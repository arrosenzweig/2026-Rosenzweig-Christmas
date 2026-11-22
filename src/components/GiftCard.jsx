import { useRef } from 'react';
import Editable from './Editable.jsx';
import Stockings from './Stockings.jsx';
import { profileById } from '../data/profiles.js';
import { formatLeft, msLeft } from '../lib/store.jsx';
import { fileToResizedDataUrl, placeholderImage } from '../lib/images.js';

/**
 * One gift.
 *   variant "own"    --- your own list. Every part of the card can be clicked
 *                        and rewritten: photo, title, note, link, priority.
 *   variant "browse" --- someone else's list: claim buttons, candy-cane /
 *                        wrapped-gift covers depending on who claimed it.
 */
export default function GiftCard({ item, variant = 'own', claim, me, onDelete, onPriority, onEdit, onClaim }) {
  const mine = claim && claim.by === me;
  const buyer = claim ? profileById(claim.by) : null;
  const hidden = variant === 'browse' && claim?.status === 'bought' && !mine;
  const candyCane = variant === 'browse' && claim?.status === 'pending';
  const editable = variant === 'own' && typeof onEdit === 'function';
  const photoRef = useRef(null);

  async function onPickPhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      onEdit(item.id, { image: await fileToResizedDataUrl(file) });
    } catch (err) {
      console.warn('Could not read that photo', err);
    }
    e.target.value = '';
  }

  const readOnlyTitle = item.link ? (
    <a className="gift-title" href={item.link} target="_blank" rel="noreferrer noopener">
      {item.title}
    </a>
  ) : (
    <span className="gift-title">{item.title}</span>
  );

  return (
    <article className={`gift-card ${hidden ? 'is-hidden-gift' : ''} ${candyCane ? 'is-pending' : ''} ${editable ? 'is-editable' : ''}`}>
      {variant === 'own' && (
        <button className="delete-x" type="button" title="Remove from my list" aria-label={`Remove ${item.title}`} onClick={() => onDelete(item.id)}>
          ×
        </button>
      )}

      <div className="gift-media">
        <img
          src={item.image}
          alt=""
          loading="lazy"
          onError={(e) => {
            // a shop's photo can vanish or block hotlinking --- fall back to the
            // wrapped-present card rather than showing a broken image
            if (e.currentTarget.dataset.fallback) return;
            e.currentTarget.dataset.fallback = '1';
            e.currentTarget.src = placeholderImage(item.title);
          }}
        />

        {editable && (
          <>
            <button className="photo-edit" type="button" onClick={() => photoRef.current?.click()} title="Click to change the photo">
              🖼️ Change photo
            </button>
            <input ref={photoRef} type="file" accept="image/*" hidden onChange={onPickPhoto} />
          </>
        )}

        {candyCane && <div className="candy-cane-watermark" aria-hidden="true" />}
        {hidden && (
          <div className="bought-cover">
            <span className="bought-clipart" aria-hidden="true">🎁</span>
            <span className="bought-word">Already bought</span>
          </div>
        )}
      </div>

      <div className="gift-body">
        {hidden && <span className="gift-title muted">A secret 🤫</span>}

        {!hidden && editable && (
          <>
            <Editable
              className="gift-title"
              value={item.title}
              label="the name"
              placeholder="Name this gift"
              onSave={(title) => onEdit(item.id, { title: title || item.title })}
            />
            <Editable
              as="p"
              className="gift-notes"
              value={item.notes}
              label="the note"
              placeholder="+ add a note (size, colour, where to find it)"
              multiline
              onSave={(notes) => onEdit(item.id, { notes })}
            />
            <span className="gift-link-row">
              <Editable
                className="gift-link"
                value={item.link}
                label="the link"
                placeholder="+ add a link"
                type="url"
                onSave={(link) => onEdit(item.id, { link })}
              />
              {item.link && (
                <a className="gift-link-open" href={item.link} target="_blank" rel="noreferrer noopener" title="Open this link">
                  ↗
                </a>
              )}
            </span>
          </>
        )}

        {!hidden && !editable && (
          <>
            {readOnlyTitle}
            {item.notes && <p className="gift-notes">{item.notes}</p>}
          </>
        )}

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
