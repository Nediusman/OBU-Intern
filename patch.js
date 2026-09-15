const fs = require("fs");
const content = fs.readFileSync("src/backend/api.ts", "utf8");

const insertion = `
// ─── Research Projects ───────────────────────────────────────────────────────

export type ResearchProjectItem = {
  id: string;
  slug?: string;
  project_title: string;
  project_code?: string;
  category?: string;
  description?: string;
  principal_researcher?: string;
  department?: string;
  funding_source?: string;
  start_date?: string;
  end_date?: string;
  budget?: string;
  status: string;
  documents?: any;
  main_image_id?: string;
  image?: string;
};

export const getResearchProjects = createServerFn({ method: "GET" }).handler(async () => {
  await initDb();
  const db = getDb();
  const res = await db.query(
    \`SELECT p.id, p.slug, p.project_title, p.project_code, p.category, p.description,
            p.principal_researcher, p.department, p.funding_source, p.start_date, p.end_date,
            p.budget, p.status, p.documents, p.main_image_id, m.file_url as image
     FROM research_projects p
     LEFT JOIN media m ON p.main_image_id = m.id
     WHERE p.status = 'active'
     ORDER BY p.created_at DESC\`
  );
  return res.rows as ResearchProjectItem[];
});

export const getResearchProjectBySlug = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    await initDb();
    const db = getDb();
    const res = await db.query(
      \`SELECT p.id, p.slug, p.project_title, p.project_code, p.category, p.description,
              p.principal_researcher, p.department, p.funding_source, p.start_date, p.end_date,
              p.budget, p.status, p.documents, p.main_image_id, m.file_url as image
       FROM research_projects p
       LEFT JOIN media m ON p.main_image_id = m.id
       WHERE p.slug = $1 AND p.status = 'active'\`,
      [slug]
    );
    return (res.rows[0] as ResearchProjectItem) || null;
  });
`;

const modified = content.replace(
  "// ─── News ────────────────────────────────────────────────────────────────────",
  insertion + "\n// ─── News ────────────────────────────────────────────────────────────────────",
);

fs.writeFileSync("src/backend/api.ts", modified);
