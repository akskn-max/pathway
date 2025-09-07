'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, Loader2, Heart, Lightbulb, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { usePersona } from '@/contexts/PersonaContext';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export function AIConciergeChat() {
  const { personaProfile } = usePersona();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Hello! I'm your Personal AI Concierge for your ${personaProfile?.journey_type?.replace('_', ' ')} journey. I'm here to provide personalized guidance, answer your questions, and help you navigate every step of your path to parenthood. How can I support you today?`,
      timestamp: new Date(),
      suggestions: [
        'What should I do next?',
        'Help me understand my options',
        'I\'m feeling anxious about the process',
        'Show me my journey timeline'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/agents/ai-concierge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          conversationHistory: messages.slice(-5).map(m => ({
            role: m.type === 'user' ? 'user' : 'assistant',
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.response,
        timestamp: new Date(),
        suggestions: generateSuggestions(content)
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment, and in the meantime, you can explore the other features in your dashboard.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const generateSuggestions = (lastMessage: string): string[] => {
    const suggestions = [
      'What are my next steps?',
      'Help me find providers',
      'Explain this process to me',
      'How much will this cost?',
      'What should I expect?',
      'I need emotional support'
    ];
    
    return suggestions.slice(0, 3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            <span>AI Personal Concierge</span>
            <Badge variant="secondary" className="ml-auto">
              HIPAA Compliant
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto border rounded-lg p-4 mb-4 space-y-4 bg-gray-50">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-white border'
                  } rounded-lg p-4 shadow-sm`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    
                    {/* Suggestions for assistant messages */}
                    {message.type === 'assistant' && message.suggestions && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-medium opacity-80">Suggested responses:</p>
                        <div className="flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs h-7"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">AI Concierge is typing...</span>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything about your journey..."
              disabled={loading}
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !inputMessage.trim()}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold">Health Check</h3>
            <p className="text-sm text-muted-foreground">Review your health data</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <Lightbulb className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold">Get Insights</h3>
            <p className="text-sm text-muted-foreground">AI-powered recommendations</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold">Schedule</h3>
            <p className="text-sm text-muted-foreground">Book appointments</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold">Find Providers</h3>
            <p className="text-sm text-muted-foreground">Connect with experts</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}