import NoArg from 'noarg'
import readLine from 'readline'
import install from './install'
import isElevated from 'is-elevated'

const app = NoArg.create('iwint', {
  description: 'Install Windows Terminal',
})

app.on(async () => {
  try {
    if (!(await isElevated())) {
      throw 'Please run this script as an administrator.'
    }

    console.log('Installing Windows Terminal...')
    await install()
  } catch (err: any) {
    console.error('An error occurred while installing Windows Terminal')
    console.log('!', err.message ?? err)
  } finally {
    const rl = readLine.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    process.stdin.setRawMode(true)
    process.stdin.resume()

    console.log('')
    console.log('Press any key to exit...')
    process.stdin.on('data', () => {
      rl.close()
      process.exit()
    })
  }
})

export default app
