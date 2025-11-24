import { Link } from 'react-router-dom';
import { scrollToTop } from '../../utils/scrollToTop';

/**
 * Link component that scrolls to top on click
 * Wraps React Router's Link component with scroll behavior
 * Ensures navbar is fully visible and content starts below it
 */
export default function LinkWithScroll({ to, children, className, onClick, ...props }) {
  const handleClick = (e) => {
    onClick?.(e);
    // Scroll to top when link is clicked (immediate for better UX)
    // The ScrollToTop component will also handle it on route change, but this provides immediate feedback
    scrollToTop();
  };

  return (
    <Link to={to} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}

