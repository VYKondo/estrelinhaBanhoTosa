export default function PaymentStatusPage({ params }: { params: Promise<{ status: string }> }) {
  const { status } = React.use(params);
  
  const messages: Record<string, { title: string, desc: string }> = {
    success: { title: 'Pagamento Confirmado!', desc: 'Seu agendamento foi confirmado com sucesso.' },
    pending: { title: 'Pagamento Pendente', desc: 'Aguardando confirmação do pagamento.' },
    error: { title: 'Erro no Pagamento', desc: 'Ocorreu um problema ao processar seu pagamento.' }
  };

  const current = messages[status] || messages.error;

  return (
    <div className="container mx-auto py-20 text-center">
      <h1 className="text-4xl font-bold">{current.title}</h1>
      <p className="text-muted-foreground mt-4">{current.desc}</p>
    </div>
  );
}
// Adicionei React ao escopo
import React from 'react';
