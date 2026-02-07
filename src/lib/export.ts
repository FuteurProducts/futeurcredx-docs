/**
 * CSV Export with PII Redaction & Audit Trail
 * Strips sensitive fields before export and emits audit events.
 */

/** Fields that contain PII and must be redacted before export */
const PII_FIELDS = new Set([
  'ssn', 'socialSecurityNumber', 'social_security_number',
  'taxId', 'tax_id', 'ein',
  'bankAccount', 'bank_account', 'accountNumber', 'account_number',
  'routingNumber', 'routing_number',
  'dob', 'dateOfBirth', 'date_of_birth',
  'driversLicense', 'drivers_license',
]);

function redactPII(row: Record<string, unknown>): Record<string, unknown> {
  const redacted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    redacted[key] = PII_FIELDS.has(key) ? '***REDACTED***' : value;
  }
  return redacted;
}

export function exportToCSV(
  data: Record<string, unknown>[],
  filename: string,
  options?: { onAudit?: (recordCount: number) => void }
) {
  if (data.length === 0) return;

  // Redact PII fields
  const sanitized = data.map(redactPII);

  const headers = Object.keys(sanitized[0]);
  const csvContent = [
    headers.join(','),
    ...sanitized.map(row =>
      headers.map(h => {
        const val = String(row[h] ?? '');
        return val.includes(',') || val.includes('"') || val.includes('\n')
          ? `"${val.replace(/"/g, '""')}"`
          : val;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);

  // Fire audit callback
  options?.onAudit?.(data.length);
}
