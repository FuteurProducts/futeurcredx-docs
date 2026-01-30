import { FileText, Download, Mail, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function ExecutiveSummary() {
  const handleExport = (format: string) => {
    console.log(`Exporting as ${format}`);
    // In production, this would trigger actual export
  };

  return (
    <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
      <Card className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Executive Summary Export</h2>
              <p className="text-sm text-muted-foreground">Generate C-suite ready reports</p>
            </div>
          </div>
          <Badge variant="outline">Updated 2 mins ago</Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 glass rounded-lg border border-white/10 hover:border-primary/50 transition-colors cursor-pointer animate-fade-in"
            style={{ animationDelay: '500ms' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-primary" />
              <p className="font-semibold text-sm">PDF Report</p>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Comprehensive metrics with charts and insights
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full gap-2"
              onClick={() => handleExport('pdf')}
            >
              <Download className="w-3 h-3" />
              Export PDF
            </Button>
          </div>

          <div className="p-4 glass rounded-lg border border-white/10 hover:border-primary/50 transition-colors cursor-pointer animate-fade-in"
            style={{ animationDelay: '600ms' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-success" />
              <p className="font-semibold text-sm">Excel Workbook</p>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Raw data with pivot tables for analysis
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full gap-2"
              onClick={() => handleExport('excel')}
            >
              <Download className="w-3 h-3" />
              Export Excel
            </Button>
          </div>

          <div className="p-4 glass rounded-lg border border-white/10 hover:border-primary/50 transition-colors cursor-pointer animate-fade-in"
            style={{ animationDelay: '700ms' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-purple-500" />
              <p className="font-semibold text-sm">PowerPoint Deck</p>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Presentation-ready slides with visuals
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full gap-2"
              onClick={() => handleExport('powerpoint')}
            >
              <Download className="w-3 h-3" />
              Export PPTX
            </Button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-background/30 rounded-lg border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium">Scheduled Reports</p>
            <Badge variant="default" className="text-xs">Active</Badge>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium">Weekly Summary</p>
                <p className="text-xs text-muted-foreground">Every Monday, 9:00 AM</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium">Monthly Report</p>
                <p className="text-xs text-muted-foreground">1st of month, 8:00 AM</p>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full mt-3">
            Configure Schedule
          </Button>
        </div>
      </Card>
    </div>
  );
}
