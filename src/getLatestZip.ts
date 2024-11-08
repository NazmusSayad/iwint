import downloadWithProgress from './downloadWithProgress'

export default async function () {
  const releaseResponse = await fetch(
    'https://api.github.com/repos/microsoft/terminal/releases/latest'
  )

  if (!releaseResponse.ok) {
    throw new Error('Failed to fetch latest release.')
  }

  const releaseData = await releaseResponse.json()
  const assets = releaseData?.assets

  if (!assets) {
    throw new Error('No assets found in the latest release.')
  }

  const zipAsset = assets.find((asset: any) => asset.name.endsWith('_x64.zip'))
  if (!zipAsset) {
    throw new Error('ZIP file not found in the latest release assets.')
  }

  const downloadUrl = zipAsset.browser_download_url
  return await downloadWithProgress(downloadUrl)
}
