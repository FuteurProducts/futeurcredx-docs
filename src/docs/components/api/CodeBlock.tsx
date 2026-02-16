import { useEffect, useMemo, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import { CopyButton } from '@/docs/components/shared/CopyButton';

// ---------------------------------------------------------------------------
// PrismJS loader — dynamic imports to work around rolldown-vite CJS interop.
//
// PrismJS is CJS. Its language plugins use `(function(Prism){…})(Prism)` IIFEs
// that expect a scope-level `Prism` variable. Rolldown may split PrismJS core
// and plugins into different chunks, breaking this reference. Loading everything
// dynamically and setting `window.Prism` before plugin evaluation fixes it.
// ---------------------------------------------------------------------------

interface PrismLib {
  languages: Record<string, unknown>;
  highlight: (code: string, grammar: unknown, language: string) => string;
  util: { encode: (text: string) => string | string[] };
}

let _prism: PrismLib | null = null;
let _loadPromise: Promise<PrismLib> | null = null;

function loadPrism(): Promise<PrismLib> {
  if (_prism) return Promise.resolve(_prism);
  if (_loadPromise) return _loadPromise;

  _loadPromise = (async () => {
    const mod = await import('prismjs');
    const Prism = ((mod as Record<string, unknown>)['default'] ?? mod) as PrismLib;

    // Expose globally so language plugins can find it via their IIFEs
    (globalThis as Record<string, unknown>)['Prism'] = Prism;

    // Load language plugins — must happen AFTER global is set.
    // @ts-expect-error — CJS side-effect modules have no type declarations
    await import('prismjs/components/prism-bash');
    // @ts-expect-error — CJS side-effect module
    await import('prismjs/components/prism-go');
    // @ts-expect-error — CJS side-effect module
    await import('prismjs/components/prism-javascript');
    // @ts-expect-error — CJS side-effect module
    await import('prismjs/components/prism-json');
    // @ts-expect-error — CJS side-effect module
    await import('prismjs/components/prism-python');

    _prism = Prism;
    return Prism;
  })();

  return _loadPromise;
}

// Start loading immediately when this module is first imported
loadPrism();

// ---------------------------------------------------------------------------
// CodeBlock component
// ---------------------------------------------------------------------------

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

function highlightCode(prism: PrismLib | null, source: string, lang: string): string {
  if (!prism) return escapeHtml(source);
  const prismLang = languageToPrism[lang] ?? lang;
  const grammar = prism.languages[prismLang];
  if (!grammar) {
    return prism.util.encode(source) as string;
  }
  return prism.highlight(source, grammar, prismLang);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
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
  const [prism, setPrism] = useState<PrismLib | null>(_prism);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    if (!prism) {
      loadPrism().then((p) => {
        if (mountedRef.current) setPrism(p);
      });
    }
    return () => { mountedRef.current = false; };
  }, [prism]);

  useEffect(() => {
    if (isMultiLang && tabs.length > 0 && !tabs.includes(activeTab)) {
      setActiveTab(tabs[0]);
    }
  }, [isMultiLang, tabs, activeTab]);

  const currentCode = isMultiLang
    ? (code as Record<string, string>)[activeTab] ?? ''
    : (code as string);

  const currentLang = isMultiLang ? activeTab : language;
  const highlighted = highlightCode(prism, currentCode, currentLang);

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
                      __html: highlightCode(prism, line, currentLang),
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
