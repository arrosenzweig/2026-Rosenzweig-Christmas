import { useState } from 'react';
import Layout from './components/Layout.jsx';
import ProfilePicker from './components/ProfilePicker.jsx';
import MyProfile from './pages/MyProfile.jsx';
import MyList from './pages/MyList.jsx';
import ChristmasWishes from './pages/ChristmasWishes.jsx';
import SantasWorkshop from './pages/SantasWorkshop.jsx';
import { useStore } from './lib/store.jsx';

export default function App() {
  const { profile } = useStore();
  const [tab, setTab] = useState('my-list');

  if (!profile) return <ProfilePicker />;

  return (
    <Layout tab={tab} setTab={setTab}>
      {tab === 'profile' && <MyProfile />}
      {tab === 'my-list' && <MyList />}
      {tab === 'wishes' && <ChristmasWishes />}
      {tab === 'workshop' && <SantasWorkshop />}
    </Layout>
  );
}
