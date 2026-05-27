'use client';

import { motion } from "framer-motion";

export function LiquidBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0f172a]">
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-green-500/20 blur-[120px]"
      />
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[20%] -right-[10%] h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-[150px]"
      />
    </div>
  );
}
