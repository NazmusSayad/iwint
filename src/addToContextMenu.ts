import { execSync } from 'child_process'

function writeItem(
  name: string,
  label: string,
  command: string,
  icon: string,
  extended = false
) {
  execSync(
    `reg add "HKCU\\SOFTWARE\\Classes\\Directory\\shell\\${name}" /ve /t REG_SZ /d "${label}" /f`
  )
  execSync(
    `reg add "HKCU\\SOFTWARE\\Classes\\Directory\\shell\\${name}" /v Icon /t REG_SZ /d "${icon}" /f`
  )
  execSync(
    `reg add "HKCU\\SOFTWARE\\Classes\\Directory\\shell\\${name}\\command" /ve /t REG_SZ /d "${command}" /f`
  )
  if (extended) {
    execSync(
      `reg add "HKCU\\SOFTWARE\\Classes\\Directory\\shell\\${name}" /v Extended /t REG_SZ /d "" /f`
    )
  }

  execSync(
    `reg add "HKCU\\SOFTWARE\\Classes\\Directory\\background\\shell\\${name}" /ve /t REG_SZ /d "${label}" /f`
  )
  execSync(
    `reg add "HKCU\\SOFTWARE\\Classes\\Directory\\background\\shell\\${name}" /v Icon /t REG_SZ /d "${icon}" /f`
  )
  execSync(
    `reg add "HKCU\\SOFTWARE\\Classes\\Directory\\background\\shell\\${name}\\command" /ve /t REG_SZ /d "${command}" /f`
  )
  if (extended) {
    execSync(
      `reg add "HKCU\\SOFTWARE\\Classes\\Directory\\background\\shell\\${name}" /v Extended /t REG_SZ /d "" /f`
    )
  }
}

export default async function (
  key: string,
  label: string,
  exe: string,
  extended: boolean
) {
  writeItem(key, label, exe + ' -d %V', exe, extended)
}
