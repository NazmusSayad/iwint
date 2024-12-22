import os from 'os'
import app from './app'

if (os.platform() === 'win32') {
  app.start()
} else {
  console.error('This script is only compatible with Windows.')
  process.exit(1)
}
