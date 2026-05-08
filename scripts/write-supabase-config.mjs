#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const out = path.join(root, "supabase-config.js");

const url = process.env.KHOOS_SUPABASE_URL || process.env.SUPABASE_URL || "";
const key =
  process.env.KHOOS_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";

const body = `/** توليد تلقائي — لا تُحرَّر يدوياً إن وُجد npm run build:config */
window.KHOOS_SUPABASE_URL = ${JSON.stringify(url)};
window.KHOOS_SUPABASE_ANON_KEY = ${JSON.stringify(key)};
`;

fs.writeFileSync(out, body, "utf8");
console.log("wrote", out, url ? "(URL OK)" : "(تحذير: URL فارغ)");
