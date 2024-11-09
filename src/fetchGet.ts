import https from 'https'

export default function (url: string) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Your-User-Agent-Here',
      },
    }

    https
      .get(url, options, (res) => {
        let data = ''

        res.on('data', (chunk) => {
          data += chunk
        })

        res.on('end', () => {
          try {
            resolve(JSON.parse(data))
          } catch (error) {
            reject(new Error('Failed to parse response data'))
          }
        })
      })
      .on('error', (error) => {
        reject(error)
      })
  })
}
