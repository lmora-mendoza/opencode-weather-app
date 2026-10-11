# AGENTS.md

## Stack
- Runtime: Bun (TypeScript, ESM). Entrypoint: `index.ts` (`"module": "index.ts"` en `package.json`).
- Sin scripts en `package.json`, sin linter, sin framework de tests, sin CI. Es un scaffold de `bun init`.
- tsconfig estricto: `strict`, `noUncheckedIndexedAccess`, `noFallthroughCasesInSwitch`, `moduleResolution: bundler`. Vigilar accesos por índice y `switch` sin `break`.

## Comandos
- Ejecutar: `bun run index.ts` o `bun index.ts`
- Instalar deps: `bun install` (lockfile: `bun.lock`)
- Typecheck: `bunx tsc --noEmit` (no hay script definido)
- Compilar binario (objetivo del README): `bun build index.ts --compile --outfile weather-cli`

## Objetivo (ver `README.md`)
- Weather CLI con menú de consola. APIs Open-Meteo, sin key:
  - Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name=<ciudad>&count=1&language=es&format=json`
  - Forecast: `https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&current=temperature_2m`
- Usar `fetch` nativo de Bun. No añadir cliente HTTP externo.
