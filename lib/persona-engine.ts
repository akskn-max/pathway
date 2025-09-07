export interface PersonaProfile {
  journey_type: 'ivf' | 'natural_conception' | 'domestic_adoption' | 'international_adoption' | 'surrogacy' | 'egg_freezing';
  emotional_state: 'optimistic' | 'anxious' | 'determined' | 'overwhelmed' | 'hopeful' | 'cautious';
  age_group: '18-25' | '26-30' | '31-35' | '36-40' | '41-45' | '46+';
  relationship_status: 'single' | 'partnered' | 'married' | 'divorced' | 'widowed';
  financial_readiness: 'limited' | 'moderate' | 'comfortable' | 'well_resourced';
  support_system: 'strong' | 'moderate' | 'limited';
  health_status: 'excellent' | 'good' | 'fair' | 'concerns';
  priorities: string[];
  theme: string;
  timeline_urgency: 'flexible' | 'moderate' | 'urgent';
  education_level: 'high_school' | 'college' | 'graduate' | 'professional';
  location_type: 'urban' | 'suburban' | 'rural';
}

export interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
  };
  mood: string;
}

export const THEMES: Record<string, ThemeConfig> = {
  sanctuary_orange: {
    name: 'Sanctuary Orange',
    colors: {
      primary: 'hsl(24, 100%, 50%)', // Warm orange
      secondary: 'hsl(24, 85%, 95%)', // Light orange
      accent: 'hsl(45, 100%, 65%)', // Golden yellow
      background: 'hsl(0, 0%, 100%)', // Pure white
      foreground: 'hsl(24, 15%, 15%)', // Warm dark brown
      muted: 'hsl(24, 10%, 85%)', // Warm light gray
      border: 'hsl(24, 20%, 90%)', // Warm border
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
    },
    mood: 'warm, nurturing, optimistic',
  },
  clinical_blue: {
    name: 'Clinical Blue',
    colors: {
      primary: 'hsl(210, 100%, 50%)', // Medical blue
      secondary: 'hsl(210, 85%, 95%)', // Light blue
      accent: 'hsl(190, 100%, 65%)', // Teal accent
      background: 'hsl(0, 0%, 100%)', // Pure white
      foreground: 'hsl(210, 15%, 15%)', // Cool dark gray
      muted: 'hsl(210, 10%, 85%)', // Cool light gray
      border: 'hsl(210, 20%, 90%)', // Cool border
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
    },
    mood: 'professional, trustworthy, clinical',
  },
  nurturing_green: {
    name: 'Nurturing Green',
    colors: {
      primary: 'hsl(140, 70%, 45%)', // Forest green
      secondary: 'hsl(140, 60%, 95%)', // Light green
      accent: 'hsl(120, 80%, 60%)', // Fresh green
      background: 'hsl(0, 0%, 100%)', // Pure white
      foreground: 'hsl(140, 15%, 15%)', // Natural dark
      muted: 'hsl(140, 10%, 85%)', // Natural light
      border: 'hsl(140, 20%, 90%)', // Natural border
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
    },
    mood: 'natural, growth-oriented, calming',
  },
  gentle_purple: {
    name: 'Gentle Purple',
    colors: {
      primary: 'hsl(270, 70%, 55%)', // Soft purple
      secondary: 'hsl(270, 60%, 95%)', // Light purple
      accent: 'hsl(290, 80%, 70%)', // Lavender accent
      background: 'hsl(0, 0%, 100%)', // Pure white
      foreground: 'hsl(270, 15%, 15%)', // Purple-tinted dark
      muted: 'hsl(270, 10%, 85%)', // Purple-tinted light
      border: 'hsl(270, 20%, 90%)', // Purple-tinted border
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
    },
    mood: 'compassionate, supportive, gentle',
  },
  strength_gray: {
    name: 'Strength Gray',
    colors: {
      primary: 'hsl(220, 10%, 35%)', // Strong gray
      secondary: 'hsl(220, 10%, 95%)', // Light gray
      accent: 'hsl(210, 50%, 65%)', // Steel blue accent
      background: 'hsl(0, 0%, 100%)', // Pure white
      foreground: 'hsl(220, 10%, 15%)', // Deep gray
      muted: 'hsl(220, 5%, 85%)', // Neutral light
      border: 'hsl(220, 10%, 90%)', // Neutral border
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
    },
    mood: 'resilient, determined, grounded',
  },
};

export class PersonaEngine {
  static generatePersonaFromOnboarding(onboardingData: any): PersonaProfile {
    const {
      journey_type,
      age,
      relationship_status,
      financial_situation,
      emotional_state,
      priorities,
      timeline,
      education,
      location,
      support_system,
      health_concerns,
    } = onboardingData;

    // Age group mapping
    const age_group = age <= 25 ? '18-25' : 
                     age <= 30 ? '26-30' : 
                     age <= 35 ? '31-35' : 
                     age <= 40 ? '36-40' : 
                     age <= 45 ? '41-45' : '46+';

    // Theme selection based on persona characteristics
    const theme = this.selectTheme(journey_type, emotional_state, age_group);

    return {
      journey_type,
      emotional_state,
      age_group,
      relationship_status,
      financial_readiness: financial_situation,
      support_system,
      health_status: health_concerns ? 'concerns' : 'good',
      priorities: priorities || [],
      theme,
      timeline_urgency: timeline === 'urgent' ? 'urgent' : 
                       timeline === 'flexible' ? 'flexible' : 'moderate',
      education_level: education,
      location_type: location,
    };
  }

  private static selectTheme(
    journey_type: string,
    emotional_state: string,
    age_group: string
  ): string {
    // Theme selection algorithm based on persona characteristics
    if (emotional_state === 'anxious' || emotional_state === 'overwhelmed') {
      return 'nurturing_green'; // Calming, natural
    }
    
    if (journey_type === 'ivf' && (age_group === '36-40' || age_group === '41-45')) {
      return 'strength_gray'; // Resilient, determined
    }
    
    if (journey_type === 'natural_conception' && emotional_state === 'optimistic') {
      return 'sanctuary_orange'; // Warm, nurturing
    }
    
    if (journey_type === 'adoption' || journey_type === 'domestic_adoption') {
      return 'gentle_purple'; // Compassionate, supportive
    }
    
    if (emotional_state === 'determined' || emotional_state === 'cautious') {
      return 'clinical_blue'; // Professional, trustworthy
    }

    // Default theme
    return 'sanctuary_orange';
  }

  static getThemeConfig(themeName: string): ThemeConfig {
    return THEMES[themeName] || THEMES.sanctuary_orange;
  }

  static updatePersonaProfile(
    currentProfile: PersonaProfile,
    updates: Partial<PersonaProfile>
  ): PersonaProfile {
    const updated = { ...currentProfile, ...updates };
    
    // Re-evaluate theme if certain characteristics change
    if (updates.emotional_state || updates.journey_type) {
      updated.theme = this.selectTheme(
        updated.journey_type,
        updated.emotional_state,
        updated.age_group
      );
    }
    
    return updated;
  }

  static getPersonalizedContent(profile: PersonaProfile) {
    const content = {
      welcomeMessage: this.getWelcomeMessage(profile),
      prioritizedFeatures: this.getPrioritizedFeatures(profile),
      recommendedProviders: this.getProviderRecommendations(profile),
      educationalContent: this.getEducationalRecommendations(profile),
      supportResources: this.getSupportResources(profile),
    };

    return content;
  }

  private static getWelcomeMessage(profile: PersonaProfile): string {
    const journeyTypeMessages = {
      ivf: 'Welcome to your IVF journey. We\'re here to support you every step of the way.',
      natural_conception: 'Welcome! Let\'s explore natural paths to parenthood together.',
      domestic_adoption: 'Welcome to your adoption journey. We\'ll help you navigate this meaningful path.',
      international_adoption: 'Welcome! International adoption is a beautiful journey, and we\'re here to guide you.',
      surrogacy: 'Welcome to your surrogacy journey. We\'ll help you understand and navigate this process.',
      egg_freezing: 'Welcome! Let\'s explore egg freezing options to preserve your future fertility.',
    };

    return journeyTypeMessages[profile.journey_type] || 'Welcome to Pathways to Parenthood!';
  }

  private static getPrioritizedFeatures(profile: PersonaProfile): string[] {
    const baseFeatures = ['AI Concierge', 'Journey Dashboard', 'Provider Marketplace'];
    
    if (profile.financial_readiness === 'limited' || profile.priorities.includes('cost')) {
      baseFeatures.unshift('Cost Calculator', 'Insurance Optimizer');
    }
    
    if (profile.emotional_state === 'anxious' || profile.support_system === 'limited') {
      baseFeatures.push('Support Groups', 'Mental Health Resources');
    }
    
    if (profile.timeline_urgency === 'urgent') {
      baseFeatures.unshift('Fast Track Appointments');
    }

    return baseFeatures;
  }

  private static getProviderRecommendations(profile: PersonaProfile): string[] {
    const recommendations = [];
    
    switch (profile.journey_type) {
      case 'ivf':
        recommendations.push('fertility_clinic', 'reproductive_endocrinologist');
        break;
      case 'natural_conception':
        recommendations.push('obgyn', 'fertility_specialist', 'nutritionist');
        break;
      case 'domestic_adoption':
      case 'international_adoption':
        recommendations.push('adoption_agency', 'adoption_attorney', 'social_worker');
        break;
      case 'surrogacy':
        recommendations.push('surrogacy_agency', 'reproductive_attorney', 'fertility_clinic');
        break;
      case 'egg_freezing':
        recommendations.push('fertility_clinic', 'reproductive_endocrinologist');
        break;
    }

    if (profile.emotional_state === 'anxious' || profile.support_system === 'limited') {
      recommendations.push('therapist', 'support_group');
    }

    return recommendations;
  }

  private static getEducationalRecommendations(profile: PersonaProfile): string[] {
    const content = [`${profile.journey_type}_basics`, `${profile.journey_type}_timeline`];
    
    if (profile.age_group === '36-40' || profile.age_group === '41-45' || profile.age_group === '46+') {
      content.push('age_related_fertility');
    }
    
    if (profile.financial_readiness === 'limited') {
      content.push('financing_options', 'insurance_coverage');
    }
    
    if (profile.priorities.includes('success_rates')) {
      content.push('success_rate_analysis', 'clinic_comparison');
    }

    return content;
  }

  private static getSupportResources(profile: PersonaProfile): string[] {
    const resources = ['peer_support_groups'];
    
    if (profile.emotional_state === 'anxious' || profile.emotional_state === 'overwhelmed') {
      resources.push('anxiety_management', 'stress_reduction');
    }
    
    if (profile.relationship_status === 'partnered' || profile.relationship_status === 'married') {
      resources.push('couples_counseling', 'relationship_support');
    }
    
    if (profile.support_system === 'limited') {
      resources.push('online_communities', 'mentorship_program');
    }

    return resources;
  }
}