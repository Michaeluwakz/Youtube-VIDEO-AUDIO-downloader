'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Video, Music, Loader2, CheckCircle2, Check } from 'lucide-react';
import { DownloadFormat } from '@/types';
import { useVideoStore } from '@/store/useVideoStore';
import { cn } from '@/lib/utils';

interface FormatSelectorProps {
  formats: DownloadFormat[];
  videoId: string;
  videoTitle: string;
  thumbnail: string;
}

export default function FormatSelector({ 
  formats, 
  videoId, 
  videoTitle,
  thumbnail 
}: FormatSelectorProps) {
  const [selectedFormat, setSelectedFormat] = useState<DownloadFormat | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const { addToHistory } = useVideoStore();

  const videoFormats = formats.filter(f => f.hasVideo && f.hasAudio);
  const audioFormats = formats.filter(f => f.hasAudio && !f.hasVideo);

  // Function to handle format selection (ONLY ONE at a time)
  const handleSelectFormat = (format: DownloadFormat) => {
    if (!downloading) {
      setSelectedFormat(format);
      setDownloadComplete(false);
    }
  };

  // Main download function - works with ANY format
  const handleDownload = async () => {
    if (!selectedFormat || downloading) return;

    setDownloading(true);
    setDownloadComplete(false);

    try {
      console.log('Starting download for format:', selectedFormat);

      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: `https://www.youtube.com/watch?v=${videoId}`,
          itag: selectedFormat.itag,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Download failed');
      }

      // Get the blob from response
      const blob = await response.blob();
      console.log('Download complete, blob size:', blob.size);
      
      // Create download link with proper filename and extension
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Sanitize filename and add proper extension
      const safeTitle = videoTitle.replace(/[^a-z0-9]/gi, '_').substring(0, 100);
      const extension = selectedFormat.container || (selectedFormat.hasVideo ? 'mp4' : 'mp3');
      a.download = `${safeTitle}.${extension}`;
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log('File downloaded successfully');

      // Add to history
      addToHistory({
        id: Date.now().toString(),
        videoId,
        title: videoTitle,
        thumbnail,
        downloadedAt: new Date().toISOString(),
        format: selectedFormat.format,
        quality: selectedFormat.qualityLabel || selectedFormat.quality,
      });

      setDownloadComplete(true);
      
      // Reset after showing success
      setTimeout(() => {
        setDownloadComplete(false);
      }, 5000);
      
    } catch (error) {
      console.error('Download error:', error);
      alert(error instanceof Error ? error.message : 'Failed to download video. Please try again.');
      setDownloadComplete(false);
    } finally {
      setDownloading(false);
    }
  };

  const FormatButton = ({ format, icon: Icon }: { format: DownloadFormat; icon: React.ComponentType<{ className?: string }> }) => {
    const isSelected = selectedFormat?.itag === format.itag;
    
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => handleSelectFormat(format)}
        disabled={downloading}
        className={cn(
          "relative p-4 rounded-xl border-2 transition-all text-left",
          "hover:border-blue-500 hover:shadow-md",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          isSelected
            ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-lg ring-2 ring-blue-500/20"
            : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
        )}
      >
        <div className="flex items-start gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            format.hasVideo 
              ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" 
              : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
          )}>
            <Icon className="h-5 w-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-neutral-900 dark:text-white">
                {format.qualityLabel || format.quality}
              </h3>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                {format.size}
              </span>
            </div>
            
            <div className="mt-1 flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
              <span className="uppercase font-medium">{format.container}</span>
              {format.resolution && (
                <>
                  <span>•</span>
                  <span>{format.resolution}</span>
                </>
              )}
              {format.fps && (
                <>
                  <span>•</span>
                  <span>{format.fps}fps</span>
                </>
              )}
              {format.bitrate && !format.hasVideo && (
                <>
                  <span>•</span>
                  <span>{format.bitrate}</span>
                </>
              )}
            </div>
            
            {format.hasVideo && format.hasAudio && (
              <div className="mt-1 text-xs text-green-600 dark:text-green-400 font-medium">
                ✓ Video + Audio
              </div>
            )}
            {!format.hasVideo && format.hasAudio && (
              <div className="mt-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
                ♪ Audio Only
              </div>
            )}
          </div>

          {/* Selection indicator */}
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex-shrink-0"
            >
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
            </motion.div>
          )}
          
          {!isSelected && (
            <div className="flex-shrink-0 w-6 h-6 border-2 border-neutral-300 dark:border-neutral-600 rounded-full" />
          )}
        </div>
      </motion.button>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      {/* Video Formats */}
      {videoFormats.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5 text-red-600" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Video Formats
            </h3>
            <span className="text-sm text-neutral-500">({videoFormats.length} available)</span>
          </div>
          
          <div className="grid gap-3 sm:grid-cols-2">
            {videoFormats.slice(0, 8).map((format) => (
              <FormatButton key={format.itag} format={format} icon={Video} />
            ))}
          </div>
        </div>
      )}

      {/* Audio Formats */}
      {audioFormats.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Music className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Audio Only
            </h3>
            <span className="text-sm text-neutral-500">({audioFormats.length} available)</span>
          </div>
          
          <div className="grid gap-3 sm:grid-cols-2">
            {audioFormats.slice(0, 4).map((format) => (
              <FormatButton key={format.itag} format={format} icon={Music} />
            ))}
          </div>
        </div>
      )}

      {/* Main Download Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="sticky bottom-0 bg-white dark:bg-neutral-900 border-t-2 border-neutral-200 dark:border-neutral-700 p-6 -mx-6 -mb-6 mt-6"
      >
        {selectedFormat && !downloading && !downloadComplete && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Selected:</strong> {selectedFormat.qualityLabel || selectedFormat.quality} 
              {' • '}
              {selectedFormat.container.toUpperCase()}
              {selectedFormat.hasVideo && selectedFormat.hasAudio && ' (Video + Audio)'}
              {!selectedFormat.hasVideo && selectedFormat.hasAudio && ' (Audio Only)'}
            </p>
          </div>
        )}

        <motion.button
          onClick={handleDownload}
          disabled={!selectedFormat || downloading}
          whileHover={{ scale: selectedFormat && !downloading ? 1.02 : 1 }}
          whileTap={{ scale: selectedFormat && !downloading ? 0.98 : 1 }}
          className={cn(
            "w-full py-4 px-6 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            selectedFormat && !downloading
              ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl"
              : "bg-neutral-300 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400"
          )}
        >
          {downloading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Downloading...</span>
            </>
          ) : !selectedFormat ? (
            <>
              <Download className="h-6 w-6" />
              <span>Select a Format First</span>
            </>
          ) : (
            <>
              <Download className="h-6 w-6" />
              <span>Download Now</span>
            </>
          )}
        </motion.button>

        {!selectedFormat && (
          <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-3">
            👆 Click on any format above to select it
          </p>
        )}
      </motion.div>

      {/* Success Message */}
      {downloadComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-x-0 top-20 mx-auto max-w-md z-50 px-4"
        >
          <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-xl p-4 shadow-2xl flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-green-900 dark:text-green-100 text-lg">
                Download Complete! ✓
              </p>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Your file has been saved to your downloads folder
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

