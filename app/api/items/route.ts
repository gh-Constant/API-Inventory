import { NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { rateLimiter } from '@/lib/rate-limit';
import { validateItem } from '@/lib/validators';

export async function GET(req: Request) {
  try {
    const rateLimitResponse = await rateLimiter(req);
    if (rateLimitResponse) return rateLimitResponse;

    const apiKey = req.headers.get('x-api-key');
    
    if (!validateApiKey(apiKey)) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const rarity = searchParams.get('rarity');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const where = {
      ...(type && { type }),
      ...(rarity && { rarity }),
    };

    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.item.count({ where }),
    ]);

    const items_with_stats = items.map(item => ({
      ...item,
      stats: JSON.parse(item.stats),
    }));

    return NextResponse.json({
      items: items_with_stats,
      pagination: {
        total,
        page,
        pageSize: limit,
        pageCount: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const rateLimitResponse = await rateLimiter(req);
    if (rateLimitResponse) return rateLimitResponse;

    const apiKey = req.headers.get('x-api-key');
    if (!validateApiKey(apiKey)) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validationResult = validateItem(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid item data', details: validationResult.error },
        { status: 400 }
      );
    }

    const { name, type, rarity, stats } = body;
    
    const item = await prisma.item.create({
      data: {
        name,
        type,
        rarity,
        stats: JSON.stringify(stats),
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}