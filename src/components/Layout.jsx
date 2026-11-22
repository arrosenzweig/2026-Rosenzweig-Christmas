import Avatar from './Avatar.jsx';
import { themeVars } from '../data/profiles.js';
import { useStore } from '../lib/store.jsx';

const TABS = [
  { id: 'profile', label: 'My Profile', icon: '⭐' },
  { id: 'my-list', label: 'My List', icon: '📝' },
  { id: 'wishes', label: 'Christmas Wishes', icon: '✨' },
  { id: 'workshop', label: "Santa's Workshop", icon: '🛠️' },
];

export default function Layout({ tab, setTab, children }) {
  const { profile, setProfileId, claims, profileId, profileMeta, status } = useStore();
  const mine = Object.values(claims).filter((c) => c.by === profileId);
  const pendingCount = mine.filter((c) => c.status === 'pending').length;

  return (
    <div className={`app texture-${profile.theme.texture}`} style={themeVars(profile)}>
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">🎄</span>
          <span className="brand-text">
            <strong>Rosenzweig Christmas</strong>
            <small>2026</small>
          </span>
        </div>

        <button className="who" type="button" onClick={() => setProfileId(null)} title="Switch profile">
          <Avatar
            profile={profile}
            image={profileMeta(profileId).image}
            emoji={profileMeta(profileId).emoji}
            size={32}
            className="who-avatar"
          />
          <span className="who-name">{profile.name}</span>
          <span className="who-switch">switch</span>
        </button>
      </header>

      <nav className="tabs">
        {TABS.map((t) => (
          <button key={t.id} type="button" className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            <span aria-hidden="true">{t.icon}</span> {t.label}
            {t.id === 'workshop' && pendingCount > 0 && <span className="tab-badge">{pendingCount}</span>}
          </button>
        ))}
      </nav>

      <main className="main">{children}</main>

      <footer className="foot">
        Made with candy canes and good intentions 🍬
        {' · '}
        <span className={`board-state ${status}`}>
          <span className="board-dot" aria-hidden="true" />
          {status === 'shared' && 'Shared board — everyone sees your changes'}
          {status === 'connecting' && 'Connecting to the shared board…'}
          {status === 'offline' && "Can't reach the shared board — changes are saved here for now"}
          {status === 'local' && 'Saved in this browser only'}
        </span>
      </footer>
    </div>
  );
}
