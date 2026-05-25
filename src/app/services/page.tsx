import { getServices } from '@/lib/actions/service-actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ServiceType } from '@prisma/client';
import { Scissors, Bath, Package, Search } from 'lucide-react';
import { BookingDialog } from '@/components/booking-dialog';
import { currentUser } from '@clerk/nextjs/server';

const typeIcons: Record<ServiceType, any> = {
  BATH: Bath,
  GROOMING: Scissors,
  PACKAGE: Package,
};

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const filter = type && Object.values(ServiceType).includes(type as ServiceType) 
    ? (type as ServiceType) 
    : undefined;

  const services = await getServices(filter);
  const user = await currentUser();

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nosso Catálogo de Serviços</h1>
          <p className="text-muted-foreground mt-1">
            Escolha o melhor cuidado para o seu pet e agende agora mesmo.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant={!filter ? "default" : "outline"} asChild size="sm">
            <a href="/services">Todos</a>
          </Button>
          {Object.values(ServiceType).map((t) => (
            <Button 
              key={t} 
              variant={filter === t ? "default" : "outline"} 
              asChild 
              size="sm"
            >
              <a href={`/services?type=${t}`}>
                {t === 'BATH' ? 'Banho' : t === 'GROOMING' ? 'Tosa' : 'Pacotes'}
              </a>
            </Button>
          ))}
        </div>
      </div>

      {services.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-lg border border-dashed">
          <Search className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Nenhum serviço encontrado</h3>
          <p className="text-muted-foreground">Tente mudar o filtro ou volte mais tarde.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = typeIcons[service.type];
            return (
              <Card key={service.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="secondary">{service.type}</Badge>
                  </div>
                  <CardTitle className="mt-4">{service.name}</CardTitle>
                  <CardDescription>{service.shop.name}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Duração:</span>
                    <span className="font-medium">{service.durationMin} min</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span className="text-muted-foreground">Local:</span>
                    <span className="font-medium text-right">{service.shop.address}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center border-t pt-4">
                  <span className="text-xl font-bold">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.price)}
                  </span>
                  <BookingDialog service={service} user={user} />
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
