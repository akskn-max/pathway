'use client';

import { usePersona } from '@/contexts/PersonaContext';
import JourneyDashboard from '@/components/dashboard/JourneyDashboard';
import Navigation from '@/components/layout/Navigation';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, personaProfile, loading } = usePersona();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/');
      } else if (!personaProfile) {
        router.push('/onboarding');
      }
    }
  }, [user, personaProfile, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !personaProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <JourneyDashboard />
    </div>
  );
}