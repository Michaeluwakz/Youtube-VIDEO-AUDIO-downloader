'use client';

import { motion } from 'framer-motion';
import { Clock, User, Eye, Calendar } from 'lucide-react';
import { VideoInfo } from '@/types';
import { formatNumber } from '@/lib/utils';
import Image from 'next/image';

interface VideoCardProps {
  videoInfo: VideoInfo;
}

export default function VideoCard({ videoInfo }: VideoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto bg-white dark:bg-neutral-800 rounded-2xl shadow-lg overflow-hidden border border-neutral-200 dark:border-neutral-700"
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video bg-neutral-100 dark:bg-neutral-900">
        <Image
          src={videoInfo.thumbnail}
          alt={videoInfo.title}
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm font-medium">
          {videoInfo.duration}
        </div>
      </div>

      {/* Video Info */}
      <div className="p-6 space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white line-clamp-2">
          {videoInfo.title}
        </h2>

        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
          <User className="h-4 w-4" />
          <span className="font-medium">{videoInfo.channel}</span>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-neutral-500 dark:text-neutral-400">
          {videoInfo.viewCount && (
            <div className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              <span>{formatNumber(parseInt(videoInfo.viewCount))} views</span>
            </div>
          )}
          {videoInfo.uploadDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{videoInfo.uploadDate}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>Duration: {videoInfo.duration}</span>
          </div>
        </div>

        {videoInfo.description && (
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3">
              {videoInfo.description}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

