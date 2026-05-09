import type { UMLDiagram, UMLRelationship, UMLRelationshipType } from '../types.js';
import type { ValidationResult } from '../types.js';

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

  const validTypes: UMLRelationshipType[] = [
    'association',
    'inheritance',
    'realization',
    'aggregation',
    'composition',
    'dependency',
  ];

  if (relationship.type && !validTypes.includes(relationship.type)) {
    return { valid: false, error: 'Invalid relationship type' };
  }

  const entityIds = [
    ...diagram.classes.map((cls) => cls.id),
    ...diagram.interfaces.map((intf) => intf.id),
  ];

  if (!entityIds.includes(relationship.sourceId)) {
    return { valid: false, error: 'Source entity does not exist' };
  }

  if (!entityIds.includes(relationship.targetId)) {
    return { valid: false, error: 'Target entity does not exist' };
  }

  if (relationship.type === 'inheritance' || relationship.type === 'realization') {
    if (wouldCreateCycle(relationship.sourceId, relationship.targetId, diagram)) {
      return { valid: false, error: 'Circular inheritance is not allowed' };
    }
  }

  return { valid: true };
}

function wouldCreateCycle(sourceId: string, targetId: string, diagram: UMLDiagram): boolean {
  const visited = new Set<string>();
  const stack = [targetId];

  while (stack.length > 0) {
    const currentId = stack.pop();
    if (!currentId) continue;

    if (currentId === sourceId) return true;

    if (visited.has(currentId)) continue;
    visited.add(currentId);

    const outgoing = diagram.relationships
      .filter((relationship) =>
        relationship.sourceId === currentId &&
        (relationship.type === 'inheritance' || relationship.type === 'realization')
      )
      .map((relationship) => relationship.targetId);

    stack.push(...outgoing);
  }

  return false;
}
