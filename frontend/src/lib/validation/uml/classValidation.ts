import { ValidationResult } from './methodValidation';

/**
 * Validates a class or interface name.
 * Rules:
 * - Must not be empty or whitespace-only
 * - Must be unique (case-sensitive) within the diagram
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

  // Check for duplicates
  // We exclude the current entity's name if we are editing an existing one
  const isDuplicate = existingNames.some(existingName => existingName === trimmedName);

  if (isDuplicate) {
    return { valid: false, error: `Entity name "${trimmedName}" is already in use` };
  }

  // Basic identifier validation (start with letter/_, followed by alphanumeric/_)
  const IDENTIFIER_REGEX = /^[a-zA-Z_$][a-zA-Z\d_$]*$/;
  if (!IDENTIFIER_REGEX.test(trimmedName)) {
    return {
      valid: false,
      error: 'Invalid class name. Use only letters, numbers, and underscores, starting with a letter or underscore.',
    };
  }

  return { valid: true };
}
