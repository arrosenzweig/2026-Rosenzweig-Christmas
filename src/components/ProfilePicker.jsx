import { PROFILES } from '../data/profiles.js';
import { useStore } from '../lib/store.jsx';
import Avatar from './Avatar.jsx';
import ChristmasScene from './ChristmasScene.jsx';

export default function ProfilePicker() {
  const { setProfileId, items, profileMeta } = useStore();

  return (
    <div className="picker">
      <ChristmasScene />

      <div className="picker-inner">
        <h1 className="picker-title">Who&apos;s shopping?</h1>
        <p className="picker-sub">Rosenzweig Christmas 2026</p>

        <ul className="picker-grid">
          {PROFILES.map((p) => {
            const count = items.filter((i) => i.owner === p.id).length;
            return (
              <li key={p.id}>
                <button
                  className="picker-tile"
                  type="button"
                  style={{ '--accent': p.theme.accent, '--accent-2': p.theme.accent2 }}
                  onClick={() => setProfileId(p.id)}
                >
                  <Avatar profile={p} image={profileMeta(p.id).image} size={118} className="picker-avatar" />
                  <span className="picker-name">{p.name}</span>
                  <span className="picker-count">{count} {count === 1 ? 'wish' : 'wishes'}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
