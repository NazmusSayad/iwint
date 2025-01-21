import fs from 'fs'
import path from 'path'
import AdmZip from 'adm-zip'
import { addToPath } from 'env-win'
import getLatestZip from './getLatestZip'
import createShortcut from './createShortcut'
import addToContextMenu from './addToContextMenu'
import setCompatibilitySettings from './setCompatibilitySettings'
import config from './config'

export default async function () {
  console.log('> Downloading latest Windows Terminal...')
  const zipBuffer = await getLatestZip()

  console.log('- Unpacking Windows Terminal...')
  const zip = new AdmZip(zipBuffer)

  console.log('- Writing files to disk...')
  zip.getEntries().forEach((entry) => {
    const entryPathParts = entry.entryName.split('/').slice(1).join('/')
    const outputPath = path.join(config.installDir, entryPathParts)

    if (entry.isDirectory) {
      fs.mkdirSync(outputPath, { recursive: true })
    } else {
      fs.writeFileSync(outputPath, entry.getData())
    }
  })

  const wtExe = path.join(config.installDir, 'wt.exe')
  const wtaExe = path.join(config.installDir, 'wta.exe')

  console.log('> Copying wt.exe to wta.exe...')
  fs.copyFileSync(wtExe, wtaExe)

  console.log('> Preparing wta.exe to run as administrator...')
  setCompatibilitySettings(wtaExe, 'RUNASADMIN')

  console.log('> Adding Windows Terminal to PATH...')
  addToPath('User', config.installDir)

  console.log('> Creating shortcut for Windows Terminal...')
  createShortcut(
    wtExe,
    path.join(config.startMenuDir, config.startMenuLinkFileName)
  )

  console.log('> Adding Windows Terminal to context menu...')
  addToContextMenu(config.contextMenuKey, 'Open Terminal', wtExe, false)
  addToContextMenu(
    config.contextMenuKeyAdmin,
    'Open Terminal (Admin)',
    wtaExe,
    true
  )

  console.log('Windows Terminal installed successfully!')
}
