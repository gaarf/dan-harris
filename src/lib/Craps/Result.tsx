import clsx from "clsx";
import { useContext } from "react";
import { GameContext } from "./game";

export function Result() {
	const { tick, roll: [a, b] } = useContext(GameContext);
	const rolling = !a || !b;

	return (
		<p
			className={clsx({
				'badge': true,
				'blur': tick === undefined,
				'variant-glass-primary': !rolling,
				'animate-bounce variant-glass-surface': rolling
			})}
		>
			{rolling ?`${a + b || '?'} + ?` : a + b}
		</p>
	);
}
