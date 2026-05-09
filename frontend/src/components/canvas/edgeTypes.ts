import { EdgeTypes } from 'reactflow';
import { AssociationEdge } from './edges/AssociationEdge';
import { InheritanceEdge } from './edges/InheritanceEdge';
import { RealizationEdge } from './edges/RealizationEdge';
import { AggregationEdge } from './edges/AggregationEdge';
import { CompositionEdge } from './edges/CompositionEdge';
import { DependencyEdge } from './edges/DependencyEdge';

export const edgeTypes: EdgeTypes = {
  association: AssociationEdge,
  inheritance: InheritanceEdge,
  realization: RealizationEdge,
  aggregation: AggregationEdge,
  composition: CompositionEdge,
  dependency: DependencyEdge,
};