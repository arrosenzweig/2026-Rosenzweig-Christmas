import { useMemo, useState } from 'react';
import GiftCard from '../components/GiftCard.jsx';
import SortBar from '../components/SortBar.jsx';
import { PROFILES } from '../data/profiles.js';
import { sortItems, useStore } from '../lib/store.jsx';

export default function ChristmasWishes() {
  const { items, claims, profileId, setClaim } = useStore();
  const others = PROFILES.filter((p) => p.id !== profileId);
  const [selected, setSelected] = useState([]);
  const [sort, setSort] = useState('priority');

  const toggle = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const lists = useMemo(
    () =>
      selected.map((owner) => ({
        profile: others.find((p) => p.id === owner),
        items: sortItems(items.filter((i) => i.owner === owner), sort),
      })),
    [selected, items, sort, others],
  );

  return (
    <section>
      <h2 className="page-title">Christmas Wishes</h2>
      <p className="page-sub">Pick one person — or several — and see what they are hoping for.</p>

      <div className="who-picker">
        {others.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`who-chip ${selected.includes(p.id) ? 'active' : ''}`}
            style={{ '--chip': p.theme.accent }}
            onClick={() => toggle(p.id)}
          >
            <span aria-hidden="true">{p.emoji}</span> {p.name}
          </button>
        ))}
        {selected.length > 0 && (
          <button type="button" className="who-chip clear" onClick={() => setSelected([])}>
            Clear
          </button>
        )}
        {selected.length === 0 && (
          <button type="button" className="who-chip clear" onClick={() => setSelected(others.map((p) => p.id))}>
            Everyone
          </button>
        )}
      </div>

      {selected.length === 0 ? (
        <p className="empty">Choose a name above to peek at a list. 👀</p>
      ) : (
        <>
          <SortBar sort={sort} setSort={setSort} />
          {lists.map(({ profile, items: list }) => (
            <div key={profile.id} className="list-block" style={{ '--accent': profile.theme.accent }}>
              <h3 className="list-heading">
                <span aria-hidden="true">{profile.emoji}</span> {profile.name}&apos;s list
                <small>{list.length} {list.length === 1 ? 'item' : 'items'}</small>
              </h3>
              {list.length === 0 ? (
                <p className="empty small">{profile.name} hasn&apos;t added anything yet.</p>
              ) : (
                <div className="gift-grid">
                  {list.map((item) => (
                    <GiftCard
                      key={item.id}
                      item={item}
                      variant="browse"
                      me={profileId}
                      claim={claims[item.id]}
                      onClaim={(id, status) => setClaim(id, status, profileId)}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </section>
  );
}
