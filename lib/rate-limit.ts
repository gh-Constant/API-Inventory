import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const rateLimit = new Map<string, { count: number; timestamp: number }>();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 60; // 60 requests per minute

export function getRateLimitInfo(identifier: string) {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  
  // Clean up old entries
  for (const [key, value] of rateLimit.entries()) {
    if (value.timestamp < windowStart) {
      rateLimit.delete(key);
    }
  }

  const current = rateLimit.get(identifier) || { count: 0, timestamp: now };
  if (current.timestamp < windowStart) {
    current.count = 0;
    current.timestamp = now;
  }
  
  return current;
}

export function updateRateLimit(identifier: string) {
  const current = getRateLimitInfo(identifier);
  current.count += 1;
  rateLimit.set(identifier, current);
  return current;
}

export async function rateLimiter(req: Request) {
  const headersList = headers();
  const apiKey = headersList.get('x-api-key');
  
  if (!apiKey) {
    return NextResponse.json({ error: 'API key required' }, { status: 401 });
  }

  const current = updateRateLimit(apiKey);
  
  if (current.count > MAX_REQUESTS) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429 }
    );
  }

  return null;
}