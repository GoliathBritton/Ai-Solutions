"use client";

import React, { useState, useEffect } from 'react';

interface QASCDashboardProps {
  className?: string;
}

interface SwarmStatus {
  totalAgents: number;
  availableAgents: number;
  workingAgents: number;
  averagePerformance: number;
  quantumCapability: number;
  collaborationScore: number;
}

interface CodingTask {
  id: string;
  description: string;
  requirements: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  complexity: number;
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'failed';
  quantumOptimization: boolean;
}

interface CodeSolution {
  id: string;
  taskId: string;
  code: string;
  language: string;
  quality: number;
  performance: number;
  maintainability: number;
  testCoverage: number;
  quantumOptimized: boolean;
  createdBy: string;
  consensus: number;
  timestamp: string;
}

export default function QASCDashboard({ className = "" }: QASCDashboardProps) {
  const [swarmStatus, setSwarmStatus] = useState<SwarmStatus | null>(null);
  const [tasks, setTasks] = useState<CodingTask[]>([]);
  const [solutions, setSolutions] = useState<CodeSolution[]>([]);
  const [newTask, setNewTask] = useState({
    description: '',
    requirements: '',
    priority: 'medium' as const,
    complexity: 5,
    quantumOptimization: true
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSwarmStatus();
    loadTasks();
    loadSolutions();
  }, []);

  const loadSwarmStatus = async () => {
    try {
      const response = await fetch('/api/qasc/code');
      if (response.ok) {
        const data = await response.json();
        setSwarmStatus(data.data.swarmStatus);
      }
    } catch (error) {
      console.error('Failed to load swarm status:', error);
    }
  };

  const loadTasks = async () => {
    try {
      const response = await fetch('/api/qasc/tasks');
      if (response.ok) {
        const data = await response.json();
        setTasks(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const loadSolutions = async () => {
    try {
      const response = await fetch('/api/qasc/solutions');
      if (response.ok) {
        const data = await response.json();
        setSolutions(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load solutions:', error);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.description.trim()) return;

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/qasc/code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: {
            description: newTask.description,
            requirements: newTask.requirements.split(',').map(r => r.trim()).filter(r => r),
            priority: newTask.priority,
            complexity: newTask.complexity,
            quantumOptimization: newTask.quantumOptimization
          }
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTasks(prev => [data.data.task, ...prev]);
        setSolutions(prev => [data.data.consensus.finalSolution, ...prev]);
        setNewTask({
          description: '',
          requirements: '',
          priority: 'medium',
          complexity: 5,
          quantumOptimization: true
        });
      } else {
        setError(data.error?.message || 'Task creation failed');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'in_progress': return 'text-blue-400';
      case 'review': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 80) return 'text-green-400';
    if (quality >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          Quantum Agentic Swarm Coding (QASC)
        </h2>
        <p className="text-gray-400">
          Collaborative, quantum-enhanced coding with swarm intelligence
        </p>
      </div>

      {/* Swarm Status */}
      {swarmStatus && (
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Swarm Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{swarmStatus.totalAgents}</div>
              <div className="text-sm text-gray-400">Total Agents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{swarmStatus.availableAgents}</div>
              <div className="text-sm text-gray-400">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{swarmStatus.workingAgents}</div>
              <div className="text-sm text-gray-400">Working</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {(swarmStatus.averagePerformance * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-400">Avg Performance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">
                {(swarmStatus.quantumCapability * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-400">Quantum Capability</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-400">
                {(swarmStatus.collaborationScore * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-400">Collaboration</div>
            </div>
          </div>
        </div>
      )}

      {/* Create Task */}
      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">Create Coding Task</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Task Description
            </label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the coding task..."
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Requirements (comma-separated)
            </label>
            <input
              type="text"
              value={newTask.requirements}
              onChange={(e) => setNewTask(prev => ({ ...prev, requirements: e.target.value }))}
              placeholder="TypeScript, React, Performance optimization, etc."
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as any }))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Complexity (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={newTask.complexity}
                onChange={(e) => setNewTask(prev => ({ ...prev, complexity: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newTask.quantumOptimization}
                  onChange={(e) => setNewTask(prev => ({ ...prev, quantumOptimization: e.target.checked }))}
                  className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-300">Quantum Optimization</span>
              </label>
            </div>
          </div>

          <button
            onClick={handleCreateTask}
            disabled={isProcessing || !newTask.description.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {isProcessing ? 'Processing...' : 'Create Task'}
          </button>
          
          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 border border-red-500/30 rounded-lg p-3">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Tasks */}
      {tasks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Recent Tasks</h3>
          {tasks.slice(0, 5).map((task) => (
            <div key={task.id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-medium text-white">{task.description}</h4>
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Requirements</div>
                  <div className="text-white text-sm">
                    {task.requirements.join(', ')}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Complexity</div>
                  <div className="text-white">{task.complexity}/10</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Quantum</div>
                  <div className={`${task.quantumOptimization ? 'text-green-400' : 'text-gray-400'}`}>
                    {task.quantumOptimization ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Solutions */}
      {solutions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Generated Solutions</h3>
          {solutions.slice(0, 3).map((solution) => (
            <div key={solution.id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-medium text-white">Solution {solution.id}</h4>
                <div className="flex space-x-2">
                  <span className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded text-xs font-medium">
                    {solution.language.toUpperCase()}
                  </span>
                  {solution.quantumOptimized && (
                    <span className="px-2 py-1 bg-purple-900/30 text-purple-400 rounded text-xs font-medium">
                      QUANTUM
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <pre className="bg-gray-900/50 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto">
                  <code>{solution.code}</code>
                </pre>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Quality</div>
                  <div className={`${getQualityColor(solution.quality)}`}>
                    {(solution.quality * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Performance</div>
                  <div className="text-white">
                    {(solution.performance * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Maintainability</div>
                  <div className="text-white">
                    {(solution.maintainability * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Test Coverage</div>
                  <div className="text-white">
                    {(solution.testCoverage * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {tasks.length === 0 && solutions.length === 0 && !isProcessing && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No tasks or solutions yet</div>
          <div className="text-gray-500 text-sm">
            Create a coding task above to start using the quantum swarm
          </div>
        </div>
      )}
    </div>
  );
}
