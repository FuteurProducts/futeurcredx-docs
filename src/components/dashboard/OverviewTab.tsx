import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Code, FileText, BarChart2, Rocket, CheckCircle, ExternalLink } from 'lucide-react';
import { ApiHealthMonitor } from '@/components/dashboard/dashboard/ApiHealthMonitor';
import { ConversionChart } from '@/components/dashboard/dashboard/ConversionChart';

const OverviewTab: React.FC = () => {
  const gettingStartedSteps = [
    { text: 'Account Created', subtext: 'Welcome to FuteurCredX!', completed: true },
    { text: 'API Key Generated', subtext: 'Ready to make API calls', completed: true },
    { text: 'Make Your First API Call', subtext: 'Test the API with your key', completed: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-8"
    >
      {/* Top Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Quick Actions */}
        <div className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-black uppercase tracking-wider text-blue-900 flex items-center gap-2 mb-4">
          <Code className="w-5 h-5" />
          Quick Actions
        </h3>
        <div className="space-y-4">
          <div className="block p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Code className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-slate-800">API Testing</p>
                <p className="text-sm text-slate-500">Test APIs with your generated tokens</p>
              </div>
            </div>
          </div>
          <Link to="/docs" className="block p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="font-bold text-slate-800">API Documentation</p>
                        <p className="text-sm text-slate-500">View examples and guides</p>
                    </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
            </div>
          </Link>
          <div className="p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                        <BarChart2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="font-bold text-slate-800">Usage Analytics</p>
                        <p className="text-sm text-slate-500">Detailed usage insights</p>
                    </div>
                </div>
                <span className="text-xs font-bold uppercase text-slate-400 bg-slate-200 px-2 py-1 rounded-full">Coming Soon</span>
            </div>
          </div>
        </div>
        </div>
      </div>

        {/* Getting Started */}
        <div className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-black uppercase tracking-wider text-blue-900 flex items-center gap-2 mb-4">
          <Rocket className="w-5 h-5" />
          Getting Started
        </h3>
        <div className="space-y-3">
          {gettingStartedSteps.map((step, index) => (
            <div key={index} className={`p-4 rounded-xl flex items-center gap-4 ${step.completed ? 'bg-green-50' : 'bg-slate-50'}`}>
              {step.completed ? (
                <div className="w-9 h-9 flex items-center justify-center bg-green-500 text-white rounded-full flex-shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-9 h-9 flex items-center justify-center bg-slate-200 text-slate-500 font-bold rounded-full flex-shrink-0">
                  {index + 1}
                </div>
              )}
              <div>
                <p className={`font-bold ${step.completed ? 'text-green-800' : 'text-slate-800'}`}>{step.text}</p>
                <p className="text-sm text-slate-500">{step.subtext}</p>
              </div>
            </div>
          ))}
        </div>
        </div>
        </div>
      </div>

      {/* Live API Health */}
      <div className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-black uppercase tracking-wider text-blue-900 flex items-center gap-2 mb-4">
          <BarChart2 className="w-5 h-5" />
          API Health
        </h3>
        <ApiHealthMonitor />
      </div>

      {/* Performance */}
      <div className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-black uppercase tracking-wider text-blue-900 flex items-center gap-2 mb-4">
          <BarChart2 className="w-5 h-5" />
          Performance Overview
        </h3>
        <ConversionChart
          data={[
            { month: 'Jan', applications: 450, approved: 340, conversionRate: 16.2, approvalRate: 75.6 },
            { month: 'Feb', applications: 520, approved: 385, conversionRate: 17.1, approvalRate: 74.0 },
            { month: 'Mar', applications: 580, approved: 445, conversionRate: 17.8, approvalRate: 76.7 },
            { month: 'Apr', applications: 615, approved: 468, conversionRate: 18.2, approvalRate: 76.1 },
            { month: 'May', applications: 670, approved: 512, conversionRate: 18.9, approvalRate: 76.4 },
            { month: 'Jun', applications: 725, approved: 558, conversionRate: 19.5, approvalRate: 77.0 }
          ]}
        />
      </div>
    </motion.div>
  );
};

export default OverviewTab;
