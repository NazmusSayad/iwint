import { formatBytes } from './utils'
import { https, http } from 'follow-redirects'

export default async function (url: string): Promise<Buffer> {
  const client = url.startsWith('https') ? https : http

  return new Promise((resolve, reject) => {
    const req = client.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download: ${res.statusMessage}`))
      }

      const totalSize =
        parseInt(res.headers['content-length'] || '', 10) || null
      let downloadedSize = 0
      const chunks: Uint8Array[] = []

      function write(msg: string): void {
        process.stdout.cursorTo(0)
        process.stdout.clearScreenDown()
        process.stdout.write(msg)
      }

      const totalSizeInUnits = totalSize !== null && formatBytes(totalSize)

      res.on('data', (chunk) => {
        downloadedSize += chunk.length
        chunks.push(chunk)

        if (totalSize) {
          const percentage = ((downloadedSize / totalSize) * 100).toFixed(2)
          const downloadedInUnits = formatBytes(downloadedSize)
          write(
            `- Downloaded ${percentage}% (${downloadedInUnits}/${totalSizeInUnits})...`
          )
        } else {
          write(
            `- Downloaded ${formatBytes(
              downloadedSize
            )} (total size unknown)...`
          )
        }
      })

      res.on('end', () => {
        console.log('')
        resolve(Buffer.concat(chunks))
      })
    })

    req.on('error', reject)
  })
}
