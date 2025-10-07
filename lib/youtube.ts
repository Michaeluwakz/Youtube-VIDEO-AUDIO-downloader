import ytdl from '@distube/ytdl-core';
import { VideoInfo, DownloadFormat } from '@/types';
import { formatBytes, formatDuration } from './utils';

// Create agent to avoid bot detection
const agent = ytdl.createAgent(undefined, {
  localAddress: undefined,
});

export async function getVideoInfo(url: string): Promise<VideoInfo> {
  try {
    console.log('Getting video info with agent...');
    const info = await ytdl.getInfo(url, { agent });
    const formats = info.formats
      .filter((format) => format.hasAudio || format.hasVideo)
      .map((format): DownloadFormat => {
        const isAudioOnly = format.hasAudio && !format.hasVideo;
        
        let formatType: 'mp4' | 'webm' | 'mp3' | 'm4a' = 'mp4';
        if (isAudioOnly) {
          formatType = format.container === 'mp4' ? 'm4a' : 'mp3';
        } else if (format.container === 'webm') {
          formatType = 'webm';
        }

        return {
          itag: format.itag,
          quality: format.qualityLabel || format.audioBitrate + 'kbps' || 'unknown',
          format: formatType,
          size: format.contentLength ? formatBytes(parseInt(format.contentLength)) : 'Unknown',
          resolution: format.qualityLabel,
          bitrate: format.audioBitrate ? `${format.audioBitrate}kbps` : undefined,
          hasAudio: format.hasAudio,
          hasVideo: format.hasVideo,
          container: format.container,
          qualityLabel: format.qualityLabel,
          fps: format.fps
        };
      })
      // Remove duplicates and sort by quality
      .filter((format, index, self) => 
        index === self.findIndex((f) => f.quality === format.quality && f.format === format.format)
      )
      .sort((a, b) => {
        // Sort video formats by resolution
        if (a.hasVideo && b.hasVideo) {
          const aHeight = parseInt(a.resolution || '0');
          const bHeight = parseInt(b.resolution || '0');
          return bHeight - aHeight;
        }
        // Sort audio formats by bitrate
        if (!a.hasVideo && !b.hasVideo) {
          const aBitrate = parseInt(a.bitrate || '0');
          const bBitrate = parseInt(b.bitrate || '0');
          return bBitrate - aBitrate;
        }
        // Video formats come before audio
        return a.hasVideo ? -1 : 1;
      });

    const videoDetails = info.videoDetails;
    
    return {
      id: videoDetails.videoId,
      title: videoDetails.title,
      duration: formatDuration(parseInt(videoDetails.lengthSeconds)),
      thumbnail: videoDetails.thumbnails[videoDetails.thumbnails.length - 1].url,
      channel: videoDetails.author.name,
      channelUrl: videoDetails.author.channel_url,
      uploadDate: videoDetails.uploadDate,
      viewCount: videoDetails.viewCount,
      description: videoDetails.description || undefined,
      availableFormats: formats
    };
  } catch (error) {
    console.error('Error fetching video info:', error);
    throw new Error('Failed to fetch video information. Please check the URL and try again.');
  }
}

export function getBestFormat(formats: DownloadFormat[], quality: string = 'highest'): DownloadFormat | null {
  const videoFormats = formats.filter(f => f.hasVideo && f.hasAudio);
  
  if (videoFormats.length === 0) return formats[0] || null;

  if (quality === 'highest') {
    return videoFormats[0];
  }

  if (quality === 'lowest') {
    return videoFormats[videoFormats.length - 1];
  }

  // Find specific quality
  return videoFormats.find(f => f.qualityLabel === quality) || videoFormats[0];
}

