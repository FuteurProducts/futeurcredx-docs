import { Code, Book, Download, ExternalLink, Sparkles, Terminal } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const sdks = [
  { name: 'Node.js SDK', version: 'v2.4.1', downloads: '12.5K', icon: '🟢' },
  { name: 'Python SDK', version: 'v2.3.8', downloads: '9.2K', icon: '🐍' },
  { name: 'Java SDK', version: 'v2.4.0', downloads: '8.1K', icon: '☕' },
  { name: 'C# SDK', version: 'v2.3.5', downloads: '5.4K', icon: '💜' },
];

const quickLinks = [
  { title: 'API Reference', desc: 'Complete endpoint documentation', icon: Book, url: 'https://docs.futeurcredx.com/' },
  { title: 'Quickstart Guide', desc: 'Get started in 5 minutes', icon: Sparkles, url: 'https://docs.futeurcredx.com/' },
  { title: 'Code Examples', desc: 'Production-ready samples', icon: Code, url: 'https://docs.futeurcredx.com/' },
  { title: 'Changelog', desc: 'Latest updates & features', icon: Terminal, url: 'https://docs.futeurcredx.com/' },
];

export function DeveloperHub() {
  return (
    <div className="space-y-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Code className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Developer Experience Hub</h2>
          <p className="text-sm text-muted-foreground">Everything you need to integrate</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* SDK Downloads */}
        <Card className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Download className="w-4 h-4" />
            <h3 className="font-semibold">SDK Downloads</h3>
          </div>
          <div className="space-y-3">
            {sdks.map((sdk, i) => (
              <div
                key={sdk.name}
                className="flex items-center justify-between p-3 bg-background/30 rounded-lg hover:bg-background/50 transition-colors cursor-pointer animate-fade-in"
                style={{ animationDelay: `${500 + i * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{sdk.icon}</span>
                  <div>
                    <p className="font-medium text-sm">{sdk.name}</p>
                    <p className="text-xs text-muted-foreground">{sdk.version}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Downloads</p>
                  <p className="text-sm font-semibold">{sdk.downloads}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Links */}
        <Card className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Book className="w-4 h-4" />
            <h3 className="font-semibold">Quick Links</h3>
          </div>
          <div className="space-y-2">
            {quickLinks.map((link, i) => (
              <a
                key={link.title}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-background/30 rounded-lg hover:bg-background/50 hover:border-primary/50 border border-transparent transition-all group animate-fade-in"
                style={{ animationDelay: `${600 + i * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <link.icon className="w-4 h-4 text-primary" />
                  <div>
                    <p className="font-medium text-sm">{link.title}</p>
                    <p className="text-xs text-muted-foreground">{link.desc}</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>
        </Card>
      </div>

      {/* API Version Info */}
      <Card className="glass-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Current API Version</p>
            <p className="text-xs text-muted-foreground">Lumiq Credit Journey API</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="default" className="font-code">v2.1.0</Badge>
            <Badge variant="outline">Stable</Badge>
            <Button size="sm" variant="outline" className="font-code">
              <Terminal className="w-3 h-3 mr-2" />
              View Changelog
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
