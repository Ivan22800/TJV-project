import Layout from './components/Layout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Feed from './components/Feed';
import Groups from './components/Groups';
import Settings from './components/Settings';
import FeedMyPosts from './components/FeedMyPosts';
import Register from './components/Register';
import Login from './components/Login';
import ProtectedRoute, { PublicRoute } from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/feed/*" element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route index element={<Feed />} />
                <Route path="groups" element={<Groups />} />
                <Route path="my-posts" element={<FeedMyPosts />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
