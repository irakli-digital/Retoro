import Image from "next/image";
import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes,
  fill = false,
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  // Generate WebP path if not already WebP
  const getWebPSrc = (originalSrc: string) => {
    if (originalSrc.endsWith('.webp')) return originalSrc;
    
    const pathParts = originalSrc.split('.');
    pathParts[pathParts.length - 1] = 'webp';
    return pathParts.join('.');
  };

  const webpSrc = getWebPSrc(imageSrc);

  const handleError = () => {
    // Fallback to original image if WebP fails
    if (imageSrc === webpSrc) {
      setImageSrc(src);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const imageProps = {
    src: imageSrc,
    alt,
    className: `${className} transition-opacity duration-300 ${
      isLoading ? 'opacity-0' : 'opacity-100'
    }`,
    priority,
    onError: handleError,
    onLoad: handleLoad,
    ...(sizes && { sizes }),
    ...(fill && { fill }),
    ...(!fill && width && height && { width, height }),
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded" />
      )}
      <Image {...imageProps} />
    </div>
  );
}