import { copyFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const source = '.env'
const targetDirectory = '.output/server'
const target = `${targetDirectory}/.env`

if (existsSync(source) && existsSync(targetDirectory)) {
  await mkdir(targetDirectory, { recursive: true })
  await copyFile(source, target)
  console.log('Copied .env to .output/server/.env')
}
