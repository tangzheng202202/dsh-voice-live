/** Shipped browser bundle must register under the package name dsh expects. */

import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const source = readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8')
const head = source.slice(0, 400)
const tail = source.slice(-500)

describe('client module registration', () => {
  it('registers once as dsh-voice-live and contains a registration failure', () => {
    expect(head).toContain('id: "dsh-voice-live"')
    expect(source).not.toContain('@deepseek-ai/dsh-client-ui-voice-live')
    expect(source.match(/__ModuleLoader__\.load\(/g)).toHaveLength(1)
    expect(head.startsWith('try {')).toBe(true)
    expect(tail).toContain('client registration failed; the rest of the UI keeps running')
    expect(tail).toContain('client module failed; the rest of the UI keeps running')
  })
})
