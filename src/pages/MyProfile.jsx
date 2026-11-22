import { useRef, useState } from 'react';
import Avatar from '../components/Avatar.jsx';
import PhotoCropper from '../components/PhotoCropper.jsx';
import ProfileNotes from '../components/ProfileNotes.jsx';
import StyleQuestionnaire from '../components/StyleQuestionnaire.jsx';
import { EMOJI_GROUPS } from '../data/emojis.js';
import { useStore } from '../lib/store.jsx';
import { fileToDataUrl, fileToResizedDataUrl } from '../lib/images.js';

const KINDS = [
  { id: 'text', label: '📝 Note' },
  { id: 'photo', label: '🖼️ Photo' },
  { id: 'link', label: '🔗 Link' },
];

export default function MyProfile() {
  const { profile, profileId, profileMeta, setProfileImage, setProfileEmoji, setProfileStyle, addNote, deleteNote } =
    useStore();
  const meta = profileMeta(profileId);

  const [kind, setKind] = useState('text');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [photo, setPhoto] = useState('');
  const [error, setError] = useState('');
  const [cropping, setCropping] = useState(''); // the photo being lined up
  const avatarRef = useRef(null);
  const photoRef = useRef(null);

  /** Picking a file opens the cropper rather than saving it straight away. */
  async function onAvatarPicked(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setCropping(await fileToDataUrl(file));
      setError('');
    } catch (err) {
      setError(err.message);
    }
    e.target.value = '';
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

  const chosenEmoji = meta.emoji || profile.emoji;

  return (
    <section>
      <h2 className="page-title">My Profile</h2>
      <p className="page-sub">
        Your picture, the emoji that stands for you around the site, and your general gift notes — the
        things that are true of <em>everything</em> on your list: sizes, colors, allergies, what not to buy.
        Everyone sees these when they open your list.
      </p>

      <div className="profile-editor">
        <div className="profile-avatar-edit">
          <Avatar profile={profile} image={meta.image} emoji={meta.emoji} size={140} />
          <div className="profile-avatar-actions">
            <button className="btn" type="button" onClick={() => avatarRef.current?.click()}>
              {meta.image ? 'Change picture' : 'Upload a picture'}
            </button>
            {meta.image && (
              <>
                <button className="btn" type="button" onClick={() => setCropping(meta.image)}>
                  Adjust
                </button>
                <button className="btn ghost" type="button" onClick={() => setProfileImage(profileId, '')}>
                  Remove
                </button>
              </>
            )}
            <input ref={avatarRef} type="file" accept="image/*" hidden onChange={onAvatarPicked} />
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

      {/* ---------------------------------------------------------- emoji -- */}
      <h3 className="shop-heading">Your emoji <small>stands for you wherever your picture doesn&apos;t fit</small></h3>
      <div className="emoji-picker">
        <div className="emoji-current">
          <span className="emoji-current-mark">{chosenEmoji}</span>
          <span>
            {meta.emoji ? 'Your pick' : 'Picked for you'}
            {meta.emoji && (
              <button className="btn ghost" type="button" onClick={() => setProfileEmoji(profileId, '')}>
                Reset
              </button>
            )}
          </span>
        </div>

        {EMOJI_GROUPS.map((group) => (
          <div className="emoji-group" key={group.name}>
            <h4>{group.name}</h4>
            <div className="emoji-grid">
              {group.emojis.map((e) => (
                <button
                  key={e}
                  type="button"
                  className={`emoji-option ${chosenEmoji === e ? 'active' : ''}`}
                  aria-pressed={chosenEmoji === e}
                  title={`Use ${e}`}
                  onClick={() => setProfileEmoji(profileId, e)}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h3 className="shop-heading">How your notes look to everyone else</h3>
      {meta.notes.length === 0 ? (
        <p className="empty small">No notes yet — add sizes, colors, or anything you&apos;d rather nobody bought.</p>
      ) : (
        <div className="notes-preview">
          <ProfileNotes notes={meta.notes} onDelete={(id) => deleteNote(profileId, id)} />
        </div>
      )}

      {/* ------------------------------------------------ design your page -- */}
      <h3 className="shop-heading">
        Make this page yours <small>only you see these changes</small>
      </h3>
      <p className="shop-note">
        Answer as much or as little as you like. It changes the colours and the background of your own view
        of the site — never anyone&apos;s list, and never what other people see.
      </p>
      <div className="quiz-card">
        <StyleQuestionnaire style={meta.style} onSave={(style) => setProfileStyle(profileId, style)} />
      </div>

      {cropping && (
        <PhotoCropper
          src={cropping}
          onCancel={() => setCropping('')}
          onDone={(dataUrl) => {
            setProfileImage(profileId, dataUrl);
            setCropping('');
          }}
        />
      )}
    </section>
  );
}
