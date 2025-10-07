'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { History, Trash2, X } from 'lucide-react';
import { useVideoStore } from '@/store/useVideoStore';
import Image from 'next/image';
import { useState } from 'react';

export default function DownloadHistory() {
  const { history, removeFromHistory, clearHistory } = useVideoStore();
  const [isOpen, setIsOpen] = useState(false);

  if (history.length === 0) return null;

  return (
    <>
      {/* History Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg flex items-center gap-2 z-40"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <History className="h-6 w-6" />
        <span className="font-medium pr-2">History ({history.length})</span>
      </motion.button>

      {/* History Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-neutral-900 shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <History className="h-6 w-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                      Download History
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                {history.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('Clear all download history?')) {
                        clearHistory();
                      }
                    }}
                    className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1.5"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear All
                  </button>
                )}
              </div>

              {/* History List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <AnimatePresence mode="popLayout">
                  {history.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      layout
                      className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-3 border border-neutral-200 dark:border-neutral-700"
                    >
                      <div className="flex gap-3">
                        {/* Thumbnail */}
                        <div className="relative w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-700">
                          <Image
                            src={item.thumbnail}
                            alt={item.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-neutral-900 dark:text-white line-clamp-2 mb-1">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                            <span className="uppercase font-medium">{item.format}</span>
                            <span>•</span>
                            <span>{item.quality}</span>
                          </div>
                          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                            {new Date(item.downloadedAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => removeFromHistory(item.id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded-lg transition-colors h-fit"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

