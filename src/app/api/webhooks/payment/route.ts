import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const signature = req.headers.get('asaas-signature');
  const body = await req.text();
  const payload = JSON.parse(body);

  // Validação de assinatura
  const hmac = crypto.createHmac('sha256', process.env.ASAAS_WEBHOOK_SECRET!);
  const digest = hmac.update(body).digest('hex');

  if (signature !== digest) {
    return NextResponse.json({ error: 'Assinatura inválida' }, { status: 401 });
  }

  // Idempotência: Log
  const existingLog = await prisma.paymentLog.findFirst({
    where: { externalId: payload.payment.id }
  });

  if (existingLog) return NextResponse.json({ status: 'already_processed' });

  await prisma.paymentLog.create({
    data: {
      externalId: payload.payment.id,
      gateway: 'ASAAS',
      rawPayload: payload,
      status: payload.event
    }
  });

  if (payload.event === 'PAYMENT_RECEIVED') {
    await prisma.booking.update({
      where: { id: payload.payment.externalReference },
      data: { status: 'PAID' }
    });
  }

  return NextResponse.json({ received: true });
}
