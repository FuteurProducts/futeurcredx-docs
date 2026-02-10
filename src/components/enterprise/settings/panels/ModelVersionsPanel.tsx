/**
 * Model Versions Panel
 * SR 11-7 compliant model governance and version management
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu, CheckCircle, FileText, GitBranch, ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockModelVersions } from '../mockData';

export const ModelVersionsPanel: React.FC = () => {
  const [models] = useState(mockModelVersions);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-chart-2/10 text-chart-2 border-chart-2/20">Active</Badge>;
      case 'testing':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Testing</Badge>;
      case 'deprecated':
        return <Badge variant="secondary">Deprecated</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Model Versions</h2>
          <p className="text-sm text-muted-foreground">
            SR 11-7 compliant model governance and version control
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          <FileText className="h-4 w-4 mr-1" />
          SR 11-7 Compliant
        </Badge>
      </div>

      {/* Governance Summary */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-primary">{models.filter(m => m.status === 'active').length}</div>
            <div className="text-xs text-muted-foreground">Active Models</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-warning">{models.filter(m => m.status === 'testing').length}</div>
            <div className="text-xs text-muted-foreground">In Testing</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-chart-2">100%</div>
            <div className="text-xs text-muted-foreground">Validation Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-muted-foreground">Q4 2024</div>
            <div className="text-xs text-muted-foreground">Next Review</div>
          </CardContent>
        </Card>
      </div>

      {/* Models List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Models</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
          <TabsTrigger value="deprecated">Deprecated</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {models.map((model) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        model.status === 'active' ? 'bg-chart-2/10' :
                        model.status === 'testing' ? 'bg-warning/10' : 'bg-muted'
                      }`}>
                        <Cpu className={`h-6 w-6 ${
                          model.status === 'active' ? 'text-chart-2' :
                          model.status === 'testing' ? 'text-warning' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium">{model.name}</h3>
                          <Badge variant="outline" className="font-mono">{model.version}</Badge>
                          {getStatusBadge(model.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{model.notes}</p>
                        
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4 text-chart-2" />
                            Validated {new Date(model.validatedOn).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <GitBranch className="h-4 w-4" />
                            SHA: {model.id.slice(-8)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Documentation
                      </Button>
                      {model.status === 'testing' && (
                        <Button size="sm" onClick={() => {
                          toast.success('Model promoted to production');
                        }}>
                          Promote to Production
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Model Metrics */}
                  {model.status === 'active' && (
                    <div className="mt-6 pt-4 border-t">
                      <h4 className="text-sm font-medium mb-3">Performance Metrics (Last 30 Days)</h4>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Accuracy</span>
                            <span>94.2%</span>
                          </div>
                          <Progress value={94.2} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Precision</span>
                            <span>91.8%</span>
                          </div>
                          <Progress value={91.8} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Recall</span>
                            <span>89.5%</span>
                          </div>
                          <Progress value={89.5} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">AUC-ROC</span>
                            <span>0.92</span>
                          </div>
                          <Progress value={92} className="h-2" />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        {/* Filtered tabs */}
        {['active', 'testing', 'deprecated'].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            {models.filter(m => m.status === status).map((model) => (
              <Card key={model.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <Cpu className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{model.name}</h3>
                        <Badge variant="outline" className="font-mono">{model.version}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{model.notes}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {models.filter(m => m.status === status).length === 0 && (
              <Card className="border-dashed">
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No {status} models
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Governance Info */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <FileText className="h-6 w-6 text-primary mt-1" />
            <div>
              <h4 className="font-medium">Model Governance (SR 11-7)</h4>
              <p className="text-sm text-muted-foreground mt-1">
                All models are subject to Federal Reserve SR 11-7 guidance on model risk management. 
                This includes independent validation, ongoing monitoring, and documented approval workflows.
              </p>
              <Button variant="link" className="px-0 mt-2">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Governance Policy
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelVersionsPanel;
