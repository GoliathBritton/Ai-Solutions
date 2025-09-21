"use client";

import React from 'react';
import MetisAILogo from '@/components/MetisAILogo';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <MetisAILogo size={120} tagline="Revolutionizing AI with Quantum Computing" />
          <h1 className="text-4xl font-bold text-white mt-8 mb-4">About MetisAI</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We are pioneering the future of artificial intelligence through quantum-enhanced computing, 
            creating unprecedented capabilities in language processing, content verification, and intelligent automation.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-gray-800/50 rounded-lg p-8 mb-16 border border-gray-700">
          <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
          <p className="text-lg text-gray-300 mb-6">
            To democratize quantum computing and make it accessible to businesses and developers worldwide. 
            We believe that the future of AI lies in the intersection of quantum mechanics and machine learning, 
            and we're building the tools to make that future a reality today.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-white mb-2">Innovation</h3>
              <p className="text-gray-400">
                Pushing the boundaries of what's possible with quantum-enhanced AI
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-white mb-2">Accessibility</h3>
              <p className="text-gray-400">
                Making quantum computing accessible to everyone, everywhere
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔬</div>
              <h3 className="text-xl font-semibold text-white mb-2">Research</h3>
              <p className="text-gray-400">
                Advancing the field through cutting-edge research and development
              </p>
            </div>
          </div>
        </div>

        {/* Technology Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Technology</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <div className="text-purple-400 text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-white mb-3">qdLLM</h3>
              <p className="text-gray-400 mb-4">
                Quantum-Diffusion-LLM with advanced reversal reasoning and parallel processing capabilities
              </p>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Quantum-enhanced text generation</li>
                <li>• Superior coherence and accuracy</li>
                <li>• Parallel processing optimization</li>
              </ul>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <div className="text-blue-400 text-3xl mb-4">🧠</div>
              <h3 className="text-xl font-semibold text-white mb-3">QNLP</h3>
              <p className="text-gray-400 mb-4">
                Quantum Natural Language Processing with superior parallelism and semantic understanding
              </p>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Quantum language models</li>
                <li>• Enhanced semantic analysis</li>
                <li>• Multi-language support</li>
              </ul>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <div className="text-pink-400 text-3xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold text-white mb-3">QTransform</h3>
              <p className="text-gray-400 mb-4">
                Quantum Transformer algorithms with enhanced attention mechanisms and context processing
              </p>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Quantum attention mechanisms</li>
                <li>• Advanced context processing</li>
                <li>• Improved efficiency</li>
              </ul>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <div className="text-green-400 text-3xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-3">MCP</h3>
              <p className="text-gray-400 mb-4">
                Machine Content Protocol for unbiased information integration and verification
              </p>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Multi-source verification</li>
                <li>• TOR network integration</li>
                <li>• Web3 maximization</li>
              </ul>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <div className="text-yellow-400 text-3xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-white mb-3">QASC</h3>
              <p className="text-gray-400 mb-4">
                Quantum Agentic Swarm Coding for AI-powered development assistance
              </p>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• AI coding assistant</li>
                <li>• Quantum-enhanced suggestions</li>
                <li>• Real-time collaboration</li>
              </ul>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <div className="text-red-400 text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-white mb-3">QUBO</h3>
              <p className="text-gray-400 mb-4">
                Quadratic Unconstrained Binary Optimization for complex problem solving
              </p>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Optimization algorithms</li>
                <li>• Complex problem solving</li>
                <li>• Quantum annealing</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-gray-800/50 rounded-lg p-8 mb-16 border border-gray-700">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">JD</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Dr. John Doe</h3>
              <p className="text-purple-400 mb-2">Chief Executive Officer</p>
              <p className="text-gray-400 text-sm">
                Quantum computing researcher with 15+ years of experience in AI and machine learning.
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">JS</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Dr. Jane Smith</h3>
              <p className="text-blue-400 mb-2">Chief Technology Officer</p>
              <p className="text-gray-400 text-sm">
                Expert in quantum algorithms and distributed systems with a focus on scalability.
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">MJ</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Dr. Mike Johnson</h3>
              <p className="text-green-400 mb-2">Head of Research</p>
              <p className="text-gray-400 text-sm">
                Leading researcher in quantum machine learning and neural network optimization.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">🔬 Scientific Excellence</h3>
              <p className="text-gray-300">
                We maintain the highest standards of scientific rigor in our research and development, 
                ensuring that every feature we build is grounded in solid quantum computing principles.
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">🤝 Collaboration</h3>
              <p className="text-gray-300">
                We believe in the power of collaboration, working closely with researchers, 
                developers, and businesses to advance the field of quantum AI.
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">🌱 Innovation</h3>
              <p className="text-gray-300">
                We continuously push the boundaries of what's possible, exploring new frontiers 
                in quantum computing and artificial intelligence.
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">🎯 Impact</h3>
              <p className="text-gray-300">
                We focus on creating real-world impact, building solutions that solve actual 
                problems and drive meaningful change in industries worldwide.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Get in Touch</h2>
          <p className="text-gray-300 mb-6">
            Ready to experience the future of AI? Join us on this quantum journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg transition-colors"
            >
              Contact Us
            </a>
            <a
              href="/"
              className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg transition-colors"
            >
              Try MetisAI
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
