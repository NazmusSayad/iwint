import fs from 'fs'
import path from 'path'
import AdmZip from 'adm-zip'
import readLine from 'readline'
import { addToPath } from 'env-win'
import getLatestZip from './getLatestZip'
import createShortcut from './createShortcut'
import addToContextMenu from './addToContextMenu'
import setCompatibilitySettings from './setCompatibilitySettings'

const INSTALL_DIR = path.join(
  process.env.ProgramW6432 ?? process.env.PROGRAMFILES ?? 'C:\\Program Files',
  'Windows Terminal'
)

const START_MENU_PROGRAMS_DIR = path.join(
  process.env.ProgramData ?? process.env.ALLUSERSPROFILE ?? 'C:\\ProgramData',
  'Microsoft\\Windows\\Start Menu\\Programs'
)

async function main() {
  console.log('> Downloading latest Windows Terminal...')
  const zipBuffer = await getLatestZip()

  console.log('- Unpacking Windows Terminal...')
  const zip = new AdmZip(zipBuffer)

  console.log('- Writing files to disk...')
  zip.getEntries().forEach((entry) => {
    const entryPathParts = entry.entryName.split('/').slice(1).join('/')
    const outputPath = path.join(INSTALL_DIR, entryPathParts)

    if (entry.isDirectory) {
      fs.mkdirSync(outputPath, { recursive: true })
    } else {
      fs.writeFileSync(outputPath, entry.getData())
    }
  })

  const wtExe = path.join(INSTALL_DIR, 'wt.exe')
  const wtaExe = path.join(INSTALL_DIR, 'wta.exe')

  console.log('> Copying wt.exe to wta.exe...')
  fs.copyFileSync(wtExe, wtaExe)

  console.log('> Preparing wta.exe to run as administrator...')
  setCompatibilitySettings(wtaExe, 'RUNASADMIN')

  console.log('> Adding Windows Terminal to PATH...')
  addToPath('User', INSTALL_DIR)

  console.log('> Creating shortcut for Windows Terminal...')
  createShortcut(
    wtExe,
    path.join(START_MENU_PROGRAMS_DIR, 'Windows Terminal.lnk')
  )

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

    console.log('Press any key to exit...')
    process.stdin.on('data', () => {
      rl.close()
      process.exit()
    })
  }
})()
