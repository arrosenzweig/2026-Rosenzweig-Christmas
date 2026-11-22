import { useMemo, useRef, useState } from 'react';
import GiftCard from '../components/GiftCard.jsx';
import SortBar from '../components/SortBar.jsx';
import Stockings from '../components/Stockings.jsx';
import { sortItems, useStore } from '../lib/store.jsx';
import { fileToResizedDataUrl } from '../lib/images.js';
import { enrich } from '../lib/searchAgent.js';

const EMPTY = { title: '', link: '', image: '', notes: '', priority: 'med' };

export default function MyList() {
  const { items, profileId, profile, addItem, deleteItem, updateItem } = useStore();
  const [draft, setDraft] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sort, setSort] = useState('priority');
  const fileRef = useRef(null);

  const mine = useMemo(
    () => sortItems(items.filter((i) => i.owner === profileId), sort),
    [items, profileId, sort],
  );

  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));

  async function onPickPhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    try {
      set({ image: await fileToResizedDataUrl(file) });
    } catch (err) {
      setError(err.message);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!draft.title.trim() && !draft.link.trim() && !draft.image) {
      setError('Add a title, a link or a photo — any one of them is enough.');
      return;
    }
    setError('');
    setBusy(true);
    try {
      const filled = await enrich(draft, profile.theme.accent);
      addItem({
        owner: profileId,
        title: filled.title,
        link: filled.link,
        image: filled.image,
        imageBy: filled.imageBy,
        notes: [filled.note, draft.notes.trim()].filter(Boolean).join(' · '),
        priority: draft.priority,
      });
      setDraft(EMPTY);
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      setError(err.message || 'Something went wrong adding that.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section>
      <h2 className="page-title">My List</h2>
      <p className="page-sub">
        Add a title, a link, a photo — or all three. Whatever you leave blank, the elf fills in for you.
        Once it is on your list, click any part of a card to change it.
      </p>

      <form className="add-card" onSubmit={onSubmit}>
        <div className="add-grid">
          <label className="field">
            <span>Gift</span>
            <input
              type="text"
              placeholder="Cozy knit sweater"
              value={draft.title}
              onChange={(e) => set({ title: e.target.value })}
            />
          </label>

          <label className="field">
            <span>Link</span>
            <input
              type="url"
              placeholder="https://..."
              value={draft.link}
              onChange={(e) => set({ link: e.target.value })}
            />
          </label>

          <label className="field">
            <span>Photo</span>
            <input ref={fileRef} type="file" accept="image/*" onChange={onPickPhoto} />
          </label>

          <label className="field wide">
            <span>Notes <small>(size, color, where to find it)</small></span>
            <input
              type="text"
              placeholder="Size L, must be knit"
              value={draft.notes}
              onChange={(e) => set({ notes: e.target.value })}
            />
          </label>

          <div className="field">
            <span>Priority</span>
            <Stockings value={draft.priority} onChange={(p) => set({ priority: p })} />
          </div>
        </div>

        <div className="add-actions">
          {draft.image && <img className="add-preview" src={draft.image} alt="Preview of the photo you picked" />}
          <button className="btn primary" type="submit" disabled={busy}>
            {busy ? 'Elf is searching…' : 'Add to my list'}
          </button>
          {error && <span className="error">{error}</span>}
        </div>
      </form>

      <SortBar sort={sort} setSort={setSort} />

      {mine.length === 0 ? (
        <p className="empty">Your list is empty. Santa needs hints! 🎅</p>
      ) : (
        <div className="gift-grid">
          {mine.map((item) => (
            <GiftCard
              key={item.id}
              item={item}
              variant="own"
              onDelete={deleteItem}
              onPriority={(id, priority) => updateItem(id, { priority })}
              // rewriting the gift makes it yours, so the catalog stops updating it ---
              // but merely approving the photo is not a rewrite
              onEdit={(id, patch) =>
                updateItem(id, {
                  ...patch,
                  ...(['title', 'notes', 'link', 'image'].some((f) => f in patch) ? { edited: true } : {}),
                })
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}
