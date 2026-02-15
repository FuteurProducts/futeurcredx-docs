import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Clock,
  RefreshCw,
  Shield,
} from 'lucide-react';

import { cn } from '@/lib/utils';

import { CodeBlock } from '@/docs/components/api/CodeBlock';
import { Callout } from '@/docs/components/shared/Callout';

interface WebhookEvent {
  event: string;
  description: string;
  category: string;
}

const webhookEvents: WebhookEvent[] = [
  { event: 'score.created', description: 'A new credit score has been calculated for a business', category: 'Credit Scores' },
  { event: 'score.updated', description: 'An existing credit score has been recalculated with new data', category: 'Credit Scores' },
  { event: 'application.submitted', description: 'A new credit application has been submitted', category: 'Applications' },
  { event: 'application.approved', description: 'An application has been approved by the underwriting engine', category: 'Applications' },
  { event: 'application.denied', description: 'An application has been denied', category: 'Applications' },
  { event: 'offer.created', description: 'A new credit offer has been generated for a business', category: 'Offers' },
  { event: 'offer.expired', description: 'An offer has passed its expiration date without acceptance', category: 'Offers' },
  { event: 'offer.accepted', description: 'A business has accepted a credit offer', category: 'Offers' },
  { event: 'risk.alert.created', description: 'A new risk alert has been triggered by monitoring rules', category: 'Risk' },
  { event: 'risk.alert.resolved', description: 'A risk alert has been marked as resolved', category: 'Risk' },
  { event: 'report.completed', description: 'An asynchronous report generation job has finished', category: 'Reports' },
];

const payloadExample = JSON.stringify(
  {
    id: 'evt_abc123def456',
    type: 'score.updated',
    createdAt: '2026-02-15T14:30:00.000Z',
    data: {
      businessId: 'biz_001',
      portfolioId: 'portfolio_chase_001',
      previousScore: 728,
      newScore: 742,
      trend: 'improving',
      factors: [
        'Improved payment history',
        'Reduced credit utilization',
      ],
    },
    metadata: {
      version: '1.0',
      environment: 'production',
    },
  },
  null,
  2,
);

const verificationExamples: Record<string, string> = {
  node: `import crypto from 'crypto';

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

// In your webhook handler:
app.post('/webhooks/lumiq', (req, res) => {
  const signature = req.headers['x-lumiq-signature'];
  const isValid = verifyWebhookSignature(
    JSON.stringify(req.body),
    signature,
    process.env.LUMIQ_WEBHOOK_SECRET
  );

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Process the webhook event
  const event = req.body;
  console.log(\`Received: \${event.type}\`);

  res.status(200).json({ received: true });
});`,
  python: `import hmac
import hashlib
from flask import Flask, request, jsonify

app = Flask(__name__)

def verify_webhook_signature(
    payload: bytes,
    signature: str,
    secret: str
) -> bool:
    expected = hmac.new(
        secret.encode("utf-8"),
        payload,
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(signature, expected)

@app.route("/webhooks/lumiq", methods=["POST"])
def handle_webhook():
    signature = request.headers.get("X-Lumiq-Signature", "")
    is_valid = verify_webhook_signature(
        request.get_data(),
        signature,
        os.environ["LUMIQ_WEBHOOK_SECRET"],
    )

    if not is_valid:
        return jsonify({"error": "Invalid signature"}), 401

    event = request.get_json()
    print(f"Received: {event['type']}")

    return jsonify({"received": True}), 200`,
};

const categories = [...new Set(webhookEvents.map((e) => e.category))];

export default function Webhooks() {
  return (
    <div className="mx-auto max-w-4xl space-y-12 py-8">
      {/* Header */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-purple-500/10 p-2">
            <Bell className="h-6 w-6 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Webhooks
          </h1>
        </div>
        <p className="text-lg leading-relaxed text-gray-400">
          Receive real-time event notifications when data changes in your
          portfolio. Webhooks push events to your server over HTTPS, eliminating
          the need for polling.
        </p>
      </div>

      {/* Coming Soon */}
      <Callout type="info" title="Coming Soon">
        Webhook delivery is currently in private beta. The event types and
        payload structures below represent the planned implementation. Contact
        your account manager to request early access.
      </Callout>

      {/* Event Types */}
      <section id="events">
        <h2 className="mb-4 text-2xl font-bold text-white">Event Types</h2>
        <p className="mb-6 text-gray-400">
          Subscribe to specific event types to receive only the notifications
          relevant to your integration.
        </p>

        <div className="space-y-6">
          {categories.map((category) => {
            const categoryEvents = webhookEvents.filter(
              (e) => e.category === category,
            );

            return (
              <div key={category}>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
                  {category}
                </h3>
                <div className="overflow-hidden rounded-xl border border-gray-800">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-gray-800/50">
                      {categoryEvents.map((evt) => (
                        <tr key={evt.event}>
                          <td className="px-5 py-3">
                            <code className="rounded bg-gray-800 px-2 py-0.5 font-mono text-xs text-blue-300">
                              {evt.event}
                            </code>
                          </td>
                          <td className="px-5 py-3 text-gray-400">
                            {evt.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Payload Schema */}
      <section id="payload">
        <h2 className="mb-4 text-2xl font-bold text-white">
          Webhook Payload
        </h2>
        <p className="mb-4 text-gray-400">
          Every webhook delivery includes a consistent envelope with the event
          type, timestamp, and event-specific data.
        </p>
        <CodeBlock code={payloadExample} language="json" title="Example Payload: score.updated" />

        <div className="mt-4 overflow-hidden rounded-xl border border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50">
                <th className="px-5 py-3 text-left font-semibold uppercase tracking-wider text-gray-400">
                  Field
                </th>
                <th className="px-5 py-3 text-left font-semibold uppercase tracking-wider text-gray-400">
                  Type
                </th>
                <th className="px-5 py-3 text-left font-semibold uppercase tracking-wider text-gray-400">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {[
                { field: 'id', type: 'string', desc: 'Unique event identifier for idempotency' },
                { field: 'type', type: 'string', desc: 'Event type (e.g., score.updated)' },
                { field: 'createdAt', type: 'string (ISO 8601)', desc: 'When the event was generated' },
                { field: 'data', type: 'object', desc: 'Event-specific payload data' },
                { field: 'metadata', type: 'object', desc: 'Version and environment info' },
              ].map((row) => (
                <tr key={row.field}>
                  <td className="px-5 py-3">
                    <code className="font-mono text-xs text-blue-300">
                      {row.field}
                    </code>
                  </td>
                  <td className="px-5 py-3">
                    <code className="font-mono text-xs text-gray-400">
                      {row.type}
                    </code>
                  </td>
                  <td className="px-5 py-3 text-gray-400">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Signature Verification */}
      <section id="verification">
        <div className="mb-4 flex items-center gap-3">
          <Shield className="h-5 w-5 text-emerald-400" />
          <h2 className="text-2xl font-bold text-white">
            Signature Verification
          </h2>
        </div>
        <p className="mb-4 text-gray-400">
          Every webhook delivery includes an{' '}
          <code className="rounded bg-gray-800 px-1.5 py-0.5 text-sm text-blue-300">
            X-Lumiq-Signature
          </code>{' '}
          header containing an HMAC-SHA256 signature of the request body. Always
          verify this signature to ensure the payload was sent by LumiqAI and
          was not tampered with in transit.
        </p>

        <CodeBlock
          code={verificationExamples}
          title="Signature Verification"
        />

        <Callout type="danger" title="Security Warning">
          Never skip signature verification in production. Always use
          constant-time comparison (timingSafeEqual / compare_digest) to
          prevent timing attacks.
        </Callout>
      </section>

      {/* Retry Policy */}
      <section id="retry-policy">
        <div className="mb-4 flex items-center gap-3">
          <RefreshCw className="h-5 w-5 text-amber-400" />
          <h2 className="text-2xl font-bold text-white">Retry Policy</h2>
        </div>
        <p className="mb-6 text-gray-400">
          If your endpoint returns a non-2xx status code or times out, LumiqAI
          will retry delivery with exponential backoff.
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: RefreshCw,
              label: 'Max Retries',
              value: '3',
              color: 'text-blue-400',
            },
            {
              icon: Clock,
              label: 'Max Window',
              value: '24 hours',
              color: 'text-amber-400',
            },
            {
              icon: AlertTriangle,
              label: 'Timeout',
              value: '30 seconds',
              color: 'text-red-400',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-xl border border-gray-800 bg-gray-900/30 p-5 text-center"
              >
                <Icon className={cn('mx-auto mb-2 h-5 w-5', item.color)} />
                <p className="text-2xl font-bold text-white">{item.value}</p>
                <p className="mt-1 text-xs text-gray-500">{item.label}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50">
                <th className="px-5 py-3 text-left font-semibold uppercase tracking-wider text-gray-400">
                  Attempt
                </th>
                <th className="px-5 py-3 text-left font-semibold uppercase tracking-wider text-gray-400">
                  Delay
                </th>
                <th className="px-5 py-3 text-left font-semibold uppercase tracking-wider text-gray-400">
                  Cumulative
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {[
                { attempt: '1st retry', delay: '1 minute', cumulative: '~1 min' },
                { attempt: '2nd retry', delay: '10 minutes', cumulative: '~11 min' },
                { attempt: '3rd retry', delay: '1 hour', cumulative: '~71 min' },
              ].map((row) => (
                <tr key={row.attempt}>
                  <td className="px-5 py-3 text-gray-300">{row.attempt}</td>
                  <td className="px-5 py-3 text-gray-400">{row.delay}</td>
                  <td className="px-5 py-3 text-gray-500">{row.cumulative}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Best Practices */}
      <Callout type="tip" title="Webhook Best Practices">
        <ul className="mt-2 space-y-1.5">
          <li>
            <CheckCircle className="mr-1.5 inline h-3.5 w-3.5 text-emerald-400" />
            Return a 200 response quickly -- process events asynchronously
          </li>
          <li>
            <CheckCircle className="mr-1.5 inline h-3.5 w-3.5 text-emerald-400" />
            Use the event <code className="rounded bg-gray-800 px-1 py-0.5 text-xs text-emerald-300">id</code> field for idempotency to handle duplicate deliveries
          </li>
          <li>
            <CheckCircle className="mr-1.5 inline h-3.5 w-3.5 text-emerald-400" />
            Store raw payloads before processing for debugging and replay
          </li>
          <li>
            <CheckCircle className="mr-1.5 inline h-3.5 w-3.5 text-emerald-400" />
            Use HTTPS endpoints with valid TLS certificates
          </li>
        </ul>
      </Callout>
    </div>
  );
}
