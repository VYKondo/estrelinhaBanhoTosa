import { LiquidBackground } from "./liquid-background";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen">
      <LiquidBackground />
      <main className="relative flex-1 pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );
}
