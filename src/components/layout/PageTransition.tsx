
import { motion } from "framer-motion";
import { ReactNode } from "react";

type PageTransitionProps = {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
};

export function PageTransition({ children, direction = "up" }: PageTransitionProps) {
  const getAnimationProps = () => {
    const baseProps = {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.4, ease: "easeInOut" },
    };
    
    const directionProps = {
      up: {
        initial: { ...baseProps.initial, y: 10 },
        animate: { ...baseProps.animate, y: 0 },
        exit: { ...baseProps.exit, y: -10 },
      },
      down: {
        initial: { ...baseProps.initial, y: -10 },
        animate: { ...baseProps.animate, y: 0 },
        exit: { ...baseProps.exit, y: 10 },
      },
      left: {
        initial: { ...baseProps.initial, x: 10 },
        animate: { ...baseProps.animate, x: 0 },
        exit: { ...baseProps.exit, x: -10 },
      },
      right: {
        initial: { ...baseProps.initial, x: -10 },
        animate: { ...baseProps.animate, x: 0 },
        exit: { ...baseProps.exit, x: 10 },
      },
    };
    
    return {
      ...baseProps,
      ...directionProps[direction],
    };
  };
  
  const animationProps = getAnimationProps();
  
  return (
    <motion.div
      initial={animationProps.initial}
      animate={animationProps.animate}
      exit={animationProps.exit}
      transition={animationProps.transition}
    >
      {children}
    </motion.div>
  );
}
