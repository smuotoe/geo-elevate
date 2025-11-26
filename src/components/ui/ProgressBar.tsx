import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
    progress: number; // 0 to 100
    color?: string;
    height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    progress,
    color = 'bg-elevate-primary',
    height = 8
}) => {
    return (
        <div className="w-full bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700" style={{ height }}>
            <motion.div
                className={`h-full ${color}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            />
        </div>
    );
};
