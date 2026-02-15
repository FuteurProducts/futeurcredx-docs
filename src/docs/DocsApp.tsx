import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DocsProvider } from '@/docs/contexts/DocsContext'

// Lazy-load the layout and all pages
const DocsLayout = lazy(() => import('@/docs/components/layout/DocsLayout'))
const Home = lazy(() => import('@/docs/pages/Home'))
const Quickstart = lazy(() => import('@/docs/pages/Quickstart'))
const Authentication = lazy(() => import('@/docs/pages/Authentication'))
const ApiReference = lazy(() => import('@/docs/pages/ApiReference'))
const Sandbox = lazy(() => import('@/docs/pages/Sandbox'))
const Errors = lazy(() => import('@/docs/pages/Errors'))
const DataModels = lazy(() => import('@/docs/pages/DataModels'))
const Webhooks = lazy(() => import('@/docs/pages/Webhooks'))
const Changelog = lazy(() => import('@/docs/pages/Changelog'))
const FAQ = lazy(() => import('@/docs/pages/FAQ'))

function DocsLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent mx-auto" />
        <p className="mt-3 text-sm text-gray-400">Loading docs...</p>
      </div>
    </div>
  )
}

export default function DocsApp() {
  return (
    <DocsProvider>
      <BrowserRouter>
        <Suspense fallback={<DocsLoadingFallback />}>
          <Routes>
            <Route element={<DocsLayout />}>
              <Route index element={<Home />} />
              <Route path="quickstart" element={<Quickstart />} />
              <Route path="authentication" element={<Authentication />} />
              <Route path="api-reference" element={<ApiReference />} />
              <Route path="api-reference/:tag" element={<ApiReference />} />
              <Route path="sandbox" element={<Sandbox />} />
              <Route path="errors" element={<Errors />} />
              <Route path="data-models" element={<DataModels />} />
              <Route path="webhooks" element={<Webhooks />} />
              <Route path="changelog" element={<Changelog />} />
              <Route path="faq" element={<FAQ />} />

              {/* Legacy/expected redirects */}
              <Route path="api-docs" element={<Navigate to="/api-reference" replace />} />
              <Route path="docs" element={<Navigate to="/" replace />} />
              <Route path="api" element={<Navigate to="/api-reference" replace />} />
              <Route path="getting-started" element={<Navigate to="/quickstart" replace />} />
              <Route path="reference" element={<Navigate to="/api-reference" replace />} />

              {/* Catch-all → home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </DocsProvider>
  )
}
