import { createInterface, type Interface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

export function createPrompt(): Interface {
  return createInterface({ input: stdin, output: stdout });
}

export async function askText(prompt: Interface, label: string): Promise<string> {
  return (await prompt.question(label)).trim();
}

export async function pause(prompt: Interface): Promise<void> {
  await prompt.question("\n  Pulsa Enter para continuar...");
}
