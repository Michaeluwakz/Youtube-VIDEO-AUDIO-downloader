export interface VideoInfo {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  channel: string;
  channelUrl?: string;
  uploadDate?: string;
  viewCount?: string;
  description?: string;
  availableFormats: DownloadFormat[];
}

export interface DownloadFormat {
  itag: number;
  quality: string;
  format: 'mp4' | 'webm' | 'mp3' | 'm4a';
  size: string;
  resolution?: string;
  bitrate?: string;
  hasAudio: boolean;
  hasVideo: boolean;
  container: string;
  qualityLabel?: string;
  fps?: number;
}

export interface DownloadProgress {
  videoId: string;
  title: string;
  progress: number;
  status: 'pending' | 'downloading' | 'completed' | 'error' | 'cancelled';
  downloadedBytes: number;
  totalBytes: number;
  speed: number;
  estimatedTime: number;
  error?: string;
}

export interface DownloadHistoryItem {
  id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  downloadedAt: string;
  format: string;
  quality: string;
}

export interface DownloadRequest {
  url: string;
  quality: string;
  format: string;
  itag: number;
}

