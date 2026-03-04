import { resolve } from "path";
import { logColor } from "./log-color";

export async function asyncDelay(milliseconds: number = 0, verbose = false) {
  if (milliseconds <= 0) return;

  if (verbose) {
    logColor(`delaying for ${milliseconds / 1000}s`);
  }

  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}
