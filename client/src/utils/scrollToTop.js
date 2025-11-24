/**
 * Scroll to top utility
 * Scrolls to the top of the page (position 0)
 * Since navbar is sticky at top-0, scrolling to 0 ensures navbar is fully visible
 * and content starts right below it
 */
export function scrollToTop() {
  // Use requestAnimationFrame to ensure DOM is ready
  requestAnimationFrame(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Scroll to navbar level utility (alias for scrollToTop)
 * Maintained for backward compatibility
 * @deprecated Use scrollToTop() instead
 */
export function scrollToNavbar() {
  scrollToTop();
}

