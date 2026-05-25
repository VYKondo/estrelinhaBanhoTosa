'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { toZonedTime } from 'date-fns-tz';
import { BookingStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const bookingSchema = z.object({
  serviceId: z.string().cuid(),
  petId: z.string().cuid(),
  shopId: z.string().cuid(),
  localDateTime: z.string(), // ISO format string from client: YYYY-MM-DDTHH:mm
});

export async function createBooking(input: any) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return { success: false, error: 'Não autorizado' };

  const validation = bookingSchema.safeParse(input);
  if (!validation.success) return { success: false, error: 'Dados inválidos' };

  const { serviceId, petId, shopId, localDateTime } = validation.data;

  // 1. Obter o usuário no nosso DB
  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) return { success: false, error: 'Usuário não encontrado' };

  // 2. Converter data local para UTC
  // Assumindo que o sistema opera em 'America/Sao_Paulo'
  const timeZone = 'America/Sao_Paulo';
  const appointmentDateUtc = toZonedTime(localDateTime, timeZone);

  try {
    // 3. Transação Prisma para evitar conflitos
    const booking = await prisma.$transaction(async (tx) => {
      // Verificar se já existe agendamento no mesmo horário para o mesmo shop (simplificado para demonstração)
      // Em uma implementação real, checaríamos range de duração
      const conflict = await tx.booking.findFirst({
        where: {
          shopId,
          appointmentDate: appointmentDateUtc,
          status: { not: BookingStatus.CANCELLED },
        },
      });

      if (conflict) {
        throw new Error('Horário já ocupado.');
      }

      return await tx.booking.create({
        data: {
          userId: user.id,
          serviceId,
          petId,
          shopId,
          appointmentDate: appointmentDateUtc,
          status: BookingStatus.PENDING,
        },
      });
    });

    revalidatePath('/bookings');
    return { success: true, bookingId: booking.id };
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao criar agendamento' };
  }
}

export async function cancelBooking(id: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return { success: false, error: 'Não autorizado' };

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) return { success: false, error: 'Usuário não encontrado' };

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { service: true },
  });

  if (!booking || booking.userId !== user.id) {
    return { success: false, error: 'Agendamento não encontrado' };
  }

  // Regra: só cancela se PENDING e > 2h antes
  if (booking.status !== BookingStatus.PENDING) {
    return { success: false, error: 'Apenas agendamentos pendentes podem ser cancelados' };
  }

  const now = new Date();
  const diffHours = (booking.appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (diffHours < 2) {
    return { success: false, error: 'Cancelamento permitido apenas com 2h de antecedência' };
  }

  await prisma.booking.update({
    where: { id },
    data: { status: BookingStatus.CANCELLED },
  });

  revalidatePath(`/bookings/${id}`);
  revalidatePath('/bookings');
  return { success: true };
}
