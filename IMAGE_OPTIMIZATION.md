# 🖼️ Image Optimization System

This project includes automatic image compression and WebP conversion for optimal performance.

## 📁 Directory Structure

```
public/images/blog/
├── raw/           # Put original images here
├── optimized/     # Auto-generated optimized images
├── featured/      # Featured images for blog cards
├── content/       # Images for article content
└── thumbnails/    # Small preview images
```

## 🚀 Quick Start

### 1. Add Original Images
Put your original images (JPG, PNG, GIF, etc.) in:
```
public/images/blog/raw/
```

### 2. Run Optimization
```bash
npm run optimize-images
```

### 3. Use Optimized Images
The script creates multiple optimized versions:
- `filename.webp` - Original size, WebP format
- `filename-thumb.webp` - 400×225 thumbnail
- `filename-medium.webp` - 800px wide
- `filename-large.webp` - 1200px wide  
- `filename.jpg` - Fallback JPEG

## 🔧 Features

### ✅ Automatic Optimization
- **WebP Conversion**: 85% quality, maximum compression
- **Multiple Sizes**: Responsive image variants
- **JPEG Fallbacks**: Browser compatibility
- **Smart Compression**: Maintains visual quality

### 📐 Generated Sizes
- **Thumbnail**: 400×225 (16:9, for cards)
- **Medium**: 800px wide (for content)
- **Large**: 1200px wide (for hero images)
- **Original**: Optimized but same dimensions

### ⚡ Performance Benefits
- **60-80% smaller** file sizes with WebP
- **Responsive images** for different devices
- **Lazy loading** ready with Next.js Image
- **Automatic format selection** (WebP → JPEG fallback)

## 🎯 Usage Examples

### In Blog Articles (HTML)
```html
<!-- Use optimized WebP -->
<img src="/images/blog/optimized/my-image.webp" alt="Description" />

<!-- Responsive image -->
<img 
  src="/images/blog/optimized/my-image-medium.webp" 
  srcset="/images/blog/optimized/my-image-thumb.webp 400w,
          /images/blog/optimized/my-image-medium.webp 800w,
          /images/blog/optimized/my-image-large.webp 1200w"
  sizes="(max-width: 768px) 400px, (max-width: 1200px) 800px, 1200px"
  alt="Description" 
/>
```

### With OptimizedImage Component
```tsx
import OptimizedImage from '@/components/OptimizedImage';

// Automatic WebP with JPEG fallback
<OptimizedImage
  src="/images/blog/optimized/my-image.webp"
  alt="Description"
  width={800}
  height={450}
  className="rounded-lg"
/>
```

### In Database (Featured Images)
```sql
INSERT INTO posts (featured_image, ...) 
VALUES ('/images/blog/optimized/article-hero.webp', ...);
```

## ⚙️ Configuration

### Next.js Image Optimization
Configured in `next.config.mjs`:
- **Formats**: WebP, AVIF support
- **Cache**: 1 year TTL
- **Sizes**: Responsive breakpoints
- **Security**: SVG sanitization

### Compression Settings
In `scripts/optimize-images.js`:
- **WebP Quality**: 85% (adjustable)
- **JPEG Quality**: 85% (adjustable)
- **Effort Level**: 6 (maximum compression)

## 🔄 Workflow

1. **Add Images**: Drop originals in `public/images/blog/raw/`
2. **Optimize**: Run `npm run optimize-images`
3. **Reference**: Use optimized images from `public/images/blog/optimized/`
4. **Deploy**: Optimized images deploy automatically

## 📊 Expected Results

| Format | Original | WebP | Savings |
|--------|----------|------|---------|
| JPEG   | 500KB    | 150KB| 70%     |
| PNG    | 800KB    | 200KB| 75%     |
| Large  | 2MB      | 400KB| 80%     |

## 🛠️ Troubleshooting

### Images Not Optimizing?
- Check file formats (JPG, PNG, GIF supported)
- Ensure Sharp is installed: `npm install sharp`
- Verify directory permissions

### WebP Not Loading?
- Browser compatibility (95%+ modern browsers)
- JPEG fallback should load automatically
- Check network tab for 404 errors

### Performance Issues?
- Use appropriate image sizes
- Enable Next.js Image component
- Check Lighthouse scores

## 📝 Best Practices

1. **Use WebP First**: Reference `.webp` files primarily
2. **Responsive Images**: Use different sizes for different screens  
3. **Lazy Loading**: Next.js Image component handles this
4. **Alt Text**: Always include descriptive alt attributes
5. **File Naming**: Use descriptive names (not `image1.jpg`)

This system ensures your blog images load fast while maintaining high quality! 🚀