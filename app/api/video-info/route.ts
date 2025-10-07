import { NextRequest, NextResponse } from 'next/server';
import { getVideoInfo } from '@/lib/youtube';
import { isValidYouTubeUrl } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    console.log('Video info request received:', url);

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

    console.log('Fetching video information...');
    const videoInfo = await getVideoInfo(url);
    console.log('Video info retrieved successfully:', videoInfo.title);

    return NextResponse.json(videoInfo);
  } catch (error) {
    console.error('Error in video-info API:', error);
    
    let errorMessage = 'Failed to fetch video information';
    
    if (error instanceof Error) {
      if (error.message.includes('unavailable')) {
        errorMessage = 'Video is unavailable or has been removed';
      } else if (error.message.includes('private')) {
        errorMessage = 'Video is private';
      } else if (error.message.includes('restricted')) {
        errorMessage = 'Video is age-restricted or region-locked';
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

