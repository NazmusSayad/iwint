import os from 'os'
import path from 'path'
import isElevated from 'is-elevated'
import { spawnSync } from 'child_process'

const appScript = path.resolve(__dirname, 'app.js')

function runScriptInNewWindow(asAdmin: boolean) {
  const binPath = `"${path.resolve(process.argv[0])}"`
  const scriptPath = `"${path.resolve(appScript)}"`
  const args = process.argv
    .slice(2)
    .map((arg) => `"${arg}"`)
    .join(' ')

  const command = `powershell -Command "Start-Process '${binPath}' -ArgumentList '${scriptPath} ${args}'${
    asAdmin ? ' -Verb RunAs' : ''
  }"`
  return spawnSync(command, { shell: true })
}

;(async () => {
  if (os.platform() !== 'win32') {
    console.error('This script only works on Windows.')
    return process.exit(1)
  }

  if (!(await isElevated())) {
    console.warn('This script requires elevated privileges to run.')
    const result = runScriptInNewWindow(true)

    if (result.status !== 0) {
      console.error('Failed to run with elevated privileges')
      return process.exit(1)
    }

    return process.exit(0)
  }

  runScriptInNewWindow(false)
})()
