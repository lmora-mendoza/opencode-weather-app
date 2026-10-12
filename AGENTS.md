# AGENTS.md

## Stack
- Runtime: Bun (TypeScript, ESM). Entrypoint: `src/index.ts` (`"module": "src/index.ts"` en `package.json`).
- Scripts en `package.json`: `dev`, `build`, `start`. Sin linter, sin framework de tests, sin CI.
- tsconfig estricto: `strict`, `noUncheckedIndexedAccess`, `noFallthroughCasesInSwitch`, `moduleResolution: bundler`. Vigilar accesos por índice y `switch` sin `break`.

## Comandos
- Ejecutar: `bun run src/index.ts` o `bun src/index.ts`
- Dev watch: `bun run dev`
- Instalar deps: `bun install` (lockfile: `bun.lock`)
- Typecheck: `bunx tsc --noEmit` (no hay script definido)
- Compilar binario (objetivo del README): `bun run build` (`bun build src/index.ts --compile --outfile weather-cli`)

## Estructura (`src/`)
- `actions/`: casos de uso del menú (`getWeather`, `addCity`, `removeCity`, `setDefaultCity`, `listCities`, `showForecast`, `toggleUnit`). Delegan en `api/` y `storage/`.
- `presentation/`: `menu.ts` (menú + `askOption`), `input.ts` (`createPrompt`, `askText`, `pause`), `output.ts` (prints). Sin `fetch` ni acceso a disco.
- `storage/`: `citiesStorage.ts` (`loadConfig`, `saveConfig`), `settingsStorage.ts` (unidad). Única capa con acceso a disco.
- `types/`: `City.ts`, `Weather.ts`, `Config.ts`, `MenuOption.ts`.
- `api/`: `geocoding.ts`, `weather.ts`. Única capa con `fetch`.
- `utils/`: `constants.ts`, `format.ts`, `colors.ts`.
- `index.ts`: loop principal, solo orquesta acciones.

## Objetivo (ver `README.md`)
- Weather CLI con menú de consola. APIs Open-Meteo, sin key:
  - Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name=<ciudad>&count=1&language=es&format=json`
  - Forecast: `https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&current=temperature_2m`
- Usar `fetch` nativo de Bun. No añadir cliente HTTP externo.
