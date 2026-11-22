import { useEffect, useState } from 'react';
import { MOTIF_SUGGESTIONS, motifFor } from '../data/motifs.js';

const SWATCHES = [
  '#d11a2a', '#12813f', '#e3a92f', '#8e5cd9', '#2fc2cf', '#e8728c',
  '#3f7fd6', '#e09440', '#7fb069', '#111827',
];

const BLANK = { colors: ['', ''], background: ['', '', ''], special: '' };

/**
 * The questionnaire at the foot of your profile page. Your answers only change
 * how YOUR view of the site looks --- the colours, the wallpaper and one
 * special thing drifting past. Nobody else's page changes, and none of it
 * touches anyone's list.
 */
export default function StyleQuestionnaire({ style, onSave }) {
  const [draft, setDraft] = useState({ ...BLANK, ...style });
  const [saved, setSaved] = useState(false);
  const [cheering, setCheering] = useState(false);

  useEffect(() => {
    setDraft({ ...BLANK, ...style });
  }, [style]);

  const set = (patch) => {
    setDraft((d) => ({ ...d, ...patch }));
    setSaved(false);
  };

  // these read the latest draft rather than the one captured at render, so two
  // quick clicks in a row both stick
  const setColor = (i, value) => {
    setDraft((d) => {
      const colors = [...(d.colors || ['', ''])];
      colors[i] = value;
      return { ...d, colors };
    });
    setSaved(false);
  };

  const setThing = (i, value) => {
    setDraft((d) => {
      const background = [...(d.background || ['', '', ''])];
      background[i] = value;
      return { ...d, background };
    });
    setSaved(false);
  };

  function save(e) {
    e.preventDefault();
    onSave({
      colors: (draft.colors || []).map((c) => c || '').slice(0, 2),
      background: (draft.background || []).map((t) => (t || '').trim()).slice(0, 3),
      special: (draft.special || '').trim(),
    });
    setSaved(true);
    // a small burst, because picking your own colours deserves one
    setCheering(true);
    setTimeout(() => setCheering(false), 1600);
  }

  const cheerColors = [
    draft.colors?.[0] || 'var(--accent)',
    draft.colors?.[1] || 'var(--accent-2)',
    '#e3a92f',
    '#12813f',
  ];

  const preview = (draft.background || []).filter(Boolean);

  return (
    <form className="quiz" onSubmit={save}>
      {cheering && (
        <div className="confetti" aria-hidden="true">
          {Array.from({ length: 34 }, (_, i) => (
            <span
              key={i}
              style={{
                left: `${(i * 97) % 100}%`,
                background: cheerColors[i % cheerColors.length],
                animationDelay: `${(i % 9) * 0.06}s`,
                '--sway': `${((i % 7) - 3) * 26}px`,
              }}
            />
          ))}
        </div>
      )}
      <div className="quiz-q">
        <h4>1. Pick up to two colours</h4>
        <p>They become the colours of your buttons, headings and highlights.</p>

        {[0, 1].map((i) => (
          <div className="quiz-colors" key={i}>
            <span className="quiz-colors-label">{i === 0 ? 'Main' : 'Second'}</span>
            {SWATCHES.map((c) => (
              <button
                key={c}
                type="button"
                className={`swatch ${draft.colors?.[i] === c ? 'active' : ''}`}
                style={{ background: c }}
                title={c}
                aria-label={`Use ${c}`}
                onClick={() => setColor(i, c)}
              />
            ))}
            <input
              type="color"
              className="swatch-custom"
              value={draft.colors?.[i] || '#d11a2a'}
              onChange={(e) => setColor(i, e.target.value)}
              aria-label={i === 0 ? 'Main colour' : 'Second colour'}
            />
            {draft.colors?.[i] && (
              <button type="button" className="btn ghost" onClick={() => setColor(i, '')}>
                Clear
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="quiz-q">
        <h4>2. Three things for your background</h4>
        <p>
          Anything you like — <em>{MOTIF_SUGGESTIONS.slice(0, 4).join(', ')}</em>. Words we recognise turn
          into pictures; the rest are written out in your own words.
        </p>
        <div className="quiz-things">
          {[0, 1, 2].map((i) => {
            const value = draft.background?.[i] || '';
            const emoji = motifFor(value);
            return (
              <label className="field" key={i}>
                <span>Thing {i + 1}</span>
                <span className="quiz-thing-row">
                  <input
                    type="text"
                    value={value}
                    placeholder={MOTIF_SUGGESTIONS[i]}
                    onChange={(e) => setThing(i, e.target.value)}
                  />
                  <span className="quiz-thing-preview">{emoji || (value ? '✎' : '')}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="quiz-q">
        <h4>3. One special something</h4>
        <p>A single element that drifts across your page — a unicorn, a rocket, a disco ball.</p>
        <label className="field">
          <span>Special element</span>
          <span className="quiz-thing-row">
            <input
              type="text"
              value={draft.special || ''}
              placeholder="unicorn"
              onChange={(e) => set({ special: e.target.value })}
            />
            <span className="quiz-thing-preview">{motifFor(draft.special) || (draft.special ? '✎' : '')}</span>
          </span>
        </label>
      </div>

      <div className="add-actions">
        <button className="btn primary" type="submit">Save my look</button>
        <button
          className="btn ghost"
          type="button"
          onClick={() => { setDraft({ ...BLANK }); onSave({ ...BLANK, colors: [], background: [], special: '' }); }}
        >
          Back to default
        </button>
        {saved && <span className="quiz-saved">Saved — look around 🎨</span>}
        {preview.length > 0 && (
          <span className="quiz-preview">
            {preview.map((t, i) => (
              <span key={i}>{motifFor(t) || t}</span>
            ))}
          </span>
        )}
      </div>
    </form>
  );
}
