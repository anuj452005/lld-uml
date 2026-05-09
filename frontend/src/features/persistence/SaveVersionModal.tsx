'use client';

import { useState } from 'react';
import { useSaveVersion } from '@/hooks/useSaveVersion';

export interface SaveVersionModalProps {
  diagramId: string | undefined;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * SaveVersionModal
 *
 * Modal for entering a version name and creating an explicit version.
 * Appears when user clicks "Save Version" button.
 *
 * Rules:
 * - Require non-empty version name
 * - Show loading state while creating
 * - Show error if save fails
 * - Close modal on success
 */
export function SaveVersionModal({
  diagramId,
  isOpen,
  onClose,
  onSuccess,
}: SaveVersionModalProps) {
  const [versionName, setVersionName] = useState('');
  const { saveVersion, isCreating } = useSaveVersion(diagramId);

  const handleSave = async () => {
    if (!versionName.trim()) return;

    const result = await saveVersion(versionName.trim());
    if (result) {
      setVersionName('');
      onClose();
      onSuccess?.();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-bg-surface-primary p-6 shadow-2xl border border-border-primary animate-in fade-in zoom-in duration-200">
        <h2 className="mb-4 text-lg font-semibold text-text-primary">Save Version</h2>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-text-secondary">
            Version Name
          </label>
          <input
            type="text"
            value={versionName}
            onChange={(e) => setVersionName(e.target.value)}
            placeholder="e.g., Initial Draft, Milestone 1..."
            className="w-full rounded-md border border-border-primary bg-bg-surface-secondary px-3 py-2 text-text-primary placeholder-text-tertiary focus:border-accent-primary focus:outline-none transition-colors"
            disabled={isCreating}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
            }}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isCreating}
            className="flex-1 rounded-md border border-border-primary px-4 py-2 text-sm font-medium text-text-primary hover:bg-bg-surface-tertiary disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isCreating || !versionName.trim()}
            className="flex-1 rounded-md bg-accent-primary px-4 py-2 text-sm font-medium text-text-inverse hover:bg-accent-primary/90 disabled:opacity-50 transition-colors"
          >
            {isCreating ? 'Saving...' : 'Save Version'}
          </button>
        </div>
      </div>
    </div>
  );
}
