import { env, stdout } from "node:process";

function isColorEnabled(): boolean {
  if (env.NO_COLOR !== undefined) return false;
  return stdout.isTTY !== false;
}

function paint(code: string, text: string): string {
  if (!isColorEnabled()) return text;
  return `\x1b[${code}m${text}\x1b[0m`;
}

export function cyan(text: string): string {
  return paint("36", text);
}

export function yellow(text: string): string {
  return paint("33", text);
}

export function green(text: string): string {
  return paint("32", text);
}

export function red(text: string): string {
  return paint("31", text);
}
