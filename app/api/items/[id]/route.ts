import { NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { rateLimiter } from '@/lib/rate-limit';
import { validateItem } from '@/lib/validators';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const item = await prisma.item.findUnique({
      where: { id: params.id },
    });

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...item,
      stats: JSON.parse(item.stats),
    });
  } catch (error) {
    console.error('Error fetching item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const item = await prisma.item.update({
      where: { id: params.id },
      data: {
        name,
        type,
        rarity,
        stats: JSON.stringify(stats),
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    await prisma.item.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}