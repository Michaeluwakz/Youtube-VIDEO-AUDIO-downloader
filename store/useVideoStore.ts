import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VideoInfo, DownloadProgress, DownloadHistoryItem } from '@/types';

interface VideoStore {
  currentVideo: VideoInfo | null;
  isLoading: boolean;
  error: string | null;
  downloads: DownloadProgress[];
  history: DownloadHistoryItem[];
  
  // Actions
  setCurrentVideo: (video: VideoInfo | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  addDownload: (download: DownloadProgress) => void;
  updateDownload: (videoId: string, update: Partial<DownloadProgress>) => void;
  removeDownload: (videoId: string) => void;
  addToHistory: (item: DownloadHistoryItem) => void;
  clearHistory: () => void;
  removeFromHistory: (id: string) => void;
}

export const useVideoStore = create<VideoStore>()(
  persist(
    (set) => ({
      currentVideo: null,
      isLoading: false,
      error: null,
      downloads: [],
      history: [],

      setCurrentVideo: (video) => set({ currentVideo: video, error: null }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error, isLoading: false }),
      
      addDownload: (download) =>
        set((state) => ({
          downloads: [...state.downloads, download]
        })),
      
      updateDownload: (videoId, update) =>
        set((state) => ({
          downloads: state.downloads.map((d) =>
            d.videoId === videoId ? { ...d, ...update } : d
          )
        })),
      
      removeDownload: (videoId) =>
        set((state) => ({
          downloads: state.downloads.filter((d) => d.videoId !== videoId)
        })),
      
      addToHistory: (item) =>
        set((state) => ({
          history: [item, ...state.history].slice(0, 50) // Keep last 50 items
        })),
      
      clearHistory: () => set({ history: [] }),
      
      removeFromHistory: (id) =>
        set((state) => ({
          history: state.history.filter((h) => h.id !== id)
        }))
    }),
    {
      name: 'tubegrab-storage',
      partialize: (state) => ({ history: state.history })
    }
  )
);

