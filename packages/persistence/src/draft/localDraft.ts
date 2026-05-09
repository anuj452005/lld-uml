/**
 * Local Draft persistence using localStorage.
 * This provides a safety net for unsaved changes during network failures.
 */

export interface LocalDraft {
  diagramId: string;
  data: any;
  updatedAt: string;
}

const STORAGE_PREFIX = 'uml_draft_';

export class LocalDraftManager {
  /**
   * Saves a diagram snapshot to local storage as a draft.
   */
  static saveDraft(diagramId: string, data: any): void {
    if (typeof window === 'undefined') return;

    const draft: LocalDraft = {
      diagramId,
      data,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(`${STORAGE_PREFIX}${diagramId}`, JSON.stringify(draft));
  }

  /**
   * Retrieves a draft from local storage.
   */
  static getDraft(diagramId: string): LocalDraft | null {
    if (typeof window === 'undefined') return null;

    const raw = localStorage.getItem(`${STORAGE_PREFIX}${diagramId}`);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as LocalDraft;
    } catch (e) {
      console.error('Failed to parse local draft:', e);
      return null;
    }
  }

  /**
   * Clears a specific draft.
   */
  static clearDraft(diagramId: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`${STORAGE_PREFIX}${diagramId}`);
  }

  /**
   * Checks if a local draft is newer than a given ISO timestamp.
   */
  static isDraftNewer(diagramId: string, serverUpdatedAt: string): boolean {
    const draft = this.getDraft(diagramId);
    if (!draft) return false;

    const draftTime = new Date(draft.updatedAt).getTime();
    const serverTime = new Date(serverUpdatedAt).getTime();

    return draftTime > serverTime;
  }
}
