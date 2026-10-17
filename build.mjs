/**
 * Standalone build. No DSH monorepo checkout required.
 *
 *   npm install
 *   npm run build
 *
 * Host and invariant bundles are ESM. The client bundle is the browser
 * `window.__ModuleLoader__` format DSH already loads. Type declarations come
 * from `tsc -b`.
 */
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import esbuild from 'esbuild'

const root = path.dirname(fileURLToPath(import.meta.url))
const CLIENT_ID = '@deepseek-ai/dsh-client-ui-voice-live'

function externalize(patterns) {
  return {
    name: 'externalize',
    setup(build) {
      build.onResolve({ filter: /.*/ }, (args) => {
        if (args.kind !== 'import-statement' && args.kind !== 'require-call' && args.kind !== 'dynamic-import') return
        if (patterns.some((re) => re.test(args.path))) return { path: args.path, external: true }
      })
    },
  }
}

function cssModules() {
  return {
    name: 'css-modules',
    setup(build) {
      build.onResolve({ filter: /\.module\.css$/ }, (args) => ({
        path: path.resolve(args.resolveDir, args.path),
        namespace: 'css-module',
      }))
      build.onLoad({ filter: /.*/, namespace: 'css-module' }, (args) => {
        const source = readFileSync(args.path, 'utf8')
        const rel = path.relative(root, args.path).split(path.sep).join('/')
        const prefix = `_${createHash('sha1').update(rel).digest('hex').slice(0, 6)}_`
        const map = {}
        const rename = (name) => {
          map[name] ??= prefix + name
          return map[name]
        }
        let css = source
        for (const match of source.matchAll(/@keyframes\s+([\w-]+)/g)) {
          css = css.replaceAll(match[1], rename(match[1]))
        }
        css = css.replace(/\.(-?[_a-zA-Z][\w-]*)/g, (full, name) => {
          if (name.startsWith(prefix)) return full
          return `.${rename(name)}`
        })
        const tagId = `${CLIENT_ID}/${path.basename(args.path)}`
        const contents = `
          const css = ${JSON.stringify(css)};
          const tagId = ${JSON.stringify(tagId)};
          if (typeof document !== "undefined" && document.head && !document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]")) {
            const tag = document.createElement("style");
            tag.dataset.plugin = ${JSON.stringify(CLIENT_ID)};
            tag.dataset.pluginCss = tagId;
            tag.textContent = css;
            document.head.appendChild(tag);
          }
          export default ${JSON.stringify(map)};
        `
        return { contents, loader: 'js', resolveDir: path.dirname(args.path) }
      })
    },
  }
}

const hostExternal = externalize([/^@deepseek-ai\//, /^ws$/, /^node:/])
const clientExternal = externalize([/^@deepseek-ai\//, /^react$/, /^react\//])

await esbuild.build({
  absWorkingDir: root,
  entryPoints: ['src/index.ts'],
  outfile: 'lib/index.js',
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: 'es2024',
  legalComments: 'none',
  plugins: [hostExternal],
})

await esbuild.build({
  absWorkingDir: root,
  entryPoints: ['src/invariant.ts'],
  outfile: 'lib/invariant.js',
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: 'es2024',
  legalComments: 'none',
  plugins: [hostExternal],
})

const client = await esbuild.build({
  absWorkingDir: root,
  entryPoints: ['src/client/index.ts'],
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  target: 'es2022',
  jsx: 'automatic',
  write: false,
  legalComments: 'none',
  plugins: [clientExternal, cssModules()],
})
const cjs = client.outputFiles[0].text
const wrapped = `window.__ModuleLoader__.load({
  id: ${JSON.stringify(CLIENT_ID)},
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    ${cjs}
    return module.exports;
  }
});
`
writeFileSync(path.join(root, 'lib/client.js'), wrapped)

const tsc = spawnSync(process.execPath, ['node_modules/typescript/lib/tsc.js', '-b', 'tsconfig.json'], {
  cwd: root,
  stdio: 'inherit',
})
if (tsc.status !== 0) process.exit(tsc.status ?? 1)
console.log('dsh-voice-live: built lib/ from src/ (no monorepo).')
