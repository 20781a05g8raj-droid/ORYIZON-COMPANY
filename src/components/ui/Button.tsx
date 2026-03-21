'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  shiny?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  shiny = false,
  ...props
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2 font-medium rounded-lg relative overflow-hidden
    transition-all duration-300 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-[var(--color-primary)]/90 backdrop-blur-md border border-white/20 text-white
      hover:bg-[var(--color-primary)] hover:border-white/40
      focus:ring-[var(--color-primary)]
      shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)]
    `,
    secondary: `
      bg-[var(--color-secondary)]/90 backdrop-blur-md border border-[var(--color-primary)]/20 text-[var(--color-primary)]
      hover:bg-[var(--color-cream)] hover:border-[var(--color-primary)]/40
      focus:ring-[var(--color-secondary)]
      shadow-[0_4px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]
    `,
    outline: `
      border-2 border-[var(--color-primary)]/50 backdrop-blur-sm text-[var(--color-primary)] bg-white/10
      hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)]
      focus:ring-[var(--color-primary)]
    `,
    ghost: `
      text-[var(--color-primary)] bg-transparent hover:backdrop-blur-md hover:bg-[var(--color-secondary)]/50
      focus:ring-[var(--color-primary)]
    `,
    accent: `
      bg-[var(--color-accent)]/90 backdrop-blur-md border border-white/20 text-white
      hover:bg-[var(--color-accent)] hover:border-white/40
      focus:ring-[var(--color-accent)]
      shadow-[0_8px_32px_rgba(255,215,0,0.15)] hover:shadow-gold
    `,
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {shiny && !disabled && !loading && (
        <motion.div
          className="absolute inset-0 -translate-x-full"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            repeat: Infinity,
            repeatType: 'loop',
            duration: 1.5,
            ease: 'linear',
            repeatDelay: 3, // Shine every 3 seconds
          }}
        >
          <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
        </motion.div>
      )}

      {loading ? (
        <span className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
      ) : (
        <div className="relative z-10 flex items-center gap-2">
          {icon && iconPosition === 'left' && icon}
          {children}
          {icon && iconPosition === 'right' && icon}
        </div>
      )}
    </motion.button>
  );
}
