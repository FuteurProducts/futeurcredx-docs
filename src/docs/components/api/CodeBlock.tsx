import { useEffect, useMemo, useState } from 'react';

import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-python';

import { cn } from '@/lib/utils';

import { CopyButton } from '@/docs/components/shared/CopyButton';

interface CodeBlockProps {
  code: string | Record<string, string>;
  language?: string;
  showLineNumbers?: boolean;
  title?: string;
  className?: string;
}

const languageLabels: Record<string, string> = {
  curl: 'cURL',
  python: 'Python',
  node: 'Node.js',
  javascript: 'Node.js',
  go: 'Go',
  json: 'JSON',
  bash: 'Bash',
};

const languageToPrism: Record<string, string> = {
  curl: 'bash',
  node: 'javascript',
  python: 'python',
  go: 'go',
  json: 'json',
  bash: 'bash',
  javascript: 'javascript',
};

function highlightCode(source: string, lang: string): string {
  const prismLang = languageToPrism[lang] ?? lang;
  const grammar = Prism.languages[prismLang];
  if (!grammar) {
    return Prism.util.encode(source) as string;
  }
  return Prism.highlight(source, grammar, prismLang);
}

export function CodeBlock({
  code,
  language = 'bash',
  showLineNumbers = false,
  title,
  className,
}: CodeBlockProps) {
  const isMultiLang = typeof code === 'object';
  const tabs = useMemo(
    () => (isMultiLang ? Object.keys(code) : []),
    [code, isMultiLang],
  );
  const [activeTab, setActiveTab] = useState<string>(
    isMultiLang ? tabs[0] : language,
  );

  useEffect(() => {
    if (isMultiLang && tabs.length > 0 && !tabs.includes(activeTab)) {
      setActiveTab(tabs[0]);
    }
  }, [isMultiLang, tabs, activeTab]);

  const currentCode = isMultiLang
    ? (code as Record<string, string>)[activeTab] ?? ''
    : (code as string);

  const currentLang = isMultiLang ? activeTab : language;
  const highlighted = highlightCode(currentCode, currentLang);

  const lines = currentCode.split('\n');

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-gray-800 bg-gray-900',
        className,
      )}
    >
      {/* Header with tabs or title */}
      {(isMultiLang || title) && (
        <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900/80">
          <div className="flex items-center">
            {title && !isMultiLang && (
              <span className="px-4 py-2.5 text-xs font-medium text-gray-400">
                {title}
              </span>
            )}
            {isMultiLang &&
              tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'px-4 py-2.5 text-xs font-medium transition-all duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50',
                    activeTab === tab
                      ? 'border-b-2 border-blue-500 text-white'
                      : 'text-gray-500 hover:text-gray-300',
                  )}
                >
                  {languageLabels[tab] ?? tab}
                </button>
              ))}
          </div>
          <div className="pr-2">
            <CopyButton text={currentCode} />
          </div>
        </div>
      )}

      {/* Code content */}
      <div className="relative">
        {!isMultiLang && !title && (
          <div className="absolute right-2 top-2 z-10">
            <CopyButton text={currentCode} />
          </div>
        )}
        <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
          {showLineNumbers ? (
            <code>
              {lines.map((line, i) => (
                <div key={i} className="flex">
                  <span className="mr-4 inline-block w-8 select-none text-right text-gray-600">
                    {i + 1}
                  </span>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: highlightCode(line, currentLang),
                    }}
                  />
                </div>
              ))}
            </code>
          ) : (
            <code
              className={`language-${languageToPrism[currentLang] ?? currentLang}`}
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          )}
        </pre>
      </div>
    </div>
  );
}
