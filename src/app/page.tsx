import Image from "next/image";
import MetisAILogo from "@/components/MetisAILogo";
import QuantumLLMInterface from "@/components/quantum/QuantumLLMInterface";
import MCPDashboard from "@/components/mcp/MCPDashboard";
import QASCDashboard from "@/components/qasc/QASCDashboard";

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <MetisAILogo size={120} tagline="Neuromorphic Quantum Business Architecture" />
          <p className="text-xl text-gray-300 mt-6 max-w-3xl mx-auto">
            Experience the future of AI with quantum-enhanced language models powered by Dynex neuromorphic computing
          </p>
        </div>

        {/* Quantum Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <div className="text-purple-400 text-2xl mb-3">⚡</div>
            <h3 className="text-xl font-semibold text-white mb-2">qdLLM</h3>
            <p className="text-gray-400 text-sm">
              Quantum-Diffusion-LLM with advanced reversal reasoning and parallel processing capabilities
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <div className="text-blue-400 text-2xl mb-3">🧠</div>
            <h3 className="text-xl font-semibold text-white mb-2">QNLP</h3>
            <p className="text-gray-400 text-sm">
              Quantum Natural Language Processing with superior parallelism and semantic understanding
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <div className="text-pink-400 text-2xl mb-3">🔄</div>
            <h3 className="text-xl font-semibold text-white mb-2">QTransform</h3>
            <p className="text-gray-400 text-sm">
              Quantum Transformer algorithms with enhanced attention mechanisms and context processing
            </p>
          </div>
        </div>

                {/* Quantum LLM Interface */}
                <div className="max-w-4xl mx-auto mb-16">
                  <QuantumLLMInterface />
                </div>

                {/* MCP Dashboard */}
                <div className="max-w-6xl mx-auto mb-16">
                  <MCPDashboard />
                </div>

                {/* QASC Dashboard */}
                <div className="max-w-6xl mx-auto mb-16">
                  <QASCDashboard />
                </div>

        {/* Technology Stack */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-8">Powered by Advanced Technology</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Dynex Neuromorphic Computing</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Quantum Annealing</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
              <span>QUBO Optimization</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>nuco.cloud Integration</span>
            </div>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
