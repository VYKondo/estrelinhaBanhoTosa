'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { createBooking } from '@/lib/actions/booking-actions';
import { getAvailableSlots } from '@/lib/actions/availability-actions';
import { getUserPets } from '@/lib/actions/service-actions';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface BookingDialogProps {
  service: any;
  user: any;
}

export function BookingDialog({ service, user }: BookingDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [pets, setPets] = useState<any[]>([]);
  const [selectedPet, setSelectedPet] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const router = useRouter();

  const fetchSlots = useCallback(async (selectedDate: Date) => {
    setLoadingSlots(true);
    try {
      const slots = await getAvailableSlots(service.shopId, selectedDate, service.durationMin);
      setAvailableTimes(slots);
    } catch (error) {
      toast.error('Erro ao carregar horários.');
    } finally {
      setLoadingSlots(false);
    }
  }, [service.shopId, service.durationMin]);

  useEffect(() => {
    if (open && user) {
      getUserPets(user.id).then(setPets);
    }
  }, [open, user]);

  useEffect(() => {
    if (date) {
      fetchSlots(date);
    }
  }, [date, fetchSlots]);

  const handleBooking = async () => {
    if (!selectedPet || !date || !selectedTime) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      const localDateTime = `${format(date, 'yyyy-MM-dd')}T${selectedTime}`;
      
      const result = await createBooking({
        serviceId: service.id,
        petId: selectedPet,
        shopId: service.shopId,
        localDateTime,
      });

      if (result.success) {
        toast.success('Agendamento realizado com sucesso!');
        setOpen(false);
        router.push(`/bookings/${result.bookingId}`);
      } else {
        toast.error(result.error || 'Erro ao realizar agendamento.');
      }
    } catch (error) {
      toast.error('Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Button variant="default" onClick={() => router.push('/sign-in')}>
        Entrar para Agendar
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Agendar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agendar {service.name}</DialogTitle>
          <DialogDescription>
            Escolha o pet, a data e o horário para o atendimento.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="pet">Seu Pet</Label>
            <Select onValueChange={setSelectedPet} value={selectedPet}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um pet" />
              </SelectTrigger>
              <SelectContent>
                {pets.map((pet) => (
                  <SelectItem key={pet.id} value={pet.id}>
                    {pet.name} ({pet.species})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="time">Horário</Label>
            <Select 
              onValueChange={setSelectedTime} 
              value={selectedTime}
              disabled={loadingSlots || availableTimes.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingSlots ? "Carregando..." : "Selecione um horário"} />
              </SelectTrigger>
              <SelectContent>
                {availableTimes.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleBooking} disabled={loading || !selectedPet || !selectedTime}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmar Agendamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
