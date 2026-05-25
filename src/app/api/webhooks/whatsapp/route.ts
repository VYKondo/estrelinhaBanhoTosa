import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendWhatsappTemplate } from '@/lib/whatsapp';

export async function POST(req: Request) {
  const body = await req.json();

  // Verificação simples do webhook (Ideal: validar assinatura do Facebook)
  const entry = body.entry?.[0];
  const changes = entry?.changes?.[0];
  const message = changes?.value?.messages?.[0];

  if (message?.type === 'text') {
    const text = message.text.body.toLowerCase();
    const phone = message.from;

    const user = await prisma.user.findFirst({
      where: { phone: phone.replace(/\D/g, '') },
      include: { bookings: { where: { status: 'PAID' }, orderBy: { appointmentDate: 'desc' } } }
    });

    if (user && user.bookings.length > 0) {
      const booking = user.bookings[0];
      if (text.includes('confirmar')) {
        await prisma.booking.update({ where: { id: booking.id }, data: { status: 'CONFIRMED' } });
      } else if (text.includes('cancelar')) {
        await prisma.booking.update({ where: { id: booking.id }, data: { status: 'CANCELLED' } });
      }
    }
  }

  return NextResponse.json({ status: 'ok' });
}
