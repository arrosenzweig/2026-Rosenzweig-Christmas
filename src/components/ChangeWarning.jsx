import { profileById } from '../data/profiles.js';

const FIELD_NAMES = {
  title: 'the name',
  image: 'the photo',
  link: 'the link',
  notes: 'the note',
};

export function describeChange(fields = []) {
  const names = fields.map((f) => FIELD_NAMES[f]).filter(Boolean);
  if (!names.length) return 'this gift';
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

/**
 * The loud notice a buyer gets when the owner has changed a gift that buyer is
 * already on the hook for --- shown in Santa's Workshop and on that person's
 * page under Christmas Wishes until it is waved away.
 */
export default function ChangeWarning({ entries, onAck }) {
  if (!entries.length) return null;

  return (
    <section className="change-warning" role="alert">
      <span className="change-warning-mark" aria-hidden="true">⚠️</span>

      <div className="change-warning-body">
        <h3>
          {entries.length === 1
            ? 'Heads up — a gift you are buying has changed'
            : `Heads up — ${entries.length} gifts you are buying have changed`}
        </h3>
        <p className="change-warning-sub">Check it still matches what you were going to get.</p>

        <ul>
          {entries.map(({ item, fields }) => {
            const owner = profileById(item.owner);
            return (
              <li key={item.id}>
                <span>
                  <strong>{owner?.name || 'Someone'}</strong> changed {describeChange(fields)} on{' '}
                  <a href={item.link} target="_blank" rel="noreferrer noopener">
                    {item.title}
                  </a>
                </span>
                <button className="btn" type="button" onClick={() => onAck(item.id)}>
                  Got it
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
