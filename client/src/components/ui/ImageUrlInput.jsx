import React, { useState } from 'react';
import { getJsDelivrUrl } from '../../services/jsdelivr';
import { getImageUrl } from '../../utils/helpers/imageUrl';

/**
 * Image URL Input Component
 * A simple component for entering image URLs (jsDelivr CDN or any URL)
 * Images should be uploaded to GitHub repo and referenced via jsDelivr CDN
 */
export default function ImageUrlInput({
  value = null,
  onChange,
  category = 'general',
  label = 'Image URL',
  required = false,
  placeholder = 'https://cdn.jsdelivr.net/gh/username/repo@main/pets/image.jpg',
  className = '',
  showPreview = true
}) {
  const [imageUrl, setImageUrl] = useState(value || '');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);

  // Update when value prop changes
  React.useEffect(() => {
    if (value !== imageUrl) {
      setImageUrl(value || '');
      setPreviewUrl(value ? getImageUrl(value) : null);
    }
  }, [value]);

  const handleChange = (e) => {
    const url = e.target.value.trim();
    setImageUrl(url);
    setError(null);

    // Update preview if URL is valid
    if (url) {
      try {
        const fullUrl = getImageUrl(url);
        setPreviewUrl(fullUrl);
        onChange?.(url);
      } catch (err) {
        setError('Invalid URL format');
        setPreviewUrl(null);
      }
    } else {
      setPreviewUrl(null);
      onChange?.(null);
    }
  };

  const handleGenerateJsDelivrUrl = () => {
    // Helper to generate jsDelivr URL format as placeholder
    const exampleUrl = getJsDelivrUrl('example.jpg', category);
    setImageUrl(exampleUrl);
    setPreviewUrl(exampleUrl);
    onChange?.(exampleUrl);
  };

  return (
    <div className={`image-url-input ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="flex gap-2">
        <input
          type="url"
          value={imageUrl}
          onChange={handleChange}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="button"
          onClick={handleGenerateJsDelivrUrl}
          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          title="Generate example jsDelivr URL format"
        >
          Example
        </button>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {showPreview && previewUrl && (
        <div className="mt-4">
          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-full h-auto max-h-64 rounded-lg border border-gray-300"
            onError={() => {
              setError('Failed to load image. Please check the URL.');
              setPreviewUrl(null);
            }}
            onLoad={() => setError(null)}
          />
        </div>
      )}

      <p className="mt-2 text-xs text-gray-500">
        Upload images to your GitHub assets repository and use the jsDelivr CDN URL.
        <br />
        Format: <code className="text-xs">https://cdn.jsdelivr.net/gh/username/repo@branch/path/to/image.jpg</code>
      </p>
    </div>
  );
}

