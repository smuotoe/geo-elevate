import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, type HTMLMotionProps } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', fullWidth, ...props }, ref) => {
        const variants = {
            primary: 'bg-elevate-primary text-white hover:bg-blue-600 shadow-elevate hover:shadow-elevate-hover dark:shadow-none',
            secondary: 'bg-white text-elevate-text border border-gray-200 hover:bg-gray-50 shadow-sm dark:bg-elevate-card-dark dark:text-elevate-text-dark dark:border-gray-700 dark:hover:bg-gray-800',
            outline: 'border-2 border-elevate-primary text-elevate-primary hover:bg-blue-50 dark:hover:bg-blue-900/20',
            ghost: 'text-elevate-subtext hover:text-elevate-text hover:bg-gray-100 dark:text-elevate-subtext-dark dark:hover:text-elevate-text-dark dark:hover:bg-gray-800',
        };

        const sizes = {
            sm: 'px-4 py-2 text-sm',
            md: 'px-6 py-3 text-base',
            lg: 'px-8 py-4 text-lg font-semibold',
        };

        return (
            <motion.button
                ref={ref}
                whileTap={{ scale: 0.95 }}
                className={cn(
                    'rounded-full font-medium transition-all duration-200 flex items-center justify-center',
                    variants[variant],
                    sizes[size],
                    fullWidth ? 'w-full' : '',
                    className
                )}
                {...props}
            />
        );
    }
);

Button.displayName = 'Button';
