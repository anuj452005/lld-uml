import { Request, Response } from 'express';
import { createScopedClient } from '../utils/supabase.js';
import type { UMLDiagram } from '../types/uml.js';

/**
 * PersistenceController
 *
 * Handlers for:
 * - PUT /:id — save working snapshot only (no version)
 * - POST /:id/versions — create immutable version
 * - GET /:id/versions — list versions
 * - POST /:versionId/restore — restore version to working snapshot
 */
export class PersistenceController {
  /**
   * PUT /api/v1/diagrams/:id
   *
   * Save the working snapshot WITHOUT creating a version.
   * Used by auto-save and manual edits.
   */
  static async saveWorkingSnapshot(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { diagram, layout, viewport } = req.body;
      const token = (req as any).token;

      if (!diagram || !layout || !viewport) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_PAYLOAD',
            message: 'Missing required fields: diagram, layout, viewport',
          },
        });
      }

      const supabase = createScopedClient(token);

      // 1. Verify ownership
      const { data: diagramRecord, error: diagError } = await supabase
        .from('diagrams')
        .select('owner_id')
        .eq('id', id)
        .single();

      if (diagError || !diagramRecord) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Diagram not found' },
        });
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user || user.id !== diagramRecord.owner_id) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'Not authorized to update this diagram' },
        });
      }

      // 2. Update diagram timestamp
      await supabase
        .from('diagrams')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', id);

      // 3. Update working snapshot
      const { error: snapError } = await supabase
        .from('diagram_snapshots')
        .update({
          uml_model: {
            classes: diagram.classes,
            interfaces: diagram.interfaces,
            relationships: diagram.relationships,
          },
          layout_state: layout,
          viewport_state: viewport,
          metadata: { ...diagram.metadata, isModified: false },
        })
        .eq('diagram_id', id)
        .eq('snapshot_type', 'working');

      if (snapError) throw snapError;

      return res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('Error saving working snapshot:', error);
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: error.message },
      });
    }
  }

  /**
   * POST /api/v1/diagrams/:id/versions
   *
   * Create an immutable named version from the current working snapshot.
   */
  static async createVersion(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { versionName } = req.body;
      const token = (req as any).token;

      if (!versionName || typeof versionName !== 'string') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_PAYLOAD',
            message: 'Missing required field: versionName',
          },
        });
      }

      const supabase = createScopedClient(token);

      // 1. Verify ownership
      const { data: diagramRecord, error: diagError } = await supabase
        .from('diagrams')
        .select('owner_id')
        .eq('id', id)
        .single();

      if (diagError || !diagramRecord) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Diagram not found' },
        });
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user || user.id !== diagramRecord.owner_id) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'Not authorized to create version' },
        });
      }

      // 2. Get current working snapshot
      const { data: workingSnapshot, error: snapError } = await supabase
        .from('diagram_snapshots')
        .select('*')
        .eq('diagram_id', id)
        .eq('snapshot_type', 'working')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (snapError || !workingSnapshot) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Working snapshot not found' },
        });
      }

      // 3. Create immutable version snapshot
      const { data: versionSnapshot, error: versionSnapError } = await supabase
        .from('diagram_snapshots')
        .insert({
          diagram_id: id,
          snapshot_type: 'version',
          uml_model: workingSnapshot.uml_model,
          layout_state: workingSnapshot.layout_state,
          viewport_state: workingSnapshot.viewport_state,
          metadata: { ...workingSnapshot.metadata, isModified: false },
        })
        .select()
        .single();

      if (versionSnapError) throw versionSnapError;

      // 4. Create version record
      const { data: version, error: versionError } = await supabase
        .from('diagram_versions')
        .insert({
          diagram_id: id,
          version_name: versionName,
          snapshot_id: versionSnapshot.id,
          created_by: user.id
        })
        .select()
        .single();

      if (versionError) throw versionError;

      return res.status(201).json({
        success: true,
        data: { version },
      });
    } catch (error: any) {
      console.error('Error creating version:', error);
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: error.message },
      });
    }
  }

  /**
   * GET /api/v1/diagrams/:id/versions
   *
   * List all versions for a diagram (metadata only, no snapshots).
   */
  static async listVersions(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const token = (req as any).token;

      const supabase = createScopedClient(token);

      // 1. Verify ownership
      const { data: diagramRecord, error: diagError } = await supabase
        .from('diagrams')
        .select('owner_id')
        .eq('id', id)
        .single();

      if (diagError || !diagramRecord) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Diagram not found' },
        });
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user || user.id !== diagramRecord.owner_id) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'Not authorized to view versions' },
        });
      }

      // 2. Get versions (metadata only)
      const { data: versions, error: versionError } = await supabase
        .from('diagram_versions')
        .select('id, diagram_id, version_name, snapshot_id, created_at')
        .eq('diagram_id', id)
        .order('created_at', { ascending: false });

      if (versionError) throw versionError;

      return res.status(200).json({
        success: true,
        data: { versions: versions || [] },
      });
    } catch (error: any) {
      console.error('Error listing versions:', error);
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: error.message },
      });
    }
  }

  /**
   * POST /api/v1/versions/:versionId/restore
   *
   * Restore a version to the working snapshot.
   * Does NOT mutate the version record itself.
   */
  static async restoreVersion(req: Request, res: Response) {
    try {
      const { versionId } = req.params;
      const token = (req as any).token;

      const supabase = createScopedClient(token);

      // 1. Get version record
      const { data: version, error: versionError } = await supabase
        .from('diagram_versions')
        .select('*')
        .eq('id', versionId)
        .single();

      if (versionError || !version) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Version not found' },
        });
      }

      // 2. Verify ownership
      const { data: diagramRecord, error: diagError } = await supabase
        .from('diagrams')
        .select('owner_id')
        .eq('id', version.diagram_id)
        .single();

      if (diagError || !diagramRecord) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Diagram not found' },
        });
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user || user.id !== diagramRecord.owner_id) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'Not authorized to restore' },
        });
      }

      // 3. Get version snapshot
      const { data: versionSnapshot, error: snapError } = await supabase
        .from('diagram_snapshots')
        .select('*')
        .eq('id', version.snapshot_id)
        .single();

      if (snapError || !versionSnapshot) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Version snapshot not found' },
        });
      }

      // 4. Update working snapshot with version content
      const { error: updateError } = await supabase
        .from('diagram_snapshots')
        .update({
          uml_model: versionSnapshot.uml_model,
          layout_state: versionSnapshot.layout_state,
          viewport_state: versionSnapshot.viewport_state,
          metadata: { ...versionSnapshot.metadata, isModified: false },
        })
        .eq('diagram_id', version.diagram_id)
        .eq('snapshot_type', 'working');

      if (updateError) throw updateError;

      // 5. Update diagram timestamp
      await supabase
        .from('diagrams')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', version.diagram_id);

      // 6. Return the restored snapshot data
      return res.status(200).json({
        success: true,
        data: {
          diagram: versionSnapshot.uml_model,
          layout: versionSnapshot.layout_state,
          viewport: versionSnapshot.viewport_state,
        },
      });
    } catch (error: any) {
      console.error('Error restoring version:', error);
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: error.message },
      });
    }
  }
}
