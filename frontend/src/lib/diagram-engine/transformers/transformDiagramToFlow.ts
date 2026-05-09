import { Node, Edge } from 'reactflow';
import { UMLDiagram, DiagramNodeLayout, UMLRelationshipType } from '@/types/uml';

interface RelationshipEdgeData {
  relType: UMLRelationshipType;
  label?: string;
}

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
  const edges: Edge<RelationshipEdgeData>[] = diagram.relationships.map((rel) => ({
    id: rel.id,
    source: rel.sourceId,
    target: rel.targetId,
    type: rel.type,
    label: rel.label,
    data: {
      relType: rel.type,
      label: rel.label,
    },
  }));

  return { nodes, edges };
}
