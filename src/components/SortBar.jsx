import { SORTS } from '../lib/store.jsx';

export default function SortBar({ sort, setSort }) {
  return (
    <div className="sortbar">
      <span className="sortbar-label">Sort</span>
      {SORTS.map((s) => (
        <button key={s.id} type="button" className={`chip ${sort === s.id ? 'active' : ''}`} onClick={() => setSort(s.id)}>
          {s.label}
        </button>
      ))}
    </div>
  );
}
