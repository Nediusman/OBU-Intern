import fs from 'fs';

let content = fs.readFileSync('src/frontend/lib/database.openapi.types.ts', 'utf8');

// Row
content = content.replace(
  /services: \{\n\s+\/\*\*\n\s+\* Format: uuid/g,
  "services: {\n    /** Format: character varying */\n    slug?: string;\n    /**\n     * Format: uuid"
);

fs.writeFileSync('src/frontend/lib/database.openapi.types.ts', content);
