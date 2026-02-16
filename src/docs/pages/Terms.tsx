/**
 * Terms of Service Page
 * Substantive terms of service for FuteurCredX / LumiqAI platform
 */

export default function Terms() {
  return (
    <div className="mx-auto max-w-3xl py-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
        <p className="mt-2 text-sm text-gray-400">
          Last updated: February 16, 2026 | Effective: February 16, 2026
        </p>
      </header>

      <section className="space-y-4 text-sm leading-relaxed text-gray-300">
        <p>
          These Terms of Service ("Terms") govern your access to and use of the LumiqAI platform,
          APIs, documentation, and related services (collectively, the "Services") provided by
          FuteurCredX Inc. ("FuteurCredX," "we," "us," or "our"). By accessing or using the
          Services, you agree to be bound by these Terms.
        </p>

        <h2 className="text-xl font-semibold text-white pt-4">1. Service Description</h2>
        <p>
          LumiqAI is a B2B credit analytics platform designed for financial institutions. The
          Services include:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>A dashboard for portfolio analytics, credit intelligence, and risk monitoring</li>
          <li>RESTful APIs for programmatic access to credit scoring, business entity data, and analytics</li>
          <li>A sandbox environment for development and testing</li>
          <li>Developer documentation and integration support</li>
        </ul>
        <p>
          LumiqAI provides decision-support signals only. The platform does not replace bureau
          credit scores, credit committee judgment, or issue lending decisions. All outputs are
          informational and intended to support, not automate, credit decisions.
        </p>

        <h2 className="text-xl font-semibold text-white pt-4">2. Account and Access</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>You must register for an account to access the Services. You are responsible for maintaining the confidentiality of your credentials.</li>
          <li>You must provide accurate and complete registration information.</li>
          <li>You are responsible for all activity that occurs under your account.</li>
          <li>You must notify us immediately of any unauthorized use of your account.</li>
          <li>We may suspend or terminate accounts that violate these Terms.</li>
        </ul>

        <h2 className="text-xl font-semibold text-white pt-4">3. API Usage</h2>

        <h3 className="text-base font-medium text-white">3.1 API Keys</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>API keys are scoped to environments (sandbox or production) and must not be shared across environments.</li>
          <li>You are responsible for the security of your API keys. Treat them as secrets.</li>
          <li>Compromised keys must be revoked immediately through the dashboard or API.</li>
          <li>We recommend rotating production API keys every 90 days.</li>
        </ul>

        <h3 className="text-base font-medium text-white">3.2 Rate Limits</h3>
        <p>API access is subject to rate limits:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong className="text-white">Sandbox:</strong> 100 requests per minute, 10,000 per day</li>
          <li><strong className="text-white">Production:</strong> 1,000 requests per minute, 100,000 per day (default; higher limits available upon request)</li>
        </ul>
        <p>
          Rate limit information is included in response headers (X-RateLimit-Limit,
          X-RateLimit-Remaining, X-RateLimit-Reset). Exceeding rate limits will result in
          HTTP 429 responses.
        </p>

        <h3 className="text-base font-medium text-white">3.3 Acceptable Use</h3>
        <p>You agree not to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Use the APIs for any unlawful purpose or in violation of applicable regulations</li>
          <li>Attempt to access data belonging to other tenants or bypass tenant isolation controls</li>
          <li>Reverse engineer, decompile, or attempt to extract the source code of the Services</li>
          <li>Use the Services to build a competing product</li>
          <li>Scrape, crawl, or otherwise systematically extract data beyond your authorized scope</li>
          <li>Interfere with or disrupt the integrity or performance of the Services</li>
        </ul>

        <h2 className="text-xl font-semibold text-white pt-4">4. Data Ownership and Processing</h2>

        <h3 className="text-base font-medium text-white">4.1 Your Data</h3>
        <p>
          You retain all rights to the data you submit to the Services ("Your Data"). You grant
          us a limited license to process Your Data solely for the purpose of providing the
          Services. We will not use Your Data for any other purpose without your explicit consent.
        </p>

        <h3 className="text-base font-medium text-white">4.2 Derived Analytics</h3>
        <p>
          We may generate analytics, risk signals, and insights derived from Your Data as part
          of the Services. These outputs are provided to you as part of the Services and are
          subject to the decision-support disclaimer in Section 1.
        </p>

        <h3 className="text-base font-medium text-white">4.3 Aggregate Data</h3>
        <p>
          We may use anonymized, aggregated data that does not identify any individual business
          or person to improve the Services, develop benchmarks, and for internal research.
          Such aggregate data will not be attributable to you or your clients.
        </p>

        <h2 className="text-xl font-semibold text-white pt-4">5. Security</h2>
        <p>
          We implement commercially reasonable technical and organizational measures to protect
          the Services and Your Data, including encryption (AES-256 at rest, TLS 1.3 in transit),
          multi-tenant database isolation with row-level security, role-based access controls,
          and audit logging. Our SOC 2 Type II compliance roadmap is active.
        </p>
        <p>
          You are responsible for implementing appropriate security measures on your end,
          including securing API keys, implementing webhook signature verification, and
          restricting IP access where appropriate.
        </p>

        <h2 className="text-xl font-semibold text-white pt-4">6. Service Availability</h2>
        <p>
          We aim to provide highly available Services but do not guarantee uninterrupted access.
          We may perform scheduled maintenance with reasonable advance notice. Specific uptime
          commitments, if any, will be set forth in a separate Service Level Agreement (SLA)
          between us and your organization.
        </p>

        <h2 className="text-xl font-semibold text-white pt-4">7. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL FUTEURCREDX BE
          LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
          OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY
          LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Your use or inability to use the Services</li>
          <li>Any credit decisions made using information provided by the Services</li>
          <li>Any unauthorized access to or alteration of your data</li>
          <li>Any interruption or cessation of the Services</li>
        </ul>
        <p>
          OUR TOTAL LIABILITY FOR ALL CLAIMS RELATED TO THE SERVICES SHALL NOT EXCEED THE
          AMOUNTS PAID BY YOU TO US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
        </p>

        <h2 className="text-xl font-semibold text-white pt-4">8. Disclaimer of Warranties</h2>
        <p>
          THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
          EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT
          WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
        </p>
        <p>
          CREDIT SIGNALS, RISK INDICATORS, AND ANALYTICS PROVIDED BY THE SERVICES ARE FOR
          INFORMATIONAL PURPOSES ONLY AND DO NOT CONSTITUTE CREDIT ADVICE, LENDING RECOMMENDATIONS,
          OR FINANCIAL GUIDANCE.
        </p>

        <h2 className="text-xl font-semibold text-white pt-4">9. Termination</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Either party may terminate these Terms with 30 days written notice.</li>
          <li>We may suspend or terminate your access immediately if you violate these Terms.</li>
          <li>Upon termination, your right to access the Services ceases. We will retain Your Data for 30 days after termination to allow for export, after which it will be deleted unless a longer retention period is required by law or regulation.</li>
          <li>Sections 4, 7, 8, and 10 survive termination.</li>
        </ul>

        <h2 className="text-xl font-semibold text-white pt-4">10. General Provisions</h2>

        <h3 className="text-base font-medium text-white">10.1 Governing Law</h3>
        <p>
          These Terms are governed by the laws of the State of Delaware, United States, without
          regard to conflict of law principles.
        </p>

        <h3 className="text-base font-medium text-white">10.2 Modifications</h3>
        <p>
          We may modify these Terms at any time. We will provide notice of material changes by
          posting the updated Terms on this page and, for significant changes, by email to
          registered account holders. Continued use of the Services after changes take effect
          constitutes acceptance of the modified Terms.
        </p>

        <h3 className="text-base font-medium text-white">10.3 Entire Agreement</h3>
        <p>
          These Terms, together with our Privacy Policy and any applicable SLA or data processing
          agreement, constitute the entire agreement between you and FuteurCredX regarding the Services.
        </p>

        <h2 className="text-xl font-semibold text-white pt-4">11. Contact</h2>
        <p>
          For questions about these Terms:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Email: <a href="mailto:security@futeurcredx.com" className="text-blue-400 hover:underline">security@futeurcredx.com</a></li>
          <li>Company: FuteurCredX Inc.</li>
        </ul>
        <p className="text-xs text-gray-500 pt-4">
          These terms of service are provided as a substantive framework. They have not yet been
          reviewed by legal counsel. Contact security@futeurcredx.com for the latest version.
        </p>
      </section>
    </div>
  );
}
