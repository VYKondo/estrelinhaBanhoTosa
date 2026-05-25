import axios from 'axios';

const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
const ASAAS_API_URL = process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3';

const asaasClient = axios.create({
  baseURL: ASAAS_API_URL,
  headers: {
    'access_token': ASAAS_API_KEY,
    'Content-Type': 'application/json',
  },
});

export async function createCheckoutSession(bookingId: string, amount: number, customerId: string) {
  const { data } = await asaasClient.post('/payments', {
    customer: customerId,
    billingType: 'PIX',
    value: amount,
    dueDate: new Date().toISOString().split('T')[0],
    externalReference: bookingId,
    description: `Pagamento agendamento #${bookingId.slice(-8)}`,
  });
  return data;
}

export async function createSubscription(userId: string, plan: string, customerId: string) {
  const { data } = await asaasClient.post('/subscriptions', {
    customer: customerId,
    billingType: 'UNDEFINED',
    value: plan === 'premium' ? 99.90 : 49.90,
    nextDueDate: new Date().toISOString().split('T')[0],
    description: `Assinatura ${plan}`,
  });
  return data;
}

export async function getPaymentStatus(id: string) {
  const { data } = await asaasClient.get(`/payments/${id}`);
  return data;
}
