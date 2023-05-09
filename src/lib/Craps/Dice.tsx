import { useCallback, useContext, useEffect, useState } from 'react';
import { Die } from './Die';
import { rollDie } from '../utils';
import clsx from 'clsx';
import { GameContext } from './game';

interface DiceProps {
	onRoll: (...roll: number[]) => number;
}

async function shuffle(setter: React.Dispatch<number>) {
	setter(0);
	const t = 2 + Math.random() * Math.LN10;
	await new Promise((d) => setTimeout(d, t * 1e3));
	const r = rollDie();
	setter(r);
	return r;
}

export function Dice({ onRoll }: DiceProps) {
	const {
		roll: [ra, rb],
		tick,
		table
	} = useContext(GameContext);

	const disabled = !table;

	const [a, setA] = useState(ra);
	const [b, setB] = useState(rb);

	const handleClick = useCallback(async () => {
		onRoll();
		const result = await Promise.all([shuffle(setA).then(onRoll), shuffle(setB).then(onRoll)]);
		onRoll(...result);
	}, [onRoll, setA, setB]);

	useEffect(() => {
		if (0 === tick) {
			handleClick();
		}
	}, [tick]);

	const rolling = !a || !b;

	return (
		<button
			onClick={rolling || disabled ? undefined : handleClick}
			className={clsx(
				{
					'transition-transform': true,
					'scale-75 variant-ringed cursor-wait': rolling
				},
				rolling || disabled ? 'pointer-events-none' : 'hover:variant-filled-surface'
			)}
		>
			<ul className="flex gap-10 p-10">
				<li className="z-10 flex flex-1 justify-center">
					<Die face={a} />
				</li>
				<li className="flex flex-1 justify-center">
					<Die face={b} />
				</li>
			</ul>
		</button>
	);
}
