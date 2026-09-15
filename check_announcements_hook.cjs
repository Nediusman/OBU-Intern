const fs = require("fs");
const content = fs.readFileSync("src/routes/admin.content.announcements.tsx", "utf8");
console.log(content.split("\n").slice(0, 20).join("\n"));
