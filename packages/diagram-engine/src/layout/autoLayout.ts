export interface DiagramNodeLayout {
  entityId: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export interface UMLClass {
  id: string;
}

export interface UMLInterface {
  id: string;
}

export interface UMLDiagram {
  classes: UMLClass[];
  interfaces: UMLInterface[];
}

/**
 * Automatically layouts nodes in a grid.
 * 
 * Strategy:
 * - Arrange nodes in rows of 3
 * - 60px gutter
 * - Base offset (80, 80)
 */
export function autoLayoutDiagram(diagram: UMLDiagram): DiagramNodeLayout[] {
  const allEntities = [...diagram.classes, ...diagram.interfaces];
  
  const COLUMN_COUNT = 3;
  const GUTTER = 60;
  const NODE_WIDTH = 250;
  const NODE_HEIGHT = 200;
  const START_X = 80;
  const START_Y = 80;

  return allEntities.map((entity, index) => {
    const row = Math.floor(index / COLUMN_COUNT);
    const col = index % COLUMN_COUNT;

    return {
      entityId: entity.id,
      x: START_X + col * (NODE_WIDTH + GUTTER),
      y: START_Y + row * (NODE_HEIGHT + GUTTER),
    };
  });
}
