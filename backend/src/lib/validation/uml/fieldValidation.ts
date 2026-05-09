import { UMLField, UMLVisibility } from '../../../types/uml.js';
import { ValidationResult } from './methodValidation.js';

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

  const VALID_VISIBILITIES: UMLVisibility[] = ['public', 'private', 'protected', 'package'];
  if (field.visibility && !VALID_VISIBILITIES.includes(field.visibility)) {
    return { valid: false, error: 'Invalid visibility value' };
  }

  // Basic identifier validation for name
  const IDENTIFIER_REGEX = /^[a-zA-Z_$][a-zA-Z\d_$]*$/;
  if (!IDENTIFIER_REGEX.test(field.name.trim())) {
    return {
      valid: false,
      error: 'Invalid field name. Use only letters, numbers, and underscores.',
    };
  }

  return { valid: true };
}
