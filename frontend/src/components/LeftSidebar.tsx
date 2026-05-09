"use client";

import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Box, 
  Layers, 
  Code2, 
  Database,
  Search
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const LeftSidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "h-full bg-bg-surface-primary border-r border-border-primary transition-all duration-300 flex flex-col relative z-40",
        isCollapsed ? "w-[48px]" : "w-[280px]"
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
      )}

      <div className="flex-1 overflow-y-auto">
        <SidebarSection 
          icon={<Box size={16} />} 
          title="UML Entities" 
          isCollapsed={isCollapsed}
          defaultOpen={true}
        >
          <SidebarItem label="com.app.User" type="class" />
          <SidebarItem label="com.app.AuthService" type="interface" />
          <SidebarItem label="com.app.Repository" type="class" />
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

        <SidebarSection 
          icon={<Code2 size={16} />} 
          title="Java Source" 
          isCollapsed={isCollapsed}
        >
          <div className="px-4 py-2 text-xs text-text-tertiary italic">
            Paste code to parse
          </div>
        </SidebarSection>
      </div>

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
