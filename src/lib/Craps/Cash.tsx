import { sum } from '$lib/utils';
import { useContext } from 'react';
import { GameContext } from './game';

export function Cash() {
	function startOver() {
		window.localStorage.removeItem('cash');
		window.location.reload();
	}

	const { table, cash } = useContext(GameContext);

	return (
		<>
			<div className="flex items-baseline gap-2">
				<span>you have</span>
				<span className="font-serif text-3xl">${sum(cash, table)}</span>
				{!table && <span>in hand</span>}
			</div>
			{table > 0 ? (
				<p>
					including
					<span className="badge mx-1 variant-soft-surface">${table}</span>
					in bets
				</p>
			) : (
				!cash && (
					<button className="btn variant-ghost-tertiary btn-sm mt-2" onClick={startOver}>
						start over
					</button>
				)
			)}
		</>
	);
}
