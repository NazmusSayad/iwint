import { spawnSync } from 'child_process'

export default function (target: string, shortcut: string) {
  const psScript = [
    `$WshShell = New-Object -ComObject WScript.Shell`,
    `$Shortcut = $WshShell.CreateShortcut("${shortcut}")`,
    `$Shortcut.TargetPath = "${target}"`,
    `$Shortcut.Save()`,
  ]

  return spawnSync('powershell', ['-c', psScript.join(';')], {
    stdio: 'inherit',
    cwd: process.cwd(),
  })
}
