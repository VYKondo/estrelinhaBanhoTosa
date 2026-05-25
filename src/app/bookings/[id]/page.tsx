import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, MapPin, Scissors, Bath, Package, User, Dog } from 'lucide-react';
import { ServiceType, BookingStatus } from '@prisma/client';
import { CancelBookingButton } from '@/components/cancel-booking-button';

const typeIcons: Record<ServiceType, any> = {
  BATH: Bath,
  GROOMING: Scissors,
  PACKAGE: Package,
};

const statusColors: Record<BookingStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  PAID: 'bg-green-100 text-green-800 border-green-200',
  COMPLETED: 'bg-blue-100 text-blue-800 border-blue-200',
  CANCELLED: 'bg-red-100 text-red-800 border-red-200',
};

const statusLabels: Record<BookingStatus, string> = {
  PENDING: 'Pendente',
  PAID: 'Pago',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
};

export default async function BookingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      service: true,
      shop: true,
      pet: true,
      user: true,
    },
  });

  if (!booking) {
    notFound();
  }

  const Icon = typeIcons[booking.service.type];

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Detalhes do Agendamento</h1>

        <Card>
          <CardHeader className="border-b bg-muted/20">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>{booking.service.name}</CardTitle>
                  <CardDescription>Ref: {booking.id.slice(-8).toUpperCase()}</CardDescription>
                </div>
              </div>
              <Badge className={statusColors[booking.status]}>
                {statusLabels[booking.status]}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-sm">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Data</p>
                    <p className="text-muted-foreground">
                      {format(booking.appointmentDate, "PPP", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Horário</p>
                    <p className="text-muted-foreground">
                      {format(booking.appointmentDate, "HH:mm")} ({booking.service.durationMin} min)
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Pet Shop</p>
                    <p className="text-muted-foreground">{booking.shop.name}</p>
                    <p className="text-xs text-muted-foreground">{booking.shop.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Dog className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Pet</p>
                    <p className="text-muted-foreground">
                      {booking.pet.name} ({booking.pet.breed})
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t flex justify-between items-center">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Tutor: {booking.user.email}</span>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-primary">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(booking.service.price)}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/10 border-t p-4 flex justify-between gap-4">
            <Button variant="outline" asChild className="flex-1">
              <a href="/services">Voltar ao Catálogo</a>
            </Button>
            <CancelBookingButton 
              bookingId={booking.id} 
              status={booking.status} 
              appointmentDate={booking.appointmentDate} 
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
