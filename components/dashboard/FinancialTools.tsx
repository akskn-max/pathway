'use client';

import React, { useState } from 'react';
import { DollarSign, Calculator, CreditCard, PieChart, TrendingUp, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { usePersona } from '@/contexts/PersonaContext';

interface CostEstimate {
  category: string;
  estimatedCost: number;
  insuranceCovered: number;
  outOfPocket: number;
}

interface FinancialPlan {
  totalEstimatedCost: number;
  insuranceCoverage: number;
  outOfPocketMax: number;
  monthlyBudget: number;
  timelineMonths: number;
}

export function FinancialTools() {
  const { personaProfile } = usePersona();
  const [selectedJourneyType, setSelectedJourneyType] = useState(personaProfile?.journey_type || 'ivf');
  const [insurancePlan, setInsurancePlan] = useState('');
  const [location, setLocation] = useState('');
  const [monthlyBudget, setMonthlyBudget] = useState('');

  // Mock cost data
  const costEstimates: Record<string, CostEstimate[]> = {
    ivf: [
      { category: 'Initial Consultation', estimatedCost: 500, insuranceCovered: 400, outOfPocket: 100 },
      { category: 'Medications', estimatedCost: 5000, insuranceCovered: 2500, outOfPocket: 2500 },
      { category: 'IVF Cycle', estimatedCost: 15000, insuranceCovered: 7500, outOfPocket: 7500 },
      { category: 'Monitoring', estimatedCost: 2000, insuranceCovered: 1500, outOfPocket: 500 },
      { category: 'Additional Services', estimatedCost: 3000, insuranceCovered: 1000, outOfPocket: 2000 }
    ],
    natural_conception: [
      { category: 'Fertility Assessment', estimatedCost: 1500, insuranceCovered: 1200, outOfPocket: 300 },
      { category: 'Monitoring & Tests', estimatedCost: 2000, insuranceCovered: 1600, outOfPocket: 400 },
      { category: 'Supplements & Medications', estimatedCost: 1000, insuranceCovered: 200, outOfPocket: 800 },
      { category: 'Specialist Visits', estimatedCost: 2500, insuranceCovered: 2000, outOfPocket: 500 }
    ],
    domestic_adoption: [
      { category: 'Agency Fees', estimatedCost: 25000, insuranceCovered: 0, outOfPocket: 25000 },
      { category: 'Legal Fees', estimatedCost: 3000, insuranceCovered: 0, outOfPocket: 3000 },
      { category: 'Home Study', estimatedCost: 2000, insuranceCovered: 0, outOfPocket: 2000 },
      { category: 'Travel & Misc', estimatedCost: 3000, insuranceCovered: 0, outOfPocket: 3000 }
    ]
  };

  const currentEstimates = costEstimates[selectedJourneyType] || [];
  const totalCost = currentEstimates.reduce((sum, item) => sum + item.estimatedCost, 0);
  const totalInsurance = currentEstimates.reduce((sum, item) => sum + item.insuranceCovered, 0);
  const totalOutOfPocket = currentEstimates.reduce((sum, item) => sum + item.outOfPocket, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Financial Planning Tools</span>
          </CardTitle>
          <CardDescription>
            Understand costs and plan your financial journey with transparency
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="calculator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculator">Cost Calculator</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
          <TabsTrigger value="planning">Financial Plan</TabsTrigger>
          <TabsTrigger value="tracking">Expense Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5" />
                <span>Cost Estimation Calculator</span>
              </CardTitle>
              <CardDescription>
                Get personalized cost estimates for your journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Input Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="journey_type">Journey Type</Label>
                  <Select value={selectedJourneyType} onValueChange={setSelectedJourneyType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ivf">IVF Treatment</SelectItem>
                      <SelectItem value="natural_conception">Natural Conception</SelectItem>
                      <SelectItem value="domestic_adoption">Domestic Adoption</SelectItem>
                      <SelectItem value="international_adoption">International Adoption</SelectItem>
                      <SelectItem value="surrogacy">Surrogacy</SelectItem>
                      <SelectItem value="egg_freezing">Egg Freezing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="insurance">Insurance Plan</Label>
                  <Select value={insurancePlan} onValueChange={setInsurancePlan}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select insurance plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue_cross">Blue Cross Blue Shield</SelectItem>
                      <SelectItem value="aetna">Aetna</SelectItem>
                      <SelectItem value="united">UnitedHealthcare</SelectItem>
                      <SelectItem value="cigna">Cigna</SelectItem>
                      <SelectItem value="kaiser">Kaiser Permanente</SelectItem>
                      <SelectItem value="none">No Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, State"
                  />
                </div>
              </div>

              {/* Cost Breakdown */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Estimated Costs</h3>
                <div className="space-y-4">
                  {currentEstimates.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{item.category}</h4>
                        <div className="text-sm text-muted-foreground">
                          Insurance covers: ${item.insuranceCovered.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${item.estimatedCost.toLocaleString()}</div>
                        <div className="text-sm text-red-600">
                          Out of pocket: ${item.outOfPocket.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="mt-6 p-6 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold">${totalCost.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total Estimated Cost</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">${totalInsurance.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Insurance Coverage</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">${totalOutOfPocket.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Your Out-of-Pocket</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insurance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Insurance Optimization</span>
              </CardTitle>
              <CardDescription>
                Maximize your insurance benefits and coverage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-2 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-700">Coverage Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Fertility Coverage</span>
                        <span className="font-semibold text-green-600">Included</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IVF Coverage</span>
                        <span className="font-semibold text-green-600">Up to 3 cycles</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Medication Coverage</span>
                        <span className="font-semibold text-green-600">50% covered</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Annual Deductible</span>
                        <span className="font-semibold">$2,500</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Out-of-Pocket Max</span>
                        <span className="font-semibold">$8,000</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4">Upload Insurance Card</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Optimization Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                        <p className="text-sm">Time procedures to maximize benefits within plan year</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                        <p className="text-sm">Use in-network providers to minimize costs</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                        <p className="text-sm">Consider HSA contributions for tax advantages</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                        <p className="text-sm">Pre-authorize all treatments to avoid surprises</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5" />
                <span>Personal Financial Plan</span>
              </CardTitle>
              <CardDescription>
                Create a customized savings and budgeting plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="monthly_budget">Monthly Budget for Journey</Label>
                  <Input
                    id="monthly_budget"
                    type="number"
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <Label htmlFor="timeline">Target Timeline (months)</Label>
                  <Input
                    id="timeline"
                    type="number"
                    placeholder="12"
                  />
                </div>
              </div>

              {monthlyBudget && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Your Financial Plan</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Monthly Budget</span>
                        <span className="font-semibold">${monthlyBudget}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Available (12 months)</span>
                        <span className="font-semibold">${(parseInt(monthlyBudget) * 12).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Out-of-Pocket</span>
                        <span className="font-semibold text-red-600">${totalOutOfPocket.toLocaleString()}</span>
                      </div>
                      <div className="border-t pt-4">
                        <div className="flex justify-between">
                          <span className="font-semibold">Shortfall/Surplus</span>
                          <span className={`font-semibold ${(parseInt(monthlyBudget) * 12) >= totalOutOfPocket ? 'text-green-600' : 'text-red-600'}`}>
                            ${((parseInt(monthlyBudget) * 12) - totalOutOfPocket).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Financing Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Fertility Loans</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Specialized loans for fertility treatments with competitive rates
                      </p>
                      <Button variant="outline" size="sm">Learn More</Button>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Payment Plans</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Monthly payment options through clinic partnerships
                      </p>
                      <Button variant="outline" size="sm">Explore Plans</Button>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Grants & Scholarships</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Financial assistance programs for qualifying families
                      </p>
                      <Button variant="outline" size="sm">Find Grants</Button>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Employer Benefits</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Fertility benefits through your employer's program
                      </p>
                      <Button variant="outline" size="sm">Check Benefits</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Expense Tracking</span>
              </CardTitle>
              <CardDescription>
                Track and categorize all your journey-related expenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Start Tracking Your Expenses</h3>
                <p className="text-muted-foreground mb-4">
                  Log expenses manually or connect your bank accounts for automatic tracking
                </p>
                <div className="space-x-3">
                  <Button>Add Expense</Button>
                  <Button variant="outline">Connect Bank</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}