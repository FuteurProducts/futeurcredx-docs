import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import DocsHeader from '@/pages/Documentation/DocsHeader';
import DocsPage from '@/pages/Documentation/Docs';
import ApiReferencePage from '@/pages/Documentation/ApiReferencePage';
import ChangelogPage from './Changelog';
import CleanFooter from '@/pages/Documentation/CleanFooter';

export default function DocsLayout() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <DocsHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="pt-32 bg-white dark:bg-[#0d0d0f]">
        <Routes>
          <Route path="/" element={<DocsPage searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
          <Route path="/api-reference" element={<ApiReferencePage />} />
          <Route path="/changelog" element={<ChangelogPage />} />
        </Routes>
      </div>
      <CleanFooter />
    </>
  );
}
