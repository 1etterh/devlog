// Writes redirect pages for v4-era URLs whose folders were capitalized
// (e.g. /DB/001_foo -> /db/001_foo). Content folders were renamed to lowercase,
// so the alias-redirects plugin no longer sees the original casing.
// Run after `npx quartz build`. Mirrors the plugin's case-redirect HTML.
import fs from "fs"
import path from "path"

const OUTPUT = process.argv[2] ?? "public"
const CONTENT = "content"

// lowercase folder path -> original v4 folder path
const LEGACY_DIRS = {
  cs: "CS",
  "cs/algorithms": "CS/Algorithms",
  "cs/network": "CS/Network",
  db: "DB",
  "db/assets": "DB/assets",
  "db/server": "DB/Server",
  "db/server/assets": "DB/Server/assets",
  dev: "Dev",
  docker: "Docker",
  javascript: "JavaScript",
  "javascript/nuxt": "JavaScript/Nuxt",
  network: "Network",
  projects: "Projects",
  tools: "Tools",
  "tools/claude": "Tools/Claude",
}

function isCaseSensitive(dir) {
  const probe = path.join(dir, ".legacy-case-probe")
  fs.mkdirSync(probe, { recursive: true })
  fs.writeFileSync(path.join(probe, "a"), "")
  const sensitive = !fs.existsSync(path.join(probe, "A"))
  fs.rmSync(probe, { recursive: true, force: true })
  return sensitive
}

// same transform as the plugin's slugifyPathPreserveCase
const slugifySegment = (s) =>
  s
    .replace(/\s/g, "-")
    .replace(/&/g, "-and-")
    .replace(/%/g, "-percent")
    .replace(/\?/g, "")
    .replace(/#/g, "")

function redirectHtml(title, url) {
  return `<!DOCTYPE html>
<html lang="en-us">
<head>
<title>${title}</title>
<link rel="canonical" href="${url}">
<meta name="robots" content="noindex">
<meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=${url}">
</head>
</html>
`
}

function writeRedirect(oldSlug, newSlug) {
  if (oldSlug === newSlug) return false
  const target = path.join(OUTPUT, newSlug + ".html")
  const dest = path.join(OUTPUT, oldSlug + ".html")
  if (!fs.existsSync(target) || fs.existsSync(dest)) return false
  const simplified = newSlug.replace(/(^|\/)index$/, "$1")
  const url = "../".repeat(oldSlug.split("/").length - 1) + (simplified || "./")
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.writeFileSync(dest, redirectHtml(simplified, url))
  return true
}

if (!isCaseSensitive(OUTPUT)) {
  console.log("Case-insensitive filesystem, skipping legacy redirects")
  process.exit(0)
}

let count = 0
for (const [dir, oldDir] of Object.entries(LEGACY_DIRS)) {
  // folder listing page: /DB/ -> /db/
  if (writeRedirect(`${oldDir}/index`, `${dir}/index`)) count++

  for (const file of fs.readdirSync(path.join(CONTENT, dir))) {
    if (!file.endsWith(".md")) continue
    const name = slugifySegment(file.replace(/\.md$/, ""))
    const newSlug = `${dir}/${name.toLowerCase()}`
    if (writeRedirect(`${oldDir}/${name}`, newSlug)) count++
  }
}

// files directly under a renamed parent but in an unrenamed subfolder
// (e.g. Docker/disk-log-trouble/*, Projects/<slug>/*)
for (const [dir, oldDir] of Object.entries(LEGACY_DIRS)) {
  for (const entry of fs.readdirSync(path.join(CONTENT, dir), { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const sub = `${dir}/${entry.name}`
    if (LEGACY_DIRS[sub]) continue
    for (const file of fs.readdirSync(path.join(CONTENT, sub))) {
      if (!file.endsWith(".md")) continue
      const name = slugifySegment(file.replace(/\.md$/, ""))
      const oldBase = `${oldDir}/${entry.name}`
      const newBase = `${sub.toLowerCase()}`
      if (writeRedirect(`${oldBase}/${name}`, `${newBase}/${name.toLowerCase()}`)) count++
    }
  }
}

console.log(`Wrote ${count} legacy redirects`)
