import fs from 'fs'
import path from 'path'
import AdmZip from 'adm-zip'
import readLine from 'readline'
import { addToPath } from 'env-win'
import getLatestZip from './getLatestZip'
import addToContextMenu from './addToContextMenu'
import setCompatibilitySettings from './setCompatibilitySettings'

async function main() {
  const OUTPUT_DIR = path.join(
    process.env.LOCALAPPDATA ??
      path.join(process.env.USERPROFILE ?? '', 'AppData', 'Local'),
    'Microsoft',
    'Windows Terminal'
  )

  console.log('> Downloading latest Windows Terminal...')
  const zipBuffer = await getLatestZip()

  console.log('- Unpacking Windows Terminal...')
  const zip = new AdmZip(zipBuffer)

  console.log('- Writing files to disk...')
  zip.getEntries().forEach((entry) => {
    const entryPathParts = entry.entryName.split('/').slice(1).join('/')
    const outputPath = path.join(OUTPUT_DIR, entryPathParts)

    if (entry.isDirectory) {
      fs.mkdirSync(outputPath, { recursive: true })
    } else {
      fs.writeFileSync(outputPath, entry.getData())
    }
  })

  const wtExe = path.join(OUTPUT_DIR, 'wt.exe')
  const wtaExe = path.join(OUTPUT_DIR, 'wta.exe')

  console.log('> Preparing wta.exe to run as administrator...')
  fs.copyFileSync(wtExe, wtaExe)
  setCompatibilitySettings(wtaExe, 'RUNASADMIN')

  console.log('> Adding Windows Terminal to PATH...')
  addToPath('User', OUTPUT_DIR)

  console.log('> Adding Windows Terminal to context menu...')
  addToContextMenu('WindowsTerminal', 'Open Terminal', wtExe, false)
  addToContextMenu(
    'WindowsTerminalAdmin',
    'Open Terminal (Admin)',
    wtaExe,
    true
  )

  console.log('Windows Terminal installed successfully!')
}

;(async () => {
  try {
    await main()
    console.log('')
  } catch (err: any) {
    console.log('')
    console.error(
      'An error occurred while installing Windows Terminal:',
      err.message
    )
  } finally {
    const rl = readLine.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    process.stdin.setRawMode(true)
    process.stdin.resume()

    process.stdout.write('Press any key to exit...')
    process.stdin.on('data', () => {
      rl.close()
      process.exit()
    })
  }
})()
