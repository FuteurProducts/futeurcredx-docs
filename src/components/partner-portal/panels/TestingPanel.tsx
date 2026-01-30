/**
 * Integration Testing Panel
 * Sandbox/production environments, UAT certification flow, test data management
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FlaskConical, CheckCircle, XCircle, Clock, Play, RotateCcw,
  FileCheck, ChevronRight, Download, Clipboard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { mockIntegrationTests, mockCertificationChecklists } from '../mockData';

export const TestingPanel: React.FC = () => {
  const { toast } = useToast();
  const [tests, setTests] = useState(mockIntegrationTests);
  const [runningTests, setRunningTests] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Security Requirements']));

  const handleRunTest = async (testId: string) => {
    setRunningTests(new Set([...runningTests, testId]));
    
    // Simulate test execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setTests(tests.map(test => {
      if (test.id === testId) {
        return {
          ...test,
          status: Math.random() > 0.1 ? 'passed' : 'failed',
          lastRunAt: new Date().toISOString(),
          duration: Math.floor(Math.random() * 3000) + 500,
        };
      }
      return test;
    }));
    
    setRunningTests(new Set([...runningTests].filter(id => id !== testId)));
    toast({ title: 'Test Complete', description: 'Test execution finished' });
  };

  const handleRunAllTests = async () => {
    const allTestIds = tests.filter(t => t.status !== 'passed').map(t => t.id);
    setRunningTests(new Set(allTestIds));
    
    // Simulate running all tests
    for (const testId of allTestIds) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTests(prev => prev.map(test => {
        if (test.id === testId) {
          return {
            ...test,
            status: Math.random() > 0.1 ? 'passed' : 'failed',
            lastRunAt: new Date().toISOString(),
            duration: Math.floor(Math.random() * 3000) + 500,
          };
        }
        return test;
      }));
      setRunningTests(prev => new Set([...prev].filter(id => id !== testId)));
    }
    
    toast({ title: 'All Tests Complete', description: 'Test suite execution finished' });
  };

  const getStatusIcon = (status: string, isRunning: boolean) => {
    if (isRunning) return <Clock className="h-4 w-4 text-primary animate-spin" />;
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-chart-2" />;
      case 'failed': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed': return <Badge className="bg-chart-2/10 text-chart-2 border-chart-2/20">Passed</Badge>;
      case 'failed': return <Badge variant="destructive">Failed</Badge>;
      case 'in_progress': return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Running</Badge>;
      default: return <Badge variant="secondary">Not Run</Badge>;
    }
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const passedTests = tests.filter(t => t.status === 'passed').length;
  const totalTests = tests.length;
  const overallProgress = (passedTests / totalTests) * 100;

  const testCategories = [...new Set(tests.map(t => t.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Integration Testing</h2>
          <p className="text-sm text-muted-foreground">
            Validate your integration before going live
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => toast({ title: 'Coming Soon', description: 'Test data reset feature' })}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Test Data
          </Button>
          <Button onClick={handleRunAllTests} disabled={runningTests.size > 0}>
            <Play className="h-4 w-4 mr-2" />
            Run All Tests
          </Button>
        </div>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Integration Certification Progress</h3>
              <p className="text-sm text-muted-foreground">
                {passedTests} of {totalTests} tests passed
              </p>
            </div>
            <div className="text-right">
              <span className={`text-2xl font-bold ${overallProgress >= 100 ? 'text-chart-2' : 'text-primary'}`}>
                {Math.round(overallProgress)}%
              </span>
              {overallProgress >= 100 && (
                <Badge className="ml-2 bg-chart-2/10 text-chart-2 border-chart-2/20">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Certified
                </Badge>
              )}
            </div>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </CardContent>
      </Card>

      <Tabs defaultValue="tests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tests">Integration Tests</TabsTrigger>
          <TabsTrigger value="certification">Certification Checklist</TabsTrigger>
          <TabsTrigger value="sandbox">Sandbox Data</TabsTrigger>
        </TabsList>

        {/* Integration Tests Tab */}
        <TabsContent value="tests" className="space-y-4">
          {testCategories.map((category) => {
            const categoryTests = tests.filter(t => t.category === category);
            const categoryPassed = categoryTests.filter(t => t.status === 'passed').length;
            
            return (
              <Card key={category}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FlaskConical className="h-5 w-5" />
                      {category}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {categoryPassed}/{categoryTests.length} passed
                      </span>
                      <Progress 
                        value={(categoryPassed / categoryTests.length) * 100} 
                        className="w-24 h-2"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categoryTests.map((test) => {
                    const isRunning = runningTests.has(test.id);
                    return (
                      <motion.div
                        key={test.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {getStatusIcon(test.status, isRunning)}
                          <div>
                            <p className="font-medium text-sm">{test.name}</p>
                            <p className="text-xs text-muted-foreground">{test.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {test.lastRunAt && (
                            <div className="text-right text-xs text-muted-foreground">
                              <p>Last run: {new Date(test.lastRunAt).toLocaleString()}</p>
                              {test.duration && <p>Duration: {test.duration}ms</p>}
                            </div>
                          )}
                          {getStatusBadge(isRunning ? 'in_progress' : test.status)}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRunTest(test.id)}
                            disabled={isRunning}
                          >
                            <Play className="h-3 w-3" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Certification Checklist Tab */}
        <TabsContent value="certification" className="space-y-4">
          {mockCertificationChecklists.map((checklist) => (
            <Collapsible
              key={checklist.category}
              open={expandedCategories.has(checklist.category)}
              onOpenChange={() => toggleCategory(checklist.category)}
            >
              <Card>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileCheck className="h-5 w-5" />
                        {checklist.category}
                        <ChevronRight className={`h-4 w-4 transition-transform ${
                          expandedCategories.has(checklist.category) ? 'rotate-90' : ''
                        }`} />
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${
                          checklist.progress === 100 ? 'text-chart-2' : 'text-muted-foreground'
                        }`}>
                          {checklist.progress}% Complete
                        </span>
                        <Progress value={checklist.progress} className="w-24 h-2" />
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 space-y-2">
                    {checklist.items.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-start gap-3 p-3 rounded-lg ${
                          item.completed ? 'bg-chart-2/5' : 'bg-muted/50'
                        }`}
                      >
                        <div className={`mt-0.5 ${item.completed ? 'text-chart-2' : 'text-muted-foreground'}`}>
                          {item.completed ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-current" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className={`font-medium text-sm ${item.completed ? 'text-chart-2' : ''}`}>
                              {item.name}
                            </p>
                            {item.required && (
                              <Badge variant="outline" className="text-xs">Required</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </TabsContent>

        {/* Sandbox Data Tab */}
        <TabsContent value="sandbox">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sandbox Test Data</CardTitle>
              <CardDescription>
                Pre-configured test entities for integration development
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Test Customers */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  Test SMB Entities
                  <Badge variant="secondary">5 entities</Badge>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { name: 'Acme Manufacturing Co', ein: 'XX-XXX1234', score: 720, tier: 'low' },
                    { name: 'Beta Services LLC', ein: 'XX-XXX5678', score: 650, tier: 'moderate' },
                    { name: 'Gamma Tech Inc', ein: 'XX-XXX9012', score: 580, tier: 'elevated' },
                    { name: 'Delta Retail Corp', ein: 'XX-XXX3456', score: 520, tier: 'high' },
                  ].map((entity) => (
                    <div key={entity.ein} className="p-3 rounded-lg bg-muted/50 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{entity.name}</p>
                        <p className="text-xs text-muted-foreground">EIN: {entity.ein}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{entity.score}</p>
                        <Badge variant="outline" className="text-xs">{entity.tier}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Test Credentials */}
              <div className="space-y-3">
                <h4 className="font-medium">Sandbox Credentials</h4>
                <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">API Key</span>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono bg-background px-2 py-1 rounded">
                        lq_test_sandbox123456789
                      </code>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Clipboard className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Portfolio ID</span>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono bg-background px-2 py-1 rounded">
                        portfolio-sandbox-001
                      </code>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Clipboard className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download Options */}
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Postman Collection
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download OpenAPI Spec
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestingPanel;
