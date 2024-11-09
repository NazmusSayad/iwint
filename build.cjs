const fs = require('fs')
const path = require('path')
const exe = require('@angablue/exe')
const { execSync } = require('child_process')

const OUT_DIR = path.resolve(__dirname, './dist')
const OUT_FILE = path.resolve(OUT_DIR, './iwint.exe')

console.log('> Cleaning up...')
fs.rmSync(OUT_DIR, { recursive: true, force: true })

console.log('> Building CommonJS module...')
execSync('tsc', { stdio: 'inherit' })

console.log('> Building exe file...')
const build = exe({
  out: OUT_FILE,
  // icon: './icon.ico',
  entry: path.join(OUT_DIR, './index.js'),
})

build.then(() => {
  console.log('- Build complete!')
  console.log('- Output:', OUT_FILE)
})
