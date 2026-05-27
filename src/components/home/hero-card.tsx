'use client';

import { CalendarPlus } from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

export function HeroCard() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-4 mt-6 rounded-2xl glass-panel p-6 flex items-center justify-between"
    >
      <div>
        <h2 className="text-lg font-bold text-white">Agende um serviço</h2>
        <p className="text-sm text-gray-300">Organize sua rotina pet</p>
      </div>
      <Button className="rounded-2xl h-12 w-12 p-0 bg-primary/20 backdrop-blur-sm border border-white/10 hover:bg-primary/40" variant="ghost">
        <CalendarPlus className="size-6 text-white" />
      </Button>
    </motion.div>
  );
}
