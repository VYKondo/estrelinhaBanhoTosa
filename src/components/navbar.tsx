import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-xl tracking-tight">
            Estrelinha <span className="text-primary">Banho & Tosa</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/agendamentos" className="text-sm font-medium hover:text-primary transition-colors">
            Agendamentos
          </Link>
          <Link href="/servicos" className="text-sm font-medium hover:text-primary transition-colors">
            Serviços
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
}
