import { Button } from '@/components/ui/button';
import { docsContent, ContentBlock, CardProps } from '@/data/docs-data';
import { ArrowUpRight, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DocsAccordion } from './DocsAccordion';

const Card = ({ href, Icon, title, description, onClick }: CardProps & { onClick: (href: string) => void }) => (
  <div 
    onClick={() => onClick(href)} 
    className="group block p-6 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors cursor-pointer"
  >
    <div className="flex justify-between items-start">
      <Icon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
      <ArrowUpRight className="h-5 w-5 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
    </div>
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  </div>
);

type ContentRendererProps = {
  section: string;
  setActiveSection: (section: 'introduction' | 'dashboard' | 'launch-checklist' | 'sdk-web' | 'quickstart') => void;
};

export const ContentRenderer = ({ section, setActiveSection }: ContentRendererProps) => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const content = docsContent[section] || [];

  const handleCardClick = (href: string) => {
    if (href.startsWith('/')) {
      navigate(href);
    } else {
      setActiveSection(href as 'introduction' | 'dashboard' | 'launch-checklist' | 'sdk-web' | 'quickstart');
    }
  };

  const handleCopy = () => {
    const textToCopy = content
      .map(block => {
        if (block.type === 'heading') return block.title;
        if (block.type === 'paragraph') return block.text;
        return '';
      })
      .filter(Boolean)
      .join('\n\n');

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      {content.map((block, index) => {
        switch (block.type) {
          case 'heading':
            return (
              <div key={index} className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">{block.title}</h1>
                {block.withCopy && (
                  <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2 bg-transparent text-gray-600 border-gray-300 hover:bg-gray-100 dark:text-white dark:border-gray-600 dark:hover:bg-gray-800 dark:hover:text-white">
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied!' : 'Copy page'}
                  </Button>
                )}
              </div>
            );
          case 'image':
            return (
              <div key={index} className="my-8 max-w-4xl mx-auto">
                <img src={block.src} alt={block.alt} className="w-full rounded-lg shadow-lg" />
              </div>
            );
          case 'paragraph':
            return (
              <p key={index} className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                {block.text}
              </p>
            );
          case 'link':
            return (
              <div key={index} className="prose dark:prose-invert max-w-none">
                <a href={block.href} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {block.text}
                </a>
              </div>
            );
          case 'cardGrid':
            return (
              <div key={index} className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                {block.cards.map((card, cardIndex) => (
                  <Card key={cardIndex} {...card} onClick={handleCardClick} />
                ))}
              </div>
            );
          case 'accordion':
            return <DocsAccordion key={index} items={block.items} />;
          default:
            return null;
        }
      })}
    </>
  );
};
