import { Cash } from './Cash';
import { Dealer } from './Dealer';
import { Dice } from './Dice';
import { Result } from './Result';

import { useCallback, useState } from 'react';
import type { DiceRoll, GameState } from './types';
import { sum } from '../utils';
import { GameContext } from './game';

interface CrapsProps {
	initialCash: number;
	onCashChange: (a: number) => void;
}

export function Craps({ initialCash, onCashChange }: CrapsProps) {
	const [game, setGame] = useState<GameState>({
		roll: [1, 1],
		cash: initialCash,
		table: 0
	});

	const handleDiceRoll = useCallback((...r: number[]) => {
		if (r.length > 1) {
			setGame((g) => ({ ...g, roll: r as DiceRoll, tick: sum(g.tick || 0, 1) }));
		} else {
			setGame((g) => ({ ...g, roll: [r[0], 0] }));
		}
		return sum(...r);
	}, []);

	const triggerDiceRoll = useCallback(() => {
		setGame((g) => ({ ...g, tick: 0 }));
	}, []);

	const handleBetBank = useCallback((amount: number, table: number) => {
		setGame((g) => {
			if (amount < 0 && Math.abs(amount) > g.cash) {
				throw new Error('Insufficient cash!');
			}
			const cash = sum(g.cash, amount);
			onCashChange(cash);
			return { ...g, table, cash };
		});
	}, []);

	return (
		<GameContext.Provider value={game}>
			<div className="flex select-none flex-col gap-2 lg:flex-row lg:items-start">
				<section className="flex flex-col items-center gap-2 pb-6">
					<Dice onRoll={handleDiceRoll} />
					<Result />
				</section>
				<aside className="flex flex-1 flex-col items-center lg:mt-8">
					<Dealer game={game} onBank={handleBetBank} onPlay={triggerDiceRoll} />
					<Cash />
				</aside>
			</div>
		</GameContext.Provider>
	);
}
