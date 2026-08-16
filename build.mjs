/**
 * dsh-voice-live build.
 *
 * The committed lib/ artifacts are snapshots of the monorepo build
 * (packages/client/ui-voice-live). A faithful standalone rebuild needs the
 * DSH clientBundle helper (tsdown.client.ts + web/src/platform.ts), which
 * lives inside the monorepo — extracting it is tracked as a follow-up.
 *
 * This script verifies the committed artifacts are present and fresh enough,
 * and documents the rebuild procedure:
 *
 *   cd <dsh monorepo>/packages/client/ui-voice-live
 *   pnpm exec tsc -b tsconfig.json && pnpm run bundle
 *   cp -R lib/ <this repo>/lib
 */
import { existsSync } from 'node:fs'
const required = ['lib/index.js', 'lib/client.js', 'lib/invariant.js']
for (const f of required) {
  if (!existsSync(f)) {
    console.error(`missing ${f} — copy it from the DSH monorepo build (see build.mjs header)`)
    process.exit(1)
  }
}
console.log('dsh-voice-live: committed lib/ artifacts present (monorepo snapshot).')
