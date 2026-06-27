// src/components/home/quick-actions.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { List, Calendar, TrendingUp } from 'lucide-react';

export default function QuickActions() {
  const actions = [
    {
      icon: List,
      label: 'Log Today',
      subtitle: 'Track your symptoms, mood, and flow',
      href: '/log'
    },
    {
      icon: Calendar,
      label: 'Calendar',
      subtitle: 'View your cycle predictions and history',
      href: '/calendar'
    },
    {
      icon: TrendingUp,
      label: 'Insights',
      subtitle: 'Discover patterns in your cycle',
      href: '/insights'
    }
  ];

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.4 }}
      className="grid gap-4 grid-cols-1 md:grid-cols-3"
    >
      {actions.map((action, index) => (
        <motion.div
          key={action.label}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Link href={action.href} className="flex flex-col items-center gap-3 p-6 glass-card w-full h-full text-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--pink-primary)]/20 border border-[var(--pink-primary)]/20 text-[var(--pink-secondary)]">
                <action.icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-foreground font-headings tracking-tight">{action.label}</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{action.subtitle}</p>
              </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}