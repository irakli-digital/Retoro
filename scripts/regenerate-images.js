const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(process.cwd(), 'public/images');
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.gif', '.tiff', '.bmp', '.webp'];
const EXCLUDE_DIRS = ['optimized', 'raw', 'blog']; // Don't process already optimized or raw directories
const EXCLUDE_FILES = ['.svg']; // Don't process SVG files

/**
 * Check if a directory should be excluded
 */
function shouldExcludeDir(dirPath) {
  const relativePath = path.relative(IMAGES_DIR, dirPath);
  return EXCLUDE_DIRS.some(exclude => relativePath.includes(exclude));
}

/**
 * Check if a file should be processed
 */
function shouldProcessFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!SUPPORTED_FORMATS.includes(ext)) {
    return false;
  }
  if (EXCLUDE_FILES.includes(ext)) {
    return false;
  }
  // Skip already optimized files (those with -thumb, -medium, -large suffixes)
  const basename = path.basename(filePath, ext);
  if (basename.includes('-thumb') || basename.includes('-medium') || basename.includes('-large')) {
    return false;
  }
  return true;
}

/**
 * Regenerate/optimize a single image
 */
async function regenerateImage(inputPath, outputDir) {
  const filename = path.parse(inputPath).name;
  const ext = path.parse(inputPath).ext.toLowerCase();
  const relativePath = path.relative(IMAGES_DIR, path.dirname(inputPath));
  
  try {
    console.log(`🔄 Processing: ${path.relative(process.cwd(), inputPath)}`);
    
    // Get image info
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    const originalSize = fs.statSync(inputPath).size;
    console.log(`   Original: ${metadata.width}x${metadata.height}, ${(originalSize / 1024).toFixed(1)}KB`);
    
    // Determine output directory (preserve directory structure)
    let outputSubDir = outputDir;
    if (relativePath && relativePath !== '.') {
      outputSubDir = path.join(outputDir, relativePath);
      if (!fs.existsSync(outputSubDir)) {
        fs.mkdirSync(outputSubDir, { recursive: true });
      }
    }
    
    // For WebP files, regenerate if needed
    if (ext === '.webp') {
      const outputPath = path.join(outputSubDir, `${filename}${ext}`);
      
      // Check if regeneration is needed by comparing file sizes/timestamps
      if (fs.existsSync(outputPath) && outputPath !== inputPath) {
        const existingSize = fs.statSync(outputPath).size;
        const existingTime = fs.statSync(outputPath).mtime;
        const sourceTime = fs.statSync(inputPath).mtime;
        
        // Only regenerate if source is newer
        if (sourceTime <= existingTime && Math.abs(existingSize - originalSize) < 1000) {
          console.log(`   ⏭️  Already up to date`);
          return;
        }
      }
      
      // Use temp file if same location
      if (outputPath === inputPath) {
        const tempPath = `${outputPath}.tmp`;
        await image
          .webp({ quality: 85, effort: 6 })
          .toFile(tempPath);
        fs.renameSync(tempPath, outputPath);
      } else {
        await image
          .webp({ quality: 85, effort: 6 })
          .toFile(outputPath);
      }
      
      const finalSize = fs.statSync(outputPath).size;
      console.log(`   ✅ Optimized: ${(finalSize / 1024).toFixed(1)}KB`);
    } else {
      // For non-WebP files, create WebP version (keep original)
      const webpPath = path.join(outputSubDir, `${filename}.webp`);
      
      // Skip if WebP already exists and is newer
      if (fs.existsSync(webpPath)) {
        const webpTime = fs.statSync(webpPath).mtime;
        const sourceTime = fs.statSync(inputPath).mtime;
        if (sourceTime <= webpTime) {
          console.log(`   ⏭️  WebP already exists and up to date`);
          return;
        }
      }
      
      // Create optimized WebP version
      await image
        .webp({ quality: 85, effort: 6 })
        .toFile(webpPath);
      
      const webpSize = fs.statSync(webpPath).size;
      console.log(`   ✅ WebP created: ${(webpSize / 1024).toFixed(1)}KB (${((1 - webpSize / originalSize) * 100).toFixed(1)}% smaller)`);
      
      // Also optimize original format if it's PNG or JPEG
      if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
        const optimizedPath = path.join(outputSubDir, `${filename}${ext}`);
        if (optimizedPath !== inputPath) {
          const tempPath = `${optimizedPath}.tmp`;
          await image
            .toFormat(ext.replace('.', ''))
            .toFile(tempPath);
          fs.renameSync(tempPath, optimizedPath);
          const optSize = fs.statSync(optimizedPath).size;
          console.log(`   ✅ Optimized ${ext}: ${(optSize / 1024).toFixed(1)}KB`);
        }
      }
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${inputPath}:`, error.message);
  }
}

/**
 * Recursively process all images in a directory
 */
async function processDirectory(dirPath, outputDir) {
  if (!fs.existsSync(dirPath)) {
    console.log(`📁 Directory doesn't exist: ${dirPath}`);
    return;
  }

  if (shouldExcludeDir(dirPath)) {
    console.log(`⏭️  Skipping excluded directory: ${path.relative(IMAGES_DIR, dirPath)}`);
    return;
  }

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      // Recursively process subdirectories
      await processDirectory(fullPath, outputDir);
    } else if (entry.isFile() && shouldProcessFile(fullPath)) {
      // Process image file
      await regenerateImage(fullPath, outputDir);
    }
  }
}

/**
 * Clear Next.js image cache to force regeneration
 */
function clearNextImageCache() {
  const cacheDir = path.join(process.cwd(), '.next/cache/images');
  if (fs.existsSync(cacheDir)) {
    console.log('\n🗑️  Clearing Next.js image cache...');
    try {
      fs.rmSync(cacheDir, { recursive: true, force: true });
      console.log('   ✅ Cache cleared');
    } catch (error) {
      console.log('   ⚠️  Could not clear cache:', error.message);
    }
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting image regeneration...\n');
  console.log(`📂 Source directory: ${IMAGES_DIR}`);
  console.log(`📂 Output directory: ${IMAGES_DIR} (in-place optimization)\n`);
  
  // Process all images in public/images
  await processDirectory(IMAGES_DIR, IMAGES_DIR);
  
  // Clear Next.js image cache to force browser to fetch new images
  clearNextImageCache();
  
  console.log('\n✨ Image regeneration complete!');
  console.log('\n📋 Notes:');
  console.log('   - Images are optimized in-place');
  console.log('   - WebP versions are created for better compression');
  console.log('   - Next.js image cache has been cleared');
  console.log('   - Run this script anytime you update images');
  console.log('\n💡 Tip: Use Next.js Image component for automatic optimization');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { regenerateImage, processDirectory, main };

