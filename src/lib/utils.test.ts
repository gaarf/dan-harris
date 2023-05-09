import { describe, it, expect } from 'vitest';
import { sum } from './utils';

describe('sum', () => {
	it('can do math', () => {
		expect(sum()).toBe(0);
		expect(sum(1, 2)).toBe(3);
		expect(sum(...Array(9).fill(1))).toBe(9);
	});
	it('can handle NaN', () => {
		expect(sum(1, NaN)).toBe(1);
	});
	it('can handle negatives', () => {
		expect(sum(1, -1)).toBe(0);
	});
});
