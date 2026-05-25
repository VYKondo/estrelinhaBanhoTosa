'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cancelBooking } from '@/lib/actions/booking-actions';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { BookingStatus } from '@prisma/client';

interface CancelBookingButtonProps {
  bookingId: string;
  status: BookingStatus;
  appointmentDate: Date;
}

export function CancelBookingButton({ bookingId, status, appointmentDate }: CancelBookingButtonProps) {
  const [loading, setLoading] = useState(false);

  const canCancel = () => {
    if (status !== 'PENDING') return false;
    const now = new Date();
    const diffHours = (new Date(appointmentDate).getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours >= 2;
  };

  const handleCancel = async () => {
    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) return;

    setLoading(true);
    try {
      const result = await cancelBooking(bookingId);
      if (result.success) {
        toast.success('Agendamento cancelado com sucesso.');
      } else {
        toast.error(result.error || 'Erro ao cancelar agendamento.');
      }
    } catch (error) {
      toast.error('Erro ao cancelar agendamento.');
    } finally {
      setLoading(false);
    }
  };

  if (!canCancel()) return null;

  return (
    <Button variant="destructive" onClick={handleCancel} disabled={loading} className="flex-1">
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Cancelar Agendamento
    </Button>
  );
}
