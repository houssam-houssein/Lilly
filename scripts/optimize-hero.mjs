import { statSync } from 'node:fs'
import sharp from 'sharp'

const source = 'src/assets/homepage.png'
const output = 'public/hero.webp'

await sharp(source)
  .resize(1920, null, { withoutEnlargement: true })
  .webp({ quality: 80 })
  .toFile(output)

console.log(`Wrote ${output} (${statSync(output).size} bytes)`)
