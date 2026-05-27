'use client';

import { Home, Calendar, Landmark, FileText, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const items = [
  { name: "Início", icon: Home, href: "/" },
  { name: "Agenda", icon: Calendar, href: "/bookings" },
  { name: "Financeiro", icon: Landmark, href: "/finance" },
  { name: "Relatórios", icon: FileText, href: "/reports" },
  { name: "Perfil", icon: User, href: "/profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <motion.nav 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-6 left-4 right-4 z-50 flex h-16 items-center justify-around glass-panel rounded-3xl px-2 border-white/10 md:hidden shadow-lg"
    >
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-2xl p-2 transition-colors",
              isActive ? "text-primary" : "text-gray-400 hover:text-white"
            )}
          >
            <item.icon className="size-5" strokeWidth={isActive ? 2.5 : 1.5} />
            <span className="text-[9px] font-medium">{item.name}</span>
          </Link>
        );
      })}
    </motion.nav>
  );
}
