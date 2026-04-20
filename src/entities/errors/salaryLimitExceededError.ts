class SalaryLimitExceededError extends Error {
  public readonly salary: number;
  public readonly max: number;

  constructor(salary: number, max: number) {
    super(`Salary ${salary} exceeds configured maximum ${max}`);
    this.name = 'SalaryLimitExceededError';
    this.salary = salary;
    this.max = max;
  }
}

export { SalaryLimitExceededError };
