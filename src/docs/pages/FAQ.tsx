import { useCallback, useMemo, useState } from 'react';

import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown, Search } from 'lucide-react';

import { cn } from '@/lib/utils';

import { type FaqCategory, faqItems } from '@/docs/data/faq';

const categoryEntries: { label: string; value: 'all' | FaqCategory }[] = [
  { label: 'All', value: 'all' },
  { label: 'Getting Started', value: 'getting-started' },
  { label: 'Authentication', value: 'authentication' },
  { label: 'Data', value: 'data' },
  { label: 'Technical', value: 'technical' },
  { label: 'Billing', value: 'billing' },
];

type CategoryValue = 'all' | FaqCategory;

export default function FAQ() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryValue>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [],
  );

  const filteredFaqs = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return faqItems.filter((faq) => {
      const matchesCategory =
        selectedCategory === 'all' || faq.category === selectedCategory;

      if (!query) return matchesCategory;

      const matchesSearch =
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const faqItemsByCategory = useMemo(() => {
    if (selectedCategory !== 'all') {
      return { [selectedCategory]: filteredFaqs };
    }

    const grouped: Record<string, typeof filteredFaqs> = {};
    for (const faq of filteredFaqs) {
      const cat = faq.category;
      if (!grouped[cat]) {
        grouped[cat] = [];
      }
      grouped[cat].push(faq);
    }
    return grouped;
  }, [filteredFaqs, selectedCategory]);

  return (
    <div className="mx-auto max-w-4xl space-y-10 py-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Frequently Asked Questions
        </h1>
        <p className="mt-2 text-lg text-gray-400">
          Find answers to common questions about the LumiqAI platform.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search questions..."
          className={cn(
            'h-12 w-full rounded-xl border border-gray-800 bg-gray-900/50 pl-11 pr-4',
            'text-sm text-gray-200 placeholder-gray-600',
            'transition-all duration-200',
            'focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
          )}
        />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="FAQ categories">
        {categoryEntries.map(({ label, value }) => {
          const isActive = value === selectedCategory;
          const count =
            value === 'all'
              ? faqItems.filter((f) => {
                  const query = searchQuery.toLowerCase().trim();
                  if (!query) return true;
                  return (
                    f.question.toLowerCase().includes(query) ||
                    f.answer.toLowerCase().includes(query)
                  );
                }).length
              : faqItems.filter((f) => {
                  const matchesCat = f.category === value;
                  const query = searchQuery.toLowerCase().trim();
                  if (!query) return matchesCat;
                  return (
                    matchesCat &&
                    (f.question.toLowerCase().includes(query) ||
                      f.answer.toLowerCase().includes(query))
                  );
                }).length;

          return (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setSelectedCategory(value)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium',
                'transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                isActive
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : 'border border-gray-800 bg-gray-900/50 text-gray-400 hover:border-gray-700 hover:text-gray-300',
              )}
            >
              {label}
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-xs',
                  isActive ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-800 text-gray-600',
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* FAQ Accordion */}
      {filteredFaqs.length > 0 ? (
        <div className="space-y-8">
          {Object.entries(faqItemsByCategory).map(([category, items]) => (
            <section key={category}>
              {selectedCategory === 'all' && (
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
                  {category}
                </h2>
              )}

              <Accordion.Root type="multiple" className="space-y-2">
                {items.map((faq) => (
                  <Accordion.Item
                    key={faq.id}
                    value={faq.id}
                    className={cn(
                      'overflow-hidden rounded-xl border border-gray-800 bg-gray-900/30',
                      'transition-all duration-200',
                      'data-[state=open]:border-gray-700 data-[state=open]:bg-gray-900/50',
                    )}
                  >
                    <Accordion.Header asChild>
                      <h3>
                        <Accordion.Trigger
                          className={cn(
                            'flex w-full items-center gap-3 px-5 py-4 text-left',
                            'text-sm font-medium text-gray-200',
                            'transition-all duration-200',
                            'hover:bg-gray-800/30',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500',
                            '[&[data-state=open]>svg]:rotate-180',
                          )}
                        >
                          <span className="min-w-0 flex-1">{faq.question}</span>
                          <ChevronDown className="h-4 w-4 flex-shrink-0 text-gray-500 transition-transform duration-200" />
                        </Accordion.Trigger>
                      </h3>
                    </Accordion.Header>
                    <Accordion.Content
                      className={cn(
                        'overflow-hidden',
                        'data-[state=open]:animate-accordion-down',
                        'data-[state=closed]:animate-accordion-up',
                      )}
                    >
                      <div className="border-t border-gray-800/50 px-5 py-4">
                        <p className="text-sm leading-relaxed text-gray-400 whitespace-pre-line">
                          {faq.answer}
                        </p>
                      </div>
                    </Accordion.Content>
                  </Accordion.Item>
                ))}
              </Accordion.Root>
            </section>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-12 text-center">
          <Search className="mx-auto mb-4 h-8 w-8 text-gray-600" />
          <p className="text-gray-400">
            No questions match your search
            {selectedCategory !== 'all' ? ` in "${categoryEntries.find(c => c.value === selectedCategory)?.label ?? selectedCategory}"` : ''}.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-3 text-sm text-blue-400 transition-colors duration-200 hover:text-blue-300"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
