export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export type UMLVisibility = 'public' | 'private' | 'protected' | 'package';

export interface UMLMethodParameter {
  id: string;
  name: string;
  type: string;
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

export interface UMLField {
  id: string;
  name: string;
  type: string;
  visibility: UMLVisibility;
  isStatic: boolean;
  isReadonly: boolean;
  defaultValue?: string;
}

export interface UMLRelationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: UMLRelationshipType;
  label?: string;
  createdAt: string;
}

export type UMLRelationshipType =
  | 'association'
  | 'inheritance'
  | 'realization'
  | 'aggregation'
  | 'composition'
  | 'dependency';

export interface UMLClass {
  id: string;
  name: string;
  type: 'class';
  visibility: UMLVisibility;
  isAbstract: boolean;
  fields: UMLField[];
  methods: UMLMethod[];
  annotations?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UMLInterface {
  id: string;
  name: string;
  type: 'interface';
  methods: UMLMethod[];
  createdAt: string;
  updatedAt: string;
}

export interface DiagramLayoutNode {
  entityId: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export interface DiagramLayoutState {
  nodes: DiagramLayoutNode[];
}

export interface DiagramViewportState {
  zoom: number;
  x: number;
  y: number;
}

export interface DiagramMetadata {
  isModified: boolean;
  lastManualEditAt?: string;
  generatedFrom?: 'java';
  parserVersion?: string;
}

export interface UMLDiagram {
  id: string;
  name: string;
  description?: string;
  sourceType: 'manual' | 'java-generated' | 'mixed';
  classes: UMLClass[];
  interfaces: UMLInterface[];
  relationships: UMLRelationship[];
  layout: DiagramLayoutState;
  viewport: DiagramViewportState;
  metadata: DiagramMetadata;
  createdAt: string;
  updatedAt: string;
}
