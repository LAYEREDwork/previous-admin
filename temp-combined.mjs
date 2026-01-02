import sharp from 'sharp';
import { join } from 'path';

// Generates a jagged tear line path for the separator
function generateJaggedPath(width, height) {
  const centerX = width / 2;
  const points = [];
  const segmentHeight = 20;
  const variation = 8;
  
  // Create jagged line down the center
  for (let y = 0; y <= height; y += segmentHeight) {
    const offset = Math.random() * variation - variation / 2;
    points.push(`${centerX + offset},${y}`);
  }
  
  return `M ${points.join(' L ')}`;
}

// Creates a combined dark/light screenshot with jagged separator
async function createCombinedScreenshot(darkPath, lightPath, outputPath) {
  try {
    // Get image dimensions
    const darkMetadata = await sharp(darkPath).metadata();
    const { width, height } = darkMetadata;
    
    // Combined image dimensions (side by side)
    const combinedWidth = width * 2;
    const combinedHeight = height;
    
    // Create the jagged separator line
    const separatorSvg = `
      <svg width="${combinedWidth}" height="${combinedHeight}" viewBox="0 0 ${combinedWidth} ${combinedHeight}">
        <path d="${generateJaggedPath(combinedWidth, combinedHeight)}" 
              stroke="#555555" 
              stroke-width="3" 
              fill="none"/>
      </svg>
    `;
    
    // Composite: dark on left, light on right, separator on top
    await sharp({
      create: {
        width: combinedWidth,
        height: combinedHeight,
        channels: 3,
        background: { r: 255, g: 255, b: 255 }
      }
    })
    .composite([
      {
        input: darkPath,
        left: 0,
        top: 0,
        blend: 'over'
      }
    ])
    .composite([
      {
        input: lightPath,
        left: width,
        top: 0,
        blend: 'over'
      }
    ])
    .composite([
      {
        input: Buffer.from(separatorSvg),
        blend: 'over'
      }
    ])
    .png()
    .toFile(outputPath);
    
    console.log(`✓ ${outputPath.split('/').pop()}`);
  } catch (error) {
    console.error(`✗ Error: ${error.message}`);
  }
}

const screenshotDir = './screenshots';
const pages = ['configs', 'editor', 'import-export', 'system', 'about'];

async function run() {
  console.log('Creating combined Dark/Light screenshots...\n');
  for (const page of pages) {
    const darkPath = join(screenshotDir, `${page}-dark.png`);
    const lightPath = join(screenshotDir, `${page}-light.png`);
    const combinedPath = join(screenshotDir, `${page}-combined.png`);
    
    await createCombinedScreenshot(darkPath, lightPath, combinedPath);
  }
  console.log('\n✅ Done!');
}

run();
