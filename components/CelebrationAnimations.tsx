'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useGameState } from '@/lib/store';

// Dynamically import Lottie to avoid SSR issues
const Player = dynamic(() => import('@lottiefiles/react-lottie-player').then(mod => ({ default: mod.Player })), {
  ssr: false,
});

interface CelebrationAnimationProps {
  type: 'xp' | 'achievement' | 'streak' | 'levelup';
  onComplete?: () => void;
}

export function CelebrationAnimation({ type, onComplete }: CelebrationAnimationProps) {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
      onComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const getAnimationData = () => {
    switch (type) {
      case 'xp':
        return {
          src: 'https://assets5.lottiefiles.com/packages/lf20_touohxv0.json', // Stars animation
          size: 200,
        };
      case 'achievement':
        return {
          src: 'https://assets10.lottiefiles.com/packages/lf20_obhph3sh.json', // Trophy animation
          size: 250,
        };
      case 'streak':
        return {
          src: 'https://assets4.lottiefiles.com/packages/lf20_b88nh30c.json', // Fire animation
          size: 200,
        };
      case 'levelup':
        return {
          src: 'https://assets1.lottiefiles.com/packages/lf20_raiw2hpe.json', // Level up animation
          size: 300,
        };
      default:
        return {
          src: 'https://assets5.lottiefiles.com/packages/lf20_touohxv0.json',
          size: 200,
        };
    }
  };

  const { src, size } = getAnimationData();

  return (
    <AnimatePresence>
      {showAnimation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <Player
              autoplay
              loop={false}
              src={src}
              style={{ height: size, width: size }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Confetti effect using pure CSS animations (fallback for when Lottie fails)
export function ConfettiExplosion() {
  const [particles, setParticles] = useState<Array<{ id: number; color: string; delay: number }>>([]);

  useEffect(() => {
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 1000,
    }));
    
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: particle.color }}
          initial={{
            x: '50vw',
            y: '50vh',
            scale: 0,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: [0, 1, 0],
            rotate: 360,
          }}
          transition={{
            duration: 3,
            delay: particle.delay / 1000,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// Simple particle effect for XP gains
interface ParticleEffectProps {
  count?: number;
  colors?: string[];
  duration?: number;
}

export function ParticleEffect({ 
  count = 20, 
  colors = ['#FFD700', '#FFA500', '#FF6B6B'], 
  duration = 2000 
}: ParticleEffectProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            left: '50%',
            top: '50%',
          }}
          initial={{ 
            opacity: 1,
            scale: 0,
            x: 0,
            y: 0,
          }}
          animate={{
            opacity: 0,
            scale: 1,
            x: (Math.random() - 0.5) * 200,
            y: (Math.random() - 0.5) * 200,
          }}
          transition={{
            duration: duration / 1000,
            delay: i * 0.05,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// Floating text animation for XP/achievements
interface FloatingTextProps {
  text: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  onComplete?: () => void;
}

export function FloatingText({ 
  text, 
  color = 'text-yellow-400', 
  size = 'md',
  onComplete 
}: FloatingTextProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  useEffect(() => {
    if (onComplete) {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [onComplete]);

  return (
    <motion.div
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 font-bold ${color} ${sizeClasses[size]} pointer-events-none`}
      initial={{ 
        opacity: 0, 
        scale: 0.5, 
        y: 50 
      }}
      animate={{ 
        opacity: [0, 1, 1, 0], 
        scale: [0.5, 1.2, 1, 1], 
        y: [50, -20, -30, -50] 
      }}
      transition={{ 
        duration: 2,
        times: [0, 0.2, 0.8, 1],
        ease: "easeOut"
      }}
    >
      {text}
    </motion.div>
  );
}

// Combined celebration component that manages different types
export function CelebrationManager() {
  const gameState = useGameState();
  const [activeAnimations, setActiveAnimations] = useState<Array<{
    id: string;
    type: 'xp' | 'achievement' | 'streak' | 'levelup';
    data?: any;
  }>>([]);

  useEffect(() => {
    if (gameState.showCelebration) {
      // Determine what type of celebration to show based on recent changes
      const newAnimation = {
        id: Date.now().toString(),
        type: 'xp' as const,
        data: { amount: gameState.lastEarnedXP }
      };

      setActiveAnimations(prev => [...prev, newAnimation]);
    }
  }, [gameState.showCelebration]);

  const removeAnimation = (id: string) => {
    setActiveAnimations(prev => prev.filter(anim => anim.id !== id));
  };

  return (
    <>
      {activeAnimations.map(animation => (
        <div key={animation.id}>
          <CelebrationAnimation 
            type={animation.type}
            onComplete={() => removeAnimation(animation.id)}
          />
          {animation.type === 'xp' && animation.data?.amount && (
            <FloatingText 
              text={`+${animation.data.amount} XP`}
              onComplete={() => {}}
            />
          )}
          <ParticleEffect />
        </div>
      ))}
    </>
  );
}