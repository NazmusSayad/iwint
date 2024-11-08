#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import AdmZip from 'adm-zip'
import { addToPath } from 'env-win'
import getLatestZip from './getLatestZip'
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

  console.log('Windows Terminal installed successfully!')
}

main().catch((err) => {
  console.error(
    'An error occurred while installing Windows Terminal:',
    err.message
  )

  process.exit(1)
})
