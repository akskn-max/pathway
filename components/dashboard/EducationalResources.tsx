'use client';

import React, { useState } from 'react';
import { BookOpen, Play, Download, Clock, Star, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePersona } from '@/contexts/PersonaContext';

interface EducationalContent {
  id: string;
  title: string;
  content_type: 'article' | 'video' | 'checklist' | 'calculator' | 'webinar';
  description: string;
  reading_time_minutes?: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  target_personas: string[];
  journey_phases: string[];
  rating: number;
  total_ratings: number;
  thumbnail?: string;
}

export function EducationalResources() {
  const { personaProfile } = usePersona();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock educational content
  const educationalContent: EducationalContent[] = [
    {
      id: '1',
      title: 'Understanding IVF: A Complete Guide',
      content_type: 'article',
      description: 'Comprehensive overview of the IVF process, from initial consultation to embryo transfer',
      reading_time_minutes: 15,
      difficulty_level: 'beginner',
      tags: ['ivf', 'fertility', 'treatment'],
      target_personas: ['ivf'],
      journey_phases: ['assessment', 'treatment'],
      rating: 4.8,
      total_ratings: 245
    },
    {
      id: '2',
      title: 'Emotional Wellness During Fertility Treatment',
      content_type: 'video',
      description: 'Expert psychologist discusses coping strategies and mental health support',
      reading_time_minutes: 25,
      difficulty_level: 'beginner',
      tags: ['mental-health', 'coping', 'support'],
      target_personas: ['ivf', 'natural_conception'],
      journey_phases: ['assessment', 'treatment', 'recovery'],
      rating: 4.9,
      total_ratings: 156
    },
    {
      id: '3',
      title: 'Adoption Process Checklist',
      content_type: 'checklist',
      description: 'Step-by-step checklist for domestic adoption from start to finalization',
      reading_time_minutes: 10,
      difficulty_level: 'intermediate',
      tags: ['adoption', 'checklist', 'legal'],
      target_personas: ['domestic_adoption', 'international_adoption'],
      journey_phases: ['preparation', 'matching', 'finalization'],
      rating: 4.7,
      total_ratings: 89
    },
    {
      id: '4',
      title: 'Insurance Coverage Calculator',
      content_type: 'calculator',
      description: 'Calculate your expected insurance coverage for fertility treatments',
      reading_time_minutes: 5,
      difficulty_level: 'beginner',
      tags: ['insurance', 'financial', 'calculator'],
      target_personas: ['ivf', 'natural_conception', 'egg_freezing'],
      journey_phases: ['assessment', 'planning'],
      rating: 4.6,
      total_ratings: 201
    },
    {
      id: '5',
      title: 'Age and Fertility: What to Expect',
      content_type: 'webinar',
      description: 'Live webinar covering age-related fertility changes and treatment options',
      reading_time_minutes: 60,
      difficulty_level: 'intermediate',
      tags: ['age', 'fertility', 'education'],
      target_personas: ['ivf', 'natural_conception', 'egg_freezing'],
      journey_phases: ['assessment'],
      rating: 4.8,
      total_ratings: 312
    }
  ];

  const filteredContent = educationalContent.filter(content => {
    if (searchTerm && !content.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !content.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (selectedCategory !== 'all' && content.content_type !== selectedCategory) {
      return false;
    }
    return true;
  });

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <BookOpen className="h-5 w-5" />;
      case 'video':
        return <Play className="h-5 w-5" />;
      case 'checklist':
        return <Download className="h-5 w-5" />;
      case 'calculator':
        return <div className="h-5 w-5 bg-primary rounded text-xs text-white flex items-center justify-center">C</div>;
      case 'webinar':
        return <div className="h-5 w-5 bg-green-600 rounded text-xs text-white flex items-center justify-center">W</div>;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Educational Resources</CardTitle>
          <CardDescription>
            Personalized learning content for your {personaProfile?.journey_type?.replace('_', ' ')} journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="article">Articles</TabsTrigger>
                <TabsTrigger value="video">Videos</TabsTrigger>
                <TabsTrigger value="checklist">Checklists</TabsTrigger>
                <TabsTrigger value="calculator">Tools</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Recommended for You */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended for You</CardTitle>
          <CardDescription>Based on your journey type and current phase</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContent
              .filter(content => content.target_personas.includes(personaProfile?.journey_type || ''))
              .slice(0, 3)
              .map((content) => (
                <Card key={content.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      {getContentIcon(content.content_type)}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm leading-tight mb-2">{content.title}</h4>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {content.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {content.reading_time_minutes && (
                              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{content.reading_time_minutes}min</span>
                              </div>
                            )}
                            <Badge className={`text-xs ${getDifficultyColor(content.difficulty_level)}`}>
                              {content.difficulty_level}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-1 text-xs">
                            <Star className="h-3 w-3 fill-current text-yellow-400" />
                            <span>{content.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* All Resources */}
      <div className="grid grid-cols-1 gap-4">
        {filteredContent.map((content) => (
          <Card key={content.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {getContentIcon(content.content_type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{content.title}</h3>
                      <p className="text-muted-foreground mb-3">{content.description}</p>
                      <div className="flex items-center space-x-4">
                        {content.reading_time_minutes && (
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{content.reading_time_minutes} min</span>
                          </div>
                        )}
                        <Badge className={getDifficultyColor(content.difficulty_level)}>
                          {content.difficulty_level}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-current text-yellow-400" />
                          <span className="text-sm">{content.rating} ({content.total_ratings})</span>
                        </div>
                      </div>
                    </div>
                    <Button>
                      {content.content_type === 'video' ? 'Watch' : 
                       content.content_type === 'calculator' ? 'Use Tool' :
                       content.content_type === 'checklist' ? 'Download' : 'Read'}
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {content.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContent.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No resources found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or browse all available resources.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}