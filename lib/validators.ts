import { z } from 'zod';

const itemSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.string().min(1).max(50),
  rarity: z.string().min(1).max(50),
  stats: z.record(z.number()).or(z.record(z.string())),
});

export function validateItem(data: unknown) {
  const result = itemSchema.safeParse(data);
  return result;
}