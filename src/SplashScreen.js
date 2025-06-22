import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const SplashScreen = ({ onComplete }) => {
  const splashRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    // Animation sequence
    tl.fromTo(splashRef.current, 
      { opacity: 0, scale: 0.8 }, 
      { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }
    )
    .to(splashRef.current, {
      opacity: 0,
      scale: 1.2,
      duration: 1,
      delay: 2,
      ease: "power2.in",
      onComplete: onComplete
    });
    
    return () => tl.kill();
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-stone-50 dark:bg-stone-900 flex items-center justify-center z-50">
      <div ref={splashRef} className="text-center">
        <h1 className="text-5xl md:text-7xl font-cursive text-stone-800 dark:text-stone-200">
          Ziyafat
        </h1>
      </div>
    </div>
  );
};

export default SplashScreen;