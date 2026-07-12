// One-command local CMS: runs Vite (the site) and decap-server (the local,
// no-login CMS backend) together. Usage: `npm run cms`, then open
// http://localhost:5173/dashboard/  → edit → Publish (writes to src/content/*).
import { spawn } from 'node:child_process'

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx'

function run(label, cmd, args) {
  const child = spawn(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' })
  child.on('exit', (code) => {
    console.log(`[cms] ${label} exited (${code}). Stopping.`)
    process.exit(code ?? 0)
  })
  return child
}

console.log('[cms] starting Decap local backend + Vite dev server…')
console.log('[cms] open http://localhost:5173/dashboard/  (no login — local editing)')
const decap = run('decap-server', npx, ['decap-server'])
const vite = run('vite', npx, ['vite'])

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => {
    decap.kill()
    vite.kill()
    process.exit(0)
  })
}
