"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
  category: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const SupportDashboard: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tickets' | 'faq' | 'contact'>('tickets');
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'general',
    priority: 'medium'
  });

  const supabase = createClient();

  useEffect(() => {
    fetchSupportData();
  }, []);

  const fetchSupportData = async () => {
    try {
      setLoading(true);
      
      // Fetch support tickets
      const { data: ticketsData } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch FAQs
      const { data: faqsData } = await supabase
        .from('faqs')
        .select('*')
        .order('category', { ascending: true });

      setTickets(ticketsData || []);
      setFaqs(faqsData || []);
      
    } catch (error) {
      console.error('Error fetching support data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          title: newTicket.title,
          description: newTicket.description,
          category: newTicket.category,
          priority: newTicket.priority,
          status: 'open',
          user_id: user.user?.id
        });

      if (error) throw error;

      setNewTicket({ title: '', description: '', category: 'general', priority: 'medium' });
      fetchSupportData();
      
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-900 text-red-300';
      case 'in_progress': return 'bg-yellow-900 text-yellow-300';
      case 'resolved': return 'bg-green-900 text-green-300';
      case 'closed': return 'bg-gray-900 text-gray-300';
      default: return 'bg-gray-900 text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-900 text-red-300';
      case 'high': return 'bg-orange-900 text-orange-300';
      case 'medium': return 'bg-yellow-900 text-yellow-300';
      case 'low': return 'bg-green-900 text-green-300';
      default: return 'bg-gray-900 text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Support Center</h1>
          <p className="text-gray-400 mt-2">Get help with your MetisAI platform</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'tickets'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            My Tickets
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'faq'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            FAQ
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'contact'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Contact Us
          </button>
        </div>

        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            {/* Create New Ticket */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Create New Ticket</h2>
              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Title</label>
                    <input
                      type="text"
                      value={newTicket.title}
                      onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Category</label>
                    <select
                      value={newTicket.category}
                      onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="general">General</option>
                      <option value="technical">Technical</option>
                      <option value="billing">Billing</option>
                      <option value="feature">Feature Request</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Description</label>
                  <textarea
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white h-32"
                    placeholder="Please provide detailed information about your issue..."
                    required
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Priority</label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                      className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Create Ticket
                  </button>
                </div>
              </form>
            </div>

            {/* Tickets List */}
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Your Tickets</h2>
              {tickets.length > 0 ? (
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="bg-gray-700/50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-medium">{ticket.title}</h3>
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(ticket.status)}`}>
                            {ticket.status.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{ticket.description}</p>
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <span>Category: {ticket.category}</span>
                        <span>Created: {new Date(ticket.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No tickets found</p>
              )}
            </div>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.length > 0 ? (
                faqs.map((faq) => (
                  <div key={faq.id} className="border-b border-gray-700 pb-4">
                    <h3 className="text-white font-medium mb-2">{faq.question}</h3>
                    <p className="text-gray-300 text-sm">{faq.answer}</p>
                    <span className="text-xs text-gray-500 mt-2 block">
                      Category: {faq.category}
                    </span>
                  </div>
                ))
              ) : (
                <div className="space-y-4">
                  <div className="border-b border-gray-700 pb-4">
                    <h3 className="text-white font-medium mb-2">What is MetisAI?</h3>
                    <p className="text-gray-300 text-sm">
                      MetisAI is a quantum-enhanced AI platform that provides advanced language models, 
                      content verification, and coding assistance powered by quantum computing.
                    </p>
                  </div>
                  <div className="border-b border-gray-700 pb-4">
                    <h3 className="text-white font-medium mb-2">How do I get started?</h3>
                    <p className="text-gray-300 text-sm">
                      Simply sign up for an account, choose a subscription plan, and start using our 
                      quantum AI features immediately.
                    </p>
                  </div>
                  <div className="border-b border-gray-700 pb-4">
                    <h3 className="text-white font-medium mb-2">What quantum features are available?</h3>
                    <p className="text-gray-300 text-sm">
                      We offer qdLLM (Quantum Diffusion LLM), QNLP (Quantum Natural Language Processing), 
                      QTransform (Quantum Transformer), and QASC (Quantum Agentic Swarm Coding).
                    </p>
                  </div>
                  <div className="border-b border-gray-700 pb-4">
                    <h3 className="text-white font-medium mb-2">How does billing work?</h3>
                    <p className="text-gray-300 text-sm">
                      We offer flexible subscription plans with usage-based pricing. You can upgrade, 
                      downgrade, or cancel your subscription at any time.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-medium">Email Support</h3>
                  <p className="text-gray-300">support@metisai.tech</p>
                  <p className="text-gray-400 text-sm">24/7 email support</p>
                </div>
                <div>
                  <h3 className="text-white font-medium">Live Chat</h3>
                  <p className="text-gray-300">Available 9 AM - 6 PM EST</p>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg mt-2">
                    Start Chat
                  </button>
                </div>
                <div>
                  <h3 className="text-white font-medium">Phone Support</h3>
                  <p className="text-gray-300">+1 (555) 123-4567</p>
                  <p className="text-gray-400 text-sm">Mon-Fri 9 AM - 5 PM EST</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Contact Form</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Subject</label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    placeholder="What can we help you with?"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Message</label>
                  <textarea
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white h-32"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportDashboard;
