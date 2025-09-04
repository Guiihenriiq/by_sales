import { gsap } from 'gsap';
import { onUnmounted } from 'vue';

export function useAnimations() {
  let timeline: gsap.core.Timeline | null = null;

  const fadeIn = (element: any, duration = 0.6) => {
    if (!element) return;
    return gsap.fromTo(element, 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration, ease: 'power2.out' }
    );
  };

  const slideIn = (element: any, direction = 'left', duration = 0.8) => {
    if (!element) return;
    const fromProps = direction === 'left' ? { x: -100 } : { x: 100 };
    return gsap.fromTo(element, 
      { ...fromProps, opacity: 0 }, 
      { x: 0, opacity: 1, duration, ease: 'power3.out' }
    );
  };

  const scaleIn = (element: any, duration = 0.5) => {
    if (!element) return;
    return gsap.fromTo(element, 
      { scale: 0, opacity: 0 }, 
      { scale: 1, opacity: 1, duration, ease: 'back.out(1.7)' }
    );
  };

  const staggerFadeIn = (elements: any, duration = 0.4) => {
    if (!elements) return;
    return gsap.fromTo(elements, 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration, stagger: 0.1, ease: 'power2.out' }
    );
  };

  const createTimeline = () => {
    timeline = gsap.timeline();
    return timeline;
  };

  onUnmounted(() => {
    if (timeline) timeline.kill();
  });

  return {
    fadeIn,
    slideIn,
    scaleIn,
    staggerFadeIn,
    createTimeline,
    gsap
  };
}