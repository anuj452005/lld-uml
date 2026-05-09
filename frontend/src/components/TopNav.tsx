"use client";

import React, { useState } from 'react';
import { Save, Share2, Settings, User, LogOut, Clock } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useSessionStore } from '@/stores/sessionStore';
import { usePersistenceStore } from '@/stores/persistenceStore';
import { useUMLStore } from '@/stores/umlStore';
import { SaveVersionModal } from '@/features/persistence/SaveVersionModal';
import { VersionListPanel } from '@/features/persistence/VersionListPanel';
import { signOut } from '@/app/(auth)/actions';
import { ExportMenu } from '@/components/ExportMenu';

export interface TopNavProps {
  diagramId?: string;
}

export const TopNav: React.FC<TopNavProps> = ({ diagramId: propDiagramId }) => {
  const pathname = usePathname();
  const user = useSessionStore((state) => state.user);
  const saveStatus = usePersistenceStore((state) => state.saveStatus);
  const errorMessage = usePersistenceStore((state) => state.errorMessage);
  const lastSavedAt = usePersistenceStore((state) => state.lastSavedAt);

  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [isVersionPanelOpen, setIsVersionPanelOpen] = useState(false);

  // Extract diagramId from URL if not provided via props
  const diagramId = propDiagramId || (pathname.includes('/workspace/') ? pathname.split('/workspace/')[1] : undefined);

  const { diagram } = useUMLStore();

  // Status badge styling
  const getStatusColor = () => {
    if (saveStatus === 'error') return 'text-status-error';
    if (saveStatus === 'saved') return 'text-status-success';
    if (saveStatus === 'saving') return 'text-status-warning';
    return 'text-text-secondary';
  };

  const getStatusText = () => {
    if (errorMessage) return 'Error';
    if (saveStatus === 'saving') return 'Saving...';
    if (saveStatus === 'saved') return 'Saved';
    if (saveStatus === 'dirty') return 'Unsaved';
    return 'Ready';
  };

  const getSourceTypeBadge = () => {
    if (!diagram) return null;
    
    let label = 'Manual';
    let styles = 'bg-bg-surface-tertiary text-text-tertiary';

    if (diagram.sourceType === 'java-generated') {
      label = 'Java Generated';
      styles = 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20';
    } else if (diagram.sourceType === 'mixed') {
      label = 'Modified';
      styles = 'bg-status-warning/10 text-status-warning border border-status-warning/20';
    }

    return (
      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md ${styles}`}>
        {label}
      </span>
    );
  };

  return (
    <>
      <nav className="h-[56px] w-full bg-bg-surface-primary border-b border-border-primary flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent-primary rounded-md flex items-center justify-center font-bold text-text-inverse">
              U
            </div>
            <span className="font-semibold text-text-primary">UML Architect</span>
          </div>
          <div className="h-4 w-[1px] bg-border-primary mx-2" />
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-text-secondary truncate max-w-[200px]">
              {diagram?.name || 'Untitled Diagram'}
            </span>
            {getSourceTypeBadge()}
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  saveStatus === 'error'
                    ? 'bg-status-error'
                    : saveStatus === 'saved'
                    ? 'bg-status-success'
                    : saveStatus === 'saving'
                    ? 'bg-status-warning'
                    : 'bg-status-warning'
                }`}
                title={errorMessage || getStatusText()}
              />
              <span className={`text-[11px] font-medium ${getStatusColor()}`}>{getStatusText()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {lastSavedAt && saveStatus === 'saved' && (
            <span className="text-xs text-text-tertiary flex items-center gap-1">
              <Clock size={12} />
              {lastSavedAt.toLocaleTimeString()}
            </span>
          )}

          <button
            onClick={() => setIsVersionModalOpen(true)}
            className="p-2 hover:bg-bg-surface-tertiary rounded-md text-text-secondary hover:text-text-primary transition-colors"
            title="Save Version"
          >
            <Save size={18} />
          </button>
          <button
            onClick={() => setIsVersionPanelOpen(true)}
            className="p-2 hover:bg-bg-surface-tertiary rounded-md text-text-secondary hover:text-text-primary transition-colors"
            title="View Versions"
          >
            <Clock size={18} />
          </button>
          <ExportMenu />
          <div className="h-4 w-[1px] bg-border-primary mx-1" />
          <button className="p-2 hover:bg-bg-surface-tertiary rounded-md text-text-secondary hover:text-text-primary transition-colors">
            <Settings size={18} />
          </button>

          {user ? (
            <div className="flex items-center gap-2 ml-2">
              <div className="flex flex-col items-end">
                <span className="text-[11px] text-text-tertiary leading-none">Logged in as</span>
                <span className="text-sm text-text-secondary leading-tight">{user.email}</span>
              </div>
              <button
                onClick={() => signOut()}
                className="p-2 hover:bg-bg-surface-tertiary rounded-md text-text-secondary hover:text-status-error transition-colors"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="w-8 h-8 bg-bg-surface-tertiary rounded-full flex items-center justify-center text-text-tertiary border border-border-primary">
              <User size={16} />
            </div>
          )}
        </div>
      </nav>

      {/* Modals and Panels */}
      <SaveVersionModal
        diagramId={diagramId}
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
      />
      <VersionListPanel
        diagramId={diagramId}
        isOpen={isVersionPanelOpen}
        onClose={() => setIsVersionPanelOpen(false)}
      />
    </>
  );
};
