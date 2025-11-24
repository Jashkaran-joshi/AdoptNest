import React, { useState } from 'react';
import { getImageUrlWithFallback, getPlaceholderImage } from '../../utils/helpers/imageUrl';
import { PLACEHOLDER_IMAGES } from '../../constants';

/**
 * Image component with automatic fallback handling
 * @param {string} src - Image source (can be relative path or full URL)
 * @param {string} alt - Alt text for the image
 * @param {string} fallback - Custom fallback image URL (optional)
 * @param {string} placeholderContext - Context for placeholder (PET_CARD, PET_DETAIL, etc.)
 * @param {object} className - Additional CSS classes
 * @param {function} onLoad - Callback when image loads
 * @param {function} onError - Callback when image fails (will still use fallback)
 * @param {object} ...props - Other img tag props
 */
export default function Image({
  src,
  alt = '',
  fallback,
  placeholderContext = 'DEFAULT',
  className = '',
  onLoad,
  onError,
  loading = 'lazy',
  ...props
}) {
  const [imageSrc, setImageSrc] = useState(() => {
    // Get initial image URL with fallback
    const fallbackUrl = fallback || getPlaceholderImage(placeholderContext);
    return getImageUrlWithFallback(src, fallbackUrl);
  });
  const [hasError, setHasError] = useState(false);

  const handleError = (e) => {
    if (!hasError) {
      setHasError(true);
      // Use fallback image
      const fallbackUrl = fallback || getPlaceholderImage(placeholderContext);
      e.target.src = fallbackUrl;
      
      // Call custom onError if provided
      if (onError) {
        onError(e);
      }
    }
  };

  const handleLoad = (e) => {
    // Call custom onLoad if provided
    if (onLoad) {
      onLoad(e);
    }
  };

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      loading={loading}
      {...props}
    />
  );
}

