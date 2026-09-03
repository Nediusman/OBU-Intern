ALTER TABLE research_projects ADD COLUMN slug TEXT;
CREATE UNIQUE INDEX research_projects_slug_idx ON research_projects(slug);
