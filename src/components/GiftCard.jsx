import Stockings from './Stockings.jsx';
import { profileById } from '../data/profiles.js';
import { formatLeft, msLeft } from '../lib/store.jsx';

/**
 * One gift.
 *   variant "own"    --- your own list: editable priority, delete button.
 *   variant "browse" --- someone else's list: claim buttons, candy-cane /
 *                        wrapped-gift covers depending on who claimed it.
 */
export default function GiftCard({ item, variant = 'own', claim, me, onDelete, onPriority, onClaim }) {
  const mine = claim && claim.by === me;
  const buyer = claim ? profileById(claim.by) : null;
  const hidden = variant === 'browse' && claim?.status === 'bought' && !mine;
  const candyCane = variant === 'browse' && claim?.status === 'pending';

  const title = item.link ? (
    <a className="gift-title" href={item.link} target="_blank" rel="noreferrer noopener">
      {item.title}
    </a>
  ) : (
    <span className="gift-title">{item.title}</span>
  );

  return (
    <article className={`gift-card ${hidden ? 'is-hidden-gift' : ''} ${candyCane ? 'is-pending' : ''}`}>
      {variant === 'own' && (
        <button className="delete-x" type="button" title="Remove from my list" aria-label={`Remove ${item.title}`} onClick={() => onDelete(item.id)}>
          ×
        </button>
      )}

      <div className="gift-media">
        <img src={item.image} alt="" loading="lazy" />
        {candyCane && <div className="candy-cane-watermark" aria-hidden="true" />}
        {hidden && (
          <div className="bought-cover">
            <span className="bought-clipart" aria-hidden="true">🎁</span>
            <span className="bought-word">Already bought</span>
          </div>
        )}
      </div>

      <div className="gift-body">
        {hidden ? <span className="gift-title muted">A secret 🤫</span> : title}
        {!hidden && item.notes && <p className="gift-notes">{item.notes}</p>}

        {!hidden && (
          <Stockings
            value={item.priority}
            size={variant === 'own' ? 'md' : 'sm'}
            onChange={variant === 'own' ? (p) => onPriority(item.id, p) : undefined}
          />
        )}

        {variant === 'browse' && (
          <div className="claim-row">
            {!claim && (
              <>
                <button className="btn pending" type="button" onClick={() => onClaim(item.id, 'pending')}>
                  🍬 Pending purchase
                </button>
                <button className="btn bought" type="button" onClick={() => onClaim(item.id, 'bought')}>
                  ✅ Bought
                </button>
              </>
            )}

            {claim && mine && claim.status === 'pending' && (
              <>
                <span className="claim-note">
                  You have this on hold — <strong>{formatLeft(msLeft(claim))}</strong> left
                </span>
                <button className="btn bought" type="button" onClick={() => onClaim(item.id, 'bought')}>
                  ✅ I bought it
                </button>
                <button className="btn ghost" type="button" onClick={() => onClaim(item.id, null)}>
                  Release
                </button>
              </>
            )}

            {claim && mine && claim.status === 'bought' && (
              <>
                <span className="claim-note">You bought this 🎁</span>
                <button className="btn ghost" type="button" onClick={() => onClaim(item.id, null)}>
                  Undo
                </button>
              </>
            )}

            {claim && !mine && claim.status === 'pending' && (
              <span className="claim-note">
                {buyer ? `${buyer.name} is buying this` : 'Someone is buying this'}
              </span>
            )}

            {claim && !mine && claim.status === 'bought' && (
              <span className="claim-note">{buyer ? `${buyer.name} got it` : 'Already taken care of'}</span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
