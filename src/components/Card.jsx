import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const Card = ({ children, className, onClick, ...props }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={twMerge(clsx('bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-xl transition-shadow duration-300', className))}
            onClick={onClick}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
