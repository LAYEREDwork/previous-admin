import fs from 'fs';
import path from 'path';

/**
 * Convert kebab-case and dot-notation to PascalCase
 * e.g., "checkmark-circle-fill" -> "CheckmarkCircleFill"
 * e.g., "square.and.arrow.down.on.square" -> "SquareAndArrowDownOnSquare"
 */
function kebabToPascalCase(kebabStr: string): string {
  return kebabStr
    .split(/[-.]/)
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Extract SVG content from file, removing XML declaration and comments
 */
function extractSvgContent(svgPath: string): string {
  let content = fs.readFileSync(svgPath, 'utf-8');

  // Remove XML declaration
  content = content.replace(/<\?xml[^?]*\?>/g, '').trim();

  // Remove DOCTYPE
  content = content.replace(/<!DOCTYPE[^>]*>/g, '').trim();

  // Remove SVG comments
  content = content.replace(/<!--[\s\S]*?-->/g, '').trim();

  // Remove extra whitespace but preserve meaningful spaces
  content = content.replace(/>\s+</g, '><');

  return content;
}

/**
 * Generate TypeScript component from SVG content
 */
function generateComponentCode(svgFileName: string, svgContent: string): string {
  const iconName = kebabToPascalCase(svgFileName.replace('.svg', ''));

  // Extract viewBox and dimensions from SVG tag
  const viewBoxMatch = svgContent.match(/viewBox="([^"]*)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';

  const template = `interface SFSymbol${iconName}Props {
  /**
   * Size of the icon in pixels
   * @default 24
   */
  size?: number | string;

  /**
   * Color of the icon
   * @default 'currentColor'
   */
  color?: string;

  /**
   * CSS class name to apply to the SVG element
   */
  className?: string;

  /**
   * Stroke width of the icon
   * @default 1
   */
  strokeWidth?: number | string;

  /**
   * Additional SVG attributes
   */
  [key: string]: any;
}

/**
 * ${iconName} Icon Component
 *
 * A custom SVG icon from SF Symbols.
 * Follows the same API conventions as React Icons library components.
 *
 * @param {SFSymbol${iconName}Props} props - Component props
 * @returns {JSX.Element} The SVG icon element
 *
 * @example
 * // Basic usage
 * <SFSymbol${iconName} size={24} color="currentColor" />
 *
 * @example
 * // With custom styling
 * <SFSymbol${iconName} size={32} color="#ff0000" className="custom-class" />
 */
export function SFSymbol${iconName}({
  size = 24,
  color = 'currentColor',
  className = '',
  strokeWidth = 1,
  ...rest
}: SFSymbol${iconName}Props): JSX.Element {
  const numSize = typeof size === 'string' ? parseInt(size, 10) : size;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="${viewBox}"
      width={numSize}
      height={numSize}
      fill={color}
      strokeWidth={strokeWidth}
      className={className}
      {...rest}
    >
      ${svgContent.replace(/<\/?svg[^>]*>/g, '').trim()}
    </svg>
  );
}
`;

  return template;
}

/**
 * Main function to generate SF Icons from SVG files
 */
async function generateSFIcons() {
  const rawIconsDir = path.join(process.cwd(), 'sf-symbols-raw');
  const iconsDir = path.join(process.cwd(), 'frontend/components/sf-symbols');

  // Check if raw icons directory exists
  if (!fs.existsSync(rawIconsDir)) {
    console.log(`📁 Creating directory: ${rawIconsDir}`);
    fs.mkdirSync(rawIconsDir, { recursive: true });
    console.log('ℹ️  Please add your SVG files to this directory and run this script again.');
    return;
  }

  // Create output directory if it doesn't exist
  if (!fs.existsSync(iconsDir)) {
    console.log(`📁 Creating directory: ${iconsDir}`);
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  // Get all SVG files
  const svgFiles = fs.readdirSync(rawIconsDir).filter(file => file.endsWith('.svg'));

  if (svgFiles.length === 0) {
    console.log('⚠️  No SVG files found in sf-symbols-raw directory.');
    return;
  }

  console.log(`\n🔍 Found ${svgFiles.length} SVG file(s)\n`);

  let created = 0;
  let skipped = 0;

  svgFiles.forEach(svgFile => {
    const iconName = kebabToPascalCase(svgFile.replace('.svg', ''));
    const componentFileName = `SFSymbol${iconName}.tsx`;
    const componentPath = path.join(iconsDir, componentFileName);

    // Check if component already exists
    if (fs.existsSync(componentPath)) {
      console.log(`⏭️  SKIPPED: ${componentFileName} (already exists)`);
      skipped++;
      return;
    }

    // Read SVG content
    const svgPath = path.join(rawIconsDir, svgFile);
    const svgContent = extractSvgContent(svgPath);

    // Generate component code
    const componentCode = generateComponentCode(svgFile, svgContent);

    // Write component file
    fs.writeFileSync(componentPath, componentCode);
    console.log(`✅ CREATED: ${componentFileName}`);
    created++;
  });

  console.log(`\n📊 Summary: ${created} created, ${skipped} skipped\n`);
}

// Run the generator
generateSFIcons().catch(error => {
  console.error('❌ Error generating SF Icons:', error);
  process.exit(1);
});
