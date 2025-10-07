import { NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';

interface TestResult {
  name: string;
  status: 'pass' | 'fail';
  message: string;
  videoId?: string;
  title?: string;
  formatCount?: number;
  fullError?: {
    name: string;
    message: string;
    stack?: string;
  };
}

export async function GET() {
  const testResults = {
    timestamp: new Date().toISOString(),
    tests: [] as TestResult[],
  };

  // Test 1: Check if ytdl-core is loaded
  try {
    testResults.tests.push({
      name: 'ytdl-core module',
      status: 'pass',
      message: 'Module loaded successfully'
    });
  } catch (error) {
    testResults.tests.push({
      name: 'ytdl-core module',
      status: 'fail',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test 2: Create agent
  try {
    ytdl.createAgent(undefined, { localAddress: undefined });
    testResults.tests.push({
      name: 'Create agent',
      status: 'pass',
      message: 'Agent created successfully'
    });
  } catch (error) {
    testResults.tests.push({
      name: 'Create agent',
      status: 'fail',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test 3: Validate a known URL
  const testUrl = 'https://www.youtube.com/watch?v=jNQXAC9IVRw';
  try {
    const isValid = ytdl.validateURL(testUrl);
    testResults.tests.push({
      name: 'URL validation',
      status: isValid ? 'pass' : 'fail',
      message: isValid ? 'URL validation works' : 'URL validation failed'
    });
  } catch (error) {
    testResults.tests.push({
      name: 'URL validation',
      status: 'fail',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test 4: Try to get video info (most likely to fail)
  try {
    const agent = ytdl.createAgent(undefined, { localAddress: undefined });
    const info = await ytdl.getInfo(testUrl, { agent });
    testResults.tests.push({
      name: 'Get video info',
      status: 'pass',
      message: `Successfully retrieved: ${info.videoDetails.title}`,
      videoId: info.videoDetails.videoId,
      title: info.videoDetails.title,
      formatCount: info.formats.length
    });
  } catch (error) {
    testResults.tests.push({
      name: 'Get video info',
      status: 'fail',
      message: error instanceof Error ? error.message : 'Unknown error',
      fullError: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : undefined
    });
  }

  return NextResponse.json(testResults, { status: 200 });
}

