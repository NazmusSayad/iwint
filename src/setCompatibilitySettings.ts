import { execSync } from 'child_process'


export default async function (exePath: string, compatibilitySettings: string) {
  const regPath = `HKCU\\Software\\Microsoft\\Windows NT\\CurrentVersion\\AppCompatFlags\\Layers`
  const command = `reg add "${regPath}" /v "${exePath}" /t REG_SZ /d "${compatibilitySettings}" /f`
  return execSync(command)
}
