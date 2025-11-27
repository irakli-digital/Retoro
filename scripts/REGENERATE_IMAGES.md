# Image Regeneration Script

This script regenerates and optimizes all images in the `public/images` folder.

## Usage

```bash
npm run regenerate-images
```

## What It Does

1. **Scans** all images in `public/images` (recursively)
2. **Optimizes** images using Sharp:
   - WebP files are re-optimized in-place
   - PNG/JPEG files get optimized WebP versions created
   - Original files are preserved
3. **Clears** Next.js image cache to force browser refresh
4. **Skips** already optimized files (unless source is newer)

## Features

- ✅ Preserves directory structure
- ✅ Skips SVG files (already optimized)
- ✅ Skips blog/optimized/raw directories (handled separately)
- ✅ Only regenerates if source is newer
- ✅ Shows compression statistics
- ✅ Clears Next.js cache automatically

## When to Run

Run this script whenever you:
- Add new images to `public/images`
- Update existing images
- Want to refresh optimized versions
- Need to clear image cache

## Output

The script will:
- Show progress for each image processed
- Display original and optimized file sizes
- Show compression percentage
- Clear Next.js image cache

## Example Output

```
🚀 Starting image regeneration...

🔄 Processing: public/images/mockup.webp
   Original: 700x569, 108.7KB
   ✅ Optimized: 69.8KB

✨ Image regeneration complete!
```

## Notes

- Images are optimized in-place (WebP files) or alongside originals (PNG/JPEG)
- The script automatically skips files that are already up-to-date
- Next.js Image component will automatically use the optimized versions

