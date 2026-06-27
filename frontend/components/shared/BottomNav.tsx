// src/components/shared/BottomNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Calendar, List, TrendingUp, Heart, Settings } from 'lucide-react';

const routes = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/log', label: 'Log', icon: List },
  { href: '/insights', label: 'Insights', icon: TrendingUp },
  { href: '/love', label: 'Love', icon: Heart },
  { href: '/settings', label: 'Settings', icon: Settings }
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background/90 backdrop-blur-sm border-t border-border/50 px-4 pb-2">
      <div className="flex justify-around">
        {routes.map((route, index) => {
          const isActive = pathname === route.href;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={`flex flex-col items-center gap-1 px-2 py-2 ${
                isActive
                  ? 'text-[var(--pink-primary)] border-b-2 border-[var(--pink-primary)]'
                  : 'text-muted-foreground/60 hover:text-muted-foreground'
              }`}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={isActive ? { scale: 1 } : { scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <route.icon className={`h-5 w-5 ${isActive ? 'text-[var(--pink-primary)]' : 'text-muted-foreground/60'}`} />
              </motion.div>
              <span className={`text-xs ${isActive ? 'font-medium' : 'font-normal'}`}>{route.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}