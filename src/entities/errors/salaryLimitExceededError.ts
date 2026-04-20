type SalaryLimitExceededError = Error & {
  salary: number;
  max: number;
};

const createSalaryLimitExceededError = (
  salary: number,
  max: number,
): SalaryLimitExceededError => {
  const base = new Error(`Salary ${salary} exceeds configured maximum ${max}`);
  base.name = 'SalaryLimitExceededError';
  return Object.assign(base, { salary, max });
};

const isSalaryLimitExceededError = (
  err: unknown,
): err is SalaryLimitExceededError =>
  err instanceof Error && err.name === 'SalaryLimitExceededError';

export type { SalaryLimitExceededError };
export { createSalaryLimitExceededError, isSalaryLimitExceededError };
