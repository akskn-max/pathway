import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface PersonaProfile {
  journey_type: string;
  emotional_state: string;
  demographics: any;
  priorities: string[];
  theme: string;
}

export class GeminiAIConcierge {
  private model;

  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  private getSystemPrompt(personaProfile: PersonaProfile): string {
    return `You are the Pathways to Parenthood Personal AI Concierge. Your role is to be an empathetic, knowledgeable, and trusted guide for individuals on their journey to becoming parents.

CORE PRINCIPLES:
- You are HIPAA-compliant and privacy-focused
- Never provide direct medical advice, but explain medical information and guide to qualified professionals
- Your tone is supportive, calm, and reassuring
- Always prioritize the user's emotional well-being and privacy
- Synthesize user data to provide personalized, actionable next steps

USER CONTEXT:
- Journey Type: ${personaProfile.journey_type}
- Emotional State: ${personaProfile.emotional_state}
- Current Priorities: ${personaProfile.priorities.join(', ')}

RESPONSE GUIDELINES:
- Keep responses conversational and empathetic
- Provide specific, actionable next steps when appropriate
- Ask clarifying questions to better understand needs
- Always offer emotional support and validation
- Suggest appropriate professional resources when needed
- Respect privacy and consent boundaries`;
  }

  async generateResponse(
    message: string,
    personaProfile: PersonaProfile,
    conversationHistory: Array<{ role: string; content: string }> = []
  ): Promise<string> {
    try {
      const systemPrompt = this.getSystemPrompt(personaProfile);
      
      // Build conversation context
      let fullPrompt = systemPrompt + "\n\nCONVERSATION HISTORY:\n";
      
      conversationHistory.forEach((msg, index) => {
        fullPrompt += `${msg.role}: ${msg.content}\n`;
      });
      
      fullPrompt += `\nUSER: ${message}\nASSISTANT: `;

      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('I apologize, but I\'m having trouble connecting right now. Please try again in a moment.');
    }
  }

  async generatePersonalizedRecommendations(
    personaProfile: PersonaProfile,
    journeyData: any,
    healthData?: any
  ): Promise<string[]> {
    try {
      const prompt = `Based on the user's profile and journey data, generate 3-5 personalized, actionable recommendations for their ${personaProfile.journey_type} journey.

USER PROFILE:
- Journey Type: ${personaProfile.journey_type}
- Emotional State: ${personaProfile.emotional_state}
- Priorities: ${personaProfile.priorities.join(', ')}

JOURNEY DATA: ${JSON.stringify(journeyData, null, 2)}

Provide recommendations as a JSON array of strings, focusing on immediate next steps, emotional support resources, and relevant educational content.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      try {
        const recommendations = JSON.parse(response.text());
        return Array.isArray(recommendations) ? recommendations : [];
      } catch {
        // Fallback if JSON parsing fails
        return response.text().split('\n').filter(line => line.trim().length > 0);
      }
    } catch (error) {
      console.error('Recommendation Generation Error:', error);
      return [
        'Continue tracking your health data and symptoms',
        'Schedule a consultation with a relevant healthcare provider',
        'Explore educational resources specific to your journey type',
        'Consider connecting with a support community',
        'Review and update your journey goals and timeline'
      ];
    }
  }

  async generateEducationalContent(
    topic: string,
    personaProfile: PersonaProfile
  ): Promise<string> {
    try {
      const prompt = `Create educational content about "${topic}" specifically tailored for someone on a ${personaProfile.journey_type} journey.

The content should:
- Be empathetic and supportive given their emotional state: ${personaProfile.emotional_state}
- Align with their priorities: ${personaProfile.priorities.join(', ')}
- Provide clear, actionable information
- Include relevant next steps
- Be approximately 200-300 words

Format the response as structured content with clear headings.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      return response.text();
    } catch (error) {
      console.error('Educational Content Generation Error:', error);
      return 'Educational content is temporarily unavailable. Please try again later.';
    }
  }
}

export const aiConcierge = new GeminiAIConcierge();