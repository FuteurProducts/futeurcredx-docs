import React from 'react';
import { motion } from 'framer-motion';
import { Check, Lock, ArrowRight, Sparkles } from 'lucide-react';

// ============================================
// TYPES
// ============================================
export interface JourneyStage {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'current' | 'locked';
  requirements?: string[];
  completedAt?: string;
}

export interface CreditJourneyData {
  currentStage: number;
  stages: JourneyStage[];
  nextUnlock?: string;
  estimatedReadiness?: string;
}

export interface CreditJourneyWidgetProps {
  data: CreditJourneyData;
  variant?: 'horizontal' | 'vertical' | 'compact';
  showRequirements?: boolean;
  className?: string;
}

// Default journey stages
const defaultStages: JourneyStage[] = [
  { id: 'verify', name: 'Verify', description: 'Identity & registry verification', status: 'completed' },
  { id: 'stabilize', name: 'Stabilize', description: 'Banking behavior analysis', status: 'completed' },
  { id: 'build', name: 'Build', description: 'Credit history establishment', status: 'current', requirements: ['6+ months operating history', 'Active tradelines'] },
  { id: 'qualify', name: 'Qualify', description: 'Pre-qualification assessment', status: 'locked' },
  { id: 'unlock', name: 'Unlock', description: 'Product access granted', status: 'locked' },
];

// ============================================
// CREDIT JOURNEY WIDGET
// ============================================
export const CreditJourneyWidget: React.FC<CreditJourneyWidgetProps> = ({
  data,
  variant = 'horizontal',
  showRequirements = true,
  className = '',
}) => {
  const stages = data.stages.length > 0 ? data.stages : defaultStages;

  const getStageIcon = (status: JourneyStage['status'], index: number) => {
    if (status === 'completed') {
      return (
        <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center shadow-lg shadow-success/30">
          <Check className="w-5 h-5 text-white" strokeWidth={3} />
        </div>
      );
    }
    if (status === 'current') {
      return (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 animate-pulse">
          <span className="text-white font-bold">{index + 1}</span>
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
        <Lock className="w-4 h-4 text-muted-foreground" />
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-card rounded-2xl p-5 shadow-sm border border-border ${className}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Approval Readiness</h3>
          <span className="text-xs text-success font-medium bg-success/10 px-2 py-1 rounded-full">
            On Track
          </span>
        </div>
        
        {/* Progress dots */}
        <div className="flex items-center justify-between mb-3">
          {stages.map((stage, index) => (
            <React.Fragment key={stage.id}>
              <div className="flex flex-col items-center">
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    stage.status === 'completed' ? 'bg-success text-white' :
                    stage.status === 'current' ? 'bg-info text-white animate-pulse' :
                    'bg-accent text-muted-foreground'
                  }`}
                >
                  {stage.status === 'completed' ? <Check className="w-3 h-3" /> : index + 1}
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 font-medium">{stage.name}</span>
              </div>
              {index < stages.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 ${
                  stage.status === 'completed' ? 'bg-success' : 'bg-accent'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {data.nextUnlock && (
          <div className="flex items-center justify-between text-sm pt-3 border-t border-border">
            <span className="text-muted-foreground">Next unlock</span>
            <span className="font-semibold text-foreground">{data.nextUnlock}</span>
          </div>
        )}
      </motion.div>
    );
  }

  if (variant === 'vertical') {
    return (
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`bg-card rounded-2xl p-6 shadow-sm border border-border ${className}`}
      >
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-[var(--primary-04)]" />
          <h3 className="text-lg font-semibold text-foreground">Credit Journey</h3>
        </div>

        <div className="space-y-1">
          {stages.map((stage, index) => (
            <div key={stage.id} className="relative">
              {/* Connector line */}
              {index < stages.length - 1 && (
                <div 
                  className={`absolute left-5 top-10 w-0.5 h-16 ${
                    stage.status === 'completed' ? 'bg-success' : 'bg-accent'
                  }`}
                />
              )}
              
              <div className={`flex gap-4 p-3 rounded-xl transition-colors ${
                stage.status === 'current' ? 'bg-info/10' : ''
              }`}>
                {getStageIcon(stage.status, index)}
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-semibold ${
                      stage.status === 'locked' ? 'text-muted-foreground' : 'text-foreground'
                    }`}>
                      {stage.name}
                    </h4>
                    {stage.status === 'current' && (
                      <span className="text-xs bg-info text-white px-2 py-0.5 rounded-full">
                        In Progress
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${
                    stage.status === 'locked' ? 'text-muted-foreground' : 'text-muted-foreground'
                  }`}>
                    {stage.description}
                  </p>
                  
                  {showRequirements && stage.status === 'current' && stage.requirements && (
                    <ul className="mt-2 space-y-1">
                      {stage.requirements.map((req, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                          <ArrowRight className="w-3 h-3 text-info" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {stage.completedAt && (
                    <p className="text-xs text-success mt-1">
                      Completed: {stage.completedAt}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {data.estimatedReadiness && (
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Est. readiness</span>
              <span className="font-semibold text-[var(--primary-04)]">{data.estimatedReadiness}</span>
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  // Horizontal variant (default)
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card rounded-2xl p-6 shadow-sm border border-border ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[var(--primary-04)]" />
          <h3 className="text-lg font-semibold text-foreground">Approval Readiness</h3>
        </div>
        {data.estimatedReadiness && (
          <span className="text-sm text-success font-medium bg-success/10 px-3 py-1 rounded-full">
            {data.estimatedReadiness}
          </span>
        )}
      </div>

      {/* Horizontal progress */}
      <div className="flex items-center justify-between relative mb-8">
        {/* Progress line background */}
        <div className="absolute top-5 left-5 right-5 h-1 bg-accent rounded-full" />
        {/* Progress line filled */}
        <div 
          className="absolute top-5 left-5 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-200"
          style={{ width: `${(data.currentStage / (stages.length - 1)) * 100}%` }}
        />
        
        {stages.map((stage, index) => (
          <div key={stage.id} className="flex flex-col items-center z-10">
            {getStageIcon(stage.status, index)}
            <span className={`text-sm font-medium mt-2 ${
              stage.status === 'locked' ? 'text-muted-foreground' : 'text-foreground'
            }`}>
              {stage.name}
            </span>
          </div>
        ))}
      </div>

      {/* Current stage details */}
      {stages[data.currentStage] && (
        <div className="bg-info/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-info rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-info">Current Stage</span>
          </div>
          <h4 className="font-semibold text-foreground mb-1">{stages[data.currentStage].name}</h4>
          <p className="text-sm text-muted-foreground mb-3">{stages[data.currentStage].description}</p>
          
          {showRequirements && stages[data.currentStage].requirements && (
            <div className="space-y-1">
              {stages[data.currentStage].requirements?.map((req, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                  <ArrowRight className="w-4 h-4 text-info" />
                  {req}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {data.nextUnlock && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">Next unlock</span>
          <span className="font-semibold text-foreground">{data.nextUnlock}</span>
        </div>
      )}
    </motion.div>
  );
};

export default CreditJourneyWidget;
