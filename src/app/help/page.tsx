"use client";

import React, { useState } from 'react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'What is MetisAI and how does it work?',
      answer: 'MetisAI is a quantum-enhanced AI platform that leverages quantum computing principles to provide superior artificial intelligence capabilities. Our platform uses quantum algorithms to process information more efficiently than traditional AI systems, offering features like qdLLM (Quantum Diffusion LLM), QNLP (Quantum Natural Language Processing), and QTransform (Quantum Transformer) algorithms.',
      category: 'general'
    },
    {
      id: '2',
      question: 'How do I get started with MetisAI?',
      answer: 'Getting started is easy! Simply sign up for an account, choose a subscription plan that fits your needs, and you can immediately start using our quantum AI features. No special hardware or technical setup is required - everything runs in the cloud.',
      category: 'getting-started'
    },
    {
      id: '3',
      question: 'What quantum features are available?',
      answer: 'MetisAI offers several quantum-enhanced features: qdLLM for advanced text generation, QNLP for superior language processing, QTransform for enhanced transformer algorithms, MCP for unbiased content verification, QASC for AI-powered coding assistance, and QUBO algorithms for complex optimization problems.',
      category: 'features'
    },
    {
      id: '4',
      question: 'How does pricing work?',
      answer: 'We offer flexible subscription plans: Starter ($29.99/month), Professional ($99.99/month), and Enterprise ($299.99/month). Each plan includes different usage limits and features. We also offer usage-based pricing for overages and custom enterprise solutions.',
      category: 'billing'
    },
    {
      id: '5',
      question: 'Is my data secure and private?',
      answer: 'Absolutely. We implement enterprise-grade security measures including end-to-end encryption, secure data storage, and strict access controls. We are GDPR and CCPA compliant, and we never sell or share your data with third parties without your explicit consent.',
      category: 'security'
    },
    {
      id: '6',
      question: 'What is the Machine Content Protocol (MCP)?',
      answer: 'MCP is our innovative system for unbiased information verification. It uses multiple search engines, TOR network integration, and Web3 technologies to provide comprehensive, unbiased content verification and fact-checking capabilities.',
      category: 'features'
    },
    {
      id: '7',
      question: 'How does QASC (Quantum Agentic Swarm Coding) work?',
      answer: 'QASC is our AI-powered coding assistant that uses quantum-enhanced algorithms to provide intelligent code suggestions, debugging help, and automated code generation. It learns from your coding patterns and provides context-aware assistance.',
      category: 'features'
    },
    {
      id: '8',
      question: 'Can I integrate MetisAI with my existing applications?',
      answer: 'Yes! We provide comprehensive APIs and SDKs for easy integration with your existing applications. Our RESTful APIs support all major programming languages and frameworks.',
      category: 'integration'
    },
    {
      id: '9',
      question: 'What support options are available?',
      answer: 'We offer 24/7 email support, live chat during business hours, comprehensive documentation, video tutorials, and dedicated support for enterprise customers. Our support team is knowledgeable about both AI and quantum computing.',
      category: 'support'
    },
    {
      id: '10',
      question: 'How accurate are the quantum AI results?',
      answer: 'Our quantum-enhanced algorithms typically achieve 15-30% better accuracy compared to traditional AI systems, with faster processing times and superior coherence in generated content. Results vary by use case, but we consistently outperform classical approaches.',
      category: 'performance'
    },
    {
      id: '11',
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period, and you can reactivate your subscription anytime.',
      category: 'billing'
    },
    {
      id: '12',
      question: 'Do you offer custom enterprise solutions?',
      answer: 'Yes! We work with enterprise clients to create custom quantum AI solutions tailored to their specific needs. This includes custom algorithms, dedicated infrastructure, and specialized support.',
      category: 'enterprise'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Topics' },
    { id: 'general', name: 'General' },
    { id: 'getting-started', name: 'Getting Started' },
    { id: 'features', name: 'Features' },
    { id: 'billing', name: 'Billing' },
    { id: 'security', name: 'Security' },
    { id: 'integration', name: 'Integration' },
    { id: 'support', name: 'Support' },
    { id: 'performance', name: 'Performance' },
    { id: 'enterprise', name: 'Enterprise' }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Help Center</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions and learn how to get the most out of MetisAI
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.slice(1).map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-white mb-3">Getting Started</h3>
            <p className="text-gray-300 mb-4">
              New to MetisAI? Learn the basics and get up and running quickly.
            </p>
            <a href="#getting-started" className="text-purple-400 hover:text-purple-300">
              View Guide →
            </a>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <div className="text-3xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-white mb-3">API Documentation</h3>
            <p className="text-gray-300 mb-4">
              Comprehensive guides for integrating MetisAI into your applications.
            </p>
            <a href="/docs" className="text-purple-400 hover:text-purple-300">
              View Docs →
            </a>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <div className="text-3xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-white mb-3">Contact Support</h3>
            <p className="text-gray-300 mb-4">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <a href="/support" className="text-purple-400 hover:text-purple-300">
              Get Help →
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            Frequently Asked Questions
            {searchQuery && (
              <span className="text-gray-400 text-lg font-normal ml-2">
                ({filteredFAQs.length} results)
              </span>
            )}
          </h2>

          {filteredFAQs.length > 0 ? (
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <div key={faq.id} className="bg-gray-800/50 rounded-lg border border-gray-700">
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full text-left p-6 flex justify-between items-center hover:bg-gray-700/50 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                    <div className="text-gray-400">
                      {expandedFAQ === faq.id ? '−' : '+'}
                    </div>
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your search terms or browse different categories
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Additional Resources */}
        <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Still Need Help?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Contact Our Support Team</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-purple-400">📧</span>
                  <span className="text-gray-300">support@metisai.tech</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-purple-400">💬</span>
                  <span className="text-gray-300">Live chat (9 AM - 6 PM EST)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-purple-400">📞</span>
                  <span className="text-gray-300">+1 (555) 123-4567</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Community Resources</h3>
              <div className="space-y-3">
                <a href="#" className="block text-purple-400 hover:text-purple-300">
                  → Developer Community
                </a>
                <a href="#" className="block text-purple-400 hover:text-purple-300">
                  → Video Tutorials
                </a>
                <a href="#" className="block text-purple-400 hover:text-purple-300">
                  → GitHub Repository
                </a>
                <a href="#" className="block text-purple-400 hover:text-purple-300">
                  → Status Page
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
