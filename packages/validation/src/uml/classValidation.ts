import type { ValidationResult } from '../types.js';

/**
 * Validates a class or interface name.
 * Rules:
 * - Must not be empty or whitespace-only
 * - Must be unique (case-sensitive) within the diagram
 * - Must be a valid identifier
 */
export function validateClassName(
  name: string,
  existingNames: string[],
  currentEntityId?: string
): ValidationResult {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return { valid: false, error: 'Class name cannot be empty' };
  }

  const isDuplicate = existingNames.some((existingName) => existingName === trimmedName);

  if (isDuplicate) {
    return { valid: false, error: `Entity name "${trimmedName}" is already in use` };
  }

  const identifierRegex = /^[a-zA-Z_$][a-zA-Z\d_$]*$/;
  if (!identifierRegex.test(trimmedName)) {
    return {
      valid: false,
      error: 'Invalid class name. Use only letters, numbers, and underscores, starting with a letter or underscore.',
    };
  }

  return { valid: true };
}
