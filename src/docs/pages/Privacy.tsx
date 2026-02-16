/**
 * Privacy Policy Page
 * Substantive privacy policy for FuteurCredX / LumiqAI platform
 */

export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl py-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
        <p className="mt-2 text-sm text-gray-400">
          Last updated: February 16, 2026 | Effective: February 16, 2026
        </p>
      </header>

      <section className="space-y-4 text-sm leading-relaxed text-gray-300">
        <p>
          FuteurCredX Inc. ("FuteurCredX," "we," "us," or "our") operates the LumiqAI platform
          and related services. This Privacy Policy describes how we collect, use, disclose, and
          protect information when you use our platform, APIs, documentation site, and related
          services (collectively, the "Services").
        </p>

        <h2 className="text-xl font-semibold text-white pt-4">1. Information We Collect</h2>

        <h3 className="text-base font-medium text-white">1.1 Information You Provide</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Account registration details (name, email address, organization name)</li>
          <li>Authentication credentials managed through our identity provider (Clerk)</li>
          <li>Business data you submit through our APIs (business entity details, financial data)</li>
          <li>Communications you send to us (support requests, feedback)</li>
          <li>Payment and billing information for paid plans</li>
        </ul>

        <h3 className="text-base font-medium text-white">1.2 Information Collected Automatically</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>API usage data (request counts, endpoints accessed, response times)</li>
          <li>Log data (IP addresses, browser type, access times, pages viewed)</li>
          <li>Device information (operating system, device type)</li>
          <li>Cookies and similar tracking technologies for session management</li>
        </ul>

        <h3 className="text-base font-medium text-white">1.3 Business Data Processed on Behalf of Clients</h3>
        <p>
          When financial institutions use our platform, they may submit business entity data,
          credit information, and financial records through our APIs. We process this data solely
          as a data processor on behalf of the financial institution (data controller) and in
          accordance with our data processing agreements.
        </p>

        <h2 className="text-xl font-semibold text-white pt-4">2. How We Use Information</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>To provide, maintain, and improve our Services</li>
          <li>To authenticate users and manage access to tenant-scoped data</li>
          <li>To process API requests and deliver analytics results</li>
          <li>To monitor system performance and ensure service reliability</li>
          <li>To generate audit logs for compliance and security purposes</li>
          <li>To communicate with you about service updates, security notices, and support</li>
          <li>To comply with legal obligations and enforce our terms</li>
        </ul>

        <h2 className="text-xl font-semibold text-white pt-4">3. Data Retention</h2>
        <p>We retain different categories of data for different periods:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong className="text-white">Account data:</strong> Retained for the duration of your account, plus 30 days after deletion request</li>
          <li><strong className="text-white">Business entity data:</strong> Retained per the data processing agreement with the financial institution, typically up to 7 years for regulatory compliance</li>
          <li><strong className="text-white">Audit logs:</strong> Retained for 7 years to meet financial regulatory requirements</li>
          <li><strong className="text-white">API request logs:</strong> Retained for 90 days for operational monitoring</li>
          <li><strong className="text-white">Session data:</strong> Retained for 30 days for security analysis</li>
        </ul>

        <h2 className="text-xl font-semibold text-white pt-4">4. Data Sharing and Disclosure</h2>
        <p>We do not sell personal information. We may share information in the following circumstances:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong className="text-white">Service providers:</strong> Cloud infrastructure providers (AWS), authentication providers (Clerk), and other vendors who process data on our behalf under contractual data protection obligations</li>
          <li><strong className="text-white">Financial institution clients:</strong> We provide analytics and reports derived from data that the institution submitted to us</li>
          <li><strong className="text-white">Legal requirements:</strong> When required by law, subpoena, court order, or governmental regulation</li>
          <li><strong className="text-white">Business transfers:</strong> In connection with a merger, acquisition, or sale of assets, with notice to affected users</li>
        </ul>

        <h2 className="text-xl font-semibold text-white pt-4">5. Data Security</h2>
        <p>We implement technical and organizational measures to protect your data:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>AES-256 encryption for data at rest</li>
          <li>TLS 1.3 encryption for data in transit</li>
          <li>Multi-tenant database isolation with row-level security policies</li>
          <li>Role-based access controls with audit logging</li>
          <li>API key scoping and rate limiting</li>
          <li>Regular security assessments (SOC 2 Type II compliance roadmap is active)</li>
        </ul>

        <h2 className="text-xl font-semibold text-white pt-4">6. Your Rights</h2>

        <h3 className="text-base font-medium text-white">6.1 General Rights</h3>
        <p>You may request to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Access the personal data we hold about you</li>
          <li>Correct inaccurate personal data</li>
          <li>Delete your personal data (subject to legal retention requirements)</li>
          <li>Export your data in a machine-readable format</li>
          <li>Object to or restrict certain processing activities</li>
        </ul>

        <h3 className="text-base font-medium text-white">6.2 CCPA Rights (California Residents)</h3>
        <p>
          If you are a California resident, you have the right to know what personal information
          we collect, request deletion of your personal information, and opt out of the sale of
          personal information. We do not sell personal information. To exercise these rights,
          contact us at the address below.
        </p>

        <h3 className="text-base font-medium text-white">6.3 GDPR Rights (EEA Residents)</h3>
        <p>
          If you are located in the European Economic Area, you have rights under the General
          Data Protection Regulation including the right to access, rectification, erasure,
          restriction of processing, data portability, and the right to object. Our legal basis
          for processing is typically contractual necessity or legitimate interest. To exercise
          these rights, contact us at the address below.
        </p>

        <h2 className="text-xl font-semibold text-white pt-4">7. Cookies</h2>
        <p>
          We use essential cookies for authentication and session management. We do not use
          third-party advertising cookies. Analytics cookies, if used, are for understanding
          aggregate usage patterns to improve the service.
        </p>

        <h2 className="text-xl font-semibold text-white pt-4">8. Children</h2>
        <p>
          Our Services are not directed to individuals under 18. We do not knowingly collect
          personal information from children.
        </p>

        <h2 className="text-xl font-semibold text-white pt-4">9. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of material
          changes by posting the updated policy on this page with a revised "Last updated" date
          and, for significant changes, by email to registered account holders.
        </p>

        <h2 className="text-xl font-semibold text-white pt-4">10. Contact Us</h2>
        <p>
          For privacy-related inquiries or to exercise your data rights:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Email: <a href="mailto:security@futeurcredx.com" className="text-blue-400 hover:underline">security@futeurcredx.com</a></li>
          <li>Company: FuteurCredX Inc.</li>
        </ul>
        <p className="text-xs text-gray-500 pt-4">
          This privacy policy is provided as a substantive framework. It has not yet been
          reviewed by legal counsel. Contact security@futeurcredx.com for the latest version.
        </p>
      </section>
    </div>
  );
}
