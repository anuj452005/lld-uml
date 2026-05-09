import { UMLMethod } from '../../../types/uml.js';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates a UML method signature string.
 * Format: methodName(param1: Type, param2: Type): ReturnType
 */
export function validateMethodSignature(signature: string): ValidationResult {
  if (!signature || signature.trim() === '') {
    return { valid: false, error: 'Method signature cannot be empty' };
  }

  // Regex to match: methodName(params): ReturnType
  // Group 1: method name
  // Group 2: parameters string
  // Group 3: return type
  const SIGNATURE_REGEX = /^([a-zA-Z_$][a-zA-Z\d_$]*)\s*\(([^)]*)\)\s*:\s*([a-zA-Z_$][a-zA-Z\d_$\[\]<>]*)$/;
  
  const match = signature.trim().match(SIGNATURE_REGEX);

  if (!match) {
    return {
      valid: false,
      error: 'Invalid signature format. Expected: name(param: Type): ReturnType',
    };
  }

  const methodName = match[1];
  const paramsStr = match[2];
  const returnType = match[3];

  if (!methodName) {
    return { valid: false, error: 'Method name is required' };
  }

  if (!returnType) {
    return { valid: false, error: 'Return type is required' };
  }

  // Validate parameters if present
  if (paramsStr.trim()) {
    const params = paramsStr.split(',').map(p => p.trim());
    for (const param of params) {
      if (!param) continue; // Skip empty trailing comma if any
      
      const paramParts = param.split(':').map(p => p.trim());
      if (paramParts.length !== 2 || !paramParts[0] || !paramParts[1]) {
        return {
          valid: false,
          error: `Invalid parameter format: "${param}". Expected "name: Type"`,
        };
      }
    }
  }

  return { valid: true };
}

/**
 * Parses a method signature into its component parts.
 * Assumes the signature has already been validated.
 */
export function parseMethodSignature(signature: string): Partial<UMLMethod> {
  const SIGNATURE_REGEX = /^([a-zA-Z_$][a-zA-Z\d_$]*)\s*\(([^)]*)\)\s*:\s*([a-zA-Z_$][a-zA-Z\d_$\[\]<>]*)$/;
  const match = signature.trim().match(SIGNATURE_REGEX);

  if (!match) return {};

  const name = match[1];
  const paramsStr = match[2];
  const returnType = match[3];

  const parameters = paramsStr
    .split(',')
    .filter(p => p.trim())
    .map((p, index) => {
      const [pName, pType] = p.split(':').map(part => part.trim());
      return {
        id: `param-${index}-${Date.now()}`,
        name: pName,
        type: pType,
      };
    });

  return {
    name,
    returnType,
    parameters,
    signature: signature.trim(),
  };
}
