import { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export function ROICalculator() {
  const [smbCustomers, setSmbCustomers] = useState(10000);
  const [avgRevenue, setAvgRevenue] = useState(5000);
  
  const creditActivationRate = 0.74; // 74%
  const conversionLift = 0.17; // 17%
  const revenuePerApproval = 8900;
  
  const activeCustomers = Math.round(smbCustomers * creditActivationRate);
  const projectedApprovals = Math.round(activeCustomers * conversionLift);
  const projectedRevenue = projectedApprovals * revenuePerApproval;
  const roiPercentage = ((projectedRevenue / (smbCustomers * avgRevenue)) * 100).toFixed(1);

  return (
    <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
      <Card className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Calculator className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">ROI Calculator</h2>
            <p className="text-sm text-muted-foreground">Project revenue uplift from credit visibility</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="smb-customers">Total SMB Customers</Label>
              <Input
                id="smb-customers"
                type="number"
                value={smbCustomers}
                onChange={(e) => setSmbCustomers(parseInt(e.target.value) || 0)}
                className="font-code"
              />
              <Slider
                value={[smbCustomers]}
                onValueChange={(v) => setSmbCustomers(v[0])}
                min={1000}
                max={100000}
                step={1000}
                className="mt-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avg-revenue">Avg Annual Revenue per Customer</Label>
              <Input
                id="avg-revenue"
                type="number"
                value={avgRevenue}
                onChange={(e) => setAvgRevenue(parseInt(e.target.value) || 0)}
                className="font-code"
              />
              <Slider
                value={[avgRevenue]}
                onValueChange={(v) => setAvgRevenue(v[0])}
                min={1000}
                max={20000}
                step={500}
                className="mt-2"
              />
            </div>

            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-xs text-muted-foreground mb-2">Based on Industry Benchmarks:</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Credit Activation Rate:</span>
                  <span className="font-bold">{(creditActivationRate * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Conversion Lift:</span>
                  <span className="font-bold text-success">+{(conversionLift * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div className="p-4 glass-card rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-primary" />
                <p className="text-xs text-muted-foreground">Credit-Active Customers</p>
              </div>
              <p className="text-3xl font-bold count-up">{activeCustomers.toLocaleString()}</p>
            </div>

            <div className="p-4 glass-card rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <p className="text-xs text-muted-foreground">Projected Approvals</p>
              </div>
              <p className="text-3xl font-bold text-success count-up">
                {projectedApprovals.toLocaleString()}
              </p>
            </div>

            <div className="p-4 glass-card rounded-lg border-2 border-primary/30">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-primary" />
                <p className="text-xs text-muted-foreground">Projected Annual Revenue</p>
              </div>
              <p className="text-3xl font-bold text-primary count-up">
                ${(projectedRevenue / 1000000).toFixed(2)}M
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                ROI: <span className="text-success font-bold">{roiPercentage}%</span> increase
              </p>
            </div>

            <div className="p-3 bg-success/10 rounded-lg border border-success/20">
              <p className="text-xs text-success font-medium">
                ✓ Based on Capital One CreditWise® and Chase Credit Journey® success metrics
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
