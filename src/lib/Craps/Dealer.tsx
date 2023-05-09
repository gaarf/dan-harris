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
	const { roll, cash, tick, table } = game;
	const [formVis, setFormVis] = useState(false);
	const [type, setType] = useState<BetType>('PASS');
	const [amount, setAmount] = useState(1);
	const [bets, setBets] = useState<Bet[]>([]);

	const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
		(event) => {
			event.preventDefault();
			try {
				const newBets = [...bets, { amount, type, key: Date.now() }];
				onBank(-amount, sum(...newBets.map((b) => b.amount)));
				setBets(newBets);
				say(`$${amount} on ${type}`);
			} catch (error) {
				console.error(error);
			}
			setFormVis(false);
		},
		[bets, amount, type, onBank]
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

	const handleShowForm: React.MouseEventHandler<HTMLButtonElement> = useCallback(() => {
		setAmount(Math.floor(cash/2));
		setFormVis(true);
		setBets((b) => b.filter((bet) => !bet.paid));
	}, [cash]);

	const [a, b] = roll;
	const rolling = !a || !b;

	useEffect(() => {
		if (rolling) {
			setFormVis(false);
			say(crapSaying([0,0]));
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

			{!formVis ? (
				<div className="flex w-full gap-2">
					<button
						className="btn flex-1 variant-filled-tertiary"
						onClick={handleShowForm}
						disabled={rolling || cash < 1}
					>
						Add Bet
					</button>
					<button
						className="btn flex-1 variant-filled-primary"
						disabled={rolling || !table}
						onClick={onPlay}
					>
						Roll Dice
					</button>
				</div>
			) : (
				<form onSubmit={handleFormSubmit} className="flex w-full flex-col gap-4 p-4 card">
					<label className="flex flex-col">
						<span className="text-sm">Type</span>
						<select value={type} onChange={handleSelectChange}>
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
						<span className="text-sm">Amount: ${amount}</span>
						<input
							className="block"
							type="range"
							name="amount"
							min={1}
							max={cash}
							value={amount}
							onChange={handleRangeChange}
						/>
					</label>

					<div className="flex flex-1 gap-2">
						<button
							className="btn btn-sm variant-ringed flex-1"
							type="reset"
							onClick={() => setFormVis(false)}
						>
							Cancel
						</button>
						<button className="btn btn-sm variant-filled-secondary flex-1" type="submit">
							Bet!
						</button>
					</div>
				</form>
			)}
		</div>
	);
}
