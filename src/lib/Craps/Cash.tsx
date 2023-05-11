import { sum } from '$lib/utils';
import { useContext, useEffect, useState, useMemo, useRef } from 'react';
import { GameContext } from './game';

function easeInSine(x: number): number {
	return 1 - Math.cos((x * Math.PI) / 2);
}

export function Cash() {
	function startOver() {
		window.localStorage.removeItem('cash');
		window.location.reload();
	}

	const { table, cash } = useContext(GameContext);
	const total = useMemo(() => sum(cash, table), [cash, table]);

	const [amount, setAmount] = useState(0);
	const raf = useRef(0);

	useEffect(() => {
		cancelAnimationFrame(raf.current);
		const ms = 2000; // anim time
		const start = performance.now();
		const loop = () =>
			setAmount((a) => {
				const r = (performance.now() - start) / ms;
				const n = a + (total - a) * easeInSine(r);
				if (r >= 1 || Math.ceil(n) === total) {
					return total;
				} else {
					raf.current = requestAnimationFrame(loop);
					return Math.floor(n);
				}
			});
		loop();
	}, [total]);

	return (
		<>
			<div className="flex items-baseline gap-2">
				<span>you have</span>
				<span className="font-serif text-3xl">${amount}</span>
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
