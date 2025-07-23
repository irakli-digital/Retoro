const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

const BLOG_IMAGES_DIR = path.join(process.cwd(), 'public/images/blog');
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.gif', '.tiff', '.bmp'];

async function createDirectories() {
  const dirs = [
    path.join(BLOG_IMAGES_DIR, 'featured'),
    path.join(BLOG_IMAGES_DIR, 'content'),
    path.join(BLOG_IMAGES_DIR, 'thumbnails'),
    path.join(BLOG_IMAGES_DIR, 'optimized')
  ];
  
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    }
  }
}

async function optimizeImage(inputPath, outputDir) {
  const filename = path.parse(inputPath).name;
  const ext = path.parse(inputPath).ext.toLowerCase();
  
  if (!SUPPORTED_FORMATS.includes(ext)) {
    console.log(`⏭️  Skipping unsupported format: ${inputPath}`);
    return;
  }

  try {
    console.log(`🔄 Processing: ${inputPath}`);
    
    // Get image info
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    console.log(`   Original: ${metadata.width}x${metadata.height}, ${(fs.statSync(inputPath).size / 1024).toFixed(1)}KB`);

    // 1. Create WebP version (main optimized version)
    const webpPath = path.join(outputDir, `${filename}.webp`);
    await image
      .webp({ quality: 85, effort: 6 })
      .toFile(webpPath);
    
    const webpSize = fs.statSync(webpPath).size;
    console.log(`   WebP: ${(webpSize / 1024).toFixed(1)}KB`);

    // 2. Create different sizes for responsive images
    const sizes = [
      { suffix: '-thumb', width: 400, height: 225 },
      { suffix: '-medium', width: 800, height: null },
      { suffix: '-large', width: 1200, height: null }
    ];

    for (const size of sizes) {
      const resizedPath = path.join(outputDir, `${filename}${size.suffix}.webp`);
      
      let resizeOptions = { width: size.width };
      if (size.height) {
        resizeOptions.height = size.height;
        resizeOptions.fit = 'cover';
        resizeOptions.position = 'center';
      }
      
      await sharp(inputPath)
        .resize(resizeOptions)
        .webp({ quality: 85, effort: 6 })
        .toFile(resizedPath);
      
      const resizedSize = fs.statSync(resizedPath).size;
      console.log(`   ${size.suffix}: ${(resizedSize / 1024).toFixed(1)}KB`);
    }

    // 3. Create fallback JPEG (for compatibility)
    const jpegPath = path.join(outputDir, `${filename}.jpg`);
    await imagemin([inputPath], {
      destination: path.dirname(jpegPath),
      plugins: [
        imageminMozjpeg({ quality: 85 })
      ]
    });
    
    // Rename to correct filename
    const tempJpegPath = path.join(path.dirname(jpegPath), path.basename(inputPath));
    if (fs.existsSync(tempJpegPath)) {
      fs.renameSync(tempJpegPath, jpegPath);
    }

    console.log(`✅ Optimized: ${filename}`);
    
  } catch (error) {
    console.error(`❌ Error processing ${inputPath}:`, error.message);
  }
}

async function processDirectory(inputDir) {
  if (!fs.existsSync(inputDir)) {
    console.log(`📁 Creating input directory: ${inputDir}`);
    fs.mkdirSync(inputDir, { recursive: true });
    return;
  }

  const files = fs.readdirSync(inputDir);
  const imageFiles = files.filter(file => 
    SUPPORTED_FORMATS.includes(path.extname(file).toLowerCase())
  );

  if (imageFiles.length === 0) {
    console.log(`📂 No images found in ${inputDir}`);
    return;
  }

  const outputDir = path.join(BLOG_IMAGES_DIR, 'optimized');
  
  for (const file of imageFiles) {
    const inputPath = path.join(inputDir, file);
    await optimizeImage(inputPath, outputDir);
  }
}

async function main() {
  console.log('🚀 Starting image optimization...\n');
  
  await createDirectories();
  
  // Process images from different directories
  const inputDirs = [
    path.join(BLOG_IMAGES_DIR, 'raw'),      // Put original images here
    path.join(BLOG_IMAGES_DIR, 'featured'), // Or directly in featured
  ];
  
  for (const inputDir of inputDirs) {
    console.log(`\n📂 Processing directory: ${inputDir}`);
    await processDirectory(inputDir);
  }
  
  console.log('\n✨ Image optimization complete!');
  console.log('\n📋 Usage guide:');
  console.log('1. Put original images in public/images/blog/raw/');
  console.log('2. Run: npm run optimize-images');
  console.log('3. Use optimized images from public/images/blog/optimized/');
  console.log('\n🖼️  Available sizes:');
  console.log('   - filename.webp (original size, optimized)');
  console.log('   - filename-thumb.webp (400x225)');
  console.log('   - filename-medium.webp (800px wide)');
  console.log('   - filename-large.webp (1200px wide)');
  console.log('   - filename.jpg (fallback JPEG)');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { optimizeImage, main };