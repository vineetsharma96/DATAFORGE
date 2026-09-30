import { DatasetRecord } from '@/types/dataset';
import { ResearchRequirement } from '@/types/research';

export interface ValidationResult {
  validRecords: DatasetRecord[];
  rejectedRecords: Array<{
    record: DatasetRecord;
    violations: string[];
  }>;
  totalValidated: number;
}

export function validateRecords(
  records: DatasetRecord[],
  requirements: ResearchRequirement
): ValidationResult {
  const validRecords: DatasetRecord[] = [];
  const rejectedRecords: Array<{ record: DatasetRecord; violations: string[] }> = [];

  const minEmp = requirements.employeeRange?.min ?? 0;
  const maxEmp = requirements.employeeRange?.max ?? 100000;

  for (const record of records) {
    const violations: string[] = [];

    // 1. Mandatory Company Name
    if (!record.companyName.value || record.companyName.value.trim().length === 0) {
      violations.push('Missing company identifier/name');
    }

    // 2. Headcount validation
    const emp = record.employees.value;
    if (emp === null || emp === undefined || emp < 0) {
      violations.push('Employee headcount is invalid or non-numeric');
    } else if (emp < minEmp || emp > maxEmp) {
      // Soft validation - keep if within margin or tag
      if (emp < minEmp * 0.8 || emp > maxEmp * 1.5) {
        violations.push(`Headcount (${emp}) strictly outside requested bracket [${minEmp}–${maxEmp}]`);
      }
    }

    // 3. Website validation
    if (!record.website.value || !record.website.value.startsWith('http')) {
      violations.push('Website lacks valid URI protocol');
    }

    // 4. Evidence requirement
    if (record.companyName.evidence.length === 0) {
      violations.push('Zero evidence observations attached to primary entity');
    }

    if (violations.length === 0) {
      validRecords.push(record);
    } else {
      rejectedRecords.push({ record, violations });
    }
  }

  return {
    validRecords,
    rejectedRecords,
    totalValidated: records.length,
  };
}
