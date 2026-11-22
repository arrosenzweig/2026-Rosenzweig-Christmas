import { useMemo } from 'react';
import { profileById } from '../data/profiles.js';
import { formatLeft, msLeft, PENDING_DAYS, useStore } from '../lib/store.jsx';

function Row({ item, claim, onClaim }) {
  const owner = profileById(item.owner);
  const left = claim.status === 'pending' ? msLeft(claim) : null;
  const urgent = left !== null && left < 24 * 3600 * 1000;

  return (
    <article className={`shop-row ${urgent ? 'urgent' : ''}`}>
      <img className="shop-thumb" src={item.image} alt="" loading="lazy" />
      <div className="shop-main">
        <a className="gift-title" href={item.link} target="_blank" rel="noreferrer noopener">{item.title}</a>
        <span className="shop-for">for {owner?.emoji} {owner?.name}</span>
        {item.notes && <span className="gift-notes">{item.notes}</span>}
      </div>

      <div className="shop-side">
        {claim.status === 'pending' ? (
          <>
            <span className={`countdown ${urgent ? 'urgent' : ''}`}>
              {urgent ? '⚠️ ' : '⏳ '}{formatLeft(left)} left
            </span>
            <span className="countdown-note">then it goes back up for anyone to buy</span>
            <div className="claim-row">
              <button className="btn bought" type="button" onClick={() => onClaim(item.id, 'bought')}>✅ I bought it</button>
              <button className="btn ghost" type="button" onClick={() => onClaim(item.id, null)}>Release</button>
            </div>
          </>
        ) : (
          <>
            <span className="done-badge">🎁 Bought</span>
            <button className="btn ghost" type="button" onClick={() => onClaim(item.id, null)}>Undo</button>
          </>
        )}
      </div>
    </article>
  );
}

export default function SantasWorkshop() {
  const { items, claims, profileId, setClaim } = useStore();

  const { pending, bought } = useMemo(() => {
    const byId = Object.fromEntries(items.map((i) => [i.id, i]));
    const mine = Object.entries(claims)
      .filter(([, c]) => c.by === profileId)
      .map(([id, claim]) => ({ item: byId[id], claim }))
      .filter((r) => r.item);
    return {
      pending: mine.filter((r) => r.claim.status === 'pending').sort((a, b) => a.claim.at - b.claim.at),
      bought: mine.filter((r) => r.claim.status === 'bought').sort((a, b) => b.claim.at - a.claim.at),
    };
  }, [items, claims, profileId]);

  const claim = (id, status) => setClaim(id, status, profileId);

  return (
    <section>
      <h2 className="page-title">Santa&apos;s Workshop</h2>
      <p className="page-sub">Everything you have on hold and everything you have already bought.</p>

      <h3 className="shop-heading">🍬 Pending purchase <small>{pending.length}</small></h3>
      <p className="shop-note">A hold lasts {PENDING_DAYS} days. If you don&apos;t mark it bought, it goes back on everyone else&apos;s board.</p>
      {pending.length === 0 ? (
        <p className="empty small">Nothing on hold right now.</p>
      ) : (
        <div className="shop-list">
          {pending.map(({ item, claim: c }) => <Row key={item.id} item={item} claim={c} onClaim={claim} />)}
        </div>
      )}

      <h3 className="shop-heading">🎁 Bought <small>{bought.length}</small></h3>
      {bought.length === 0 ? (
        <p className="empty small">No gifts bought yet.</p>
      ) : (
        <div className="shop-list">
          {bought.map(({ item, claim: c }) => <Row key={item.id} item={item} claim={c} onClaim={claim} />)}
        </div>
      )}
    </section>
  );
}
