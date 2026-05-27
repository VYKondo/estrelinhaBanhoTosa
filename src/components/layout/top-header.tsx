import { Bell } from "lucide-react";
import { Button } from "../ui/button";

interface TopHeaderProps {
  userName?: string;
}

export function TopHeader({ userName = "Usuário" }: TopHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between glass-panel mx-4 mt-4 rounded-2xl px-4 py-3">
      <div>
        <p className="text-xs text-gray-400">Olá,</p>
        <h1 className="font-bold text-lg text-white">{userName}</h1>
      </div>
      <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
        <Bell className="size-5" />
      </Button>
    </header>
  );
}
