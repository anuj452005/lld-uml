import { UMLDiagram } from '../types/uml';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005/api/v1';

export interface DiagramVersion {
  id: string;
  diagramId: string;
  version_name?: string;
  snapshotId: string;
  createdAt: string;
}

export interface SaveSnapshotPayload {
  diagram: UMLDiagram;
  layout: UMLDiagram['layout'];
  viewport: UMLDiagram['viewport'];
}

export class PersistenceService {
  /**
   * Save the working snapshot (auto-save or manual).
   * Does NOT create a version record.
   *
   * PUT /api/v1/diagrams/:diagramId
   */
  static async saveWorkingSnapshot(
    token: string,
    diagramId: string,
    payload: SaveSnapshotPayload
  ): Promise<void> {
    const response = await fetch(`${API_URL}/diagrams/${diagramId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to save diagram');
    }
  }

  /**
   * Create an explicit named version (immutable snapshot).
   *
   * POST /api/v1/diagrams/:diagramId/versions
   */
  static async createVersion(
    token: string,
    diagramId: string,
    versionName: string
  ): Promise<DiagramVersion> {
    const response = await fetch(`${API_URL}/diagrams/${diagramId}/versions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ versionName }),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to create version');
    }

    return result.data.version;
  }

  /**
   * List all versions for a diagram (metadata only).
   *
   * GET /api/v1/diagrams/:diagramId/versions
   */
  static async getVersions(
    token: string,
    diagramId: string
  ): Promise<DiagramVersion[]> {
    const response = await fetch(`${API_URL}/diagrams/${diagramId}/versions`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to fetch versions');
    }

    return result.data.versions || [];
  }

  /**
   * Restore a version to the working snapshot.
   * Does NOT mutate the version record itself.
   *
   * POST /api/v1/versions/:versionId/restore
   */
  static async restoreVersion(
    token: string,
    versionId: string
  ): Promise<SaveSnapshotPayload> {
    const response = await fetch(`${API_URL}/versions/${versionId}/restore`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to restore version');
    }

    // Response should contain the snapshot data (diagram, layout, viewport)
    return result.data;
  }
}
