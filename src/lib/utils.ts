import { toastStore } from '@skeletonlabs/skeleton';

export function toast(message: string, token = 'surface') {
	toastStore.trigger({ message, background: `variant-filled-${token}` });
}

export function sum(...a: number[]) {
  return a.reduce((m, v) => m + (v || 0), 0);
}

export function rollDie(max = 6) {
  return 1 + Math.floor(Math.random() * max);
}

export function anotherRoll(prev: number): number {
  const n = rollDie();
  return n === prev ? anotherRoll(prev) : n;
}
