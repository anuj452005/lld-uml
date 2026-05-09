import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div className={clsx("animate-pulse bg-bg-surface-tertiary rounded", className)} />
);

export const CanvasSkeleton: React.FC = () => (
  <div className="flex-1 bg-bg-canvas relative overflow-hidden flex flex-col p-8">
    <div className="flex-1 border-2 border-dashed border-border-secondary rounded-2xl flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <Skeleton className="w-48 h-6" />
        <Skeleton className="w-32 h-4" />
      </div>
    </div>
  </div>
);

export const ListSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
    {[1, 2, 3, 4, 5, 6].map(i => (
      <div key={i} className="h-[160px] bg-bg-surface-secondary rounded-xl border border-border-primary p-5 flex flex-col justify-between">
        <div className="flex justify-between">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <Skeleton className="w-16 h-5" />
        </div>
        <div>
          <Skeleton className="w-3/4 h-5 mb-2" />
          <Skeleton className="w-1/2 h-4" />
        </div>
      </div>
    ))}
  </div>
);
