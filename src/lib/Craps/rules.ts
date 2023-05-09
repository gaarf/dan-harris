import { rollDie, sum } from '$lib/utils';
import type { DiceRoll } from './types';

export type BetType = 'PASS' | 'DONT_PASS' | 'ANY_SEVEN' | 'ANY_ELEVEN';

export const rules: Record<BetType, { win?: number[]; lose?: number[]; pay?: number }> = {
	PASS: { win: [7, 11], lose: [2, 3, 12] },
	DONT_PASS: { win: [2, 3, 12], lose: [7, 11] },
	ANY_SEVEN: { win: [7], pay: 4 },
	ANY_ELEVEN: { win: [11], pay: 15 }
};

const lingo: Record<number | string, string[]> = {
	0: [
		'Rolling...',
		'Bones out...',
		'Watch it...',
		'Check ’em...'
	],
	2: [
		'two, Craps',
		'eye balls',
		'two aces',
		'rats eyes',
		'snake eyes',
		'push the don’t',
		'eleven in a shoe store',
		'twice in the rice',
		'two craps two',
		'two bad boys from Illinois',
		'two crap aces',
		'aces in both places',
		'a spot and a dot',
		'dimples'
	],
	3: [
		'three, Craps',
		'divorce roll, come up single',
		'winner on the dark side',
		'three craps three, the indicator',
		'small ace deuce, can’t produce',
		'three craps, the middle'
	],
	'1,2': [
		'ace-deuce',
		'three craps, ace caught a deuce, no use'
	],
	'2,1': [
		'crap and a half, flip side ‘O Yo',
		'two-one, son of a gun.'
	],
	4: [
		'ace trey, the easy way',
	],
	'2,2': [
		'Little Joe',
		'little Joe from Kokomo',
		'Double deuce',
		'hit us in the tu tu',
		'two spots and two dots.'
	],
	5: [
		'After five, the field’s alive',
		'little Phoebe',
		'fiver, fiver, racetrack driver',
		'we got the fever',
		'five fever',
		'five, no field five.'
	],
	'3,2': [
		'thirty-two juice roll',
	],
	6: [
		'Big Red, catch’em in the corner',
		'like a blue chip stock',
		'the national average',
		'sixie from Dixie.'
	],
	'3,3': [
		'pair-o-treys, waiter’s roll',
	],
	7: [
		'Seven out, line away',
		'grab the money',
		'front line winner, back line skinner',
		'seven’s a bruiser, the front line’s a loser',
		'up pops the devil',
		'Benny Blue, you’re all through',
	],
	'4,3': [
		'four-three, woe is me',
	],
	'5,2': [
		'five two, you’re all through',
	],
	'6,1': [
		'six ace, end of the race',
		'six one, you’re all done',
		'six-ace, you lost the race',
		'Six-ace, in your face',
	],
	'3,4': [
		'three-four, now we’re poor',
		'three-four, we’ve lost the war.'
	],
	8: [
		'Ozzie and Harriet',
		'Donnie and Marie',
		'eighter from Decatur.'
	],
	'4,4': [
		'the windows',
		'A square pair, like mom and dad',
	],
	9: [
		'Center field',
		'center of the garden',
		'ocean liner niner',
		'Nina from Pasadena',
		'Nina Niner, wine and dine her',
	],
	'4,5': [
		'What shot Jesse James? A forty-five.'
	],
	10: [
		'the big one on the end',
	],
	'5,5': [
		'Puppy paws',
		'pair-a-roses',
		'pair of sunflowers',
		'fifty-five to stay alive',
		'two stars from mars',
	],
	'6,4': [
		'sixty-four, out the door.'
	],
	11: [
		'Yo leven',
		'yo levine the dancing queen',
		'it’s not my eleven, it’s yo eleven.'
	],
	'6,5': [
		'six five, no jive'
	],
	12: [
		'Craps',
		'boxcars',
		'atomic craps',
		'a whole lot of crap',
		'craps to the max',
		'12 craps, it’s crap unless you’re betting on it',
		'all the spots we got',
		'all the spots and all the dots',
		'all the crap there is',
		'outstanding in your field',
		'triple dipple, in the lucky ducky',
		'midnight',
		'double saw on boxcars',
		'Crapus Maximus.'
	]
};

export function crapSaying(roll: DiceRoll): string {
	const total = sum(...roll);
	const a = lingo[roll.join(',')] || lingo[total] || [total.toString()];
	return a[rollDie(a.length) - 1];
}
