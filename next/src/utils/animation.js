// src/utils/animations.js

// Fade up animation for scrolling sections
export const fadeUpVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

// Staggered container for lists/grids
export const containerStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

// Glitch effect for 404
export const glitchVariant = {
  hidden: { skewX: 0, x: 0 },
  visible: {
    skewX: [0, 5, -5, 2, 0],
    x: [0, 2, -2, 1, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  }
};