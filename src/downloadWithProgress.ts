
function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let unitIndex = 0

  while (bytes >= 1024 && unitIndex < units.length - 1) {
    bytes /= 1024
    unitIndex++
  }

  return `${bytes.toFixed(2)} ${units[unitIndex]}`
}

export default async function (url: string) {
  const response = await fetch(url)

  if (!response.ok)
    throw new Error(`Failed to download: ${response.statusText}`)

  const contentLength = response.headers.get('content-length')
  const totalSize = contentLength ? parseInt(contentLength, 10) : null
  let downloadedSize = 0

  const reader = response.body?.getReader()
  const chunks: Uint8Array[] = []

  if (!reader) throw new Error('Failed to read response body.')
  function write(msg: string) {
    process.stdout.cursorTo(0)
    process.stdout.clearScreenDown()
    process.stdout.write(msg)
  }

  const totalSizeInUnits = totalSize !== null && formatBytes(totalSize)
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    if (value) {
      downloadedSize += value.length
      chunks.push(value)

      if (totalSize) {
        const percentage = ((downloadedSize / totalSize) * 100).toFixed(2)
        const downloadedInUnits = formatBytes(downloadedSize)

        write(
          `- Downloaded ${percentage}% (${downloadedInUnits}/${totalSizeInUnits})...`
        )
      } else {
        write(
          `- Downloaded ${formatBytes(downloadedSize)} (total size unknown)...`
        )
      }
    }
  }

  console.log('')
  return Buffer.from(await new Blob(chunks).arrayBuffer())
}