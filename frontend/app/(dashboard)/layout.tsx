'use client';

import '../globals.css';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/shared/nav';
import BottomNav from '@/components/shared/BottomNav';
import { apiFetch } from '@/lib/api';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await apiFetch('/auth/me');
        const user = res?.user;
        if (user) {
          localStorage.setItem('userData', JSON.stringify(user));
        }
      } catch (err) {
        console.error('Auth verification failed, redirecting to login:', err);
        localStorage.removeItem('userData');
        localStorage.removeItem('token');
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <>
      <Nav />
      <div className="flex min-h-screen bg-[var(--bg)] pb-16">
        <main className="flex-1 p-6">{children}</main>
      </div>
      <BottomNav />
    </>
  );
}