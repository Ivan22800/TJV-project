import Layout from './components/Layout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Feed from './components/Feed';
import Groups from './components/Groups';
import Settings from './components/Settings';
import FeedMyPosts from './components/FeedMyPosts';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/feed/*" element={
          <Layout>
            <Routes>
              <Route index element={<Feed />} />
              <Route path="groups" element={<Groups />} />
              <Route path="my-posts" element={<FeedMyPosts />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
