const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('Cleaning up...')
fs.rmSync(path.resolve(__dirname, './dist'), { recursive: true, force: true })

console.log('')
console.log('Building CommonJS module...')
execSync('tsc', { stdio: 'inherit' })

console.log('')
console.log('Building exe file...')
execSync('npm run pkg', { stdio: 'inherit' })
