import type { AppConfig } from "../types/Config.ts";
import { saveConfig } from "../storage/citiesStorage.ts";
import { toggleUnitValue } from "../storage/settingsStorage.ts";
import { unitLabel } from "../utils/format.ts";
import { printSuccess } from "../presentation/output.ts";

export async function toggleUnit(config: AppConfig): Promise<void> {
  config.unit = toggleUnitValue(config.unit);
  await saveConfig(config);
  printSuccess(`Unidad actual: ${unitLabel(config.unit)}`);
}
