'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={cn(
        "relative w-14 h-8 rounded-full border border-border p-1 flex items-center transition-colors duration-500",
        theme === 'dark' ? "bg-zinc-900" : "bg-white"
      )}
      aria-label="Toggle Theme"
    >
      <div className={cn(
        "absolute w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500",
        theme === 'dark' ? "translate-x-6 bg-brand-orange shadow-[0_0_15px_rgba(255,107,0,0.5)]" : "translate-x-0 bg-zinc-50 shadow-sm"
      )}>
        <AnimatePresence mode="wait">
          {theme === 'dark' ? (
            <motion.div
              key="moon"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="w-3.5 h-3.5 text-white fill-white" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ scale: 0, rotate: 90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="w-3.5 h-3.5 text-zinc-900 fill-zinc-900" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
}
