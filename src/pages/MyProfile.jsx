import { useRef, useState } from 'react';
import Avatar from '../components/Avatar.jsx';
import ProfileNotes from '../components/ProfileNotes.jsx';
import { useStore } from '../lib/store.jsx';
import { fileToResizedDataUrl } from '../lib/images.js';

const KINDS = [
  { id: 'text', label: '📝 Note' },
  { id: 'photo', label: '🖼️ Photo' },
  { id: 'link', label: '🔗 Link' },
];

export default function MyProfile() {
  const { profile, profileId, profileMeta, setProfileImage, addNote, deleteNote } = useStore();
  const meta = profileMeta(profileId);

  const [kind, setKind] = useState('text');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [photo, setPhoto] = useState('');
  const [error, setError] = useState('');
  const avatarRef = useRef(null);
  const photoRef = useRef(null);

  async function onAvatar(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setProfileImage(profileId, await fileToResizedDataUrl(file));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }

  async function onNotePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setPhoto(await fileToResizedDataUrl(file));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }

  function submit(e) {
    e.preventDefault();
    if (kind === 'text' && !text.trim()) return setError('Write something first.');
    if (kind === 'link' && !url.trim()) return setError('Paste a link first.');
    if (kind === 'photo' && !photo) return setError('Pick a photo first.');

    addNote(profileId, {
      kind,
      text: text.trim(),
      url: kind === 'link' ? url.trim() : '',
      image: kind === 'photo' ? photo : '',
    });

    setText('');
    setUrl('');
    setPhoto('');
    setError('');
    if (photoRef.current) photoRef.current.value = '';
  }

  return (
    <section>
      <h2 className="page-title">My Profile</h2>
      <p className="page-sub">
        Your picture and your general gift notes — the things that are true of <em>everything</em> on your
        list: sizes, colors, allergies, what not to buy. Everyone sees these when they open your list.
      </p>

      <div className="profile-editor">
        <div className="profile-avatar-edit">
          <Avatar profile={profile} image={meta.image} size={140} />
          <div className="profile-avatar-actions">
            <button className="btn" type="button" onClick={() => avatarRef.current?.click()}>
              {meta.image ? 'Change picture' : 'Upload a picture'}
            </button>
            {meta.image && (
              <button className="btn ghost" type="button" onClick={() => setProfileImage(profileId, '')}>
                Remove
              </button>
            )}
            <input ref={avatarRef} type="file" accept="image/*" hidden onChange={onAvatar} />
          </div>
          <strong className="profile-editor-name">{profile.name}</strong>
        </div>

        <form className="note-composer" onSubmit={submit}>
          <div className="kind-row">
            {KINDS.map((k) => (
              <button
                key={k.id}
                type="button"
                className={`chip ${kind === k.id ? 'active' : ''}`}
                onClick={() => { setKind(k.id); setError(''); }}
              >
                {k.label}
              </button>
            ))}
          </div>

          {kind === 'text' && (
            <label className="field">
              <span>General note</span>
              <textarea
                rows={3}
                placeholder="No store bought sweets. I love purple, not pink."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </label>
          )}

          {kind === 'link' && (
            <>
              <label className="field">
                <span>Link</span>
                <input type="url" placeholder="https://..." value={url} onChange={(e) => setUrl(e.target.value)} />
              </label>
              <label className="field">
                <span>Label <small>(optional)</small></span>
                <input type="text" placeholder="Shops I love" value={text} onChange={(e) => setText(e.target.value)} />
              </label>
            </>
          )}

          {kind === 'photo' && (
            <>
              <label className="field">
                <span>Photo</span>
                <input ref={photoRef} type="file" accept="image/*" onChange={onNotePhoto} />
              </label>
              <label className="field">
                <span>Caption <small>(optional)</small></span>
                <input type="text" placeholder="Colors I wear" value={text} onChange={(e) => setText(e.target.value)} />
              </label>
              {photo && <img className="add-preview" src={photo} alt="Preview of the photo you picked" />}
            </>
          )}

          <div className="add-actions">
            <button className="btn primary" type="submit">Add to my notes</button>
            {error && <span className="error">{error}</span>}
          </div>
        </form>
      </div>

      <h3 className="shop-heading">How your notes look to everyone else</h3>
      {meta.notes.length === 0 ? (
        <p className="empty small">No notes yet — add sizes, colors, or anything you&apos;d rather nobody bought.</p>
      ) : (
        <div className="notes-preview">
          <ProfileNotes notes={meta.notes} onDelete={(id) => deleteNote(profileId, id)} />
        </div>
      )}
    </section>
  );
}
