import type { Bet, BankFn, GameState } from './types';
import { Bet as BetComponent } from './Bet';
import { useCallback, useEffect, useState } from 'react';
import { sum, toast } from '../utils';
import { rules, crapSaying, type BetType } from './rules';
import { textToSpeech as say } from '$lib/tts';

interface DealerProps {
	game: GameState;
	onBank: BankFn;
	onPlay: () => void;
}

export function Dealer({ onBank, onPlay, game }: DealerProps) {
	const { roll, cash, table, tick } = game;
	const [type, setType] = useState<BetType>('PASS');
	const [amount, setAmount] = useState(Math.floor(cash / 2));
	const [bets, setBets] = useState<Bet[]>([]);

	const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
		(event) => {
			event.preventDefault();
			try {
				const newBets = [...bets.filter((bet) => !bet.paid), { amount, type, key: Date.now() }];
				onBank(-amount, sum(...newBets.map((b) => b.amount)));
				setBets(newBets);
				say(`$${amount} on ${type}`);
			} catch (error) {
				console.error(error);
			}
			setAmount(Math.floor((cash - amount) / 2));
		},
		[cash, bets, amount, type, onBank]
	);

	const handleSelectChange: React.FormEventHandler<HTMLSelectElement> = useCallback(
		({ currentTarget }) => {
			setType(currentTarget.value as BetType);
		},
		[]
	);

	const handleRangeChange: React.FormEventHandler<HTMLInputElement> = useCallback(
		({ currentTarget }) => {
			setAmount(parseInt(currentTarget.value, 10));
		},
		[]
	);

	const [a, b] = roll;
	const rolling = !a || !b;

	useEffect(() => {
		if (rolling) {
			say(crapSaying([0, 0]));
		}
	}, [rolling]);

	useEffect(() => {
		if (rolling) {
			setBets((b) => b.filter((bet) => !bet.paid));
		} else if (tick) {
			setBets((b) => {
				const total = sum(...roll);
				const newBets = b.reduce<Bet[]>((m, bet) => {
					const rule = rules[bet.type];

					const win = () => {
						const paid = (rule.pay || 1) * bet.amount;
						onBank(sum(paid, bet.amount), 0);

						return [...m, { ...bet, paid }];
					};

					const lose = () => {
						return [...m, { ...bet, paid: -bet.amount }];
					};

					if (!bet.paid) {
						let pass;
						switch (bet.type) {
							case 'PASS':
								pass = true;
							/* eslint-disable-next-line no-fallthrough */
							case 'DONT_PASS':
								if (rule.win?.includes(total)) {
									return win();
								}
								if (rule.lose?.includes(total)) {
									return lose();
								}
								if (bet.on) {
									if (bet.on === total) {
										return pass ? win() : lose();
									}
									return [...m, bet];
								} else {
									return [...m, { ...bet, on: total }];
								}

							case 'ANY_ELEVEN':
							case 'ANY_SEVEN':
								return rule.win?.includes(total) ? win() : lose();
						}
					}

					return [...m];
				}, []);
				if (newBets.find((b) => !b.paid && b.on === total)) {
					toast(`🎲 Game on ${total}`);
				}

				// the amount on the table changed
				onBank(0, sum(...newBets.map((b) => (b.paid ? 0 : b.amount))));

				const result = sum(...newBets.map((b) => b.paid || 0));

				say(crapSaying(roll)).then(() => {
					if (result > 0) {
						toast(`🏆 You won $${result}!`, 'success');
						say(`$${result}... Winner winner chicken dinner!`);
					} else if (result < 0) {
						toast(`💸 You lost $${Math.abs(result)}!`, 'error');
						say(`Better luck next time!`);
					}
				});

				return newBets;
			});
		}
	}, [onBank, rolling, tick, roll]);

	const gameOn = !!bets.find((b) => b.on && !b.paid);
	const broke = cash < 1;

	useEffect(() => {
		setType(gameOn ? 'ANY_SEVEN' : 'PASS');
	}, [gameOn]);

	return (
		<div className="mb-4 flex w-56 flex-col items-center gap-2">
			<ul className="flex w-full flex-col gap-1">
				{bets.map((bet) => (
					<li key={bet.key}>
						<BetComponent bet={bet} onBank={onBank} roll={rolling ? null : roll} />
					</li>
				))}
			</ul>

			<form onSubmit={handleFormSubmit} className="flex w-full flex-col gap-4 p-4 card">
				<label className="flex flex-col">
					<span className="text-sm">Bet Type:</span>
					<select value={type} onChange={handleSelectChange} disabled={broke}>
						<option value="PASS" disabled={gameOn}>
							PASS
						</option>
						<option value="DONT_PASS" disabled={gameOn}>
							DON&apos;T PASS
						</option>
						<option value="ANY_SEVEN">ANY_SEVEN</option>
						<option value="ANY_ELEVEN">ANY_ELEVEN</option>
					</select>
				</label>

				<label className="flex flex-col">
					<span className="text-sm">Amount:</span>
					<div className="flex items-center">
						<strong>$</strong>
						<input
							type="number"
							className='p-0 px-1 mx-px bg-transparent border-none text-current'
							name="amount"
							disabled={broke}
							min={1}
							max={cash}
							value={amount}
							onChange={handleRangeChange}
						/>
						<input
							className="flex-1 appearance-none bg-transparent [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:variant-soft-surface [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:aspect-square [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:variant-filled-tertiary"
							type="range"
							disabled={broke}
							min={1}
							max={cash}
							value={amount}
							onChange={handleRangeChange}
						/>
					</div>
				</label>

				<button className="btn variant-ghost-tertiary" type="submit" disabled={broke}>
					Bet!
				</button>
			</form>
			<button
				className="btn variant-filled-primary w-full"
				onClick={onPlay}
				disabled={rolling || !table}
			>
				Roll Dice
			</button>
		</div>
	);
}
