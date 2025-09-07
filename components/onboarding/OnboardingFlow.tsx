'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Heart, Users, DollarSign, Calendar, MapPin, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { usePersona } from '@/contexts/PersonaContext';

interface OnboardingData {
  first_name: string;
  last_name: string;
  age: number;
  journey_type: string;
  relationship_status: string;
  financial_situation: string;
  emotional_state: string;
  priorities: string[];
  timeline: string;
  education: string;
  location: string;
  support_system: string;
  health_concerns: boolean;
  date_of_birth: string;
}

const JOURNEY_TYPES = [
  { value: 'natural_conception', label: 'Natural Conception', icon: '🌱', description: 'Trying to conceive naturally' },
  { value: 'ivf', label: 'IVF', icon: '🧬', description: 'In vitro fertilization treatment' },
  { value: 'domestic_adoption', label: 'Domestic Adoption', icon: '👶', description: 'Adopting within your country' },
  { value: 'international_adoption', label: 'International Adoption', icon: '🌍', description: 'International adoption process' },
  { value: 'surrogacy', label: 'Surrogacy', icon: '🤝', description: 'Using a gestational carrier' },
  { value: 'egg_freezing', label: 'Egg Freezing', icon: '❄️', description: 'Preserving fertility for the future' }
];

const EMOTIONAL_STATES = [
  { value: 'optimistic', label: 'Optimistic', description: 'Feeling hopeful and positive' },
  { value: 'anxious', label: 'Anxious', description: 'Feeling worried or nervous' },
  { value: 'determined', label: 'Determined', description: 'Focused and committed' },
  { value: 'overwhelmed', label: 'Overwhelmed', description: 'Feeling like there\'s too much to handle' },
  { value: 'hopeful', label: 'Hopeful', description: 'Cautiously optimistic' },
  { value: 'cautious', label: 'Cautious', description: 'Taking things step by step' }
];

const PRIORITIES = [
  { value: 'health', label: 'Health & Wellness', icon: Heart },
  { value: 'cost', label: 'Cost Management', icon: DollarSign },
  { value: 'timeline', label: 'Timeline', icon: Calendar },
  { value: 'support', label: 'Emotional Support', icon: Users },
  { value: 'success_rates', label: 'Success Rates', icon: '📊' },
  { value: 'privacy', label: 'Privacy & Security', icon: Shield },
  { value: 'location', label: 'Convenient Location', icon: MapPin }
];

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<OnboardingData>>({
    priorities: []
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const steps = [
    { title: 'Personal Information', icon: Users },
    { title: 'Your Journey', icon: Heart },
    { title: 'Priorities & Goals', icon: '🎯' },
    { title: 'Life Context', icon: '🏠' },
    { title: 'Privacy & Consent', icon: Shield }
  ];

  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        throw new Error('Onboarding failed');
      }
    } catch (error) {
      console.error('Onboarding error:', error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const togglePriority = (priority: string) => {
    setFormData(prev => ({
      ...prev,
      priorities: prev.priorities?.includes(priority)
        ? prev.priorities.filter(p => p !== priority)
        : [...(prev.priorities || []), priority]
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Welcome to Pathways to Parenthood</h2>
              <p className="text-muted-foreground">Let's start by getting to know you</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={formData.first_name || ''}
                  onChange={(e) => updateFormData('first_name', e.target.value)}
                  placeholder="Your first name"
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={formData.last_name || ''}
                  onChange={(e) => updateFormData('last_name', e.target.value)}
                  placeholder="Your last name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth || ''}
                onChange={(e) => updateFormData('date_of_birth', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="relationship_status">Relationship Status</Label>
              <Select onValueChange={(value) => updateFormData('relationship_status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your relationship status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="partnered">Partnered</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Your Parenthood Journey</h2>
              <p className="text-muted-foreground">Tell us about the path you're considering</p>
            </div>

            <div>
              <Label className="text-base font-medium">Which path are you exploring?</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {JOURNEY_TYPES.map((journey) => (
                  <Card 
                    key={journey.value}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      formData.journey_type === journey.value ? 'ring-2 ring-primary border-primary' : ''
                    }`}
                    onClick={() => updateFormData('journey_type', journey.value)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{journey.icon}</span>
                        <div>
                          <h3 className="font-medium">{journey.label}</h3>
                          <p className="text-sm text-muted-foreground">{journey.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">How are you feeling right now?</Label>
              <RadioGroup 
                value={formData.emotional_state} 
                onValueChange={(value) => updateFormData('emotional_state', value)}
                className="mt-4"
              >
                {EMOTIONAL_STATES.map((state) => (
                  <div key={state.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={state.value} id={state.value} />
                    <Label htmlFor={state.value} className="flex-1 cursor-pointer">
                      <div>
                        <div className="font-medium">{state.label}</div>
                        <div className="text-sm text-muted-foreground">{state.description}</div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Your Priorities</h2>
              <p className="text-muted-foreground">What matters most to you on this journey? (Select all that apply)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PRIORITIES.map((priority) => (
                <Card 
                  key={priority.value}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    formData.priorities?.includes(priority.value) ? 'ring-2 ring-primary border-primary' : ''
                  }`}
                  onClick={() => togglePriority(priority.value)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      {typeof priority.icon === 'string' ? (
                        <span className="text-2xl">{priority.icon}</span>
                      ) : (
                        <priority.icon className="h-6 w-6 text-primary" />
                      )}
                      <div>
                        <h3 className="font-medium">{priority.label}</h3>
                      </div>
                      <Checkbox 
                        checked={formData.priorities?.includes(priority.value)} 
                        readOnly 
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <Label htmlFor="timeline">What's your timeline?</Label>
              <Select onValueChange={(value) => updateFormData('timeline', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">As soon as possible (within 6 months)</SelectItem>
                  <SelectItem value="moderate">Within the next year</SelectItem>
                  <SelectItem value="flexible">I'm flexible with timing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Life Context</h2>
              <p className="text-muted-foreground">Help us understand your situation better</p>
            </div>

            <div>
              <Label htmlFor="financial_situation">Financial Readiness</Label>
              <Select onValueChange={(value) => updateFormData('financial_situation', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your financial situation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="limited">Limited resources, need cost-effective options</SelectItem>
                  <SelectItem value="moderate">Moderate resources, some flexibility</SelectItem>
                  <SelectItem value="comfortable">Comfortable, cost is not a major concern</SelectItem>
                  <SelectItem value="well_resourced">Well-resourced, premium options available</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="support_system">Support System</Label>
              <Select onValueChange={(value) => updateFormData('support_system', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="How would you describe your support system?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strong">Strong - I have great support from family/friends</SelectItem>
                  <SelectItem value="moderate">Moderate - Some support available</SelectItem>
                  <SelectItem value="limited">Limited - I'm mostly on my own</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Location Type</Label>
              <Select onValueChange={(value) => updateFormData('location', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="What best describes your location?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urban">Urban - Major city</SelectItem>
                  <SelectItem value="suburban">Suburban - Suburb or small city</SelectItem>
                  <SelectItem value="rural">Rural - Small town or rural area</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="education">Education Level</Label>
              <Select onValueChange={(value) => updateFormData('education', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high_school">High School</SelectItem>
                  <SelectItem value="college">College Degree</SelectItem>
                  <SelectItem value="graduate">Graduate Degree</SelectItem>
                  <SelectItem value="professional">Professional/Doctoral Degree</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Privacy & Data Consent</h2>
              <p className="text-muted-foreground">Your privacy and data security are our top priorities</p>
            </div>

            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Privacy-First Approach</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>✓ All data is encrypted and HIPAA-compliant</p>
                  <p>✓ You control what information is shared and with whom</p>
                  <p>✓ Data is never sold to third parties</p>
                  <p>✓ You can delete your data at any time</p>
                </div>
                
                <div className="space-y-4 mt-6">
                  <div className="flex items-start space-x-2">
                    <Checkbox id="data_processing" />
                    <Label htmlFor="data_processing" className="text-sm leading-relaxed">
                      I consent to Pathways to Parenthood processing my personal health information to provide personalized recommendations and connect me with relevant healthcare providers.
                    </Label>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox id="ai_analysis" />
                    <Label htmlFor="ai_analysis" className="text-sm leading-relaxed">
                      I consent to AI-powered analysis of my data to generate personalized insights and recommendations.
                    </Label>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox id="provider_sharing" />
                    <Label htmlFor="provider_sharing" className="text-sm leading-relaxed">
                      I consent to sharing relevant information with healthcare providers I choose to connect with.
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Getting Started</CardTitle>
              <CardDescription>Step {currentStep + 1} of {totalSteps}</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-primary">{Math.round(progress)}% Complete</div>
              <Progress value={progress} className="w-24 mt-1" />
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            {currentStep === totalSteps - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center space-x-2"
              >
                {loading ? 'Creating your profile...' : 'Complete Setup'}
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="flex items-center space-x-2"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}