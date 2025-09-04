"use client";

/**
 * Scrolls an element to the bottom smoothly with improved reliability
 * @param element - The DOM element to scroll
 * @param behavior - The scroll behavior
 */
export const scrollToBottom = (
  element: HTMLElement | null, 
  behavior: ScrollBehavior = 'smooth'
): void => {
  if (!element) return;
  
  // Use double requestAnimationFrame for more reliable scrolling after DOM updates
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      element.scrollTo({
        top: element.scrollHeight,
        behavior,
      });
    });
  });
};

/**
 * Determines if the element is scrolled near the bottom
 * @param element - The DOM element to check
 * @param threshold - How many pixels from bottom counts as "near bottom"
 * @returns boolean indicating if the scroll is near bottom
 */
export const isNearBottom = (
  element: HTMLElement | null, 
  threshold: number = 100
): boolean => {
  if (!element) return false;
  
  const { scrollHeight, scrollTop, clientHeight } = element;
  return scrollHeight - scrollTop - clientHeight < threshold;
};
