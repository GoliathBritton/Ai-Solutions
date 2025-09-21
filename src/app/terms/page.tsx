"use client";

import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-gray-400">Last updated: September 16, 2025</p>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300 mb-6">
              By accessing and using MetisAI ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
            <p className="text-gray-300 mb-4">
              MetisAI provides quantum-enhanced artificial intelligence services including but not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
              <li>Quantum-Diffusion-LLM (qdLLM) for text generation</li>
              <li>Quantum Natural Language Processing (QNLP)</li>
              <li>Quantum Transformer algorithms (QTransform)</li>
              <li>Machine Content Protocol (MCP) for content verification</li>
              <li>Quantum Agentic Swarm Coding (QASC)</li>
              <li>Quadratic Unconstrained Binary Optimization (QUBO) algorithms</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
            <p className="text-gray-300 mb-4">
              To access certain features of the Service, you must register for an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and update your account information</li>
              <li>Maintain the security of your password and account</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mb-4">4. Acceptable Use</h2>
            <p className="text-gray-300 mb-4">You agree not to use the Service to:</p>
            <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Transmit harmful, threatening, or offensive content</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Use the Service for any illegal or unauthorized purpose</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mb-4">5. Intellectual Property</h2>
            <p className="text-gray-300 mb-4">
              The Service and its original content, features, and functionality are and will remain the exclusive property of MetisAI and its licensors. The Service is protected by copyright, trademark, and other laws.
            </p>
            <p className="text-gray-300 mb-6">
              You retain ownership of content you submit to the Service, but grant us a license to use, modify, and distribute such content as necessary to provide the Service.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">6. Privacy Policy</h2>
            <p className="text-gray-300 mb-6">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">7. Payment Terms</h2>
            <p className="text-gray-300 mb-4">
              If you purchase a subscription or other paid features:
            </p>
            <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
              <li>Fees are billed in advance on a recurring basis</li>
              <li>All fees are non-refundable except as required by law</li>
              <li>You authorize us to charge your payment method</li>
              <li>We may change our fees with 30 days' notice</li>
              <li>You may cancel your subscription at any time</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mb-4">8. Service Availability</h2>
            <p className="text-gray-300 mb-6">
              We strive to maintain high availability of the Service, but we do not guarantee uninterrupted access. The Service may be temporarily unavailable due to maintenance, updates, or circumstances beyond our control.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-300 mb-6">
              In no event shall MetisAI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">10. Disclaimer</h2>
            <p className="text-gray-300 mb-6">
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis. MetisAI expressly disclaims all warranties of any kind, whether express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">11. Indemnification</h2>
            <p className="text-gray-300 mb-6">
              You agree to defend, indemnify, and hold harmless MetisAI and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees).
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">12. Termination</h2>
            <p className="text-gray-300 mb-6">
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">13. Changes to Terms</h2>
            <p className="text-gray-300 mb-6">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">14. Governing Law</h2>
            <p className="text-gray-300 mb-6">
              These Terms shall be interpreted and governed by the laws of the State of California, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">15. Contact Information</h2>
            <p className="text-gray-300 mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
              <p className="text-gray-300">Email: legal@metisai.tech</p>
              <p className="text-gray-300">Address: 123 Quantum Drive, San Francisco, CA 94105</p>
              <p className="text-gray-300">Phone: +1 (555) 123-4567</p>
            </div>

            <div className="border-t border-gray-700 pt-6 mt-8">
              <p className="text-gray-400 text-sm text-center">
                By using MetisAI, you acknowledge that you have read and understood these Terms of Service and agree to be bound by them.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
