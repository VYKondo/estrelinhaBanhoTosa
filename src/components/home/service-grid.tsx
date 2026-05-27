'use client';

import { Scissors, Package, Users, UserCog } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  { title: "Serviços", icon: Scissors },
  { title: "Pacotes", icon: Package },
  { title: "Clientes", icon: Users },
  { title: "Equipe", icon: UserCog },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1 },
};

export function ServiceGrid() {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-4 px-4 mt-6"
    >
      {services.map((s) => (
        <motion.div 
          key={s.title} 
          variants={item}
          whileHover={{ scale: 1.02 }}
          className="glass-panel p-4 rounded-2xl flex flex-col items-center text-center gap-2"
        >
          <div className="bg-white/10 p-3 rounded-full text-primary">
            <s.icon className="size-6" strokeWidth={1.5} />
          </div>
          <span className="font-bold text-sm text-white">{s.title}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
