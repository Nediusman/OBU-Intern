const fs = require('fs');
let code = fs.readFileSync('src/routes/api/events.ts', 'utf8');
code = `import { createAPIFileRoute } from '@tanstack/react-start/api';\n` + code;
code = code.replace(`export const GET = ({ request }: { request: Request }) => {`, 
`export const APIRoute = createAPIFileRoute('/api/events')({
  GET: ({ request }: { request: Request }) => {`);
code += `\n});\n`;
fs.writeFileSync('src/routes/api/events.ts', code);
