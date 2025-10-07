'use client';

import { useVideoStore } from '@/store/useVideoStore';
import Hero from '@/components/Hero';
import URLInput from '@/components/URLInput';
import VideoCard from '@/components/VideoCard';
import FormatSelector from '@/components/FormatSelector';
import DownloadHistory from '@/components/DownloadHistory';
import DiagnosticPanel from '@/components/DiagnosticPanel';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const { currentVideo } = useVideoStore();

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-50 via-blue-50 to-neutral-100 dark:from-neutral-950 dark:via-blue-950 dark:to-neutral-900">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        {!currentVideo && <Hero />}

        {/* URL Input */}
        <div className={currentVideo ? 'mb-8' : ''}>
          <URLInput />
        </div>

        {/* Video Info & Download Options */}
        <AnimatePresence mode="wait">
          {currentVideo && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <VideoCard videoInfo={currentVideo} />
              
              <div className="text-center">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                  Choose Download Format
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Select your preferred quality and format
                </p>
              </div>

              <FormatSelector
                formats={currentVideo.availableFormats}
                videoId={currentVideo.id}
                videoTitle={currentVideo.title}
                thumbnail={currentVideo.thumbnail}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* How to Use Section */}
        {!currentVideo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="max-w-3xl mx-auto mt-16"
          >
            <h2 className="text-2xl font-bold text-center text-neutral-900 dark:text-white mb-8">
              How It Works
            </h2>
            
            <div className="space-y-4">
              {[
                { step: '1', title: 'Copy YouTube URL', desc: 'Copy the link of the video you want to download' },
                { step: '2', title: 'Paste & Analyze', desc: 'Paste the URL in the input field above' },
                { step: '3', title: 'Choose Format', desc: 'Select your preferred quality and format' },
                { step: '4', title: 'Download', desc: 'Click download and save to your device' }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                  className="flex items-start gap-4 bg-white dark:bg-neutral-800 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Download History */}
      <DownloadHistory />

      {/* Diagnostic Panel */}
      <DiagnosticPanel />

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-neutral-200 dark:border-neutral-800 text-center text-sm text-neutral-600 dark:text-neutral-400">
        <p className="mb-2">
          TubeGrab Pro - Educational Purpose Only
        </p>
        <p>
          Made with ❤️ for learning purposes
        </p>
      </footer>
    </main>
  );
}
