// Üretim (standalone) çıktısını test için ayağa kaldırır: static/public dosyalarını kopyalar.
import { cpSync, existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const standalone = resolve(root, ".next", "standalone");
if (!existsSync(resolve(standalone, "server.js"))) {
  console.error("Önce `npm run build` çalıştırın (.next/standalone yok).");
  process.exit(1);
}
cpSync(resolve(root, ".next", "static"), resolve(standalone, ".next", "static"), { recursive: true });
if (existsSync(resolve(root, "public"))) cpSync(resolve(root, "public"), resolve(standalone, "public"), { recursive: true });

const child = spawn(process.execPath, ["server.js"], {
  cwd: standalone,
  stdio: "inherit",
  env: { ...process.env, PORT: process.env.PORT ?? "3100", HOSTNAME: "127.0.0.1" },
});
child.on("exit", (code) => process.exit(code ?? 0));
