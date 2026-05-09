import { createScopedClient } from '../utils/supabase.js';
export class DiagramService {
    /**
     * Creates a new diagram for the user.
     */
    static async createDiagram(token, name, sourceType) {
        const supabase = createScopedClient(token);
        // 1. Get the user from the token to set as owner
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user)
            throw new Error('Unauthorized');
        // 2. Create the diagram record
        const { data: diagram, error: diagError } = await supabase
            .from('diagrams')
            .insert({
            name,
            source_type: sourceType,
            owner_id: user.id
        })
            .select()
            .single();
        if (diagError)
            throw diagError;
        // 3. Create an initial "working" snapshot
        const { error: snapError } = await supabase
            .from('diagram_snapshots')
            .insert({
            diagram_id: diagram.id,
            snapshot_type: 'working',
            uml_model: { classes: [], interfaces: [], relationships: [] },
            layout_state: { nodes: [] },
            viewport_state: { zoom: 1, x: 0, y: 0 },
            metadata: { isModified: false }
        });
        if (snapError)
            throw snapError;
        return diagram;
    }
    /**
     * Lists all diagrams for the user.
     */
    static async listDiagrams(token) {
        const supabase = createScopedClient(token);
        const { data, error } = await supabase
            .from('diagrams')
            .select('*')
            .eq('is_deleted', false)
            .order('updated_at', { ascending: false });
        if (error)
            throw error;
        return data;
    }
    /**
     * Retrieves a full diagram with its latest working snapshot.
     */
    static async getDiagram(token, id) {
        const supabase = createScopedClient(token);
        // 1. Get diagram metadata
        const { data: diagram, error: diagError } = await supabase
            .from('diagrams')
            .select('*')
            .eq('id', id)
            .single();
        if (diagError)
            throw diagError;
        // 2. Get latest working snapshot
        const { data: snapshot, error: snapError } = await supabase
            .from('diagram_snapshots')
            .select('*')
            .eq('diagram_id', id)
            .eq('snapshot_type', 'working')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
        if (snapError)
            throw snapError;
        // 3. Assemble the canonical UMLDiagram object
        return {
            id: diagram.id,
            name: diagram.name,
            sourceType: diagram.source_type,
            classes: snapshot.uml_model.classes || [],
            interfaces: snapshot.uml_model.interfaces || [],
            relationships: snapshot.uml_model.relationships || [],
            layout: snapshot.layout_state,
            viewport: snapshot.viewport_state,
            metadata: snapshot.metadata,
            createdAt: diagram.created_at,
            updatedAt: diagram.updated_at
        };
    }
}
