#!/usr/bin/env node

/**
 * Screenshot Generator for Previous Admin
 * 
 * Automatically creates screenshots of all pages in light and dark mode.
 * Usage: node scripts/generate_screenshots.mjs
 * 
 * Requirements:
 * - Playwright must be installed (npm install --save-dev playwright)
 * 
 * The script starts the application automatically if it's not running,
 * and stops it after taking the screenshots.
 */

import { chromium } from 'playwright';
import { mkdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { promisify } from 'util';
import sharp from 'sharp';

const sleep = promisify(setTimeout);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const CONFIG = {
  baseUrl: 'http://localhost:2342',
  screenshotDir: join(__dirname, '../.github/assets'),
  viewport: {
    width: 1300,
    height: 1080 // Starting value, ignored for fullPage
  },
  pages: [
    { name: 'configs', path: '/', tab: 'configs' },
    { name: 'editor', path: '/', tab: 'editor' },
    { name: 'import-export', path: '/', tab: 'import-export' },
    { name: 'system', path: '/', tab: 'system' },
    { name: 'about', path: '/', tab: 'about' }
  ],
  themes: ['light', 'dark']
};

let appProcess = null;
let appStartedByScript = false;

/**
 * Checks if the application is running
 */
async function isAppRunning() {
  try {
    const response = await fetch(CONFIG.baseUrl, { method: 'HEAD' });
    return response.ok || response.status === 404; // 404 is ok, means server is running
  } catch (error) {
    return false;
  }
}

/**
 * Starts the application
 */
async function startApp() {
  console.log('🚀 Starting application...\n');
  
  // Run build
  console.log('  Building...');
  const buildProcess = spawn('npm', ['run', 'build'], {
    cwd: join(__dirname, '..'),
    stdio: 'inherit',
    shell: true
  });
  
  await new Promise((resolve, reject) => {
    buildProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Build failed with code ${code}`));
      }
    });
  });
  
  console.log('  ✓ Build successful\n');
  
  // Start services
  console.log('  Starting services...');
  appProcess = spawn('./scripts/dev/start-all.sh', [], {
    cwd: join(__dirname, '..'),
    stdio: 'ignore',
    shell: true,
    detached: false
  });
  
  appStartedByScript = true;
  
  // Wait for application to be ready (longer timeout)
  let attempts = 0;
  const maxAttempts = 60; // 60 seconds
  
  while (attempts < maxAttempts) {
    await sleep(1000);
    if (await isAppRunning()) {
      // Extra wait time after start
      await sleep(5000);
      console.log('  ✓ Application running\n');
      return;
    }
    attempts++;
  }
  
  throw new Error('Application could not be started');
}
 
/**
 * Stops the application
 */
async function stopApp() {
  if (appProcess && appStartedByScript) {
    console.log('\n🛑 Stopping application...');
    
    try {
      // Try graceful shutdown
      appProcess.kill('SIGTERM');
      
      // Wait a bit
      await sleep(2000);
      
      // Force kill if still running
      if (!appProcess.killed) {
        appProcess.kill('SIGKILL');
      }
      
      console.log('  ✓ Application stopped\n');
    } catch (error) {
      console.warn('  ⚠ Error stopping application:', error.message);
    }
  }
}

/**
 * Creates the screenshot directory if it doesn't exist
 */
async function ensureScreenshotDir() {
  if (!existsSync(CONFIG.screenshotDir)) {
    await mkdir(CONFIG.screenshotDir, { recursive: true });
    console.log(`✓ Screenshot directory created: ${CONFIG.screenshotDir}`);
  }
}

/**
 * Sets the theme in the browser
 */
async function setTheme(page, theme) {
  await page.evaluate((selectedTheme) => {
    localStorage.setItem('theme-mode', selectedTheme);
    // Apply theme immediately
    const root = document.documentElement;
    if (selectedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, theme);
  
  // Wait for theme changes to be applied
  await page.waitForTimeout(500);
}

/**
 * Switches to the specified tab by setting localStorage and reloading the page
 */
async function switchToTab(page, tabName) {
  // If it's already the current tab, do nothing
  if (tabName === 'configs') {
    // configs is the default tab, already active
    return;
  }
  
  try {
    console.log(`  → Navigate to tab: ${tabName}`);
    
    // Set the tab via localStorage BEFORE navigating
    // The app will read this value from localStorage on load
    await page.evaluate((tab) => {
      localStorage.setItem('currentTab', tab);
    }, tabName);
    
    // Reload the page so the tab is loaded from localStorage
    await page.goto(CONFIG.baseUrl + '/', {
      waitUntil: 'networkidle',
      timeout: 15000
    });
    
    // Additional wait time to ensure React has rendered the tab
    await page.waitForTimeout(1500);
    console.log(`  ✓ Tab "${tabName}" loaded`);
    
  } catch (error) {
    console.warn(`  ✗ Error switching tab: ${error.message}`);
    // Don't abort, continue with screenshot of current tab
  }
}

/**
 * Creates a combined light/dark screenshot with a vertical separator line
 */
async function createCombinedScreenshot(leftPath, rightPath, outputPath) {
  try {
    // Get image dimensions
    const metadata = await sharp(leftPath).metadata();
    const { width, height } = metadata;
    const separatorWidth = 3;
    const accentColor = '#eb1919ff'; // Project accent color
    
    // Diagonal line from top-left-ish to bottom-right-ish
    const topX = Math.floor(width * 0.45);
    const bottomX = Math.floor(width * 0.55);
    
    // Create mask for the left side (Light Mode)
    const leftMaskSvg = `
      <svg width="${width}" height="${height}">
        <polygon points="0,0 ${topX},0 ${bottomX},${height} 0,${height}" fill="white" />
      </svg>
    `;
    
    // Create mask for the right side (Dark Mode)
    const rightMaskSvg = `
      <svg width="${width}" height="${height}">
        <polygon points="${topX},0 ${width},0 ${width},${height} ${bottomX},${height}" fill="white" />
      </svg>
    `;
    
    // Create the separator line
    const separatorSvg = `
      <svg width="${width}" height="${height}">
        <line x1="${topX}" y1="0" x2="${bottomX}" y2="${height}" stroke="${accentColor}" stroke-width="${separatorWidth}" />
      </svg>
    `;
    
    // Apply mask to left side
    const leftSideBuffer = await sharp(leftPath)
      .composite([
        {
          input: Buffer.from(leftMaskSvg),
          blend: 'dest-in'
        }
      ])
      .png()
      .toBuffer();

    // Apply mask to right side
    const rightSideBuffer = await sharp(rightPath)
      .composite([
        {
          input: Buffer.from(rightMaskSvg),
          blend: 'dest-in'
        }
      ])
      .png()
      .toBuffer();
    
    // Composite onto a transparent background
    await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
    .composite([
      {
        input: leftSideBuffer,
        blend: 'over'
      },
      {
        input: rightSideBuffer,
        blend: 'over'
      },
      {
        input: Buffer.from(separatorSvg),
        blend: 'over'
      }
    ])
    .png()
    .toFile(outputPath);
    
    console.log(`  ✓ Combined screenshot created: ${outputPath.split('/').pop()}`);
  } catch (error) {
    console.warn(`  ⚠ Error creating combined screenshot: ${error.message}`);
  }
}

/**
 * Applies rounded corners to screenshots
 */
async function applyScreenshotEffects(inputPath, outputPath) {
  try {
    // Get actual image dimensions
    const metadata = await sharp(inputPath).metadata();
    const { width, height } = metadata;
    
    // Apply 14px rounded corners
    const borderRadius = 14;
    
    await sharp(inputPath)
      .composite([
        {
          input: Buffer.from(
            `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
              <rect width="${width}" height="${height}" rx="${borderRadius}" ry="${borderRadius}" fill="white"/>
            </svg>`
          ),
          blend: 'dest-in'
        }
      ])
      .png()
      .toFile(outputPath);
    
    console.log(`  ✓ Rounded corners applied`);
  } catch (error) {
    console.warn(`  ⚠ Error applying effects: ${error.message}`);
  }
}

/**
 * Creates a screenshot with effects (rounded corners + macOS-like shadow)
 */
async function takeScreenshot(page, filename) {
  const filepath = join(CONFIG.screenshotDir, filename);
  const tempPath = join(CONFIG.screenshotDir, `.temp-${filename}`);
  
  // Screenshot to temporary file
  await page.screenshot({
    path: tempPath,
    fullPage: true,
    animations: 'disabled'
  });
  
  // Apply effects
  await applyScreenshotEffects(tempPath, filepath);
  
  // Delete temporary file
  try {
    await unlink(tempPath);
  } catch (error) {
    console.warn(`  ⚠ Could not delete temp file: ${error.message}`);
  }
  
  console.log(`  ✓ ${filename}`);
}

/**
 * Main function
 */
async function generateScreenshots() {
  console.log('========================================');
  console.log('  Screenshot Generator');
  console.log('========================================\n');
  
  try {
    // Check if app is running
    const isRunning = await isAppRunning();
    
    if (!isRunning) {
      await startApp();
    } else {
      console.log('✓ Application already running\n');
    }
    
    await ensureScreenshotDir();
    
    console.log(`Base URL: ${CONFIG.baseUrl}`);
    console.log(`Viewport: ${CONFIG.viewport.width}px (width)\n`);
    
    // Start browser
    console.log('Starting browser...\n');
    const browser = await chromium.launch({
      headless: true
    });
    
    try {
      for (const theme of CONFIG.themes) {
        console.log(`\n📸 ${theme.toUpperCase()} Mode\n${'='.repeat(40)}`);
        
        const context = await browser.newContext({
          viewport: CONFIG.viewport
        });
        
        const page = await context.newPage();
        
        // Navigate to home page and wait longer
        await page.goto(CONFIG.baseUrl, { waitUntil: 'networkidle', timeout: 60000 });
        
        // Extra time for app initialization
        await page.waitForTimeout(3000);
        
        // Set theme
        await setTheme(page, theme);
        
        // Reload page with theme
        await page.reload({ waitUntil: 'networkidle' });
        
        for (const pageConfig of CONFIG.pages) {
          console.log(`\n${pageConfig.name}:`);
          
          // Switch to tab
          if (pageConfig.tab) {
            await switchToTab(page, pageConfig.tab);
          }
          
          // Wait for content to load (important after tab switch)
          // With timeout to not hang forever
          try {
            await Promise.race([
              page.waitForLoadState('domcontentloaded', { timeout: 5000 }),
              new Promise(resolve => setTimeout(resolve, 5000))
            ]);
            await page.waitForTimeout(1000);
          } catch (e) {
            console.warn(`  ⚠ Timeout waiting for page, continuing`);
            await page.waitForTimeout(2000);
          }
          
          // Create screenshot
          const filename = `${pageConfig.name}-${theme}.png`;
          await takeScreenshot(page, filename);
        }
        
        await context.close();
      }
      
      // Create combined light/dark screenshots
      console.log(`\n📸 Combined Light/Dark Mode\n${'='.repeat(40)}`);
      for (const pageConfig of CONFIG.pages) {
        console.log(`\n${pageConfig.name}:`);
        const darkPath = join(CONFIG.screenshotDir, `${pageConfig.name}-dark.png`);
        const lightPath = join(CONFIG.screenshotDir, `${pageConfig.name}-light.png`);
        const combinedPath = join(CONFIG.screenshotDir, `${pageConfig.name}-combined.png`);
        
        await createCombinedScreenshot(lightPath, darkPath, combinedPath);
      }
      
      console.log('\n========================================');
      console.log(`✅ All screenshots created!`);
      console.log(`📁 Location: ${CONFIG.screenshotDir}`);
      console.log('========================================\n');
      
    } finally {
      await browser.close();
    }
    
  } catch (error) {
    console.error('\n❌ Error creating screenshots:', error);
    throw error;
  } finally {
    // Only stop app if we started it
    await stopApp();
  }
}

// Run script
generateScreenshots().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
