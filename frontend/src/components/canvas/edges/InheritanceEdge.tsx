"use client";

import React from 'react';
import { EdgeProps } from 'reactflow';
import { UMLRelationshipType } from '@/types/uml';
import { RelationshipEdge } from './RelationshipEdge';

export const InheritanceEdge: React.FC<EdgeProps> = (props) => (
  <RelationshipEdge {...(props as EdgeProps<{ relType: UMLRelationshipType; label?: string }>)} variant="inheritance" />
);