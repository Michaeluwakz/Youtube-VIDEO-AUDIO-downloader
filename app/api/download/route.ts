import { NextRequest, NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';
import { isValidYouTubeUrl } from '@/lib/utils';

// Configure ytdl with agent to avoid bot detection
const agent = ytdl.createAgent(undefined, {
  localAddress: undefined,
});

export async function POST(request: NextRequest) {
  try {
    const { url, itag } = await request.json();

    console.log('Download request received:', { url, itag });

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    if (!isValidYouTubeUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    if (!itag) {
      return NextResponse.json(
        { error: 'Format (itag) is required' },
        { status: 400 }
      );
    }

    // Validate URL with ytdl
    if (!ytdl.validateURL(url)) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL format' },
        { status: 400 }
      );
    }

    console.log('Fetching video info...');

    // Get video info with agent
    const info = await ytdl.getInfo(url, { agent });
    
    console.log('Video info retrieved:', info.videoDetails.title);

    const title = info.videoDetails.title.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 100);
    
    // Find the specific format by itag
    const selectedFormat = info.formats.find(f => f.itag === itag);
    
    if (!selectedFormat) {
      console.error('Format not found:', itag);
      return NextResponse.json(
        { error: 'Selected format not available' },
        { status: 404 }
      );
    }

    console.log('Selected format:', {
      itag: selectedFormat.itag,
      quality: selectedFormat.qualityLabel || selectedFormat.quality,
      container: selectedFormat.container
    });

    // Determine file extension based on format
    const extension = selectedFormat.container || 'mp4';
    const filename = `${title}.${extension}`;

    console.log('Starting download stream...');

    // Create a readable stream with proper error handling
    const videoStream = ytdl(url, { 
      quality: itag,
      agent,
      highWaterMark: 1024 * 512, // 512KB buffer
    });

    let streamStarted = false;

    // Create a response with streaming
    const stream = new ReadableStream({
      async start(controller) {
        videoStream.on('data', (chunk: Buffer) => {
          if (!streamStarted) {
            console.log('Stream started, first chunk received');
            streamStarted = true;
          }
          try {
            controller.enqueue(chunk);
          } catch (err) {
            console.error('Error enqueueing chunk:', err);
          }
        });

        videoStream.on('end', () => {
          console.log('Stream ended successfully');
          try {
            controller.close();
          } catch (err) {
            console.error('Error closing stream:', err);
          }
        });

        videoStream.on('error', (error: Error) => {
          console.error('Video stream error:', error.message);
          try {
            controller.error(error);
          } catch (err) {
            console.error('Error handling stream error:', err);
          }
        });
      },
      cancel() {
        console.log('Stream cancelled');
        videoStream.destroy();
      }
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': selectedFormat.mimeType || `video/${extension}`,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      }
    });
  } catch (error) {
    console.error('Error in download API:', error);
    
    // Provide more detailed error messages
    let errorMessage = 'Failed to download video';
    
    if (error instanceof Error) {
      if (error.message.includes('unavailable')) {
        errorMessage = 'Video is unavailable or private';
      } else if (error.message.includes('copyright')) {
        errorMessage = 'Video is protected by copyright';
      } else if (error.message.includes('private')) {
        errorMessage = 'Video is private';
      } else if (error.message.includes('restricted')) {
        errorMessage = 'Video is age-restricted or region-locked';
      } else if (error.message.includes('429')) {
        errorMessage = 'Too many requests. Please wait a moment and try again';
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

