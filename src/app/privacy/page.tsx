"use client";

import React from 'react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: September 16, 2025</p>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p className="text-gray-300 mb-6">
              MetisAI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our quantum-enhanced AI platform and services.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3">2.1 Personal Information</h3>
            <p className="text-gray-300 mb-4">We may collect the following personal information:</p>
            <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
              <li>Name and email address when you create an account</li>
              <li>Payment information (processed securely through Stripe)</li>
              <li>Profile information you choose to provide</li>
              <li>Communication preferences</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">2.2 Usage Information</h3>
            <p className="text-gray-300 mb-4">We automatically collect certain information about your use of our Service:</p>
            <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
              <li>API usage and request logs</li>
              <li>Quantum processing metrics</li>
              <li>Device information and IP addresses</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent on our platform</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">2.3 Content Data</h3>
            <p className="text-gray-300 mb-6">
              We may process content you submit to our quantum AI services, including text prompts, documents, and other data necessary to provide our services. This data is processed securely and may be used to improve our algorithms.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-300 mb-4">We use your information for the following purposes:</p>
            <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
              <li>Provide and maintain our quantum AI services</li>
              <li>Process payments and manage subscriptions</li>
              <li>Improve and optimize our algorithms and platform</li>
              <li>Send you service-related communications</li>
              <li>Provide customer support</li>
              <li>Comply with legal obligations</li>
              <li>Prevent fraud and ensure platform security</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mb-4">4. Information Sharing and Disclosure</h2>
            <p className="text-gray-300 mb-4">We do not sell, trade, or rent your personal information. We may share your information in the following circumstances:</p>
            
            <h3 className="text-xl font-semibold text-white mb-3">4.1 Service Providers</h3>
            <p className="text-gray-300 mb-4">
              We may share information with trusted third-party service providers who assist us in operating our platform, including:
            </p>
            <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
              <li>Payment processors (Stripe)</li>
              <li>Cloud computing providers (nuco.cloud)</li>
              <li>Database services (Supabase)</li>
              <li>Analytics providers</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">4.2 Legal Requirements</h3>
            <p className="text-gray-300 mb-6">
              We may disclose your information if required by law or in response to valid legal requests from government authorities.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
            <p className="text-gray-300 mb-4">We implement appropriate security measures to protect your information:</p>
            <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
              <li>End-to-end encryption for data transmission</li>
              <li>Secure data storage with access controls</li>
              <li>Regular security audits and updates</li>
              <li>Employee training on data protection</li>
              <li>Incident response procedures</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mb-4">6. Data Retention</h2>
            <p className="text-gray-300 mb-6">
              We retain your personal information for as long as necessary to provide our services and comply with legal obligations. Usage data may be retained for up to 2 years for analytics and service improvement purposes.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">7. Your Rights and Choices</h2>
            <p className="text-gray-300 mb-4">You have the following rights regarding your personal information:</p>
            <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Objection:</strong> Object to certain processing activities</li>
              <li><strong>Withdrawal:</strong> Withdraw consent for data processing</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mb-4">8. Cookies and Tracking Technologies</h2>
            <p className="text-gray-300 mb-4">We use cookies and similar technologies to:</p>
            <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
              <li>Remember your preferences and settings</li>
              <li>Analyze platform usage and performance</li>
              <li>Provide personalized content and features</li>
              <li>Ensure platform security and functionality</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mb-4">9. International Data Transfers</h2>
            <p className="text-gray-300 mb-6">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data during international transfers, including standard contractual clauses and adequacy decisions.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">10. Children's Privacy</h2>
            <p className="text-gray-300 mb-6">
              Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">11. California Privacy Rights</h2>
            <p className="text-gray-300 mb-4">
              If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
              <li>Right to know what personal information we collect</li>
              <li>Right to delete personal information</li>
              <li>Right to opt-out of the sale of personal information</li>
              <li>Right to non-discrimination for exercising privacy rights</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mb-4">12. European Union (GDPR) Rights</h2>
            <p className="text-gray-300 mb-6">
              If you are in the European Union, you have rights under the General Data Protection Regulation (GDPR), including the right to access, rectify, erase, restrict, port, and object to processing of your personal data.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">13. Changes to This Privacy Policy</h2>
            <p className="text-gray-300 mb-6">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
            </p>

            <h2 className="text-2xl font-bold text-white mb-4">14. Contact Us</h2>
            <p className="text-gray-300 mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
              <p className="text-gray-300">Email: privacy@metisai.tech</p>
              <p className="text-gray-300">Address: 123 Quantum Drive, San Francisco, CA 94105</p>
              <p className="text-gray-300">Phone: +1 (555) 123-4567</p>
              <p className="text-gray-300">Data Protection Officer: dpo@metisai.tech</p>
            </div>

            <div className="border-t border-gray-700 pt-6 mt-8">
              <p className="text-gray-400 text-sm text-center">
                This Privacy Policy is effective as of the date listed above and will remain in effect except with respect to any changes in its provisions in the future.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
