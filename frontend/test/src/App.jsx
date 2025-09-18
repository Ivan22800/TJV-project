import Navbar from './components/Navbar';
import Layout from './components/Layout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Feed from './components/Feed';
import Groups from './components/Groups';
import MyPosts from './components/MyPosts';
import Settings from './components/Settings';
import FeedMyPosts from './components/FeedMyPosts';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/settings" element={<Settings />} />
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Feed />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/feed-my-posts" element={<FeedMyPosts />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
