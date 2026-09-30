/**
 * This checkout contains a committed DSH monorepo build snapshot. Rebuilding
 * source needs ../tsdown.client.ts and its clientBundle helper, absent here.
 * A snapshot check must never report a successful source build.
 */
import { existsSync, readFileSync } from 'node:fs'

if (process.argv[2] === '--verify-snapshot' && process.argv.length === 3) {
  const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))
  const targets = [pkg.main, pkg.types]
  for (const entry of Object.values(pkg.exports)) {
    targets.push(...(typeof entry === 'string' ? [entry] : Object.values(entry)))
  }
  const missing = targets
    .filter((target) => typeof target === 'string')
    .map((target) => target.startsWith('./') ? target : `./${target}`)
    .filter((target) => !existsSync(new URL(target, import.meta.url)))
  if (missing.length > 0) {
    console.error(`dsh-voice-live: missing snapshot export targets: ${missing.join(', ')}`)
    process.exitCode = 1
  } else {
    console.log('dsh-voice-live: committed monorepo snapshot export targets are present; no source build was run.')
  }
} else {
  console.error(
    'dsh-voice-live cannot rebuild from source in this standalone checkout: ' +
    'tsdown.config.ts requires the DSH monorepo clientBundle helper at ../tsdown.client.ts. ' +
    'Build in the DSH monorepo, then copy its lib/ output here. ' +
    'Use npm run verify:artifacts only to check the committed snapshot.'
  )
  process.exitCode = 1
}
