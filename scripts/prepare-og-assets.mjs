import { copyFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

// Copy resvg WASM to public/
const wasmSrc = resolve(root, 'node_modules/@resvg/resvg-wasm/index_bg.wasm')
const wasmDest = resolve(root, 'public/resvg.wasm')
copyFileSync(wasmSrc, wasmDest)
console.log('✓ Copied resvg.wasm → public/resvg.wasm')

// Copy Inter Bold (latin) font to public/fonts/
mkdirSync(resolve(root, 'public/fonts'), { recursive: true })
const fontSrc = resolve(root, 'node_modules/@fontsource/inter/files/inter-latin-700-normal.woff2')
const fontDest = resolve(root, 'public/fonts/inter-bold.woff2')
copyFileSync(fontSrc, fontDest)
console.log('✓ Copied Inter Bold → public/fonts/inter-bold.woff2')
