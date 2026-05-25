export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} Estrelinha Banho & Tosa. Todos os direitos reservados.
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <a href="#" className="hover:underline underline-offset-4">LGPD</a>
          <a href="#" className="hover:underline underline-offset-4">Termos</a>
        </div>
      </div>
    </footer>
  );
}
