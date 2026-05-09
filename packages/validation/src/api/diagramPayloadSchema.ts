import { z } from 'zod';

const UMLVisibilitySchema = z.enum(['public', 'private', 'protected', 'package']);

const UMLRelationshipTypeSchema = z.enum([
  'association',
  'inheritance',
  'realization',
  'aggregation',
  'composition',
  'dependency',
]);

const UMLFieldSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  type: z.string().min(1),
  visibility: UMLVisibilitySchema,
  isStatic: z.boolean(),
  isReadonly: z.boolean(),
  defaultValue: z.string().optional(),
});

const UMLMethodParameterSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  type: z.string().min(1),
});

const UMLMethodSchema = z.object({
  id: z.string(),
  signature: z.string().min(1),
  name: z.string().min(1),
  parameters: z.array(UMLMethodParameterSchema),
  returnType: z.string().min(1),
  visibility: UMLVisibilitySchema,
  isStatic: z.boolean(),
  isAbstract: z.boolean(),
});

const UMLClassSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  type: z.literal('class'),
  visibility: UMLVisibilitySchema,
  isAbstract: z.boolean(),
  fields: z.array(UMLFieldSchema),
  methods: z.array(UMLMethodSchema),
  annotations: z.array(z.string()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const UMLInterfaceSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  type: z.literal('interface'),
  methods: z.array(UMLMethodSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const UMLRelationshipSchema = z.object({
  id: z.string(),
  sourceId: z.string(),
  targetId: z.string(),
  type: UMLRelationshipTypeSchema,
  label: z.string().optional(),
  createdAt: z.string(),
});

const DiagramLayoutNodeSchema = z.object({
  entityId: z.string(),
  x: z.number(),
  y: z.number(),
  width: z.number().optional(),
  height: z.number().optional(),
});

const DiagramLayoutSchema = z.object({
  nodes: z.array(DiagramLayoutNodeSchema),
});

const DiagramViewportSchema = z.object({
  zoom: z.number(),
  x: z.number(),
  y: z.number(),
});

const DiagramMetadataSchema = z.object({
  isModified: z.boolean(),
  lastManualEditAt: z.string().optional(),
  generatedFrom: z.literal('java').optional(),
  parserVersion: z.string().optional(),
});

export const UMLDiagramSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  sourceType: z.enum(['manual', 'java-generated', 'mixed']),
  classes: z.array(UMLClassSchema),
  interfaces: z.array(UMLInterfaceSchema),
  relationships: z.array(UMLRelationshipSchema),
  layout: DiagramLayoutSchema,
  viewport: DiagramViewportSchema,
  metadata: DiagramMetadataSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateDiagramPayloadSchema = z.object({
  name: z.string().min(1),
  sourceType: z.enum(['manual', 'java-generated', 'mixed']),
});

export const UpdateDiagramPayloadSchema = z.object({
  diagram: UMLDiagramSchema,
  layout: DiagramLayoutSchema,
  viewport: DiagramViewportSchema,
});
