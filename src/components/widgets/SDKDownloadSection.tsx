import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, Copy, Check, Code, Terminal, 
  ExternalLink, Book, Zap, Package, FileCode
} from 'lucide-react';

// ============================================
// TYPES
// ============================================
export interface SDKLanguage {
  id: string;
  name: string;
  icon: string;
  installCommand: string;
  quickStart: string;
  docsUrl?: string;
}

export interface SDKDownloadSectionProps {
  languages?: SDKLanguage[];
  apiVersion?: string;
  onDownload?: (languageId: string) => void;
  className?: string;
}

// Default SDK languages
const defaultLanguages: SDKLanguage[] = [
  {
    id: 'javascript',
    name: 'JavaScript / Node.js',
    icon: '🟨',
    installCommand: 'npm install @lumiqai/sdk',
    quickStart: `import { LumiqAI } from '@lumiqai/sdk';

const lumiq = new LumiqAI({
  apiKey: 'your_api_key'
});

// Get credit score
const score = await lumiq.getScore({
  businessId: 'biz_123',
  includeFactors: true
});

console.log(score.lumiq_score); // 742`,
    docsUrl: 'https://docs.futeurcredx.com/sdk/javascript',
  },
  {
    id: 'python',
    name: 'Python',
    icon: '🐍',
    installCommand: 'pip install lumiqai',
    quickStart: `from lumiqai import LumiqAI

lumiq = LumiqAI(api_key="your_api_key")

# Get credit score
score = lumiq.get_score(
    business_id="biz_123",
    include_factors=True
)

print(score.lumiq_score)  # 742`,
    docsUrl: 'https://docs.futeurcredx.com/sdk/python',
  },
  {
    id: 'react',
    name: 'React Components',
    icon: '⚛️',
    installCommand: 'npm install @lumiqai/react',
    quickStart: `import { CreditScoreWidget } from '@lumiqai/react';

function App() {
  return (
    <CreditScoreWidget
      apiKey="your_api_key"
      businessId="biz_123"
      theme="light"
      onScoreChange={(score) => {
        console.log('New score:', score);
      }}
    />
  );
}`,
    docsUrl: 'https://docs.futeurcredx.com/sdk/react',
  },
  {
    id: 'curl',
    name: 'REST API / cURL',
    icon: '🌐',
    installCommand: '# No installation needed',
    quickStart: `curl -X GET "https://api.futeurcredx.com/v1/credit-score" \\
  -H "Authorization: Bearer your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"business_id": "biz_123"}'

# Response:
# {
#   "lumiq_score": 742,
#   "grade": "B+",
#   "factors": [...],
#   "recommendations": [...]
# }`,
    docsUrl: 'https://docs.futeurcredx.com/api-reference',
  },
];

// ============================================
// SDK DOWNLOAD SECTION
// ============================================
export const SDKDownloadSection: React.FC<SDKDownloadSectionProps> = ({
  languages = defaultLanguages,
  apiVersion = 'v1.2.0',
  onDownload,
  className = '',
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const copyToClipboard = (text: string, type: 'command' | 'code') => {
    navigator.clipboard.writeText(text);
    if (type === 'command') {
      setCopiedCommand(text);
      setTimeout(() => setCopiedCommand(null), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl p-6 shadow-lg border border-slate-200 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">SDK & Integration</h3>
            <p className="text-sm text-slate-500">Get started in minutes</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
          {apiVersion}
        </span>
      </div>

      {/* Language tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {languages.map(lang => (
          <button
            key={lang.id}
            onClick={() => setSelectedLanguage(lang)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              selectedLanguage.id === lang.id
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>{lang.icon}</span>
            {lang.name}
          </button>
        ))}
      </div>

      {/* Installation */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Terminal className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700">Installation</span>
        </div>
        <div className="relative">
          <pre className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-sm overflow-x-auto">
            <code>{selectedLanguage.installCommand}</code>
          </pre>
          <button
            onClick={() => copyToClipboard(selectedLanguage.installCommand, 'command')}
            className="absolute top-3 right-3 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            {copiedCommand === selectedLanguage.installCommand ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* Quick Start */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Code className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700">Quick Start</span>
        </div>
        <div className="relative">
          <pre className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-sm overflow-x-auto max-h-72">
            <code className="language-javascript">{selectedLanguage.quickStart}</code>
          </pre>
          <button
            onClick={() => copyToClipboard(selectedLanguage.quickStart, 'code')}
            className="absolute top-3 right-3 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            {copiedCode ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <a
          href={selectedLanguage.docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <Book className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-slate-700">Documentation</span>
          <ExternalLink className="w-3 h-3 text-slate-400 ml-auto" />
        </a>
        
        <a
          href="https://docs.futeurcredx.com/api-reference"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <FileCode className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-slate-700">API Reference</span>
          <ExternalLink className="w-3 h-3 text-slate-400 ml-auto" />
        </a>
        
        <a
          href="https://docs.futeurcredx.com/changelog"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <Zap className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-medium text-slate-700">Changelog</span>
          <ExternalLink className="w-3 h-3 text-slate-400 ml-auto" />
        </a>
        
        <button
          onClick={() => onDownload?.(selectedLanguage.id)}
          className="flex items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
        >
          <Download className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">Download SDK</span>
        </button>
      </div>

      {/* Support */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-slate-800">Need help integrating?</h4>
            <p className="text-sm text-slate-600">Our team can help you get started</p>
          </div>
          <a
            href="https://enterprise.futeurcredx.com/contact-us"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
          >
            Contact Support
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default SDKDownloadSection;
