import { Node, Edge, MarkerType } from 'reactflow';
import { UMLDiagram, DiagramNodeLayout, UMLRelationship } from '@/types/uml';

/**
 * transformDiagramToFlow
 * 
 * A pure function that transforms the canonical UML semantic model + layout
 * into React Flow nodes and edges.
 * 
 * Rules:
 * - Must be pure (no side effects).
 * - React Flow elements are view models only.
 */
export function transformDiagramToFlow(
  diagram: UMLDiagram,
  layout: DiagramNodeLayout[]
): { nodes: Node[]; edges: Edge[] } {
  // 1. Transform Classes/Interfaces into Nodes
  const nodes: Node[] = [
    ...diagram.classes.map((cls) => {
      const nodeLayout = layout.find((l) => l.entityId === cls.id);
      return {
        id: cls.id,
        type: 'umlNode', // Custom node type to be implemented later
        position: { x: nodeLayout?.x ?? 0, y: nodeLayout?.y ?? 0 },
        data: { 
          name: cls.name, 
          type: cls.type,
          fields: cls.fields,
          methods: cls.methods,
          isAbstract: cls.isAbstract
        },
      };
    }),
    ...diagram.interfaces.map((intf) => {
      const nodeLayout = layout.find((l) => l.entityId === intf.id);
      return {
        id: intf.id,
        type: 'umlNode',
        position: { x: nodeLayout?.x ?? 0, y: nodeLayout?.y ?? 0 },
        data: { 
          name: intf.name, 
          type: intf.type,
          methods: intf.methods 
        },
      };
    }),
  ];

  // 2. Transform Relationships into Edges
  const edges: Edge[] = diagram.relationships.map((rel) => ({
    id: rel.id,
    source: rel.sourceId,
    target: rel.targetId,
    label: rel.label,
    type: 'umlEdge', // Custom edge type to be implemented later
    markerEnd: getMarkerEnd(rel.type),
    style: getEdgeStyle(rel.type),
  }));

  return { nodes, edges };
}

/**
 * Maps UML relationship types to React Flow markers
 */
function getMarkerEnd(type: UMLRelationship['type']) {
  switch (type) {
    case 'inheritance':
    case 'realization':
      return {
        type: MarkerType.ArrowClosed,
        color: '#6E7681', // diagram.edge.default
      };
    case 'composition':
      return {
        type: MarkerType.ArrowClosed,
        color: '#6E7681',
      };
    default:
      return {
        type: MarkerType.Arrow,
        color: '#6E7681',
      };
  }
}

/**
 * Maps UML relationship types to React Flow line styles
 */
function getEdgeStyle(type: UMLRelationship['type']) {
  switch (type) {
    case 'dependency':
    case 'realization':
      return {
        strokeDasharray: '5,5',
        stroke: '#6E7681',
      };
    default:
      return {
        stroke: '#6E7681',
      };
  }
}
