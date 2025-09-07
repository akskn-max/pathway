'use client';

import { usePersona } from '@/contexts/PersonaContext';
import AuthWrapper from '@/components/auth/AuthWrapper';

export default function Home() {
  const { user, loading } = usePersona();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthWrapper />;
  }

  // User is logged in, redirect will be handled by AuthWrapper
  return <AuthWrapper />;
}