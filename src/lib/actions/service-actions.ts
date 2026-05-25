import { prisma } from '@/lib/prisma';
import { ServiceType } from '@prisma/client';

export async function getServices(filter?: ServiceType) {
  return await prisma.service.findMany({
    where: filter ? { type: filter } : undefined,
    include: {
      shop: true,
    },
    orderBy: {
      name: 'asc',
    },
  });
}

export async function getUserPets(clerkId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: { pets: true },
  });
  return user?.pets || [];
}
