import { prisma } from './db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function validateApiKey(apiKey: string | null): Promise<boolean> {
  if (!apiKey) return false;
  
  const user = await prisma.user.findFirst({
    where: { apiKey },
  });
  
  return !!user;
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function generateApiKey(): string {
  return 'ak_' + Math.random().toString(36).substr(2, 9);
}