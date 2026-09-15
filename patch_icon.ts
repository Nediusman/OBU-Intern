import fs from 'fs';

let content = fs.readFileSync('src/routes/services.index.tsx', 'utf8');
content = content.replace(
  /\{\/\* @ts-expect-error icon doesn't exist but leaving it to avoid breaking layout \*\/\}\n\s+\{\/\* @ts-expect-error icon doesn't exist \*\/\}\n\s+\{\(service as any\)\.icon && \(\n\s+\{\/\* @ts-expect-error \*\/\}\n\s+<div className="text-xs text-gray-500 font-semibold">\{\(service as any\)\.icon\}<\/div>\n\s+\)\}/g,
  ""
);

// I will just replace the icon logic manually using simple JS string replacement
content = content.replace(/\{\/\* @ts-expect-error icon doesn't exist but leaving it to avoid breaking layout \*\/\}/g, "");
content = content.replace(/\{\/\* @ts-expect-error icon doesn't exist \*\/\}/g, "");
content = content.replace(/\{\/\* @ts-expect-error \*\/\}/g, "");
content = content.replace(/\{service\.icon && \(/g, "{(service as any).icon && (");
content = content.replace(/\{service\.icon\}<\/div>/g, "{(service as any).icon}</div>");
content = content.replace(/service\.icon \|\| "Building"/g, "(service as any).icon || \"Building\"");

fs.writeFileSync('src/routes/services.index.tsx', content);
