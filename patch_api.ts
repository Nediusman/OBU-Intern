import fs from 'fs';

const apiContent = fs.readFileSync('src/backend/api.ts', 'utf8');

const newFunctions = `
// ─── Registrar Documents ──────────────────────────────────────────────────────

export type RegistrarDocumentItem = {
  id: string;
  original_name: string;
  file_size: number | null;
  file_url: string;
  file_type: string | null;
};

export const getRegistrarDocuments = createServerFn({ method: "GET" }).handler(async () => {
  await initDb();
  const db = getDb();
  const res = await db.query(
    \`SELECT id, original_name, file_size, file_url, file_type
     FROM media
     WHERE folder = 'registrar-documents'
     ORDER BY created_at DESC\`
  );
  return res.rows as RegistrarDocumentItem[];
});

// ─── Services ──────────────────────────────────────────────────────────────

export type ServiceItem = {
  id: string;
  slug: string | null;
  service_name: string;
  description?: string;
  department?: string;
  status: string;
  main_image_id?: string;
  image?: string;
};

export const getServices = createServerFn({ method: "GET" }).handler(async () => {
  await initDb();
  const db = getDb();
  const res = await db.query(
    \`SELECT s.id, s.slug, s.service_name, s.description, s.department, s.status, s.main_image_id, m.file_url as image
     FROM services s
     LEFT JOIN media m ON s.main_image_id = m.id
     WHERE s.status = 'active'
     ORDER BY s.created_at DESC\`
  );
  return res.rows as ServiceItem[];
});

export const getServiceBySlug = createServerFn({ method: "GET" })
  .validator((slugOrId: string) => slugOrId)
  .handler(async ({ data: slugOrId }) => {
    await initDb();
    const db = getDb();
    const res = await db.query(
      \`SELECT s.id, s.slug, s.service_name, s.description, s.department, s.status, s.main_image_id, m.file_url as image
       FROM services s
       LEFT JOIN media m ON s.main_image_id = m.id
       WHERE (s.slug = $1 OR s.id::text = $1) AND s.status = 'active'\`,
      [slugOrId]
    );
    return (res.rows[0] as ServiceItem) || null;
  });

// ─── Vacancies ─────────────────────────────────────────────────────────────

export type VacancyItem = {
  id: string;
  job_title: string;
  vacancy_code?: string;
  department?: string;
  position_type?: string;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  application_instructions?: string;
  application_deadline?: string | null;
  status: string;
};

export const getVacancies = createServerFn({ method: "GET" }).handler(async () => {
  await initDb();
  const db = getDb();
  const res = await db.query(
    \`SELECT id, job_title, vacancy_code, department, position_type, description,
            requirements, responsibilities, application_instructions, application_deadline, status
     FROM vacancies
     WHERE status IN ('published', 'open')
       AND (application_deadline IS NULL OR application_deadline >= CURRENT_DATE)
     ORDER BY application_deadline ASC NULLS LAST\`
  );
  return res.rows as VacancyItem[];
});

`;

// Insert the new functions before "export type NewsItem"
const splitString = "export type NewsItem = {";
const newApiContent = apiContent.replace(splitString, newFunctions + splitString);

fs.writeFileSync('src/backend/api.ts', newApiContent);
