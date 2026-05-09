/**
 * Canonical UML semantic model for the UML editor project.
 * Defined in context/shared-model-specification.md
 */

export interface UMLDiagram {
  id: string;
  name: string;
  description?: string;
  sourceType: DiagramSourceType;
  classes: UMLClass[];
  interfaces: UMLInterface[];
  relationships: UMLRelationship[];
  layout: DiagramLayoutState;
  viewport: DiagramViewportState;
  metadata: DiagramMetadata;
  createdAt: string;
  updatedAt: string;
}

export type DiagramSourceType = "manual" | "java-generated" | "mixed";

export interface UMLEntityBase {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface UMLClass extends UMLEntityBase {
  type: "class";
  visibility: UMLVisibility;
  isAbstract: boolean;
  fields: UMLField[];
  methods: UMLMethod[];
  annotations?: string[];
}

export interface UMLInterface extends UMLEntityBase {
  type: "interface";
  methods: UMLMethod[];
}

export interface UMLField {
  id: string;
  name: string;
  type: string;
  visibility: UMLVisibility;
  isStatic: boolean;
  isReadonly: boolean;
  defaultValue?: string;
}

export interface UMLMethod {
  id: string;
  signature: string;
  name: string;
  parameters: UMLMethodParameter[];
  returnType: string;
  visibility: UMLVisibility;
  isStatic: boolean;
  isAbstract: boolean;
}

export interface UMLMethodParameter {
  id: string;
  name: string;
  type: string;
}

export type UMLVisibility = "public" | "private" | "protected" | "package";

export interface UMLRelationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: UMLRelationshipType;
  label?: string;
  createdAt: string;
}

export type UMLRelationshipType =
  | "association"
  | "inheritance"
  | "realization"
  | "aggregation"
  | "composition"
  | "dependency";

export interface DiagramLayoutState {
  nodes: DiagramNodeLayout[];
}

export interface DiagramNodeLayout {
  entityId: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export interface DiagramViewportState {
  zoom: number;
  x: number;
  y: number;
}

export interface DiagramMetadata {
  isModified: boolean;
  lastManualEditAt?: string;
  generatedFrom?: "java";
  parserVersion?: string;
}

export interface ParserResult {
  success: boolean;
  diagram?: UMLDiagram;
  warnings: ParserWarning[];
  errors: ParserError[];
}

export interface ParserWarning {
  code: string;
  message: string;
  line?: number;
}

export interface ParserError {
  code: string;
  message: string;
  line?: number;
  column?: number;
}
