import { DatasetRecord } from '@/types/dataset';
import { normalizeCompanyName, normalizeURL } from './normalizer';

function calculateSimilarity(str1: string, str2: string): number {
  if (str1 === str2) return 1.0;
  if (!str1 || !str2) return 0.0;

  const a = str1.toLowerCase().replace(/[^a-z0-9]/g, '');
  const b = str2.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (a === b) return 1.0;

  // Bigram Dice coefficient
  const getBigrams = (str: string) => {
    const bigrams = new Set<string>();
    for (let i = 0; i < str.length - 1; i++) {
      bigrams.add(str.substring(i, i + 2));
    }
    return bigrams;
  };

  const bigramsA = getBigrams(a);
  const bigramsB = getBigrams(b);
  let intersection = 0;
  for (const bg of bigramsA) {
    if (bigramsB.has(bg)) intersection++;
  }

  return (2 * intersection) / (bigramsA.size + bigramsB.size || 1);
}

export interface DeduplicationResult {
  deduplicatedRecords: DatasetRecord[];
  mergedCount: number;
  duplicateLog: Array<{
    primaryName: string;
    duplicateName: string;
    similarity: number;
    reason: string;
  }>;
}

export function deduplicateRecords(records: DatasetRecord[]): DeduplicationResult {
  const result: DatasetRecord[] = [];
  const duplicateLog: Array<{
    primaryName: string;
    duplicateName: string;
    similarity: number;
    reason: string;
  }> = [];

  const seenDomains = new Map<string, DatasetRecord>();
  const seenNames = new Map<string, DatasetRecord>();

  for (const record of records) {
    const rawName = record.companyName.value;
    const normName = normalizeCompanyName(rawName);
    const normDomain = normalizeURL(record.website.value);

    let match: DatasetRecord | undefined;
    let matchReason = '';
    let similarityScore = 1.0;

    // 1. Exact domain match
    if (normDomain && seenDomains.has(normDomain)) {
      match = seenDomains.get(normDomain);
      matchReason = `Exact canonical domain match: ${normDomain}`;
    }
    // 2. Normalized company name match
    else if (normName && seenNames.has(normName)) {
      match = seenNames.get(normName);
      matchReason = `Normalized legal entity name match: "${normName}"`;
    }
    // 3. Fuzzy similarity > 0.88
    else {
      for (const [existingNorm, existingRecord] of seenNames.entries()) {
        const sim = calculateSimilarity(normName, existingNorm);
        if (sim >= 0.88) {
          match = existingRecord;
          similarityScore = Math.round(sim * 100) / 100;
          matchReason = `Fuzzy name similarity (${Math.round(sim * 100)}%): "${rawName}" ≈ "${existingRecord.companyName.value}"`;
          break;
        }
      }
    }

    if (match) {
      // Merge evidence into existing record without destroying provenance
      match.companyName.evidence.push(...record.companyName.evidence);
      match.employees.evidence.push(...record.employees.evidence);
      match.fundingTotal.evidence.push(...record.fundingTotal.evidence);

      // Merge signals if distinct
      const existingSignals = new Set(match.demandSignals.value);
      for (const s of record.demandSignals.value) {
        if (!existingSignals.has(s)) {
          match.demandSignals.value.push(s);
        }
      }

      duplicateLog.push({
        primaryName: match.companyName.value,
        duplicateName: rawName,
        similarity: similarityScore,
        reason: matchReason,
      });
    } else {
      result.push(record);
      if (normDomain) seenDomains.set(normDomain, record);
      if (normName) seenNames.set(normName, record);
    }
  }

  return {
    deduplicatedRecords: result,
    mergedCount: duplicateLog.length,
    duplicateLog,
  };
}
