import { useState } from 'react';
import ApiReference from './API_Reference';
import DocsHeader from './DocsHeader';

export default function ApiReferencePage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      <DocsHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <ApiReference />
    </div>
  );
}
