import { readdirSync,readFileSync,statSync } from "node:fs";
import { join,relative } from "node:path";
const root=process.cwd();const files=[];
function walk(dir){for(const entry of readdirSync(dir)){if(["node_modules",".next",".git"].includes(entry))continue;const p=join(dir,entry);if(statSync(p).isDirectory()){walk(p);}else{files.push(relative(root,p));}}}
walk(join(root,"app"));walk(join(root,"components"));
const css=files.filter(x=>/\.(css|scss|sass|less)$/.test(x));
if(css.length!==1||css[0]!=="app/globals.css"||readFileSync(join(root,css[0]),"utf8").trim()!=='@import "tailwindcss";'){
 console.error("UI must use Tailwind className. Allowed CSS: app/globals.css with Tailwind import only.",css);process.exit(1);
}
for(const route of ["app/dashboard/page.tsx","app/dashboard/manage/page.tsx","app/admin/page.tsx","app/[siteKey]/[template]/page.tsx"]){if(!files.includes(route)){console.error("Missing route",route);process.exit(1);}}
console.log("Structure check OK:",files.length,"UI files, Tailwind-only global CSS.");
