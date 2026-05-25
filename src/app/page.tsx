import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-12 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
        Bem-vindo à <span className="text-primary">Estrelinha Banho & Tosa</span>
      </h1 >
      <p className="max-w-[600px] text-muted-foreground text-lg mb-8">
        O melhor cuidado para o seu pet, com agendamento fácil e rápido.
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/agendamentos">Agendar Agora</Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/servicos">Conheça Nossos Serviços</Link>
        </Button>
      </div>
    </div>
  );
}
