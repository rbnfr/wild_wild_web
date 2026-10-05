// Lista el contenido provisional (TODO) que queda en src/content.
// Uso:  npm run check:content            -> informa y termina bien
//       npm run check:content -- --strict -> termina con error si queda algo (útil antes de publicar)
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const contentDir = new URL('../src/content/', import.meta.url)
const strict = process.argv.includes('--strict')

const files = readdirSync(contentDir).filter(
  (name) => name.endsWith('.ts') && !name.endsWith('.test.ts'),
)

let total = 0
for (const name of files) {
  const lines = readFileSync(new URL(name, contentDir), 'utf8').split(/\r?\n/)
  const hits = lines.flatMap((line, index) =>
    line.includes('TODO') ? [{ number: index + 1, text: line.trim() }] : [],
  )
  if (hits.length === 0) continue

  total += hits.length
  console.log(`\n${join('src', 'content', name)} (${hits.length})`)
  for (const hit of hits) console.log(`  ${String(hit.number).padStart(4)}  ${hit.text}`)
}

if (total === 0) {
  console.log('Contenido completo: no queda ningún TODO en src/content.')
} else {
  console.log(`\nQuedan ${total} marcas TODO por completar con datos reales.`)
  if (strict) process.exit(1)
}
