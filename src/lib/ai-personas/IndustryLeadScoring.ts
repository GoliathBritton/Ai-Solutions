/**
 * Industry-Specific Lead Scoring and Segmentation
 * Advanced lead qualification system for all 30+ industries
 */

export interface IndustryLeadScore {
  industry: string;
  scoringCriteria: {
    companySize: {
      small: number;
      medium: number;
      large: number;
      enterprise: number;
    };
    budget: {
      low: number;
      medium: number;
      high: number;
      enterprise: number;
    };
    urgency: {
      low: number;
      medium: number;
      high: number;
      critical: number;
    };
    decisionMaking: {
      individual: number;
      committee: number;
      c_level: number;
      board: number;
    };
    technology: {
      basic: number;
      intermediate: number;
      advanced: number;
      cutting_edge: number;
    };
    industryFactors: Record<string, number>;
  };
  segmentationCriteria: {
    demographics: string[];
    firmographics: string[];
    technographics: string[];
    behavioral: string[];
  };
  qualificationQuestions: {
    budget: string[];
    authority: string[];
    need: string[];
    timeline: string[];
    industry: string[];
  };
}

export const industryLeadScoring: IndustryLeadScore[] = [
  // AGRICULTURE
  {
    industry: 'Agriculture',
    scoringCriteria: {
      companySize: {
        small: 20, // Small family farms
        medium: 40, // Regional farms
        large: 60, // Large agricultural operations
        enterprise: 80 // Agricultural corporations
      },
      budget: {
        low: 10, // <$50K
        medium: 30, // $50K-$200K
        high: 50, // $200K-$500K
        enterprise: 70 // >$500K
      },
      urgency: {
        low: 10,
        medium: 25,
        high: 40,
        critical: 60
      },
      decisionMaking: {
        individual: 30, // Farm owner
        committee: 50, // Family/partnership
        c_level: 70, // Corporate agriculture
        board: 90
      },
      technology: {
        basic: 20,
        intermediate: 40,
        advanced: 60,
        cutting_edge: 80
      },
      industryFactors: {
        cropType: 20, // High-value crops score higher
        acreage: 30, // Larger operations score higher
        sustainability: 25, // ESG focus scores higher
        precisionFarming: 35 // Already using tech scores higher
      }
    },
    segmentationCriteria: {
      demographics: ['Farm size', 'Crop type', 'Geographic location', 'Generation of farmer'],
      firmographics: ['Revenue', 'Employee count', 'Market position', 'Growth stage'],
      technographics: ['Current technology usage', 'Precision agriculture adoption', 'Data analytics usage'],
      behavioral: ['Technology adoption rate', 'Investment in innovation', 'Sustainability practices']
    },
    qualificationQuestions: {
      budget: [
        'What is your annual technology budget for farm operations?',
        'How much are you currently spending on crop monitoring and analysis?',
        'What ROI are you expecting from precision agriculture investments?'
      ],
      authority: [
        'Who makes technology decisions for your farm?',
        'Are you the primary decision maker or do you consult with family/partners?',
        'Do you have a technology advisor or consultant?'
      ],
      need: [
        'What are your biggest challenges with current farming operations?',
        'How are you currently monitoring crop health and yields?',
        'What specific problems are you looking to solve?'
      ],
      timeline: [
        'When are you looking to implement new technology?',
        'Is this tied to a specific growing season or harvest?',
        'What is driving the urgency for this solution?'
      ],
      industry: [
        'What types of crops do you grow?',
        'What is your total farm acreage?',
        'Do you currently use any precision agriculture tools?'
      ]
    }
  },

  // AVIATION
  {
    industry: 'Aviation',
    scoringCriteria: {
      companySize: {
        small: 30, // Regional airlines
        medium: 50, // Mid-size airlines
        large: 70, // Major airlines
        enterprise: 90 // International carriers
      },
      budget: {
        low: 20, // <$100K
        medium: 40, // $100K-$500K
        high: 60, // $500K-$2M
        enterprise: 80 // >$2M
      },
      urgency: {
        low: 10,
        medium: 25,
        high: 45,
        critical: 70
      },
      decisionMaking: {
        individual: 20, // Operations manager
        committee: 40, // Operations team
        c_level: 70, // CTO/COO
        board: 90
      },
      technology: {
        basic: 30,
        intermediate: 50,
        advanced: 70,
        cutting_edge: 90
      },
      industryFactors: {
        fleetSize: 40, // Larger fleets score higher
        routeComplexity: 30, // Complex routes score higher
        safetyRecord: 35, // Safety-focused companies score higher
        regulatoryCompliance: 25 // Compliance requirements score higher
      }
    },
    segmentationCriteria: {
      demographics: ['Airlines vs airports', 'Domestic vs international', 'Passenger vs cargo'],
      firmographics: ['Fleet size', 'Annual passengers', 'Revenue', 'Market position'],
      technographics: ['Current safety systems', 'Data analytics usage', 'Digital transformation stage'],
      behavioral: ['Safety investment history', 'Technology adoption rate', 'Innovation focus']
    },
    qualificationQuestions: {
      budget: [
        'What is your annual technology budget for safety and operations?',
        'How much are you currently investing in safety systems?',
        'What is your typical project budget for operational improvements?'
      ],
      authority: [
        'Who is responsible for safety and operational technology decisions?',
        'Do you have a dedicated technology or safety committee?',
        'What is the approval process for new technology investments?'
      ],
      need: [
        'What are your biggest operational challenges?',
        'How do you currently monitor safety and compliance?',
        'What specific safety or operational problems need solving?'
      ],
      timeline: [
        'When do you need to implement new safety or operational systems?',
        'Are there any regulatory deadlines driving this timeline?',
        'What is the typical implementation timeline for your organization?'
      ],
      industry: [
        'What is the size of your fleet or operation?',
        'What types of routes or operations do you handle?',
        'What safety systems are you currently using?'
      ]
    }
  },

  // BANKING
  {
    industry: 'Banking',
    scoringCriteria: {
      companySize: {
        small: 40, // Community banks
        medium: 60, // Regional banks
        large: 80, // National banks
        enterprise: 100 // International banks
      },
      budget: {
        low: 30, // <$500K
        medium: 50, // $500K-$2M
        high: 70, // $2M-$10M
        enterprise: 90 // >$10M
      },
      urgency: {
        low: 15,
        medium: 30,
        high: 50,
        critical: 75
      },
      decisionMaking: {
        individual: 20, // IT manager
        committee: 40, // Technology committee
        c_level: 70, // CTO/CIO
        board: 90
      },
      technology: {
        basic: 40,
        intermediate: 60,
        advanced: 80,
        cutting_edge: 100
      },
      industryFactors: {
        assetSize: 50, // Larger banks score higher
        customerBase: 30, // More customers score higher
        regulatoryBurden: 40, // High compliance needs score higher
        digitalTransformation: 35 // Digital focus scores higher
      }
    },
    segmentationCriteria: {
      demographics: ['Bank type', 'Geographic focus', 'Customer segments', 'Regulatory environment'],
      firmographics: ['Assets under management', 'Number of branches', 'Revenue', 'Market position'],
      technographics: ['Current core systems', 'Digital banking adoption', 'API usage', 'Cloud adoption'],
      behavioral: ['Digital transformation investment', 'Innovation focus', 'Regulatory compliance approach']
    },
    qualificationQuestions: {
      budget: [
        'What is your annual technology budget for digital transformation?',
        'How much do you typically invest in regulatory compliance technology?',
        'What is your budget for customer experience improvements?'
      ],
      authority: [
        'Who leads digital transformation initiatives?',
        'Do you have a dedicated innovation or technology committee?',
        'What is the approval process for major technology investments?'
      },
      need: [
        'What are your biggest digital banking challenges?',
        'How do you currently handle regulatory compliance?',
        'What specific customer experience problems need solving?'
      ],
      timeline: [
        'When do you need to implement new digital banking solutions?',
        'Are there regulatory deadlines driving this timeline?',
        'What is your typical implementation timeline for major projects?'
      ],
      industry: [
        'What is the size of your customer base and assets?',
        'What types of banking services do you offer?',
        'What core banking systems are you currently using?'
      ]
    }
  },

  // CONSTRUCTION
  {
    industry: 'Construction',
    scoringCriteria: {
      companySize: {
        small: 25, // Small contractors
        medium: 45, // Mid-size contractors
        large: 65, // Large contractors
        enterprise: 85 // Major construction companies
      },
      budget: {
        low: 20, // <$100K
        medium: 40, // $100K-$500K
        high: 60, // $500K-$2M
        enterprise: 80 // >$2M
      },
      urgency: {
        low: 15,
        medium: 30,
        high: 50,
        critical: 70
      },
      decisionMaking: {
        individual: 30, // Project manager
        committee: 50, // Management team
        c_level: 70, // CEO/COO
        board: 90
      },
      technology: {
        basic: 25,
        intermediate: 45,
        advanced: 65,
        cutting_edge: 85
      },
      industryFactors: {
        projectValue: 40, // Higher value projects score higher
        safetyRecord: 35, // Safety-focused companies score higher
        projectComplexity: 30, // Complex projects score higher
        technologyAdoption: 25 // Tech-forward companies score higher
      }
    },
    segmentationCriteria: {
      demographics: ['Construction type', 'Project size', 'Geographic focus', 'Specialization'],
      firmographics: ['Annual revenue', 'Number of projects', 'Employee count', 'Market position'],
      technographics: ['Current project management tools', 'Safety systems', 'BIM usage', 'Mobile technology'],
      behavioral: ['Safety investment', 'Technology adoption rate', 'Innovation focus', 'Quality standards']
    },
    qualificationQuestions: {
      budget: [
        'What is your typical technology budget per project?',
        'How much do you invest annually in safety and project management tools?',
        'What ROI do you expect from construction technology investments?'
      ],
      authority: [
        'Who makes technology decisions for your construction projects?',
        'Do you have a dedicated technology or innovation team?',
        'What is the approval process for new technology tools?'
      },
      need: [
        'What are your biggest challenges with current construction projects?',
        'How do you currently manage project timelines and safety?',
        'What specific operational problems need solving?'
      ],
      timeline: [
        'When do you need to implement new construction technology?',
        'Is this tied to specific upcoming projects?',
        'What is your typical implementation timeline for new tools?'
      ],
      industry: [
        'What types of construction projects do you typically handle?',
        'What is your average project value and duration?',
        'What construction technology are you currently using?'
      ]
    }
  },

  // HEALTHCARE
  {
    industry: 'Healthcare',
    scoringCriteria: {
      companySize: {
        small: 30, // Small practices
        medium: 50, // Mid-size practices
        large: 70, // Large healthcare systems
        enterprise: 90 // Major hospital systems
      },
      budget: {
        low: 25, // <$200K
        medium: 45, // $200K-$1M
        high: 65, // $1M-$5M
        enterprise: 85 // >$5M
      },
      urgency: {
        low: 20,
        medium: 35,
        high: 55,
        critical: 75
      },
      decisionMaking: {
        individual: 25, // Practice manager
        committee: 45, // Medical staff
        c_level: 70, // CMO/CIO
        board: 90
      },
      technology: {
        basic: 30,
        intermediate: 50,
        advanced: 70,
        cutting_edge: 90
      },
      industryFactors: {
        patientVolume: 40, // Higher patient volume scores higher
        complianceRequirements: 35, // High compliance needs score higher
        qualityMetrics: 30, // Quality-focused organizations score higher
        technologyAdoption: 25 // Tech-forward organizations score higher
      }
    },
    segmentationCriteria: {
      demographics: ['Healthcare type', 'Patient demographics', 'Geographic focus', 'Specialization'],
      firmographics: ['Patient volume', 'Number of providers', 'Revenue', 'Market position'],
      technographics: ['Current EHR systems', 'Telemedicine usage', 'Data analytics', 'Interoperability'],
      behavioral: ['Quality improvement focus', 'Technology adoption rate', 'Innovation investment', 'Patient experience focus']
    },
    qualificationQuestions: {
      budget: [
        'What is your annual technology budget for patient care systems?',
        'How much do you invest in healthcare IT and compliance?',
        'What is your budget for improving patient outcomes?'
      },
      authority: [
        'Who makes technology decisions for patient care?',
        'Do you have a medical technology committee?',
        'What is the approval process for new healthcare technology?'
      },
      need: [
        'What are your biggest challenges with patient care delivery?',
        'How do you currently manage patient data and compliance?',
        'What specific patient care problems need solving?'
      },
      timeline: [
        'When do you need to implement new patient care technology?',
        'Are there regulatory deadlines driving this timeline?',
        'What is your typical implementation timeline for healthcare systems?'
      ],
      industry: [
        'What is your patient volume and provider count?',
        'What types of healthcare services do you provide?',
        'What EHR and healthcare systems are you currently using?'
      ]
    }
  },

  // RETAIL
  {
    industry: 'Retail',
    scoringCriteria: {
      companySize: {
        small: 25, // Small retailers
        medium: 45, // Mid-size retailers
        large: 65, // Large retail chains
        enterprise: 85 // Major retail corporations
      },
      budget: {
        low: 20, // <$100K
        medium: 40, // $100K-$500K
        high: 60, // $500K-$2M
        enterprise: 80 // >$2M
      },
      urgency: {
        low: 15,
        medium: 30,
        high: 50,
        critical: 70
      },
      decisionMaking: {
        individual: 30, // Store manager
        committee: 50, // Management team
        c_level: 70, // CEO/CTO
        board: 90
      },
      technology: {
        basic: 30,
        intermediate: 50,
        advanced: 70,
        cutting_edge: 90
      },
      industryFactors: {
        storeCount: 40, // More stores score higher
        customerBase: 35, // Larger customer base scores higher
        omnichannel: 30, // Omnichannel focus scores higher
        dataAnalytics: 25 // Analytics usage scores higher
      }
    },
    segmentationCriteria: {
      demographics: ['Retail type', 'Customer demographics', 'Geographic focus', 'Product categories'],
      firmographics: ['Number of stores', 'Annual revenue', 'Employee count', 'Market position'],
      technographics: ['Current POS systems', 'E-commerce platform', 'Inventory management', 'Customer analytics'],
      behavioral: ['Customer experience focus', 'Technology adoption rate', 'Innovation investment', 'Data-driven decisions']
    },
    qualificationQuestions: {
      budget: [
        'What is your annual technology budget for retail operations?',
        'How much do you invest in customer experience technology?',
        'What ROI do you expect from retail technology investments?'
      },
      authority: [
        'Who makes technology decisions for your retail operations?',
        'Do you have a dedicated technology or innovation team?',
        'What is the approval process for new retail technology?'
      },
      need: [
        'What are your biggest challenges with customer experience?',
        'How do you currently manage inventory and sales?',
        'What specific retail operations problems need solving?'
      ],
      timeline: [
        'When do you need to implement new retail technology?',
        'Is this tied to specific seasons or promotions?',
        'What is your typical implementation timeline for retail systems?'
      ],
      industry: [
        'How many stores do you operate and what is your customer base?',
        'What types of products do you sell?',
        'What retail technology are you currently using?'
      ]
    }
  },

  // REAL ESTATE
  {
    industry: 'Real Estate',
    scoringCriteria: {
      companySize: {
        small: 20, // Individual agents
        medium: 40, // Small brokerages
        large: 60, // Large brokerages
        enterprise: 80 // Major real estate companies
      },
      budget: {
        low: 15, // <$50K
        medium: 35, // $50K-$200K
        high: 55, // $200K-$500K
        enterprise: 75 // >$500K
      },
      urgency: {
        low: 10,
        medium: 25,
        high: 45,
        critical: 65
      },
      decisionMaking: {
        individual: 40, // Agent/broker
        committee: 60, // Brokerage team
        c_level: 80, // Company leadership
        board: 100
      },
      technology: {
        basic: 25,
        intermediate: 45,
        advanced: 65,
        cutting_edge: 85
      },
      industryFactors: {
        transactionVolume: 40, // Higher volume scores higher
        marketFocus: 30, // High-value markets score higher
        technologyAdoption: 25, // Tech-forward agents score higher
        clientBase: 20 // Larger client base scores higher
      }
    },
    segmentationCriteria: {
      demographics: ['Agent vs brokerage', 'Market focus', 'Property types', 'Client demographics'],
      firmographics: ['Transaction volume', 'Revenue', 'Number of agents', 'Market position'],
      technographics: ['Current CRM usage', 'Marketing tools', 'Lead generation systems', 'Social media presence'],
      behavioral: ['Technology adoption', 'Marketing investment', 'Client relationship focus', 'Innovation interest']
    },
    qualificationQuestions: {
      budget: [
        'What is your annual technology and marketing budget?',
        'How much do you invest in lead generation and client management?',
        'What ROI do you expect from real estate technology investments?'
      },
      authority: [
        'Are you the primary decision maker for technology investments?',
        'Do you consult with other agents or the brokerage?',
        'What is the approval process for new technology tools?'
      },
      need: [
        'What are your biggest challenges with client management?',
        'How do you currently generate and manage leads?',
        'What specific real estate problems need solving?'
      ],
      timeline: [
        'When do you need to implement new real estate technology?',
        'Is this tied to specific market conditions or goals?',
        'What is your typical timeline for adopting new tools?'
      ],
      industry: [
        'What is your annual transaction volume and average sale price?',
        'What types of properties do you specialize in?',
        'What real estate technology are you currently using?'
      ]
    }
  }
];

export default industryLeadScoring;
