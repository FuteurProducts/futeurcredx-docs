import { Badge } from '@/components/ui/badge';

const changelogData = [
  {
    date: 'August 20, 2025',
    category: 'API Product Update',
    title: 'Lumiq API Launched',
    description: 'We are excited to announce the official launch of the Lumiq API, our powerful new platform for accessing comprehensive business credit data. This initial release includes access to the full Experian credit report, FSR Score, and Intelliscore Plus. Developers can now sign up, generate API keys, and start building with our robust financial data solutions.',
  },
];

export default function ChangelogPage() {
  // Add safety check for data
  if (!changelogData || changelogData.length === 0) {
    return (
      <div className="max-w-7xl mx-auto min-h-screen">
        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Changelog</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">Stay up to date with the latest product updates and improvements.</p>
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No changelog entries available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto min-h-screen">
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Changelog</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">Stay up to date with the latest product updates and improvements.</p>

        <div className="space-y-16">
          {changelogData.map((entry, index) => (
            <div key={index} className="grid md:grid-cols-[200px_1fr] gap-8 items-start">
              {/* Date and Category */}
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p className="font-medium">{entry.date || 'Date not available'}</p>
                <Badge variant="outline" className="mt-2 text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-500/50 font-medium">
                  {entry.category || 'Uncategorized'}
                </Badge>
              </div>

              {/* Title and Description */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  {entry.title || 'Untitled Entry'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {entry.description || 'No description available.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

