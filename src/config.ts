import path from 'path'

export default {
  installDir: path.join(
    process.env.ProgramW6432 ?? process.env.PROGRAMFILES ?? 'C:\\Program Files',
    'Windows Terminal'
  ),

  startMenuDir: path.join(
    process.env.ProgramData ?? process.env.ALLUSERSPROFILE ?? 'C:\\ProgramData',
    'Microsoft\\Windows\\Start Menu\\Programs'
  ),

  startMenuLinkFileName: 'Windows Terminal.lnk',

  contextMenuKey: 'WindowsTerminal',
  contextMenuKeyAdmin: 'WindowsTerminalAdmin',
}
