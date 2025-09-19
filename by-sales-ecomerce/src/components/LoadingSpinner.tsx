import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const LoadingSpinner: React.FC = () => {
  const spinnerRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (spinnerRef.current) {
      // Animate main spinner
      gsap.to(spinnerRef.current, {
        rotation: 360,
        duration: 1,
        repeat: -1,
        ease: "none"
      });
    }

    // Animate dots
    dotsRef.current.forEach((dot, index) => {
      if (dot) {
        gsap.to(dot, {
          scale: 1.5,
          duration: 0.6,
          repeat: -1,
          yoyo: true,
          delay: index * 0.2,
          ease: "power2.inOut"
        });
      }
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="relative">
        {/* Main Spinner */}
        <div
          ref={spinnerRef}
          className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full"
        />
        
        {/* Center Logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
        </div>
      </div>
      
      {/* Loading Text */}
      <div className="mt-6 text-center">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Carregando</h3>
        <div className="flex space-x-1">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              ref={el => dotsRef.current[index] = el!}
              className="w-2 h-2 bg-blue-500 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;