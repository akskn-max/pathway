'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, DollarSign, Clock, Heart, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePersona } from '@/contexts/PersonaContext';

interface Provider {
  id: string;
  name: string;
  provider_type: string;
  specializations: string[];
  location_data: {
    city: string;
    state: string;
    distance?: number;
  };
  rating_average: number;
  total_ratings: number;
  insurance_accepted: string[];
  outcome_metrics: {
    success_rate?: number;
    cost_effectiveness?: number;
  };
  recommendation_score?: number;
  match_reasons?: string[];
}

export function ProviderMarketplace() {
  const { personaProfile } = usePersona();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('recommendation');

  useEffect(() => {
    fetchProviders();
  }, [personaProfile]);

  const fetchProviders = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockProviders: Provider[] = [
        {
          id: '1',
          name: 'Reproductive Health Center',
          provider_type: 'fertility_clinic',
          specializations: ['ivf', 'natural_conception', 'egg_freezing'],
          location_data: { city: 'San Francisco', state: 'CA', distance: 2.5 },
          rating_average: 4.8,
          total_ratings: 156,
          insurance_accepted: ['Blue Cross', 'Aetna', 'UnitedHealth'],
          outcome_metrics: { success_rate: 0.75, cost_effectiveness: 0.85 },
          recommendation_score: 95,
          match_reasons: ['Specializes in your journey type', 'High success rate', 'Accepts your insurance']
        },
        {
          id: '2',
          name: 'Family Building Associates',
          provider_type: 'adoption_agency',
          specializations: ['domestic_adoption', 'international_adoption'],
          location_data: { city: 'Oakland', state: 'CA', distance: 8.2 },
          rating_average: 4.6,
          total_ratings: 89,
          insurance_accepted: ['Kaiser', 'Blue Cross'],
          outcome_metrics: { success_rate: 0.82 },
          recommendation_score: 88,
          match_reasons: ['Experienced with domestic adoption', 'Strong support services']
        },
        {
          id: '3',
          name: 'Dr. Sarah Chen, MD',
          provider_type: 'reproductive_endocrinologist',
          specializations: ['ivf', 'fertility_assessment', 'hormone_therapy'],
          location_data: { city: 'San Jose', state: 'CA', distance: 15.3 },
          rating_average: 4.9,
          total_ratings: 234,
          insurance_accepted: ['Blue Cross', 'Aetna', 'Cigna', 'UnitedHealth'],
          outcome_metrics: { success_rate: 0.78 },
          recommendation_score: 92,
          match_reasons: ['Highly rated specialist', 'Comprehensive fertility services']
        }
      ];
      
      setProviders(mockProviders);
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProviders = providers
    .filter(provider => {
      if (selectedType !== 'all' && provider.provider_type !== selectedType) return false;
      if (searchTerm && !provider.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating_average - a.rating_average;
        case 'distance':
          return (a.location_data.distance || 0) - (b.location_data.distance || 0);
        case 'recommendation':
        default:
          return (b.recommendation_score || 0) - (a.recommendation_score || 0);
      }
    });

  const getProviderTypeLabel = (type: string) => {
    const labels = {
      fertility_clinic: 'Fertility Clinic',
      adoption_agency: 'Adoption Agency',
      reproductive_endocrinologist: 'Reproductive Specialist',
      mental_health: 'Mental Health',
      legal_services: 'Legal Services',
      financial_advisor: 'Financial Advisor'
    };
    return labels[type as keyof typeof labels] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Provider Marketplace</CardTitle>
          <CardDescription>
            Find vetted providers matched to your {personaProfile?.journey_type?.replace('_', ' ')} journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Provider type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                <SelectItem value="fertility_clinic">Fertility Clinics</SelectItem>
                <SelectItem value="adoption_agency">Adoption Agencies</SelectItem>
                <SelectItem value="reproductive_endocrinologist">Specialists</SelectItem>
                <SelectItem value="mental_health">Mental Health</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommendation">Best Match</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="distance">Nearest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Providers List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredProviders.map((provider) => (
          <Card key={provider.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{provider.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{provider.location_data.city}, {provider.location_data.state}</span>
                      {provider.location_data.distance && (
                        <span>• {provider.location_data.distance} miles</span>
                      )}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    <Star className="h-4 w-4 fill-current text-yellow-400" />
                    <span className="font-semibold">{provider.rating_average}</span>
                    <span className="text-muted-foreground">({provider.total_ratings})</span>
                  </div>
                  {provider.recommendation_score && (
                    <Badge variant="secondary">
                      {provider.recommendation_score}% Match
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {/* Provider Type and Specializations */}
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {getProviderTypeLabel(provider.provider_type)}
                  </Badge>
                  {provider.specializations.slice(0, 3).map((spec) => (
                    <Badge key={spec} variant="secondary" className="text-xs">
                      {spec.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>

                {/* Match Reasons */}
                {provider.match_reasons && (
                  <div>
                    <p className="text-sm font-medium text-green-600 mb-2">Why this is a good match:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {provider.match_reasons.map((reason, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <Heart className="h-3 w-3 text-green-500 flex-shrink-0" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Metrics */}
                <div className="flex items-center space-x-6 text-sm">
                  {provider.outcome_metrics.success_rate && (
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span>
                        {Math.round(provider.outcome_metrics.success_rate * 100)}% Success Rate
                      </span>
                    </div>
                  )}
                  {provider.insurance_accepted.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                      <span>Accepts {provider.insurance_accepted.length} insurance plans</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3 pt-4">
                  <Button className="flex-1">
                    Contact Provider
                  </Button>
                  <Button variant="outline">
                    View Profile
                  </Button>
                  <Button variant="ghost" size="sm">
                    Save
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProviders.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No providers found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or contact our support team for personalized recommendations.
            </p>
            <Button className="mt-4">Contact Support</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}