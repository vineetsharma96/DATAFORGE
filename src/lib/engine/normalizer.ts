export function normalizeCompanyName(name: string): string {
  if (!name) return '';
  let cleaned = name.trim().toLowerCase();
  const legalForms = /\b(pvt\.?|private|ltd\.?|limited|inc\.?|incorporated|technologies|technology|solutions|llc|corp\.?|corporation|systems|platform)\b/gi;
  cleaned = cleaned.replace(legalForms, '');
  cleaned = cleaned.replace(/[^\w\s]/gi, ' ').replace(/\s+/g, ' ').trim();
  return cleaned;
}

export function normalizeURL(rawUrl: string): string {
  if (!rawUrl) return '';
  try {
    let url = rawUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    const parsed = new URL(url);
    let hostname = parsed.hostname.toLowerCase();
    if (hostname.startsWith('www.')) {
      hostname = hostname.substring(4);
    }
    return `https://${hostname}`;
  } catch (err) {
    return rawUrl.trim().toLowerCase();
  }
}

export function parseCurrency(raw: any): { amountUSD: number; formatted: string } {
  if (typeof raw === 'number') {
    return { amountUSD: raw, formatted: `$${(raw / 1_000_000).toFixed(1)}M` };
  }
  const str = String(raw || '').trim();
  const match = str.match(/[\$₹€£]?\s*([0-9\.]+)\s*(m|million|b|billion|k|thousand|cr|crore)?/i);
  if (!match) return { amountUSD: 0, formatted: str || 'Undisclosed' };

  let val = parseFloat(match[1]);
  const unit = (match[2] || '').toLowerCase();

  if (unit.startsWith('m')) val *= 1_000_000;
  else if (unit.startsWith('b')) val *= 1_000_000_000;
  else if (unit.startsWith('k')) val *= 1_000;
  else if (unit.startsWith('cr')) val *= 120_000; // approx 1 Crore INR in USD

  return { amountUSD: Math.round(val), formatted: `$${(val / 1_000_000).toFixed(1)}M` };
}

export function parseEmployeeRange(raw: any): number {
  if (typeof raw === 'number') return raw;
  const str = String(raw || '').trim();
  const match = str.match(/(\d+)\s*[-–to]+\s*(\d+)/i) || str.match(/(\d+)/);
  if (!match) return 0;
  if (match[2]) {
    // Return average of range
    return Math.round((parseInt(match[1], 10) + parseInt(match[2], 10)) / 2);
  }
  return parseInt(match[1], 10);
}
