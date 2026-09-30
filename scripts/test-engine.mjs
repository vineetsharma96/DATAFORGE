import assert from 'assert';
import { normalizeCompanyName, normalizeURL, parseCurrency, parseEmployeeRange } from '../src/lib/engine/normalizer.ts';
import { deduplicateRecords } from '../src/lib/engine/deduplicator.ts';
import { generateSyntheticDataset, simulateLivingDatasetUpdate } from '../src/lib/synthetic/generator.ts';
import { calculateDatasetQuality } from '../src/lib/engine/confidence.ts';

console.log('🧪 Running DATAFORGE Deterministic Engine Verification Tests...\n');

// 1. Normalization tests
console.log('1. Testing Normalizers...');
assert.strictEqual(normalizeCompanyName('Acme AI Pvt Ltd'), 'acme ai');
assert.strictEqual(normalizeCompanyName('Acme AI Technologies'), 'acme ai');
assert.strictEqual(normalizeURL('www.acmeai.in/corporate'), 'https://acmeai.in');
assert.strictEqual(parseCurrency('$14.2M').formatted, '$14.2M');
assert.strictEqual(parseEmployeeRange('50-500 employees'), 275);
console.log('   ✓ Normalizers passed.');

// 2. Synthetic Generator & Conflict Verification
console.log('2. Testing Synthetic Generator & Flagship Scenario...');
const dataset = generateSyntheticDataset({
  intent: 'Test',
  entity: 'Company',
  industries: ['SaaS'],
  locations: ['India'],
  requiredFields: ['companyName', 'employees', 'fundingTotal'],
  optionalFields: [],
});

assert(dataset.records.length >= 20, 'Should generate at least 20 records');
assert(dataset.sources.length === 5, 'Should generate 5 sources');
assert(dataset.conflicts.length >= 1, 'Should generate intentional conflicts');

const firstConflict = dataset.conflicts[0];
assert.strictEqual(firstConflict.field, 'employees');
assert.strictEqual(firstConflict.status, 'RESOLVED');
assert.strictEqual(firstConflict.resolvedValue, 127);
console.log('   ✓ Synthetic Generator & Conflict Resolution passed.');

// 3. Deduplication tests
console.log('3. Testing Deduplication Engine...');
const duplicateRecord = JSON.parse(JSON.stringify(dataset.records[0]));
duplicateRecord.id = 'rec_dup_test';
duplicateRecord.companyName.value = 'Acme AI Technologies Pvt Ltd';

const dedupResult = deduplicateRecords([dataset.records[0], duplicateRecord]);
assert.strictEqual(dedupResult.deduplicatedRecords.length, 1, 'Duplicate candidate should be merged');
assert.strictEqual(dedupResult.mergedCount, 1, 'Should report 1 merged duplicate');
console.log('   ✓ Deduplication Engine passed.');

// 4. Quality calculation tests
console.log('4. Testing Quality & Confidence Engine...');
const quality = calculateDatasetQuality(dataset.records);
assert(quality.overallScore > 0.85, 'Quality score should exceed 85%');
assert(quality.evidenceCoverage >= 0.9, 'Evidence coverage should exceed 90%');
console.log(`   ✓ Quality Engine passed (Overall Quality: ${Math.round(quality.overallScore * 100)}%).`);

// 5. Living Dataset Monitoring Simulation tests
console.log('5. Testing Living Dataset Change Detection...');
const { updatedRecords, changes } = simulateLivingDatasetUpdate(dataset.records);
assert(changes.length >= 3, 'Should detect at least 3 field-level changes');
const empChange = changes.find((c) => c.field === 'employees');
assert(empChange && empChange.newValue === 141, 'Acme AI employee count should update to 141');
console.log('   ✓ Living Dataset Change Detection passed.');

console.log('\n🎉 ALL DETERMINISTIC ENGINE TESTS PASSED SUCCESSFULLY!');
