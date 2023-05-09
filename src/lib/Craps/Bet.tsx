import clsx from "clsx";
import type { BankFn, DiceRoll, Bet as TBet } from './types';

interface BetProps {
  bet: TBet;
  roll: DiceRoll | null;
  onBank: BankFn;
}

export function Bet({ bet: { type, on, amount, paid = 0 } }: BetProps) {
  return (
    <div className="flex justify-between gap-2">
      <span className="flex flex-1 items-baseline gap-2">
        {paid > 0 ? '🏆' : paid < 0 ? '💸' : on ? '🎲' : '🍀'}
        <span
          className={clsx({
            'line-through': paid,
          })}
        >
          {type}
        </span>
        {on && <small>ON {on}</small>}
      </span>
      {paid > 0 ? (
        <span className='badge variant-filled-success'>+${paid}</span>
      ) : paid < 0 ? (
        <span className='badge variant-filled-error'>-${amount}</span>
      ) : (
        <span className='badge variant-ringed'>${amount}</span>
      )}
    </div>
  );
}
