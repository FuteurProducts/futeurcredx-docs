import { useState } from 'react';
import { Play, Copy, Check, Code2, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const exampleRequest = `curl -X POST https://api.lumiq.ai/v2/credit-journey \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "business_id": "BIZ_12345",
    "include_score": true,
    "include_tradelines": true
  }'`;

const exampleResponse = `{
  "status": "success",
  "data": {
    "business_id": "BIZ_12345",
    "fsr_score": 720,
    "intelliscore_plus": 82,
    "credit_utilization": 42.5,
    "tradelines": 12,
    "risk_class": "Low",
    "last_updated": "2025-01-15T10:30:00Z"
  },
  "response_time": "45ms"
}`;

const languages = [
  {
    name: 'cURL',
    code: exampleRequest
  },
  {
    name: 'Python',
    code: `import requests

response = requests.post(
    'https://api.lumiq.ai/v2/credit-journey',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    json={
        'business_id': 'BIZ_12345',
        'include_score': True,
        'include_tradelines': True
    }
)

print(response.json())`
  },
  {
    name: 'Node.js',
    code: `const axios = require('axios');

const response = await axios.post(
  'https://api.lumiq.ai/v2/credit-journey',
  {
    business_id: 'BIZ_12345',
    include_score: true,
    include_tradelines: true
  },
  {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    }
  }
);

console.log(response.data);`
  }
];

export function ApiPlayground() {
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setShowResponse(true);
    }, 1500);
  };

  return (
    <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
      <Card className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Code2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">Interactive API Playground</h2>
                <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 border-amber-500/30">Sandbox Mode</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Test endpoints in real-time</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-code">POST</Badge>
            <Badge variant="default">/v2/credit-journey</Badge>
          </div>
        </div>

        <Tabs defaultValue="cURL" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList className="glass">
              {languages.map((lang) => (
                <TabsTrigger key={lang.name} value={lang.name} className="font-code">
                  {lang.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <Button
              onClick={handleRun}
              disabled={isRunning}
              className="gap-2"
            >
              {isRunning ? (
                <>
                  <Zap className="w-4 h-4 animate-pulse" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run Request
                </>
              )}
            </Button>
          </div>

          {languages.map((lang) => (
            <TabsContent key={lang.name} value={lang.name} className="space-y-4">
              <div className="relative">
                <div className="absolute top-3 right-3 z-10">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(lang.code)}
                    className="gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-success" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <pre className="bg-background/50 border border-white/10 rounded-lg p-4 overflow-x-auto">
                  <code className="text-xs font-code text-foreground">
                    {lang.code}
                  </code>
                </pre>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {showResponse && (
          <div className="mt-6 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-success">200 OK</Badge>
                <span className="text-xs text-muted-foreground font-code">
                  Response time: 45ms
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleCopy(exampleResponse)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <pre className="bg-background/50 border border-success/30 rounded-lg p-4 overflow-x-auto">
              <code className="text-xs font-code text-foreground">
                {exampleResponse}
              </code>
            </pre>
            <p className="text-xs text-muted-foreground italic mt-2">
              Simulated response — connect your API key for live data
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
