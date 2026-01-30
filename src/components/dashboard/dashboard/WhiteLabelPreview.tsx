import { useState } from 'react';
import { Palette, Eye, Upload, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function WhiteLabelPreview() {
  const [brandColor, setBrandColor] = useState('#3b82f6');
  const [bankName, setBankName] = useState('Your Bank');

  return (
    <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
      <Card className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Palette className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">White-Label Preview</h2>
            <p className="text-sm text-muted-foreground">Customize branding for your bank</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Customization Controls */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bank-name">Bank Name</Label>
              <Input
                id="bank-name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Your Bank Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand-color">Primary Brand Color</Label>
              <div className="flex gap-2">
                <Input
                  id="brand-color"
                  type="color"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  placeholder="#3b82f6"
                  className="font-code"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Logo Upload</Label>
              <Button variant="outline" className="w-full gap-2">
                <Upload className="w-4 h-4" />
                Upload Logo
              </Button>
            </div>

            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Branding Consistency</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your brand colors and logo will be applied across all SMB-facing credit interfaces.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-medium">Live Preview</p>
            </div>
            
            <div
              key={`${brandColor}-${bankName}`}
              className="border border-white/10 rounded-lg overflow-hidden animate-fade-in"
            >
              {/* Mock app preview */}
              <div className="bg-background/80 p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white"
                    style={{ backgroundColor: brandColor }}
                  >
                    {bankName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{bankName}</p>
                    <p className="text-xs text-muted-foreground">Business Credit Dashboard</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Business Credit Score</p>
                  <div 
                    className="px-3 py-1 rounded-full text-white text-sm font-bold"
                    style={{ backgroundColor: brandColor }}
                  >
                    720
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="h-2 bg-background/50 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ backgroundColor: brandColor, width: '72%' }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Good standing</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3">
                  <div className="p-3 bg-background/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Available Credit</p>
                    <p className="text-sm font-bold">$125K</p>
                  </div>
                  <div className="p-3 bg-background/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Utilization</p>
                    <p className="text-sm font-bold">42.5%</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              ↑ This is how SMB customers will see your branded interface
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
