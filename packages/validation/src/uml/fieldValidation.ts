import type { UMLField, UMLVisibility } from '../types.js';
import type { ValidationResult } from '../types.js';

/**
 * Validates a UML field definition.
 */
export function validateField(field: Partial<UMLField>): ValidationResult {
  if (!field.name || field.name.trim() === '') {
    return { valid: false, error: 'Field name is required' };
  }

  if (!field.type || field.type.trim() === '') {
    return { valid: false, error: 'Field type is required' };
  }

  const validVisibilities: UMLVisibility[] = ['public', 'private', 'protected', 'package'];
  if (field.visibility && !validVisibilities.includes(field.visibility)) {
    return { valid: false, error: 'Invalid visibility value' };
  }

  const identifierRegex = /^[a-zA-Z_$][a-zA-Z\d_$]*$/;
  if (!identifierRegex.test(field.name.trim())) {
    return {
      valid: false,
      error: 'Invalid field name. Use only letters, numbers, and underscores.',
    };
  }

  return { valid: true };
}
