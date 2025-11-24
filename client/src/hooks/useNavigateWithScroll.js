import { useNavigate } from 'react-router-dom';
import { scrollToTop } from '../utils/scrollToTop';

/**
 * Custom hook that wraps useNavigate with automatic scroll to top
 * Use this instead of useNavigate for programmatic navigation
 * to ensure the page scrolls to top after navigation
 * 
 * @returns {Function} navigate function with scroll behavior
 * 
 * @example
 * const navigate = useNavigateWithScroll();
 * navigate('/dashboard'); // Automatically scrolls to top
 */
export function useNavigateWithScroll() {
  const navigate = useNavigate();

  return (to, options) => {
    // Scroll to top immediately when navigating
    scrollToTop();
    navigate(to, options);
  };
}

