import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendWhatsappTemplate } from '@/lib/whatsapp';

export async function GET() {
  const now = new Date();
  const targetStart = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const targetEnd = new Date(targetStart.getTime() + 5 * 60 * 1000);

  const bookings = await prisma.booking.findMany({
    where: {
      status: 'PAID',
      appointmentDate: { gte: targetStart, lte: targetEnd },
      user: { whatsappOptInAt: { not: null } }
    },
    include: { user: true }
  });

  for (const booking of bookings) {
    try {
      if (booking.user.phone) {
        await sendWhatsappTemplate(booking.user.phone, 'booking_reminder', {
          name: booking.user.email,
          date: booking.appointmentDate.toLocaleString()
        });
      }
    } catch (error) {
      console.error(`Fallback: Sending email for booking ${booking.id}`, error);
      // Aqui você integraria o Resend ou Nodemailer
    }
  }

  return NextResponse.json({ processed: bookings.length });
}
