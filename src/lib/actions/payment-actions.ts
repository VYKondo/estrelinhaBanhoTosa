'use server';

import { prisma } from '@/lib/prisma';
import { getPaymentStatus } from '@/lib/payment';

export async function checkBookingPayment(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { service: true }
  });

  if (!booking) return { status: 'error' };
  if (booking.status === 'PAID') return { status: 'success' };

  // Verifica no Asaas (simulação de ID de gateway salvo no log)
  const log = await prisma.paymentLog.findFirst({
    where: { externalId: { contains: bookingId } } // Simplificação
  });

  if (log) {
    const status = await getPaymentStatus(log.externalId!);
    if (status.status === 'RECEIVED') {
      await prisma.booking.update({ where: { id: bookingId }, data: { status: 'PAID' } });
      return { status: 'success' };
    }
  }

  return { status: 'pending' };
}
