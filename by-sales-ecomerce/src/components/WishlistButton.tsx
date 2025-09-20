import React, { useRef, useEffect } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';

interface WishlistButtonProps {
  productId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ 
  productId, 
  size = 'md', 
  className = '' 
}) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const heartRef = useRef<SVGSVGElement>(null);
  
  const inWishlist = isInWishlist(productId);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const buttonSizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3'
  };

  useEffect(() => {
    if (heartRef.current) {
      gsap.set(heartRef.current, { scale: 1 });
    }
  }, []);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Faça login para adicionar à lista de desejos');
      navigate('/login');
      return;
    }

    // Animate heart
    if (heartRef.current && buttonRef.current) {
      const tl = gsap.timeline();
      
      // Pulse animation
      tl.to(heartRef.current, {
        scale: 1.3,
        duration: 0.1,
        ease: "power2.out"
      })
      .to(heartRef.current, {
        scale: 1,
        duration: 0.2,
        ease: "elastic.out(1, 0.3)"
      });

      // If adding to wishlist, create floating hearts
      if (!inWishlist) {
        createFloatingHearts();
      }
    }

    await toggleWishlist(productId);
  };

  const createFloatingHearts = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const container = document.body;

    // Create multiple floating hearts
    for (let i = 0; i < 3; i++) {
      const heart = document.createElement('div');
      heart.innerHTML = '❤️';
      heart.style.position = 'fixed';
      heart.style.left = `${rect.left + rect.width / 2}px`;
      heart.style.top = `${rect.top + rect.height / 2}px`;
      heart.style.fontSize = '16px';
      heart.style.pointerEvents = 'none';
      heart.style.zIndex = '9999';
      
      container.appendChild(heart);

      // Animate floating heart
      gsap.to(heart, {
        y: -100 - (i * 20),
        x: (Math.random() - 0.5) * 100,
        opacity: 0,
        scale: 0.5,
        duration: 1.5 + (i * 0.2),
        ease: "power2.out",
        onComplete: () => {
          container.removeChild(heart);
        }
      });
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className={`
        ${buttonSizeClasses[size]}
        rounded-full transition-all duration-300 transform hover:scale-110
        ${inWishlist 
          ? 'bg-red-50 text-red-500 hover:bg-red-100' 
          : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
        }
        ${className}
      `}
      title={inWishlist ? 'Remover da lista de desejos' : 'Adicionar à lista de desejos'}
    >
      {inWishlist ? (
        <HeartSolidIcon 
          ref={heartRef}
          className={`${sizeClasses[size]} text-red-500`} 
        />
      ) : (
        <HeartIcon 
          ref={heartRef}
          className={`${sizeClasses[size]}`} 
        />
      )}
    </button>
  );
};

export default WishlistButton;