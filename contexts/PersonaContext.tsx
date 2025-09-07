'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PersonaProfile, ThemeConfig, PersonaEngine } from '@/lib/persona-engine';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface PersonaContextType {
  personaProfile: PersonaProfile | null;
  themeConfig: ThemeConfig;
  user: User | null;
  loading: boolean;
  updatePersonaProfile: (updates: Partial<PersonaProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

interface PersonaProviderProps {
  children: ReactNode;
}

export function PersonaProvider({ children }: PersonaProviderProps) {
  const [personaProfile, setPersonaProfile] = useState<PersonaProfile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const themeConfig = personaProfile 
    ? PersonaEngine.getThemeConfig(personaProfile.theme)
    : PersonaEngine.getThemeConfig('sanctuary_orange');

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data?.persona_profile) {
        setPersonaProfile(data.persona_profile as PersonaProfile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const updatePersonaProfile = async (updates: Partial<PersonaProfile>) => {
    if (!user || !personaProfile) return;

    try {
      const updatedProfile = PersonaEngine.updatePersonaProfile(personaProfile, updates);
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          persona_profile: updatedProfile,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setPersonaProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating persona profile:', error);
      throw error;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);
        
        if (currentUser) {
          await fetchUserProfile(currentUser.id);
        }
      } catch (error) {
        console.error('Error getting user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setPersonaProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Apply theme to CSS variables
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      const theme = themeConfig.colors;
      
      root.style.setProperty('--primary', theme.primary);
      root.style.setProperty('--secondary', theme.secondary);
      root.style.setProperty('--accent', theme.accent);
      root.style.setProperty('--background', theme.background);
      root.style.setProperty('--foreground', theme.foreground);
      root.style.setProperty('--muted', theme.muted);
      root.style.setProperty('--border', theme.border);
    }
  }, [themeConfig]);

  const value: PersonaContextType = {
    personaProfile,
    themeConfig,
    user,
    loading,
    updatePersonaProfile,
    refreshProfile,
  };

  return (
    <PersonaContext.Provider value={value}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  const context = useContext(PersonaContext);
  if (context === undefined) {
    throw new Error('usePersona must be used within a PersonaProvider');
  }
  return context;
}