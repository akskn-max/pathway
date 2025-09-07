'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MessageCircle, Users, DollarSign, BookOpen, Settings, Activity, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePersona } from '@/contexts/PersonaContext';
import { AIConciergeChat } from './AIConciergeChat';
import { ProviderMarketplace } from './ProviderMarketplace';
import { FinancialTools } from './FinancialTools';
import { EducationalResources } from './EducationalResources';

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  dueDate?: string;
  category: string;
}

interface JourneyData {
  id: string;
  journey_type: string;
  status: string;
  current_phase: string;
  milestones: Milestone[];
  progress_percentage: number;
  next_actions: string[];
}

export default function JourneyDashboard() {
  const { personaProfile, themeConfig, user } = usePersona();
  const [journeyData, setJourneyData] = useState<JourneyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      fetchJourneyData();
    }
  }, [user]);

  const fetchJourneyData = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockJourneyData: JourneyData = {
        id: '1',
        journey_type: personaProfile?.journey_type || 'natural_conception',
        status: 'active',
        current_phase: 'assessment',
        progress_percentage: 35,
        milestones: [
          {
            id: '1',
            title: 'Complete Health Assessment',
            description: 'Comprehensive health and fertility evaluation',
            status: 'completed',
            category: 'health'
          },
          {
            id: '2',
            title: 'Meet with Specialist',
            description: 'Initial consultation with reproductive specialist',
            status: 'in_progress',
            dueDate: '2025-01-15',
            category: 'medical'
          },
          {
            id: '3',
            title: 'Insurance Review',
            description: 'Review insurance coverage and benefits',
            status: 'upcoming',
            dueDate: '2025-01-20',
            category: 'financial'
          }
        ],
        next_actions: [
          'Schedule follow-up blood work',
          'Review insurance coverage options',
          'Complete partner health screening'
        ]
      };
      
      setJourneyData(mockJourneyData);
    } catch (error) {
      console.error('Error fetching journey data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getJourneyTitle = () => {
    const titles = {
      natural_conception: 'Natural Conception Journey',
      ivf: 'IVF Treatment Journey',
      domestic_adoption: 'Domestic Adoption Journey',
      international_adoption: 'International Adoption Journey',
      surrogacy: 'Surrogacy Journey',
      egg_freezing: 'Egg Freezing Journey'
    };
    return titles[journeyData?.journey_type as keyof typeof titles] || 'Your Parenthood Journey';
  };

  const getMilestoneIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'upcoming':
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {personaProfile?.first_name || 'there'}!
              </h1>
              <p className="text-gray-600 mt-1">{getJourneyTitle()}</p>
            </div>
            <Button variant="outline" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="concierge" className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>AI Concierge</span>
            </TabsTrigger>
            <TabsTrigger value="providers" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Providers</span>
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Financial</span>
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Learn</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Calendar</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Journey Progress</CardTitle>
                <CardDescription>Your current progress on your parenthood journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {journeyData?.progress_percentage}% Complete
                    </span>
                  </div>
                  <Progress value={journeyData?.progress_percentage} className="h-2" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {journeyData?.milestones.filter(m => m.status === 'completed').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {journeyData?.milestones.filter(m => m.status === 'in_progress').length}
                      </div>
                      <div className="text-sm text-muted-foreground">In Progress</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {journeyData?.milestones.filter(m => m.status === 'upcoming').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Upcoming</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Next Steps</CardTitle>
                <CardDescription>AI-powered recommendations for your next actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {journeyData?.next_actions.map((action, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span className="flex-1">{action}</span>
                      <Button variant="ghost" size="sm">
                        Mark Complete
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Milestones */}
            <Card>
              <CardHeader>
                <CardTitle>Journey Milestones</CardTitle>
                <CardDescription>Track your progress through key milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {journeyData?.milestones.map((milestone) => (
                    <motion.div
                      key={milestone.id}
                      className="flex items-start space-x-4 p-4 rounded-lg border"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {getMilestoneIcon(milestone.status)}
                      <div className="flex-1">
                        <h4 className="font-medium">{milestone.title}</h4>
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                        {milestone.dueDate && (
                          <p className="text-sm text-blue-600 mt-1">Due: {milestone.dueDate}</p>
                        )}
                      </div>
                      <Badge variant={
                        milestone.status === 'completed' ? 'default' :
                        milestone.status === 'in_progress' ? 'secondary' : 'outline'
                      }>
                        {milestone.status.replace('_', ' ')}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="concierge">
            <AIConciergeChat />
          </TabsContent>

          <TabsContent value="providers">
            <ProviderMarketplace />
          </TabsContent>

          <TabsContent value="financial">
            <FinancialTools />
          </TabsContent>

          <TabsContent value="education">
            <EducationalResources />
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Appointments & Calendar</CardTitle>
                <CardDescription>Manage your appointments and schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Calendar Integration</h3>
                  <p className="text-muted-foreground mb-4">
                    Connect your calendar to manage appointments with providers
                  </p>
                  <Button>Connect Calendar</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}