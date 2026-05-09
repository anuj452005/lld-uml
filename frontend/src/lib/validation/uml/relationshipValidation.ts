import { UMLRelationship, UMLDiagram, UMLRelationshipType } from '../../../types/uml';
import { ValidationResult } from './methodValidation';

/**
 * Validates a UML relationship.
 */
export function validateRelationship(
  relationship: Partial<UMLRelationship>,
  diagram: UMLDiagram
): ValidationResult {
  if (!relationship.sourceId || !relationship.targetId) {
    return { valid: false, error: 'Source and target entities are required' };
  }

  if (relationship.sourceId === relationship.targetId) {
    return { valid: false, error: 'Self-inheritance is not allowed' };
  }

  const VALID_TYPES: UMLRelationshipType[] = [
    'association',
    'inheritance',
    'realization',
    'aggregation',
    'composition',
    'dependency',
  ];

  if (relationship.type && !VALID_TYPES.includes(relationship.type)) {
    return { valid: false, error: 'Invalid relationship type' };
  }

  // Check if entities exist
  const entityIds = [
    ...diagram.classes.map((c) => c.id),
    ...diagram.interfaces.map((i) => i.id),
  ];

  if (!entityIds.includes(relationship.sourceId)) {
    return { valid: false, error: 'Source entity does not exist' };
  }

  if (!entityIds.includes(relationship.targetId)) {
    return { valid: false, error: 'Target entity does not exist' };
  }

  // Circular inheritance check
  if (relationship.type === 'inheritance' || relationship.type === 'realization') {
    if (wouldCreateCycle(relationship.sourceId, relationship.targetId, diagram)) {
      return { valid: false, error: 'Circular inheritance is not allowed' };
    }
  }

  return { valid: true };
}

/**
 * Checks if adding an inheritance relationship from source to target would create a cycle.
 */
function wouldCreateCycle(
  sourceId: string,
  targetId: string,
  diagram: UMLDiagram
): boolean {
  // To find if targetId can reach sourceId via existing inheritance/realization edges
  const visited = new Set<string>();
  const stack = [targetId];

  while (stack.length > 0) {
    const currentId = stack.pop()!;
    if (currentId === sourceId) return true;

    if (visited.has(currentId)) continue;
    visited.add(currentId);

    // Find all entities that currentId extends/implements
    const outgoing = diagram.relationships
      .filter((r) => r.sourceId === currentId && (r.type === 'inheritance' || r.type === 'realization'))
      .map((r) => r.targetId);

    stack.push(...outgoing);
  }

  return false;
}
