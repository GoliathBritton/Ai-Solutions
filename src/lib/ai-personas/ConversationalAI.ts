/**
 * MetisAI Conversational AI System
 * Advanced conversational AI with voice capabilities for sales and marketing
 */

import { AIPersonaManager, ConversationType, AIPersona } from './AIPersonas';

export interface ConversationContext {
  leadId: string;
  personaId: string;
  conversationType: ConversationType;
  leadInfo: LeadInfo;
  conversationHistory: ConversationMessage[];
  currentStage: ConversationStage;
  objectives: ConversationObjective[];
  sentiment: SentimentAnalysis;
  nextActions: NextAction[];
}

export interface LeadInfo {
  id: string;
  name: string;
  company: string;
  industry: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  painPoints: string[];
  currentSolutions: string[];
  budget: string;
  timeline: string;
  decisionMakers: string[];
  lastContact: Date;
  contactHistory: ContactRecord[];
  preferences: LeadPreferences;
}

export interface LeadPreferences {
  preferredContactMethod: 'email' | 'phone' | 'linkedin' | 'video';
  preferredTime: string;
  timeZone: string;
  communicationStyle: 'formal' | 'casual' | 'technical' | 'consultative';
  interests: string[];
}

export interface ConversationMessage {
  id: string;
  timestamp: Date;
  speaker: 'ai' | 'human';
  message: string;
  intent: string;
  sentiment: number;
  entities: Entity[];
  actionItems: ActionItem[];
}

export interface Entity {
  type: string;
  value: string;
  confidence: number;
}

export interface ActionItem {
  type: 'follow-up' | 'send-materials' | 'schedule-meeting' | 'qualify' | 'objection-handle';
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: Date;
}

export interface SentimentAnalysis {
  overall: number; // -1 to 1
  confidence: number;
  emotions: Emotion[];
  keywords: KeywordSentiment[];
}

export interface Emotion {
  emotion: string;
  intensity: number;
}

export interface KeywordSentiment {
  keyword: string;
  sentiment: number;
  frequency: number;
}

export interface ConversationObjective {
  type: 'qualify' | 'educate' | 'demo' | 'close' | 'follow-up';
  description: string;
  successCriteria: string[];
  completed: boolean;
}

export interface NextAction {
  type: 'call' | 'email' | 'schedule' | 'send-materials' | 'research';
  description: string;
  priority: 'high' | 'medium' | 'low';
  scheduledFor: Date;
  assignedTo: string;
}

export type ConversationStage = 
  | 'introduction' 
  | 'qualification' 
  | 'presentation' 
  | 'objection-handling' 
  | 'closing' 
  | 'follow-up' 
  | 'nurturing';

export interface VoiceConfig {
  provider: 'elevenlabs' | 'azure' | 'aws-polly' | 'openai';
  voiceId: string;
  speed: number;
  pitch: number;
  volume: number;
  language: string;
}

export interface ConversationResponse {
  message: string;
  intent: string;
  confidence: number;
  suggestedActions: NextAction[];
  stageTransition?: ConversationStage;
  followUpQuestions: string[];
  objectionsDetected: string[];
}

export class ConversationalAI {
  private personaManager: AIPersonaManager;
  private conversations: Map<string, ConversationContext> = new Map();
  private voiceConfigs: Map<string, VoiceConfig> = new Map();

  constructor() {
    this.personaManager = new AIPersonaManager();
    this.initializeVoiceConfigs();
  }

  /**
   * Initialize voice configurations for each persona
   */
  private initializeVoiceConfigs(): void {
    const personas = this.personaManager.getAllPersonas();
    
    personas.forEach(persona => {
      const voiceConfig: VoiceConfig = {
        provider: 'elevenlabs',
        voiceId: this.getVoiceIdForPersona(persona),
        speed: this.getSpeedForPersona(persona),
        pitch: this.getPitchForPersona(persona),
        volume: 0.8,
        language: 'en-US'
      };
      
      this.voiceConfigs.set(persona.id, voiceConfig);
    });
  }

  /**
   * Get voice ID for persona
   */
  private getVoiceIdForPersona(persona: AIPersona): string {
    const voiceMapping: Record<string, string> = {
      'sarah-enterprise': 'sarah-voice-001',
      'marcus-technical': 'marcus-voice-002',
      'elena-crypto': 'elena-voice-003',
      'david-support': 'david-voice-004',
      'alex-marketing': 'alex-voice-005'
    };
    
    return voiceMapping[persona.id] || 'default-voice';
  }

  /**
   * Get speaking speed for persona
   */
  private getSpeedForPersona(persona: AIPersona): number {
    switch (persona.voiceProfile.speakingRate) {
      case 'slow': return 0.8;
      case 'normal': return 1.0;
      case 'fast': return 1.2;
      default: return 1.0;
    }
  }

  /**
   * Get pitch for persona
   */
  private getPitchForPersona(persona: AIPersona): number {
    switch (persona.voiceProfile.pitch) {
      case 'low': return 0.8;
      case 'medium': return 1.0;
      case 'high': return 1.2;
      default: return 1.0;
    }
  }

  /**
   * Start a new conversation with a lead
   */
  async startConversation(
    leadInfo: LeadInfo,
    personaId: string,
    conversationType: ConversationType,
    channel: 'phone' | 'email' | 'chat' | 'video'
  ): Promise<ConversationContext> {
    const persona = this.personaManager.getPersona(personaId);
    if (!persona) {
      throw new Error(`Persona with ID ${personaId} not found`);
    }

    const context: ConversationContext = {
      leadId: leadInfo.id,
      personaId,
      conversationType,
      leadInfo,
      conversationHistory: [],
      currentStage: 'introduction',
      objectives: this.generateObjectives(conversationType, leadInfo),
      sentiment: { overall: 0, confidence: 0, emotions: [], keywords: [] },
      nextActions: []
    };

    this.conversations.set(leadInfo.id, context);

    // Generate initial message
    const initialMessage = await this.generateInitialMessage(context, channel);
    
    return context;
  }

  /**
   * Generate conversation objectives based on type and lead info
   */
  private generateObjectives(
    conversationType: ConversationType,
    leadInfo: LeadInfo
  ): ConversationObjective[] {
    const objectives: ConversationObjective[] = [];

    switch (conversationType) {
      case 'cold-call':
        objectives.push(
          {
            type: 'qualify',
            description: 'Determine if lead is a good fit for MetisAI',
            successCriteria: ['Pain points identified', 'Budget confirmed', 'Timeline established'],
            completed: false
          },
          {
            type: 'educate',
            description: 'Introduce MetisAI quantum AI capabilities',
            successCriteria: ['Interest generated', 'Value proposition understood'],
            completed: false
          }
        );
        break;
      case 'warm-lead':
        objectives.push(
          {
            type: 'demo',
            description: 'Schedule and conduct product demonstration',
            successCriteria: ['Demo scheduled', 'Key features shown', 'Questions answered'],
            completed: false
          }
        );
        break;
      case 'technical-consultation':
        objectives.push(
          {
            type: 'educate',
            description: 'Provide technical details and integration guidance',
            successCriteria: ['Technical requirements understood', 'Integration plan created'],
            completed: false
          }
        );
        break;
    }

    return objectives;
  }

  /**
   * Generate initial message for conversation
   */
  private async generateInitialMessage(
    context: ConversationContext,
    channel: 'phone' | 'email' | 'chat' | 'video'
  ): Promise<string> {
    const persona = this.personaManager.getPersona(context.personaId);
    if (!persona) return '';

    const script = this.personaManager.getPersonaScript(context.personaId, 'greeting');
    const personalizedScript = this.personaManager.personalizeScript(script, {
      name: context.leadInfo.name,
      company: context.leadInfo.company,
      industry: context.leadInfo.industry
    });

    // Adapt message for channel
    switch (channel) {
      case 'phone':
        return personalizedScript;
      case 'email':
        return this.adaptScriptForEmail(personalizedScript, context.leadInfo);
      case 'chat':
        return this.adaptScriptForChat(personalizedScript);
      case 'video':
        return this.adaptScriptForVideo(personalizedScript);
      default:
        return personalizedScript;
    }
  }

  /**
   * Process incoming message and generate response
   */
  async processMessage(
    leadId: string,
    message: string,
    channel: 'phone' | 'email' | 'chat' | 'video'
  ): Promise<ConversationResponse> {
    const context = this.conversations.get(leadId);
    if (!context) {
      throw new Error(`No conversation found for lead ${leadId}`);
    }

    // Analyze the incoming message
    const messageAnalysis = await this.analyzeMessage(message);
    
    // Add message to conversation history
    const conversationMessage: ConversationMessage = {
      id: this.generateMessageId(),
      timestamp: new Date(),
      speaker: 'human',
      message,
      intent: messageAnalysis.intent,
      sentiment: messageAnalysis.sentiment,
      entities: messageAnalysis.entities,
      actionItems: messageAnalysis.actionItems
    };

    context.conversationHistory.push(conversationMessage);

    // Update sentiment analysis
    context.sentiment = await this.updateSentimentAnalysis(context);

    // Determine response based on current stage and message analysis
    const response = await this.generateResponse(context, messageAnalysis);

    // Add AI response to conversation history
    const aiMessage: ConversationMessage = {
      id: this.generateMessageId(),
      timestamp: new Date(),
      speaker: 'ai',
      message: response.message,
      intent: response.intent,
      sentiment: 0.5, // AI messages are neutral
      entities: [],
      actionItems: []
    };

    context.conversationHistory.push(aiMessage);

    // Update context with next actions
    context.nextActions = response.suggestedActions;

    // Update stage if needed
    if (response.stageTransition) {
      context.currentStage = response.stageTransition;
    }

    return response;
  }

  /**
   * Analyze incoming message
   */
  private async analyzeMessage(message: string): Promise<{
    intent: string;
    sentiment: number;
    entities: Entity[];
    actionItems: ActionItem[];
  }> {
    // This would integrate with NLP services like OpenAI, Azure Cognitive Services, etc.
    // For now, we'll provide a simplified analysis
    
    const intent = this.detectIntent(message);
    const sentiment = this.analyzeSentiment(message);
    const entities = this.extractEntities(message);
    const actionItems = this.generateActionItems(message, intent);

    return { intent, sentiment, entities, actionItems };
  }

  /**
   * Detect intent from message
   */
  private detectIntent(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return 'pricing_inquiry';
    } else if (lowerMessage.includes('demo') || lowerMessage.includes('show')) {
      return 'demo_request';
    } else if (lowerMessage.includes('not interested') || lowerMessage.includes('not ready')) {
      return 'objection';
    } else if (lowerMessage.includes('tell me more') || lowerMessage.includes('explain')) {
      return 'information_request';
    } else if (lowerMessage.includes('schedule') || lowerMessage.includes('meeting')) {
      return 'meeting_request';
    } else {
      return 'general_inquiry';
    }
  }

  /**
   * Analyze sentiment of message
   */
  private analyzeSentiment(message: string): number {
    // Simple sentiment analysis - in production, use a proper NLP service
    const positiveWords = ['interested', 'great', 'excellent', 'good', 'like', 'love'];
    const negativeWords = ['not interested', 'bad', 'terrible', 'hate', 'expensive', 'no'];
    
    const lowerMessage = message.toLowerCase();
    let sentiment = 0;
    
    positiveWords.forEach(word => {
      if (lowerMessage.includes(word)) sentiment += 0.1;
    });
    
    negativeWords.forEach(word => {
      if (lowerMessage.includes(word)) sentiment -= 0.1;
    });
    
    return Math.max(-1, Math.min(1, sentiment));
  }

  /**
   * Extract entities from message
   */
  private extractEntities(message: string): Entity[] {
    const entities: Entity[] = [];
    
    // Simple entity extraction - in production, use NER services
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const phoneRegex = /\b\d{3}-\d{3}-\d{4}\b/;
    const companyRegex = /\b[A-Z][a-z]+ (Inc|LLC|Corp|Company|Group)\b/;
    
    if (emailRegex.test(message)) {
      const email = message.match(emailRegex)?.[0];
      if (email) entities.push({ type: 'email', value: email, confidence: 0.9 });
    }
    
    if (phoneRegex.test(message)) {
      const phone = message.match(phoneRegex)?.[0];
      if (phone) entities.push({ type: 'phone', value: phone, confidence: 0.9 });
    }
    
    if (companyRegex.test(message)) {
      const company = message.match(companyRegex)?.[0];
      if (company) entities.push({ type: 'company', value: company, confidence: 0.8 });
    }
    
    return entities;
  }

  /**
   * Generate action items from message
   */
  private generateActionItems(message: string, intent: string): ActionItem[] {
    const actionItems: ActionItem[] = [];
    const lowerMessage = message.toLowerCase();
    
    if (intent === 'demo_request') {
      actionItems.push({
        type: 'schedule-meeting',
        description: 'Schedule demo presentation',
        priority: 'high',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      });
    }
    
    if (lowerMessage.includes('send') && lowerMessage.includes('information')) {
      actionItems.push({
        type: 'send-materials',
        description: 'Send product information and case studies',
        priority: 'medium',
        dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours
      });
    }
    
    return actionItems;
  }

  /**
   * Generate response based on context and message analysis
   */
  private async generateResponse(
    context: ConversationContext,
    messageAnalysis: any
  ): Promise<ConversationResponse> {
    const persona = this.personaManager.getPersona(context.personaId);
    if (!persona) {
      throw new Error(`Persona with ID ${context.personaId} not found`);
    }

    let response: ConversationResponse;

    switch (messageAnalysis.intent) {
      case 'pricing_inquiry':
        response = await this.handlePricingInquiry(context, persona);
        break;
      case 'demo_request':
        response = await this.handleDemoRequest(context, persona);
        break;
      case 'objection':
        response = await this.handleObjection(context, persona, messageAnalysis);
        break;
      case 'information_request':
        response = await this.handleInformationRequest(context, persona);
        break;
      case 'meeting_request':
        response = await this.handleMeetingRequest(context, persona);
        break;
      default:
        response = await this.handleGeneralInquiry(context, persona);
    }

    return response;
  }

  /**
   * Handle pricing inquiries
   */
  private async handlePricingInquiry(
    context: ConversationContext,
    persona: AIPersona
  ): Promise<ConversationResponse> {
    const response = `I'd be happy to discuss our pricing structure with you. Our pricing is based on your specific needs and usage requirements. 

For enterprise clients like ${context.leadInfo.company}, we typically offer:
- Custom pricing based on your AI compute needs
- Volume discounts for larger implementations
- Flexible payment options including our FLY Token ecosystem

Would you like me to create a customized quote based on your current AI usage and requirements?`;

    return {
      message: response,
      intent: 'pricing_response',
      confidence: 0.9,
      suggestedActions: [
        {
          type: 'send-materials',
          description: 'Send pricing guide and ROI calculator',
          priority: 'high',
          scheduledFor: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
          assignedTo: context.personaId
        }
      ],
      followUpQuestions: [
        'What is your current monthly AI spending?',
        'How many users would need access to the platform?',
        'What are your primary use cases for AI?'
      ],
      objectionsDetected: []
    };
  }

  /**
   * Handle demo requests
   */
  private async handleDemoRequest(
    context: ConversationContext,
    persona: AIPersona
  ): Promise<ConversationResponse> {
    const response = `Excellent! I'd love to show you how MetisAI's quantum-enhanced capabilities can transform your ${context.leadInfo.industry} operations.

For ${context.leadInfo.company}, I can prepare a personalized demo that shows:
- How our quantum AI outperforms traditional solutions by 40%
- Specific use cases relevant to your industry
- Integration with your existing systems
- ROI calculations based on your current processes

What's the best time for a 30-minute demo? I can also include your technical team if needed.`;

    return {
      message: response,
      intent: 'demo_scheduling',
      confidence: 0.95,
      suggestedActions: [
        {
          type: 'schedule',
          description: 'Schedule personalized demo',
          priority: 'high',
          scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          assignedTo: context.personaId
        }
      ],
      stageTransition: 'presentation',
      followUpQuestions: [
        'What time works best for you this week?',
        'Should I include your technical team in the demo?',
        'Are there specific features you'd like me to focus on?'
      ],
      objectionsDetected: []
    };
  }

  /**
   * Handle objections
   */
  private async handleObjection(
    context: ConversationContext,
    persona: AIPersona,
    messageAnalysis: any
  ): Promise<ConversationResponse> {
    const script = this.personaManager.getPersonaScript(context.personaId, 'objectionHandling');
    
    let response = script;
    
    // Customize objection handling based on detected objection type
    if (messageAnalysis.sentiment < -0.3) {
      response += ` I completely understand your concerns. Many of our clients had similar reservations initially, but here's what they discovered...`;
    }

    return {
      message: response,
      intent: 'objection_handling',
      confidence: 0.8,
      suggestedActions: [
        {
          type: 'send-materials',
          description: 'Send case studies and testimonials',
          priority: 'high',
          scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
          assignedTo: context.personaId
        }
      ],
      stageTransition: 'objection-handling',
      followUpQuestions: [
        'What specific concerns do you have?',
        'Have you had negative experiences with AI solutions before?',
        'What would need to change for you to consider our solution?'
      ],
      objectionsDetected: ['general_resistance']
    };
  }

  /**
   * Handle information requests
   */
  private async handleInformationRequest(
    context: ConversationContext,
    persona: AIPersona
  ): Promise<ConversationResponse> {
    const response = `I'd be happy to provide more detailed information about MetisAI. Based on your interest in ${context.leadInfo.industry}, let me share some relevant details:

${this.getIndustrySpecificInfo(context.leadInfo.industry)}

Would you like me to send you our comprehensive solution guide and some case studies from similar companies in your industry?`;

    return {
      message: response,
      intent: 'information_sharing',
      confidence: 0.9,
      suggestedActions: [
        {
          type: 'send-materials',
          description: 'Send industry-specific solution guide',
          priority: 'medium',
          scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
          assignedTo: context.personaId
        }
      ],
      followUpQuestions: [
        'What specific aspects would you like to learn more about?',
        'Are you currently evaluating other AI solutions?',
        'What's your timeline for implementing AI solutions?'
      ],
      objectionsDetected: []
    };
  }

  /**
   * Handle meeting requests
   */
  private async handleMeetingRequest(
    context: ConversationContext,
    persona: AIPersona
  ): Promise<ConversationResponse> {
    const response = `Perfect! I'd love to schedule a meeting to discuss how MetisAI can benefit ${context.leadInfo.company}.

I can offer several meeting formats:
- 15-minute discovery call to understand your needs
- 30-minute demo showing our quantum AI capabilities
- 45-minute technical consultation for your IT team

What works best for your schedule? I'm available this week and can accommodate your timezone.`;

    return {
      message: response,
      intent: 'meeting_scheduling',
      confidence: 0.95,
      suggestedActions: [
        {
          type: 'schedule',
          description: 'Schedule meeting based on lead preference',
          priority: 'high',
          scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          assignedTo: context.personaId
        }
      ],
      stageTransition: 'qualification',
      followUpQuestions: [
        'What day and time works best for you?',
        'Which meeting format would be most valuable?',
        'Should I include anyone else from your team?'
      ],
      objectionsDetected: []
    };
  }

  /**
   * Handle general inquiries
   */
  private async handleGeneralInquiry(
    context: ConversationContext,
    persona: AIPersona
  ): Promise<ConversationResponse> {
    const script = this.personaManager.getPersonaScript(context.personaId, 'introduction');
    const personalizedScript = this.personaManager.personalizeScript(script, {
      name: context.leadInfo.name,
      company: context.leadInfo.company,
      industry: context.leadInfo.industry
    });

    return {
      message: personalizedScript,
      intent: 'general_response',
      confidence: 0.8,
      suggestedActions: [
        {
          type: 'qualify',
          description: 'Continue qualification process',
          priority: 'medium',
          scheduledFor: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
          assignedTo: context.personaId
        }
      ],
      followUpQuestions: [
        'What challenges are you facing with your current AI solutions?',
        'How is your organization currently using AI?',
        'What would success look like for your AI initiatives?'
      ],
      objectionsDetected: []
    };
  }

  /**
   * Get industry-specific information
   */
  private getIndustrySpecificInfo(industry: string): string {
    const industryInfo: Record<string, string> = {
      'real estate': `Real Estate Benefits:
- Predictive analytics for property valuations
- Automated lead scoring and qualification
- Market trend analysis with quantum precision
- ROI optimization for property investments
- Automated document processing and analysis`,

      'financial services': `Financial Services Benefits:
- Risk assessment with quantum-enhanced accuracy
- Fraud detection and prevention
- Algorithmic trading optimization
- Regulatory compliance automation
- Credit scoring improvements`,

      'healthcare': `Healthcare Benefits:
- Medical diagnosis assistance
- Drug discovery acceleration
- Patient outcome prediction
- Treatment optimization
- Medical imaging analysis`
    };

    return industryInfo[industry.toLowerCase()] || `Industry Benefits:
- Process optimization with quantum computing
- Cost reduction through intelligent automation
- Enhanced decision-making capabilities
- Scalable AI solutions for enterprise needs
- Competitive advantage through advanced AI`;
  }

  /**
   * Generate voice message
   */
  async generateVoiceMessage(
    leadId: string,
    message: string
  ): Promise<{ audioUrl: string; duration: number }> {
    const context = this.conversations.get(leadId);
    if (!context) {
      throw new Error(`No conversation found for lead ${leadId}`);
    }

    const voiceConfig = this.voiceConfigs.get(context.personaId);
    if (!voiceConfig) {
      throw new Error(`No voice config found for persona ${context.personaId}`);
    }

    // This would integrate with voice synthesis services
    // For now, return a placeholder
    return {
      audioUrl: `https://api.voice-synthesis.com/generate?voice=${voiceConfig.voiceId}&text=${encodeURIComponent(message)}`,
      duration: Math.ceil(message.length / 15) // Estimate duration
    };
  }

  /**
   * Update sentiment analysis for conversation
   */
  private async updateSentimentAnalysis(context: ConversationContext): Promise<SentimentAnalysis> {
    const recentMessages = context.conversationHistory.slice(-5); // Last 5 messages
    const sentiments = recentMessages.map(msg => msg.sentiment);
    const averageSentiment = sentiments.reduce((sum, sent) => sum + sent, 0) / sentiments.length;

    return {
      overall: averageSentiment,
      confidence: 0.8,
      emotions: [],
      keywords: []
    };
  }

  /**
   * Adapt script for email
   */
  private adaptScriptForEmail(script: string, leadInfo: LeadInfo): string {
    return `Subject: Revolutionary AI Solution for ${leadInfo.company}

Dear ${leadInfo.name},

${script}

Best regards,
MetisAI Team

P.S. I've attached our latest case study showing how we helped a similar company in ${leadInfo.industry} achieve 40% better results.`;
  }

  /**
   * Adapt script for chat
   */
  private adaptScriptForChat(script: string): string {
    return script.replace(/Hello/g, 'Hi').replace(/I hope I'm not catching you at a bad time/g, 'I hope you're doing well');
  }

  /**
   * Adapt script for video
   */
  private adaptScriptForVideo(script: string): string {
    return `${script}

I'd love to show you a quick demo of our platform. Are you available for a brief video call?`;
  }

  /**
   * Generate unique message ID
   */
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get conversation context
   */
  getConversationContext(leadId: string): ConversationContext | undefined {
    return this.conversations.get(leadId);
  }

  /**
   * Get all active conversations
   */
  getAllActiveConversations(): ConversationContext[] {
    return Array.from(this.conversations.values());
  }

  /**
   * End conversation
   */
  endConversation(leadId: string): void {
    this.conversations.delete(leadId);
  }
}

export default ConversationalAI;
