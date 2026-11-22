import { useMemo, useState } from 'react';
import Avatar from '../components/Avatar.jsx';
import GiftCard from '../components/GiftCard.jsx';
import ProfileNotes from '../components/ProfileNotes.jsx';
import SortBar from '../components/SortBar.jsx';
import { PROFILES } from '../data/profiles.js';
import { sortItems, useStore } from '../lib/store.jsx';

export default function ChristmasWishes() {
  const { items, claims, profileId, setClaim, profileMeta } = useStore();
  const others = PROFILES.filter((p) => p.id !== profileId);
  const [selected, setSelected] = useState(null);
  const [sort, setSort] = useState('priority');

  const who = others.find((p) => p.id === selected) || null;
  const meta = who ? profileMeta(who.id) : null;

  const { giving, rest } = useMemo(() => {
    if (!who) return { giving: [], rest: [] };
    const theirs = items.filter((i) => i.owner === who.id);
    const isMine = (i) => claims[i.id]?.by === profileId;
    return {
      giving: sortItems(theirs.filter(isMine), sort),
      rest: sortItems(theirs.filter((i) => !isMine(i)), sort),
    };
  }, [who, items, claims, profileId, sort]);

  const card = (item) => (
    <GiftCard
      key={item.id}
      item={item}
      variant="browse"
      me={profileId}
      claim={claims[item.id]}
      onClaim={(id, status) => setClaim(id, status, profileId)}
    />
  );

  return (
    <section>
      <h2 className="page-title">Christmas Wishes</h2>
      <p className="page-sub">Pick a person and see what they are hoping for.</p>

      <div className="who-picker">
        {others.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`who-chip ${selected === p.id ? 'active' : ''}`}
            style={{ '--chip': p.theme.accent }}
            onClick={() => setSelected(selected === p.id ? null : p.id)}
          >
            <span aria-hidden="true">{p.emoji}</span> {p.name}
          </button>
        ))}
      </div>

      {!who ? (
        <p className="empty">Choose a name above to peek at a list. 👀</p>
      ) : (
        <div className="wish-view" style={{ '--accent': who.theme.accent, '--accent-2': who.theme.accent2 }}>
          <header className="wish-header">
            <Avatar profile={who} image={meta.image} size={128} />
            <h3 className="wish-name">{who.name}</h3>
            {meta.notes.length > 0 ? (
              <ProfileNotes notes={meta.notes} />
            ) : (
              <p className="empty small centered">{who.name} hasn&apos;t written any gift notes yet.</p>
            )}
          </header>

          {giving.length > 0 && (
            <div className="list-block">
              <h4 className="list-heading">
                <span aria-hidden="true">🎁</span> Gifts you&apos;re giving {who.name}
                <small>{giving.length} {giving.length === 1 ? 'gift' : 'gifts'}</small>
              </h4>
              <div className="gift-grid">{giving.map(card)}</div>
            </div>
          )}

          <div className="list-block">
            <h4 className="list-heading">
              <span aria-hidden="true">✨</span> {giving.length > 0 ? `The rest of ${who.name}'s list` : `${who.name}'s list`}
              <small>{rest.length} {rest.length === 1 ? 'item' : 'items'}</small>
            </h4>
            <SortBar sort={sort} setSort={setSort} />
            {rest.length === 0 ? (
              <p className="empty small">
                {items.some((i) => i.owner === who.id) ? 'Everything here is already spoken for by you. 🎅' : `${who.name} hasn't added anything yet.`}
              </p>
            ) : (
              <div className="gift-grid">{rest.map(card)}</div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
