'use server';

import { prisma } from '@/lib/prisma';
import { startOfDay, endOfDay, addMinutes, isAfter, isBefore, format } from 'date-fns';

export async function getAvailableSlots(shopId: string, date: Date, duration: number) {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  // Busca agendamentos do dia
  const bookings = await prisma.booking.findMany({
    where: {
      shopId,
      appointmentDate: {
        gte: dayStart,
        lte: dayEnd,
      },
      status: { not: 'CANCELLED' },
    },
    include: { service: true },
  });

  const shop = await prisma.shop.findUnique({ where: { id: shopId } });
  if (!shop) return [];

  // openHours structure: { "0": { open: "08:00", close: "18:00" }, "1": ... }
  const openHours = shop.openHours as any;
  const dayOfWeek = date.getDay().toString();
  const hours = openHours[dayOfWeek];

  if (!hours) return []; // Fechado

  const [openH, openM] = hours.open.split(':').map(Number);
  const [closeH, closeM] = hours.close.split(':').map(Number);

  const start = new Date(date).setHours(openH, openM, 0, 0);
  const end = new Date(date).setHours(closeH, closeM, 0, 0);

  const slots = [];
  let current = start;

  while (current + duration * 60000 <= end) {
    const slotStart = new Date(current);
    const slotEnd = new Date(current + duration * 60000);

    const isOccupied = bookings.some((b) => {
      const bStart = b.appointmentDate.getTime();
      const bEnd = bStart + b.service.durationMin * 60000;
      
      // Checa overlap
      return (slotStart.getTime() < bEnd && slotEnd.getTime() > bStart);
    });

    if (!isOccupied) {
      slots.push(format(slotStart, 'HH:mm'));
    }

    current += 30 * 60000; // Step de 30 minutos
  }

  return slots;
}
