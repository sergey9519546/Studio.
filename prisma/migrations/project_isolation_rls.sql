-- Row-Level Security (RLS) Policies for Project Data Isolation
-- Run this after the Prisma migrations to enable project-based data separation

-- Enable RLS on tables that need project isolation
ALTER TABLE knowledge_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_access_control ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE moodboard_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;

-- Create function to get current user's project access
CREATE OR REPLACE FUNCTION current_user_projects()
RETURNS SETOF uuid AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get current user from session (set via SET LOCAL)
  v_user_id := current_setting('app.current_user_id', TRUE)::uuid;
  
  IF v_user_id IS NULL THEN
    RETURN;
  END IF;
  
  -- Return all projects user owns
  RETURN QUERY
  SELECT id FROM projects WHERE "userId" = v_user_id;
  
  -- Return all projects user has access to
  RETURN QUERY
  SELECT "projectId" FROM project_access_control WHERE "userId" = v_user_id::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check project access
CREATE OR REPLACE FUNCTION has_project_access(project_id uuid, required_permission text DEFAULT 'read')
RETURNS boolean AS $$
DECLARE
  v_user_id uuid;
  v_is_owner boolean;
  v_has_permission boolean;
BEGIN
  v_user_id := current_setting('app.current_user_id', TRUE)::uuid;
  
  IF v_user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Check if user is project owner
  SELECT EXISTS(
    SELECT 1 FROM projects 
    WHERE id = project_id AND "userId" = v_user_id
  ) INTO v_is_owner;
  
  IF v_is_owner THEN
    RETURN TRUE;
  END IF;
  
  -- Check access control
  SELECT EXISTS(
    SELECT 1 FROM project_access_control pac
    WHERE pac."projectId" = project_id 
    AND pac."userId" = v_user_id::text
    AND (pac.permissions::jsonb ? required_permission OR pac.permissions::jsonb ? 'admin')
  ) INTO v_has_permission;
  
  RETURN v_has_permission;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for knowledge_sources
DROP POLICY IF EXISTS knowledge_sources_project_isolation ON knowledge_sources;
CREATE POLICY knowledge_sources_project_isolation ON knowledge_sources
  FOR ALL
  USING (
    "projectId" IS NULL 
    OR "projectId"::uuid IN (SELECT current_user_projects())
  );

-- RLS Policies for conversations
DROP POLICY IF EXISTS conversations_project_isolation ON conversations;
CREATE POLICY conversations_project_isolation ON conversations
  FOR ALL
  USING (
    "projectId" IS NULL 
    OR "projectId"::uuid IN (SELECT current_user_projects())
  );

-- RLS Policies for messages (inherit from conversation)
DROP POLICY IF EXISTS messages_project_isolation ON messages;
CREATE POLICY messages_project_isolation ON messages
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM conversations c 
      WHERE c.id = messages."conversationId"
      AND (c."projectId" IS NULL OR c."projectId"::uuid IN (SELECT current_user_projects()))
    )
  );

-- RLS Policies for project_embeddings
DROP POLICY IF EXISTS project_embeddings_isolation ON project_embeddings;
CREATE POLICY project_embeddings_isolation ON project_embeddings
  FOR ALL
  USING (
    "projectId"::uuid IN (SELECT current_user_projects())
  );

-- RLS Policies for project_audit_log
DROP POLICY IF EXISTS project_audit_log_isolation ON project_audit_log;
CREATE POLICY project_audit_log_isolation ON project_audit_log
  FOR ALL
  USING (
    "projectId"::uuid IN (SELECT current_user_projects())
  );

-- RLS Policies for project_access_control
DROP POLICY IF EXISTS project_access_control_isolation ON project_access_control;
CREATE POLICY project_access_control_isolation ON project_access_control
  FOR SELECT
  USING (
    "projectId"::uuid IN (SELECT current_user_projects())
  );

-- RLS Policies for assets
DROP POLICY IF EXISTS assets_project_isolation ON assets;
CREATE POLICY assets_project_isolation ON assets
  FOR ALL
  USING (
    "projectId" IS NULL 
    OR "projectId"::uuid IN (SELECT current_user_projects())
  );

-- RLS Policies for moodboard_items
DROP POLICY IF EXISTS moodboard_items_project_isolation ON moodboard_items;
CREATE POLICY moodboard_items_project_isolation ON moodboard_items
  FOR ALL
  USING (
    "projectId"::uuid IN (SELECT current_user_projects())
  );

-- RLS Policies for scripts
DROP POLICY IF EXISTS scripts_project_isolation ON scripts;
CREATE POLICY scripts_project_isolation ON scripts
  FOR ALL
  USING (
    "projectId"::uuid IN (SELECT current_user_projects())
  );

-- Create index for efficient project access lookups
CREATE INDEX IF NOT EXISTS idx_project_access_control_user_project 
  ON project_access_control("userId", "projectId");

CREATE INDEX IF NOT EXISTS idx_knowledge_sources_project 
  ON knowledge_sources("projectId");

CREATE INDEX IF NOT EXISTS idx_conversations_project 
  ON conversations("projectId");

CREATE INDEX IF NOT EXISTS idx_project_embeddings_project_hash 
  ON project_embeddings("projectId", "contentHash");

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION current_user_projects() TO PUBLIC;
GRANT EXECUTE ON FUNCTION has_project_access(uuid, text) TO PUBLIC;

-- Create helper function for setting current user context
CREATE OR REPLACE FUNCTION set_current_user_context(user_id uuid)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_user_id', user_id::text, TRUE);
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION set_current_user_context(uuid) TO PUBLIC;

COMMENT ON FUNCTION current_user_projects() IS 'Returns all project IDs the current user has access to';
COMMENT ON FUNCTION has_project_access(uuid, text) IS 'Checks if current user has specific permission on a project';
COMMENT ON FUNCTION set_current_user_context(uuid) IS 'Sets the current user context for RLS policies';
