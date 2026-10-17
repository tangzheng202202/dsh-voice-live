import { defineConfig } from 'vitest/config'

/**
 * DSH publishes client entries as `window.__ModuleLoader__` scripts, not ESM.
 * Tests import `SlotRegistry` and `LocaleRuntime` from those entries, so the
 * loader below evaluates the script and re-exports the factory result.
 */
function dshClientModules() {
  const specs = new Set([
    '@deepseek-ai/dsh-client-runtime/client',
    '@deepseek-ai/dsh-client-locale/client',
  ])
  return {
    name: 'dsh-client-modules',
    enforce: 'pre' as const,
    resolveId(id: string) {
      if (specs.has(id)) return `\0${id}`
    },
    load(id: string) {
      if (!id.startsWith('\0@deepseek-ai/')) return
      const spec = id.slice(1)
      const names = spec.endsWith('dsh-client-runtime/client')
        ? ['SlotRegistry']
        : ['LocaleRuntime']
      return `
        import { createRequire } from 'node:module'
        import { readFileSync } from 'node:fs'
        const require = createRequire(import.meta.url)
        const cache = new Map()
        function loadClient(spec) {
          if (cache.has(spec)) return cache.get(spec)
          const code = readFileSync(require.resolve(spec), 'utf8')
          let loaded
          const window = {
            __ModuleLoader__: {
              load(def) {
                loaded = def.factory((id) => {
                  if (typeof id === 'string' && id.endsWith('/client')) return loadClient(id)
                  if (id === '@deepseek-ai/dsh-client-ui-primitives') {
                    return new Proxy({}, { get: () => () => null })
                  }
                  return require(id)
                })
              },
            },
          }
          new Function('window', code)(window)
          cache.set(spec, loaded)
          return loaded
        }
        const api = loadClient(${JSON.stringify(spec)})
        ${names.map((name) => `export const ${name} = api[${JSON.stringify(name)}]`).join('\n')}
      `
    },
  }
}

export default defineConfig({
  plugins: [dshClientModules()],
  esbuild: { jsx: 'automatic' },
  test: {
    include: ['tests/**/*.spec.ts', 'tests/**/*.spec.tsx'],
    server: {
      deps: {
        inline: [
          '@deepseek-ai/dsh-client-ui-primitives',
          'katex',
        ],
      },
    },
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/css-modules.d.ts'],
      thresholds: {
        perFile: true,
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
})
