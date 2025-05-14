'use client'

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/contexts/AuthContext';

export default function RootPage() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    
    if (user.type_render === 'carreira') {
      router.replace('/carreiras');
    } else {
      router.replace('/cursos');
    }
  }, [user, router]);

  return null;
}