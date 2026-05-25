import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createCheckoutSession } from '@/lib/payment';

export async function POST(req: NextRequest) {
  const { bookingId } = await req.json();

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { service: true, user: true },
  });

  if (!booking) return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 });

  // Mock Asaas CustomerId para fins de integração
  const asaasCustomerId = 'cus_000000000000'; 

  const payment = await createCheckoutSession(booking.id, booking.service.price, asaasCustomerId);

  return NextResponse.json({ 
    checkoutUrl: payment.invoiceUrl,
    id: payment.id 
  });
}
