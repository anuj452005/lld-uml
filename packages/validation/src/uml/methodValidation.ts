import type { UMLMethod } from '../types.js';
import type { ValidationResult } from '../types.js';

/**
 * Validates a UML method signature string.
 * Format: methodName(param1: Type, param2: Type): ReturnType
 */
export function validateMethodSignature(signature: string): ValidationResult {
  if (!signature || signature.trim() === '') {
    return { valid: false, error: 'Method signature cannot be empty' };
  }

  const signatureRegex = /^([a-zA-Z_$][a-zA-Z\d_$]*)\s*\(([^)]*)\)\s*:\s*([a-zA-Z_$][a-zA-Z\d_$\[\]<>]*)$/;
  const match = signature.trim().match(signatureRegex);

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

  if (paramsStr.trim()) {
    const params = paramsStr.split(',').map((param) => param.trim());
    for (const param of params) {
      if (!param) continue;

      const paramParts = param.split(':').map((part) => part.trim());
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
  const signatureRegex = /^([a-zA-Z_$][a-zA-Z\d_$]*)\s*\(([^)]*)\)\s*:\s*([a-zA-Z_$][a-zA-Z\d_$\[\]<>]*)$/;
  const match = signature.trim().match(signatureRegex);

  if (!match) return {};

  const name = match[1];
  const paramsStr = match[2];
  const returnType = match[3];

  const parameters = paramsStr
    .split(',')
    .filter((param) => param.trim())
    .map((param, index) => {
      const [paramName, paramType] = param.split(':').map((part) => part.trim());
      return {
        id: `param-${index}-${Date.now()}`,
        name: paramName,
        type: paramType,
      };
    });

  return {
    name,
    returnType,
    parameters,
    signature: signature.trim(),
  };
}
