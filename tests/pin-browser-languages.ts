import { afterEach, beforeEach } from 'vitest'

/**
 * Pin `navigator.languages` for specs that assert Chinese copy.
 * jsdom otherwise reports the runner's own language.
 *
 * Same behavior as `usePinnedBrowserLanguages` from
 * `@deepseek-ai/dsh-client-test-runtime`. That package depends on vitest 4,
 * and npm 10's installer crashes (`edgesOut`) while resolving vitest 4's
 * optional peer graph, so the helper lives here instead.
 */
export function pinBrowserLanguages(primary: string, ...rest: string[]): void {
  beforeEach(() => {
    Object.defineProperty(navigator, 'languages', {
      value: [primary, ...rest],
      configurable: true,
    })
    Object.defineProperty(navigator, 'language', {
      value: primary,
      configurable: true,
    })
  })
  afterEach(() => {
    Reflect.deleteProperty(navigator, 'languages')
    Reflect.deleteProperty(navigator, 'language')
  })
}
