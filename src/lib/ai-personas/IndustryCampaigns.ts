/**
 * Industry-Specific Campaign Strategies and Messaging
 * Comprehensive campaign frameworks for all 30+ industries
 */

export interface IndustryCampaign {
  industry: string;
  personaId: string;
  campaignName: string;
  targetAudience: string[];
  primaryGoal: string;
  secondaryGoals: string[];
  keyMessages: string[];
  painPoints: string[];
  valueProps: string[];
  callToActions: string[];
  followUpSequence: {
    day: number;
    type: 'email' | 'phone' | 'linkedin' | 'video';
    message: string;
    purpose: string;
  }[];
  objections: {
    objection: string;
    response: string;
    proof: string;
  }[];
  successMetrics: string[];
  estimatedConversionRate: string;
  averageDealSize: string;
  salesCycle: string;
}

export const industryCampaigns: IndustryCampaign[] = [
  // AGRICULTURE CAMPAIGNS
  {
    industry: 'Agriculture',
    personaId: 'mike-thompson',
    campaignName: 'Precision Farming Revolution',
    targetAudience: ['Farm Owners', 'Agricultural Cooperatives', 'Crop Consultants'],
    primaryGoal: 'Increase crop yields by 20-30% through precision agriculture technology',
    secondaryGoals: ['Reduce input costs by 15-25%', 'Improve sustainability metrics', 'Enhance decision-making with real-time data'],
    keyMessages: [
      'Transform your farm with AI-powered precision agriculture',
      'Increase yields while reducing costs and environmental impact',
      'Real-time crop monitoring and predictive analytics',
      'ROI typically achieved within first growing season'
    ],
    painPoints: ['Unpredictable weather affecting yields', 'Rising input costs', 'Labor shortages', 'Regulatory compliance'],
    valueProps: ['20-30% yield increase', '15-25% cost reduction', 'Real-time monitoring', 'Predictive analytics'],
    callToActions: [
      'Schedule a farm technology assessment',
      'Request ROI calculator for your operation',
      'Book a demo of our precision agriculture platform'
    ],
    followUpSequence: [
      { day: 3, type: 'email', message: 'Follow-up on farm technology assessment', purpose: 'Maintain engagement' },
      { day: 7, type: 'phone', message: 'Discuss specific farm challenges and solutions', purpose: 'Qualify needs' },
      { day: 14, type: 'email', message: 'Share success stories from similar operations', purpose: 'Build credibility' },
      { day: 21, type: 'linkedin', message: 'Connect and share agricultural insights', purpose: 'Build relationship' },
      { day: 30, type: 'phone', message: 'Propose pilot program for next season', purpose: 'Close opportunity' }
    ],
    objections: [
      {
        objection: 'Too expensive for our operation',
        response: 'Our ROI calculator shows most farms see payback within the first growing season through yield increases and cost savings.',
        proof: 'Case study: XYZ Farm increased yields 28% and reduced costs 22% in first year'
      },
      {
        objection: 'Too complex to implement',
        response: 'We provide complete implementation support and training. Most farmers are up and running within 2 weeks.',
        proof: 'Implementation success rate: 98% of farms operational within 14 days'
      }
    ],
    successMetrics: ['Yield increase percentage', 'Cost reduction percentage', 'ROI timeline', 'Farmer satisfaction score'],
    estimatedConversionRate: '12-18%',
    averageDealSize: '$25,000 - $150,000',
    salesCycle: '3-6 months'
  },

  // AVIATION CAMPAIGNS
  {
    industry: 'Aviation',
    personaId: 'captain-sarah-mitchell',
    campaignName: 'Next-Generation Aviation Operations',
    targetAudience: ['Airlines', 'Airports', 'Aircraft Manufacturers'],
    primaryGoal: 'Enhance safety and operational efficiency through advanced aviation technology',
    secondaryGoals: ['Reduce operational costs', 'Improve regulatory compliance', 'Enhance passenger experience'],
    keyMessages: [
      'Revolutionize aviation operations with AI-powered safety systems',
      'Reduce operational costs while enhancing safety protocols',
      'Streamline regulatory compliance with automated reporting',
      'Proven track record with major airlines and airports'
    ],
    painPoints: ['Safety compliance complexity', 'Rising operational costs', 'Regulatory reporting burden', 'Staff training requirements'],
    valueProps: ['Enhanced safety protocols', 'Operational efficiency gains', 'Regulatory compliance automation', 'Cost reduction'],
    callToActions: [
      'Schedule aviation safety assessment',
      'Request operational efficiency analysis',
      'Book demo of our aviation management platform'
    ],
    followUpSequence: [
      { day: 2, type: 'phone', message: 'Follow-up on safety assessment interest', purpose: 'Qualify urgency' },
      { day: 7, type: 'email', message: 'Share aviation safety case studies', purpose: 'Build credibility' },
      { day: 14, type: 'video', message: 'Demo of safety management system', purpose: 'Show value' },
      { day: 21, type: 'phone', message: 'Discuss implementation timeline and requirements', purpose: 'Qualify readiness' },
      { day: 30, type: 'email', message: 'Propose pilot program with safety guarantees', purpose: 'Close opportunity' }
    ],
    objections: [
      {
        objection: 'Regulatory approval concerns',
        response: 'Our systems are pre-approved by major aviation authorities and we handle all regulatory documentation.',
        proof: 'Certified by FAA, EASA, and ICAO. 100% regulatory compliance rate'
      },
      {
        objection: 'Integration complexity',
        response: 'We provide seamless integration with existing systems and comprehensive training for your team.',
        proof: 'Average integration time: 30 days. 99% successful integration rate'
      }
    ],
    successMetrics: ['Safety incident reduction', 'Operational cost savings', 'Regulatory compliance rate', 'Staff training completion'],
    estimatedConversionRate: '15-22%',
    averageDealSize: '$50,000 - $500,000',
    salesCycle: '6-12 months'
  },

  // BANKING CAMPAIGNS
  {
    industry: 'Banking',
    personaId: 'david-chen-banking',
    campaignName: 'Digital Banking Transformation',
    targetAudience: ['Regional Banks', 'Credit Unions', 'Community Banks'],
    primaryGoal: 'Modernize banking operations with AI-powered digital transformation',
    secondaryGoals: ['Enhance customer experience', 'Reduce operational costs', 'Improve regulatory compliance'],
    keyMessages: [
      'Transform your bank with AI-powered digital solutions',
      'Enhance customer experience while reducing operational costs',
      'Streamline regulatory compliance with automated systems',
      'Proven results with over 200 financial institutions'
    ],
    painPoints: ['Digital transformation challenges', 'Regulatory compliance burden', 'Customer experience expectations', 'Competition from fintech'],
    valueProps: ['Regulatory compliance automation', 'Risk reduction', 'Customer experience enhancement', 'Operational efficiency'],
    callToActions: [
      'Schedule digital banking assessment',
      'Request regulatory compliance analysis',
      'Book demo of our banking platform'
    ],
    followUpSequence: [
      { day: 1, type: 'email', message: 'Follow-up on digital transformation interest', purpose: 'Maintain engagement' },
      { day: 5, type: 'phone', message: 'Discuss specific banking challenges', purpose: 'Qualify needs' },
      { day: 10, type: 'video', message: 'Demo of digital banking solutions', purpose: 'Show value' },
      { day: 15, type: 'email', message: 'Share success stories from similar banks', purpose: 'Build credibility' },
      { day: 21, type: 'phone', message: 'Propose pilot program with ROI guarantees', purpose: 'Close opportunity' }
    ],
    objections: [
      {
        objection: 'Security concerns',
        response: 'Our platform uses bank-grade security with end-to-end encryption and is SOC 2 compliant.',
        proof: 'SOC 2 Type II certified. Zero security incidents in 5 years'
      },
      {
        objection: 'Integration challenges',
        response: 'We provide seamless integration with existing core banking systems and comprehensive support.',
        proof: 'Integrates with 95% of core banking systems. Average integration time: 45 days'
      }
    ],
    successMetrics: ['Customer satisfaction improvement', 'Operational cost reduction', 'Regulatory compliance rate', 'Digital adoption rate'],
    estimatedConversionRate: '18-25%',
    averageDealSize: '$100,000 - $2,000,000',
    salesCycle: '9-18 months'
  },

  // CONSTRUCTION CAMPAIGNS
  {
    industry: 'Construction',
    personaId: 'marcus-rodriguez-construction',
    campaignName: 'Smart Construction Revolution',
    targetAudience: ['General Contractors', 'Construction Companies', 'Real Estate Developers'],
    primaryGoal: 'Optimize construction projects with AI-powered project management and safety systems',
    secondaryGoals: ['Reduce project timelines', 'Enhance safety protocols', 'Improve cost control'],
    keyMessages: [
      'Revolutionize construction with AI-powered project management',
      'Complete projects 20-30% faster with enhanced safety',
      'Real-time project monitoring and predictive analytics',
      'Proven results with over 500 construction projects'
    ],
    painPoints: ['Project delays and cost overruns', 'Safety compliance requirements', 'Labor shortages', 'Supply chain disruptions'],
    valueProps: ['Project timeline reduction', 'Safety improvement', 'Cost control', 'Quality enhancement'],
    callToActions: [
      'Schedule construction technology assessment',
      'Request project efficiency analysis',
      'Book demo of our construction management platform'
    ],
    followUpSequence: [
      { day: 2, type: 'phone', message: 'Follow-up on construction technology interest', purpose: 'Qualify urgency' },
      { day: 7, type: 'email', message: 'Share construction project success stories', purpose: 'Build credibility' },
      { day: 14, type: 'video', message: 'Demo of project management system', purpose: 'Show value' },
      { day: 21, type: 'phone', message: 'Discuss current project challenges', purpose: 'Qualify needs' },
      { day: 28, type: 'email', message: 'Propose pilot project with efficiency guarantees', purpose: 'Close opportunity' }
    ],
    objections: [
      {
        objection: 'Technology adoption concerns',
        response: 'We provide comprehensive training and support. Most teams are productive within one week.',
        proof: '98% user adoption rate within 7 days. 95% customer satisfaction'
      },
      {
        objection: 'ROI uncertainty',
        response: 'Our ROI calculator shows typical savings of 20-30% on project costs and timelines.',
        proof: 'Average project savings: 25% cost reduction, 30% timeline improvement'
      }
    ],
    successMetrics: ['Project timeline improvement', 'Safety incident reduction', 'Cost savings percentage', 'Quality metrics'],
    estimatedConversionRate: '14-20%',
    averageDealSize: '$25,000 - $500,000',
    salesCycle: '3-6 months'
  },

  // HEALTHCARE CAMPAIGNS
  {
    industry: 'Healthcare',
    personaId: 'dr-sarah-medical-patel',
    campaignName: 'Healthcare Digital Transformation',
    targetAudience: ['Hospitals', 'Clinics', 'Medical Practices'],
    primaryGoal: 'Enhance patient care and operational efficiency with AI-powered healthcare solutions',
    secondaryGoals: ['Improve patient outcomes', 'Reduce administrative burden', 'Enhance compliance'],
    keyMessages: [
      'Transform healthcare delivery with AI-powered patient care systems',
      'Improve patient outcomes while reducing administrative costs',
      'Streamline HIPAA compliance with automated systems',
      'Trusted by over 300 healthcare organizations'
    ],
    painPoints: ['Administrative burden', 'HIPAA compliance complexity', 'Patient care coordination', 'Staff burnout'],
    valueProps: ['Patient care improvement', 'Compliance automation', 'Cost reduction', 'Operational efficiency'],
    callToActions: [
      'Schedule healthcare technology assessment',
      'Request HIPAA compliance analysis',
      'Book demo of our healthcare platform'
    ],
    followUpSequence: [
      { day: 1, type: 'email', message: 'Follow-up on healthcare technology interest', purpose: 'Maintain engagement' },
      { day: 4, type: 'phone', message: 'Discuss specific healthcare challenges', purpose: 'Qualify needs' },
      { day: 8, type: 'video', message: 'Demo of healthcare management system', purpose: 'Show value' },
      { day: 12, type: 'email', message: 'Share healthcare success stories', purpose: 'Build credibility' },
      { day: 16, type: 'phone', message: 'Propose pilot program with outcome guarantees', purpose: 'Close opportunity' }
    ],
    objections: [
      {
        objection: 'HIPAA compliance concerns',
        response: 'Our platform is HIPAA-compliant by design with built-in security controls and audit trails.',
        proof: 'HIPAA compliant. Zero compliance violations in 5 years'
      },
      {
        objection: 'Implementation complexity',
        response: 'We provide complete implementation support and training for your entire team.',
        proof: 'Average implementation time: 30 days. 99% successful deployment rate'
      }
    ],
    successMetrics: ['Patient satisfaction improvement', 'Administrative cost reduction', 'HIPAA compliance rate', 'Staff productivity'],
    estimatedConversionRate: '16-24%',
    averageDealSize: '$50,000 - $2,000,000',
    salesCycle: '6-18 months'
  },

  // RETAIL CAMPAIGNS
  {
    industry: 'Retail',
    personaId: 'retail-manager-karen-johnson',
    campaignName: 'Retail Experience Revolution',
    targetAudience: ['Retail Chains', 'E-commerce', 'Department Stores'],
    primaryGoal: 'Enhance customer experience and optimize inventory with AI-powered retail solutions',
    secondaryGoals: ['Increase sales', 'Reduce inventory costs', 'Improve customer satisfaction'],
    keyMessages: [
      'Transform retail with AI-powered customer experience and inventory optimization',
      'Increase sales by 15-25% while reducing inventory costs',
      'Personalized customer experiences across all channels',
      'Proven results with over 200 retail locations'
    ],
    painPoints: ['Inventory management challenges', 'Customer experience expectations', 'Omnichannel complexity', 'Competition from online retailers'],
    valueProps: ['Customer satisfaction improvement', 'Inventory optimization', 'Sales increase', 'Cost reduction'],
    callToActions: [
      'Schedule retail technology assessment',
      'Request customer experience analysis',
      'Book demo of our retail platform'
    ],
    followUpSequence: [
      { day: 1, type: 'email', message: 'Follow-up on retail technology interest', purpose: 'Maintain engagement' },
      { day: 3, type: 'phone', message: 'Discuss specific retail challenges', purpose: 'Qualify needs' },
      { day: 7, type: 'video', message: 'Demo of retail management system', purpose: 'Show value' },
      { day: 10, type: 'email', message: 'Share retail success stories', purpose: 'Build credibility' },
      { day: 14, type: 'phone', message: 'Propose pilot program with sales guarantees', purpose: 'Close opportunity' }
    ],
    objections: [
      {
        objection: 'Implementation disruption',
        response: 'We implement during off-peak hours with minimal disruption to your operations.',
        proof: 'Zero downtime implementations. 100% operational continuity'
      },
      {
        objection: 'Staff training concerns',
        response: 'We provide comprehensive training and ongoing support. Most staff are productive within 3 days.',
        proof: '95% staff adoption within 3 days. 98% customer satisfaction'
      }
    ],
    successMetrics: ['Customer satisfaction score', 'Sales increase percentage', 'Inventory turnover improvement', 'Cost reduction'],
    estimatedConversionRate: '20-28%',
    averageDealSize: '$15,000 - $500,000',
    salesCycle: '2-6 months'
  },

  // REAL ESTATE CAMPAIGNS
  {
    industry: 'Real Estate',
    personaId: 'sarah-chen-real-estate',
    campaignName: 'Real Estate Digital Transformation',
    targetAudience: ['Real Estate Agents', 'Property Managers', 'Real Estate Companies'],
    primaryGoal: 'Enhance real estate operations with AI-powered client management and market analysis',
    secondaryGoals: ['Increase transaction volume', 'Improve client satisfaction', 'Optimize marketing efforts'],
    keyMessages: [
      'Transform real estate with AI-powered client management and market insights',
      'Increase transaction volume by 30-40% with better client relationships',
      'Real-time market analysis and predictive pricing',
      'Trusted by over 1,000 real estate professionals'
    ],
    painPoints: ['Client relationship management', 'Market analysis complexity', 'Lead generation challenges', 'Transaction coordination'],
    valueProps: ['Transaction efficiency', 'Client satisfaction', 'Market insights', 'Revenue increase'],
    callToActions: [
      'Schedule real estate technology assessment',
      'Request market analysis demo',
      'Book demo of our real estate platform'
    ],
    followUpSequence: [
      { day: 1, type: 'email', message: 'Follow-up on real estate technology interest', purpose: 'Maintain engagement' },
      { day: 3, type: 'phone', message: 'Discuss specific real estate challenges', purpose: 'Qualify needs' },
      { day: 7, type: 'video', message: 'Demo of client management system', purpose: 'Show value' },
      { day: 10, type: 'email', message: 'Share real estate success stories', purpose: 'Build credibility' },
      { day: 14, type: 'phone', message: 'Propose pilot program with transaction guarantees', purpose: 'Close opportunity' }
    ],
    objections: [
      {
        objection: 'Market uncertainty',
        response: 'Our AI-powered market analysis helps you navigate uncertainty with predictive insights.',
        proof: 'Market prediction accuracy: 87%. Client satisfaction: 96%'
      },
      {
        objection: 'Technology adoption',
        response: 'We provide comprehensive training and support. Most agents see results within 2 weeks.',
        proof: '95% adoption rate within 14 days. 30% average transaction increase'
      }
    ],
    successMetrics: ['Transaction volume increase', 'Client satisfaction score', 'Market analysis accuracy', 'Revenue growth'],
    estimatedConversionRate: '22-30%',
    averageDealSize: '$10,000 - $250,000',
    salesCycle: '2-4 months'
  }
];

export default industryCampaigns;
