import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { generateApiKey } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // Create test account if requested
    if (username === 'Constant' && password === '0422') {
      const existingUser = await prisma.user.findUnique({
        where: { username: 'Constant' },
      });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash('0422', 10);
        const apiKey = 'test_api_key_constant';

        const user = await prisma.user.create({
          data: {
            username: 'Constant',
            password: hashedPassword,
            apiKey,
          },
        });

        return NextResponse.json({
          message: 'Test account created successfully',
          apiKey: user.apiKey,
        });
      }
    }

    // Regular user registration
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const apiKey = generateApiKey();

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        apiKey,
      },
    });

    return NextResponse.json({
      message: 'User created successfully',
      apiKey: user.apiKey,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}