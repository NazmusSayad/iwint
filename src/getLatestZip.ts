import fetchGet from './fetchGet'
import downloadWithProgress from './downloadWithProgress'

export default async function () {
  const releaseResponse: any = await fetchGet(
    'https://api.github.com/repos/microsoft/terminal/releases/latest'
  )

  const assets = releaseResponse?.assets
  if (!assets) {
    throw new Error('No assets found in the latest release.')
  }

  const zipAsset = assets.find((asset: any) => asset.name.endsWith('_x64.zip'))
  if (!zipAsset) {
    throw new Error('ZIP file not found in the latest release assets.')
  }

  console.log('- Found binary:', zipAsset.name)

  const downloadUrl = zipAsset.browser_download_url
  return await downloadWithProgress(downloadUrl)
}
