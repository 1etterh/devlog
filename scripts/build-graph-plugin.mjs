// Builds the vendored graph plugin (plugins/graph) into plugins/graph/dist.
// Mirrors the plugin's tsup.config.ts using Quartz's own esbuild + sass,
// so the plugin's devDependencies don't need to be installed.
import * as esbuild from "esbuild"
import * as sass from "sass"
import fs from "fs"
import path from "path"

const root = path.resolve(import.meta.dirname, "../plugins/graph")

const inlineScriptPlugin = {
  name: "inline-script-loader",
  setup(build) {
    build.onLoad({ filter: /\.scss$/ }, async (args) => ({
      contents: sass.compile(args.path).css,
      loader: "text",
    }))

    build.onLoad({ filter: /\.inline\.ts$/ }, async (args) => {
      let text = await fs.promises.readFile(args.path, "utf8")
      text = text.replace(/^export default /gm, "").replace(/^export /gm, "")
      const result = await esbuild.build({
        stdin: {
          contents: text,
          loader: "ts",
          resolveDir: path.dirname(args.path),
          sourcefile: path.relative(root, args.path),
        },
        write: false,
        bundle: true,
        minify: true,
        platform: "browser",
        format: "esm",
        target: "es2020",
        external: ["http://*", "https://*"],
      })
      return { contents: result.outputFiles[0].text, loader: "text" }
    })
  },
}

const SINGLETON_EXTERNALS = [
  "preact",
  "preact/hooks",
  "preact/jsx-runtime",
  "preact/compat",
  "@jackyzha0/quartz",
  "@jackyzha0/quartz/*",
  "vfile",
  "vfile/*",
  "unified",
]

fs.rmSync(path.join(root, "dist"), { recursive: true, force: true })

await esbuild.build({
  absWorkingDir: root,
  entryPoints: {
    index: "src/index.ts",
    types: "src/types.ts",
    "components/index": "src/components/index.ts",
  },
  outdir: "dist",
  bundle: true,
  format: "esm",
  platform: "node",
  target: "es2022",
  sourcemap: true,
  treeShaking: true,
  external: SINGLETON_EXTERNALS,
  jsx: "automatic",
  jsxImportSource: "preact",
  tsconfig: "tsconfig.build.json",
  plugins: [inlineScriptPlugin],
})

console.log("Built plugins/graph/dist")
