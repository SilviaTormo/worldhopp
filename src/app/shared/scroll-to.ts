/**
 * Smooth-scrolls to a CSS selector or element using requestAnimationFrame.
 * Used instead of `scrollIntoView` (broken in some embedded webviews) so the
 * agent, navbar anchors and the contact button all behave identically.
 */
export function scrollToTarget(target: string | Element, offset = 0): void {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) {
    return;
  }

  const startY = window.scrollY;
  const targetY = el.getBoundingClientRect().top + startY - offset;
  const distance = targetY - startY;
  if (Math.abs(distance) < 2) {
    return;
  }

  const duration = Math.min(900, Math.max(350, Math.abs(distance) * 0.5));
  const start = performance.now();
  const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

  const stepFn = (now: number): void => {
    const progress = Math.min(1, (now - start) / duration);
    window.scrollTo({ top: startY + distance * easeOutCubic(progress), behavior: 'instant' });
    if (progress < 1) {
      requestAnimationFrame(stepFn);
    }
  };
  requestAnimationFrame(stepFn);
}
