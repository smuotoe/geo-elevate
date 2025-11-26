import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, hover = false, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'bg-elevate-card rounded-2xl p-6 shadow-elevate border border-gray-100 dark:bg-elevate-card-dark dark:border-gray-800 dark:shadow-none',
                    hover && 'transition-shadow duration-200 hover:shadow-elevate-hover dark:hover:bg-gray-800',
                    className
                )}
                {...props}
            />
        );
    }
);

Card.displayName = 'Card';
