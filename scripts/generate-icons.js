const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4caf50;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#66bb6a;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="100" fill="url(#bg)"/>
  <path d="M 150 256 L 220 326 L 362 184" 
        stroke="white" 
        stroke-width="48" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        fill="none"/>
</svg>
`;

const icons = [
  { name: 'logo192.png', size: 192 },
  { name: 'logo512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'apple-touch-icon-152x152.png', size: 152 },
  { name: 'apple-touch-icon-167x167.png', size: 167 },
  { name: 'apple-touch-icon-180x180.png', size: 180 },
];

const splashScreens = [
  { name: 'apple-splash-640x1136.png', width: 640, height: 1136 },
  { name: 'apple-splash-750x1334.png', width: 750, height: 1334 },
  { name: 'apple-splash-1242x2208.png', width: 1242, height: 2208 },
  { name: 'apple-splash-1125x2436.png', width: 1125, height: 2436 },
  { name: 'apple-splash-1170x2532.png', width: 1170, height: 2532 },
  { name: 'apple-splash-1179x2556.png', width: 1179, height: 2556 },
  { name: 'apple-splash-1290x2796.png', width: 1290, height: 2796 },
];

async function generateIcons() {
  console.log('Generating app icons...');
  
  const svgBuffer = Buffer.from(svgIcon);
  
  for (const icon of icons) {
    const outputPath = path.join(publicDir, icon.name);
    await sharp(svgBuffer)
      .resize(icon.size, icon.size)
      .png()
      .toFile(outputPath);
    console.log(`✓ Generated ${icon.name}`);
  }
}

async function generateSplashScreens() {
  console.log('Generating splash screens...');
  
  for (const splash of splashScreens) {
    const iconSize = Math.min(splash.width, splash.height) * 0.3;
    const svgBuffer = Buffer.from(svgIcon);
    
    const icon = await sharp(svgBuffer)
      .resize(Math.round(iconSize), Math.round(iconSize))
      .png()
      .toBuffer();
    
    const background = await sharp({
      create: {
        width: splash.width,
        height: splash.height,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
    .composite([{
      input: icon,
      gravity: 'center'
    }])
    .png()
    .toFile(path.join(publicDir, splash.name));
    
    console.log(`✓ Generated ${splash.name}`);
  }
}

async function generateFavicon() {
  console.log('Generating favicon...');
  
  const svgBuffer = Buffer.from(svgIcon);
  const outputPath = path.join(publicDir, 'favicon.ico');
  
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32.png'));
  
  await sharp(svgBuffer)
    .resize(16, 16)
    .png()
    .toFile(path.join(publicDir, 'favicon-16.png'));
    
  console.log('✓ Generated favicon PNGs (use online converter for .ico)');
}

async function main() {
  try {
    await generateIcons();
    await generateSplashScreens();
    await generateFavicon();
    console.log('\n✅ All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

main();
