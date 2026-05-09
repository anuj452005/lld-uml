"use client";

import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from 'reactflow';
import { UMLRelationshipType } from '@/types/uml';

interface RelationshipEdgeData {
  relType: UMLRelationshipType;
  label?: string;
}

interface RelationshipEdgeProps extends EdgeProps<RelationshipEdgeData> {
  variant: UMLRelationshipType;
}

type MarkerKind = 'start' | 'end';

const EDGE_COLOR = 'var(--color-diagram-edge-default)';
const EDGE_ACTIVE_COLOR = 'var(--color-diagram-edge-active)';

export const RelationshipEdge: React.FC<RelationshipEdgeProps> = ({
  id,
  variant,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  data,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const color = selected ? EDGE_ACTIVE_COLOR : EDGE_COLOR;
  const markerIds = getMarkerIds(id, variant);
  const label = data?.label;

  return (
    <g style={{ color }}>
      <defs>{renderMarkers(markerIds, variant)}</defs>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: 'currentColor',
          strokeWidth: 2,
          strokeDasharray: getStrokeDasharray(variant),
        }}
        markerStart={markerIds.start ? `url(#${markerIds.start})` : undefined}
        markerEnd={markerIds.end ? `url(#${markerIds.end})` : undefined}
      />
      {label ? (
        <EdgeLabelRenderer>
          <div
            className="pointer-events-none rounded-sm border border-border-primary bg-bg-surface-primary px-2 py-0.5 text-[10px] text-text-secondary shadow-sm"
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      ) : null}
    </g>
  );
};

function getStrokeDasharray(variant: UMLRelationshipType): string | undefined {
  return variant === 'dependency' || variant === 'realization' ? '6 4' : undefined;
}

function getMarkerIds(id: string, variant: UMLRelationshipType): Record<MarkerKind, string | undefined> {
  const baseId = `uml-${variant}-${id}`;

  switch (variant) {
    case 'aggregation':
      return { start: `${baseId}-diamond-open`, end: `${baseId}-arrow-open` };
    case 'composition':
      return { start: `${baseId}-diamond-filled`, end: `${baseId}-arrow-open` };
    case 'inheritance':
    case 'realization':
      return { start: undefined, end: `${baseId}-triangle-open` };
    case 'association':
    case 'dependency':
    default:
      return { start: undefined, end: `${baseId}-arrow-open` };
  }
}

function renderMarkers(
  markerIds: Record<MarkerKind, string | undefined>,
  variant: UMLRelationshipType
) {
  const markerColor = 'currentColor';

  return (
    <>
      {markerIds.end && (
        <marker
          id={markerIds.end}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="8"
          markerHeight="8"
          orient="auto"
          markerUnits="strokeWidth"
        >
          {variant === 'inheritance' || variant === 'realization' ? (
            <path d="M 1 1 L 9 5 L 1 9 z" fill="none" stroke={markerColor} strokeWidth="1.5" />
          ) : (
            <path d="M 1 1 L 9 5 L 1 9" fill="none" stroke={markerColor} strokeWidth="1.5" />
          )}
        </marker>
      )}

      {markerIds.start && (
        <marker
          id={markerIds.start}
          viewBox="0 0 12 12"
          refX="2"
          refY="6"
          markerWidth="10"
          markerHeight="10"
          orient="auto-start-reverse"
          markerUnits="strokeWidth"
        >
          {variant === 'composition' ? (
            <path d="M 2 6 L 6 1 L 10 6 L 6 11 Z" fill={markerColor} stroke={markerColor} strokeWidth="1.2" />
          ) : (
            <path d="M 2 6 L 6 1 L 10 6 L 6 11 Z" fill="none" stroke={markerColor} strokeWidth="1.5" />
          )}
        </marker>
      )}
    </>
  );
}