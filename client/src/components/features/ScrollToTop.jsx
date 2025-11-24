import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTop } from '../../utils/scrollToTop';

/**
 * ScrollToTop Component
 * Automatically scrolls to top when route changes (pathname or search params)
 * Ensures navbar is fully visible on both mobile and desktop
 * Since navbar is sticky at top-0, scrolling to 0 ensures navbar is visible
 * and content starts right below it
 */
export default function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on any route change (pathname or search params)
    // Use a small delay to ensure the new page content has started rendering
    const timer = setTimeout(() => {
      scrollToTop();
    }, 0);

    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);

  return null;
}

