import { useEffect, useState } from 'react';
import './Die.css';
import { anotherRoll } from '../utils';

interface DieProps {
  face: number;
}

export function Die({ face }: DieProps) {
  const [shown, setShown] = useState<number>(face);

  useEffect(() => {
    if (!face) {
      const id = setInterval(() => setShown(anotherRoll), 250);
      return () => {
        clearInterval(id);
      };
    }
    setShown(face);
  }, [face]);

  return (
    <ol className="Die">
      {[...Array(6)].map((_, index) => (
        <li key={index} className={shown === index + 1 ? 'up' : ''}>
          {[...Array(index + 1)].map((_, d) => (
            <span key={d} />
          ))}
        </li>
      ))}
    </ol>
  );
}
