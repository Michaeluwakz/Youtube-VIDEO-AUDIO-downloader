'use client';

import { motion } from 'framer-motion';
import { Youtube, Download, Zap, Shield } from 'lucide-react';

export default function Hero() {
  const features = [
    {
      icon: Download,
      title: 'Multiple Formats',
      description: 'Download videos in various qualities and formats'
    },
    {
      icon: Zap,
      title: 'Fast & Easy',
      description: 'Simple paste and download process'
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'No registration or data collection required'
    }
  ];

  return (
    <div className="text-center space-y-8 mb-12">
      {/* Logo & Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-4"
      >
        <div className="flex justify-center">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="bg-gradient-to-br from-red-500 to-red-700 p-6 rounded-3xl shadow-lg"
          >
            <Youtube className="h-16 w-16 text-white" />
          </motion.div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
          TubeGrab Pro
        </h1>
        
        <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Download YouTube videos effortlessly. Fast, free, and easy to use.
        </p>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700"
          >
            <feature.icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="max-w-3xl mx-auto mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
      >
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>⚠️ Educational Purpose Only:</strong> Please respect copyright laws and YouTube&apos;s Terms of Service. 
          Only download videos you have permission to download.
        </p>
      </motion.div>
    </div>
  );
}

