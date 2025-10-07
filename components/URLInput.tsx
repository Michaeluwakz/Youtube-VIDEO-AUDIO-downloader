'use client';

import { useState } from 'react';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { isValidYouTubeUrl } from '@/lib/utils';
import { useVideoStore } from '@/store/useVideoStore';

export default function URLInput() {
  const [url, setUrl] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const { setCurrentVideo, setLoading, setError, isLoading } = useVideoStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setError(null);

    if (!url.trim()) {
      setLocalError('Please enter a YouTube URL');
      return;
    }

    if (!isValidYouTubeUrl(url)) {
      setLocalError('Please enter a valid YouTube URL');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/video-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch video information');
      }

      setCurrentVideo(data);
      setUrl('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      setError(message);
      setLocalError(message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setLocalError(null);
    } catch (error) {
      console.error('Failed to read clipboard:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setLocalError(null);
              }}
              placeholder="Paste YouTube video URL here..."
              className="w-full pl-12 pr-24 py-4 text-lg rounded-xl border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={handlePaste}
              className="absolute right-20 top-1/2 -translate-y-1/2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              disabled={isLoading}
            >
              Paste
            </button>
          </div>
          
          <motion.button
            type="submit"
            disabled={isLoading || !url.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Fetching...</span>
              </>
            ) : (
              <span>Get Video</span>
            )}
          </motion.button>
        </div>

        {localError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-lg"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{localError}</span>
          </motion.div>
        )}
      </form>

      <div className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
        <p>Supported formats: youtube.com/watch?v=... or youtu.be/...</p>
      </div>
    </motion.div>
  );
}

