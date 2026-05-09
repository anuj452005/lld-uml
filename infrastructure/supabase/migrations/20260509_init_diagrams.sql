-- 001_create_diagrams.sql
CREATE TABLE diagrams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL CHECK (name <> ''),
  source_type TEXT NOT NULL CHECK (source_type IN ('manual', 'java-generated', 'mixed')),
  current_version_id UUID,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_diagrams_owner ON diagrams(owner_id);

ALTER TABLE diagrams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own diagrams" ON diagrams
  USING (auth.uid() = owner_id);

-- 002_create_diagram_versions.sql
CREATE TABLE diagram_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diagram_id UUID NOT NULL REFERENCES diagrams(id) ON DELETE CASCADE,
  version_name TEXT,
  snapshot_id UUID NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_versions_diagram ON diagram_versions(diagram_id);

ALTER TABLE diagram_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage versions of their diagrams" ON diagram_versions
  USING (EXISTS (
    SELECT 1 FROM diagrams WHERE diagrams.id = diagram_id AND diagrams.owner_id = auth.uid()
  ));

-- 003_create_diagram_snapshots.sql
CREATE TABLE diagram_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diagram_id UUID NOT NULL REFERENCES diagrams(id) ON DELETE CASCADE,
  snapshot_type TEXT NOT NULL CHECK (snapshot_type IN ('working', 'version', 'autosave')),
  uml_model JSONB NOT NULL,
  layout_state JSONB NOT NULL,
  viewport_state JSONB NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_snapshots_diagram ON diagram_snapshots(diagram_id);

ALTER TABLE diagram_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage snapshots of their diagrams" ON diagram_snapshots
  USING (EXISTS (
    SELECT 1 FROM diagrams WHERE diagrams.id = diagram_id AND diagrams.owner_id = auth.uid()
  ));
