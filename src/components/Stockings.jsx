import stockingImg from '../assets/stocking.png';

const LEVELS = [
  { id: 'low', label: 'Low', count: 1 },
  { id: 'med', label: 'Medium', count: 2 },
  { id: 'high', label: 'High', count: 3 },
];

/** Three stockings; 1, 2 or 3 light up depending on priority. */
export default function Stockings({ value = 'med', onChange, size = 'md' }) {
  const lit = LEVELS.find((l) => l.id === value)?.count ?? 2;
  const interactive = typeof onChange === 'function';

  return (
    <div className={`stockings ${size} ${interactive ? 'interactive' : ''}`} role={interactive ? 'radiogroup' : undefined} aria-label="Priority">
      {LEVELS.map((level, i) => {
        const on = i < lit;
        const stocking = <img className={`stocking ${on ? 'on' : 'off'}`} src={stockingImg} alt="" />;
        if (!interactive) return <span key={level.id}>{stocking}</span>;
        return (
          <button
            key={level.id}
            type="button"
            className="stocking-btn"
            role="radio"
            aria-checked={value === level.id}
            title={`${level.label} priority`}
            onClick={() => onChange(level.id)}
          >
            {stocking}
          </button>
        );
      })}
      <span className="priority-label">
        <strong>{LEVELS.find((l) => l.id === value)?.label}</strong>
        <small>Priority</small>
      </span>
    </div>
  );
}
