import fs from 'fs';

// 1. Research Facilities

// src/routes/research.facilities.$slug.tsx
let rfDetail = fs.readFileSync('src/routes/research.facilities.$slug.tsx', 'utf8');
rfDetail = rfDetail.replace(
  'const facility = await getResearchFacilityBySlug(params.slug);',
  'const facility = await getResearchFacilityBySlug({ data: params.slug });'
);
fs.writeFileSync('src/routes/research.facilities.$slug.tsx', rfDetail);

// src/backend/api.ts
let apiTs = fs.readFileSync('src/backend/api.ts', 'utf8');
apiTs = apiTs.replace(
  "WHERE f.slug = $1 AND f.status = 'active'",
  "WHERE (f.slug = $1 OR f.id::text = $1) AND f.status = 'active'"
);

// 2. Services

// In api.ts
apiTs = apiTs.replace(
  "SELECT s.id, s.slug, s.service_name, s.description, s.department, s.status, s.main_image_id, m.file_url as image",
  "SELECT s.id, s.slug, s.service_name, s.short_description, s.full_description, s.department, s.status, s.main_image_id, m.file_url as image"
);
apiTs = apiTs.replace(
  "SELECT s.id, s.slug, s.service_name, s.description, s.department, s.status, s.main_image_id, m.file_url as image",
  "SELECT s.id, s.slug, s.service_name, s.short_description, s.full_description, s.department, s.status, s.main_image_id, m.file_url as image"
);

// We need to fix the typescript types for ServiceItem in api.ts
apiTs = apiTs.replace(
  "  description?: string;",
  "  short_description?: string;\n  full_description?: string;"
);

// 4. Careers
// In api.ts
apiTs = apiTs.replace(
  "WHERE status IN ('published', 'open')",
  "WHERE status = 'open'"
);

fs.writeFileSync('src/backend/api.ts', apiTs);

// Update Services Frontend
let svcIndex = fs.readFileSync('src/routes/services.index.tsx', 'utf8');
svcIndex = svcIndex.replace(
  "{service.description || \"\"}",
  "{service.short_description || service.full_description || \"\"}"
);
fs.writeFileSync('src/routes/services.index.tsx', svcIndex);

let svcDetail = fs.readFileSync('src/routes/services.$slug.tsx', 'utf8');
svcDetail = svcDetail.replace(
  "{service.description || \"\"}",
  "{service.full_description || service.short_description || \"\"}"
);
fs.writeFileSync('src/routes/services.$slug.tsx', svcDetail);

