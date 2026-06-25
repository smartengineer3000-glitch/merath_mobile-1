export function validateInheritanceInput(input: any) {
  if (!input) {
    throw new Error('Input is required');
  }

  if (!input.heirs || Object.keys(input.heirs).length === 0) {
    throw new Error('No heirs provided');
  }

  if (typeof input.estate !== 'number' || input.estate <= 0) {
    throw new Error('Invalid estate value');
  }

  if (!input.madhhab) {
    throw new Error('Madhhab is required');
  }
}
