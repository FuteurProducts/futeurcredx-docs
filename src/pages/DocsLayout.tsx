import { useState } from 'react';
import DocsHeader from '@/components/DocsHeader';
import DocsPage from '@/pages/Docs';
import Footer from '@/pages/Footer';

export default function DocsLayout() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <DocsHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="pt-16">
        <DocsPage searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
      <Footer />
    </>
  );
}
