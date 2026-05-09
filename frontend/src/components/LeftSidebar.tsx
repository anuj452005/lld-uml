"use client";

import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Box, 
  Layers, 
  Code2, 
  Database,
  Search,
  Plus
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useUIStore } from '@/stores/uiStore';
import { JavaEditorPanel } from '@/features/java-editor/JavaEditorPanel';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const LeftSidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'structure' | 'import'>('structure');
  const setClassEditorOpen = useUIStore((state) => state.setClassEditorOpen);
  const setSelectedNode = useUIStore((state) => state.setSelectedNode);

  const handleAddClass = () => {
    setSelectedNode(null);
    setClassEditorOpen(true);
  };

  return (
    <aside 
      className={cn(
        "h-full bg-bg-surface-primary border-r border-border-primary transition-all duration-300 flex flex-col relative z-40",
        isCollapsed ? "w-[48px]" : "w-[320px]"
      )}
    >
      <div className="flex items-center justify-between p-3 border-b border-border-primary min-h-[56px]">
        {!isCollapsed && <span className="font-medium text-sm text-text-secondary uppercase tracking-wider">Explorer</span>}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-bg-surface-tertiary rounded-md text-text-tertiary hover:text-text-primary transition-colors ml-auto"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="flex border-b border-border-primary">
          <button
            onClick={() => setActiveTab('structure')}
            className={cn(
              "flex-1 py-2 text-xs font-semibold transition-colors border-b-2",
              activeTab === 'structure' 
                ? "text-accent-primary border-accent-primary bg-bg-surface-secondary" 
                : "text-text-tertiary border-transparent hover:text-text-secondary"
            )}
          >
            Structure
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={cn(
              "flex-1 py-2 text-xs font-semibold transition-colors border-b-2",
              activeTab === 'import' 
                ? "text-accent-primary border-accent-primary bg-bg-surface-secondary" 
                : "text-text-tertiary border-transparent hover:text-text-secondary"
            )}
          >
            Code Import
          </button>
        </div>
      )}

      {!isCollapsed && activeTab === 'structure' && (
        <>
          <div className="px-3 py-3 border-b border-border-secondary">
            <button 
              onClick={handleAddClass}
              className="w-full flex items-center justify-center gap-2 bg-accent-primary hover:bg-accent-primary-hover text-text-inverse py-2 rounded-md text-xs font-semibold transition-colors shadow-sm"
            >
              <Plus size={14} />
              Add Class
            </button>
          </div>

          <div className="px-3 py-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-text-tertiary" size={14} />
              <input 
                type="text" 
                placeholder="Filter entities..."
                className="w-full bg-bg-surface-secondary border border-border-primary rounded-md py-1.5 pl-8 pr-3 text-xs text-text-primary focus:outline-none focus:border-border-active transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <SidebarSection 
              icon={<Box size={16} />} 
              title="UML Entities" 
              isCollapsed={isCollapsed}
              defaultOpen={true}
            >
              <div className="flex flex-col">
                <SidebarItem label="com.app.User" type="class" />
                <SidebarItem label="com.app.AuthService" type="interface" />
              </div>
            </SidebarSection>

            <SidebarSection 
              icon={<Layers size={16} />} 
              title="Relationships" 
              isCollapsed={isCollapsed}
            >
              <div className="px-4 py-2 text-xs text-text-tertiary italic">
                No relationships defined
              </div>
            </SidebarSection>
          </div>
        </>
      )}

      {!isCollapsed && activeTab === 'import' && (
        <div className="flex-1 overflow-hidden">
          <JavaEditorPanel />
        </div>
      )}

      {isCollapsed && (
        <div className="flex-1 flex flex-col items-center py-4 gap-4">
          <Box size={20} className="text-text-tertiary hover:text-accent-primary cursor-pointer" onClick={() => setIsCollapsed(false)} />
          <Layers size={20} className="text-text-tertiary hover:text-accent-primary cursor-pointer" onClick={() => setIsCollapsed(false)} />
          <Code2 size={20} className="text-text-tertiary hover:text-accent-primary cursor-pointer" onClick={() => { setIsCollapsed(false); setActiveTab('import'); }} />
        </div>
      )}

      <div className="mt-auto border-t border-border-primary p-2">
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-md hover:bg-bg-surface-tertiary transition-colors cursor-pointer text-text-secondary hover:text-text-primary",
          isCollapsed && "justify-center"
        )}>
          <Database size={18} />
          {!isCollapsed && <span className="text-sm font-medium">History & Versions</span>}
        </div>
      </div>
    </aside>
  );
};

interface SidebarSectionProps {
  icon: React.ReactNode;
  title: string;
  isCollapsed: boolean;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ icon, title, isCollapsed, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center py-4 border-b border-border-secondary text-text-tertiary hover:text-text-primary cursor-pointer transition-colors">
        {icon}
      </div>
    );
  }

  return (
    <div className="border-b border-border-secondary">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-bg-surface-tertiary transition-colors text-text-secondary hover:text-text-primary"
      >
        {icon}
        <span className="text-sm font-medium flex-1 text-left">{title}</span>
        <ChevronRight size={14} className={cn("transition-transform", isOpen && "rotate-90")} />
      </button>
      {isOpen && <div className="pb-2">{children}</div>}
    </div>
  );
};

const SidebarItem: React.FC<{ label: string; type: 'class' | 'interface' }> = ({ label, type }) => (
  <div className="px-4 py-1.5 flex items-center gap-2 hover:bg-bg-surface-tertiary cursor-pointer group">
    <div className={cn(
      "w-2 h-2 rounded-full",
      type === 'class' ? "bg-accent-primary" : "bg-status-success"
    )} />
    <span className="text-xs text-text-secondary group-hover:text-text-primary transition-colors truncate">
      {label}
    </span>
  </div>
);
