/**
 * Lays someone's general gift notes out nicely: the written notes as ribboned
 * cards, any photos as a strip, and any links as tappable chips. These are
 * notes about how to shop for the person --- not individual gifts.
 */
const hostOf = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

export default function ProfileNotes({ notes = [], onDelete }) {
  if (!notes.length) return null;

  const text = notes.filter((n) => n.kind === 'text');
  const photos = notes.filter((n) => n.kind === 'photo');
  const links = notes.filter((n) => n.kind === 'link');

  const Del = ({ note }) =>
    onDelete ? (
      <button className="note-x" type="button" title="Remove this note" aria-label="Remove this note" onClick={() => onDelete(note.id)}>
        ×
      </button>
    ) : null;

  return (
    <div className="notes">
      {text.length > 0 && (
        <ul className="note-cards">
          {text.map((n) => (
            <li key={n.id} className="note-card">
              <span className="note-bauble" aria-hidden="true">❄</span>
              <p>{n.text}</p>
              <Del note={n} />
            </li>
          ))}
        </ul>
      )}

      {photos.length > 0 && (
        <div className="note-photos">
          {photos.map((n) => (
            <figure key={n.id} className="note-photo">
              <img src={n.image} alt={n.text || 'Gift preference photo'} loading="lazy" />
              {n.text && <figcaption>{n.text}</figcaption>}
              <Del note={n} />
            </figure>
          ))}
        </div>
      )}

      {links.length > 0 && (
        <div className="note-links">
          {links.map((n) => (
            <span key={n.id} className="note-link-wrap">
              <a className="note-link" href={n.url} target="_blank" rel="noreferrer noopener">
                <span aria-hidden="true">🔗</span> {n.text || hostOf(n.url)}
              </a>
              <Del note={n} />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
