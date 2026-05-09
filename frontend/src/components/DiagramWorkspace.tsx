import React from 'react';

export const DiagramWorkspace: React.FC = () => {
  return (
    <main className="flex-1 bg-bg-canvas relative overflow-hidden flex items-center justify-center">
      {/* Grid Pattern Placeholder */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: `radial-gradient(circle, #E6EDF3 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }} 
      />
      
      <div className="z-10 text-center">
        <h2 className="text-text-tertiary text-lg font-medium mb-2">Diagram Canvas</h2>
        <p className="text-text-tertiary opacity-50 text-sm">
          React Flow renderer will be implemented in Unit 04
        </p>
      </div>

      {/* Floating Toolbar Placeholder */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-bg-surface-primary border border-border-primary rounded-lg shadow-lg px-2 py-1 flex items-center gap-1 z-30">
        <ToolbarButton label="Select" active />
        <ToolbarButton label="Add Class" />
        <ToolbarButton label="Connect" />
        <div className="w-[1px] h-4 bg-border-primary mx-1" />
        <ToolbarButton label="Auto Layout" />
      </div>

      {/* Floating Controls Placeholder */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-30">
        <div className="bg-bg-surface-primary border border-border-primary rounded-lg shadow-lg overflow-hidden flex flex-col">
          <ControlButton label="+" />
          <div className="h-[1px] bg-border-primary" />
          <ControlButton label="−" />
        </div>
        <div className="bg-bg-surface-primary border border-border-primary rounded-lg shadow-lg p-1">
          <ControlButton label="⌗" />
        </div>
      </div>
    </main>
  );
};

const ToolbarButton: React.FC<{ label: string; active?: boolean }> = ({ label, active }) => (
  <button className={`
    px-3 py-1.5 rounded-md text-xs font-medium transition-colors
    ${active 
      ? 'bg-accent-primary text-text-inverse' 
      : 'text-text-secondary hover:bg-bg-surface-tertiary hover:text-text-primary'}
  `}>
    {label}
  </button>
);

const ControlButton: React.FC<{ label: string }> = ({ label }) => (
  <button className="w-8 h-8 flex items-center justify-center text-text-secondary hover:bg-bg-surface-tertiary hover:text-text-primary transition-colors">
    {label}
  </button>
);
