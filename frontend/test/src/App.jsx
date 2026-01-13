import Layout from './components/Layout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Feed from './components/Feed';
import Groups from './components/Groups';
import Settings from './components/Settings';
import FeedMyPosts from './components/FeedMyPosts';
import Register from './components/Register';
import Login from './components/Login';
import ProtectedRoute, { PublicRoute } from './components/ProtectedRoute';
import { UserProvider } from './context/UserContext';
import { Toaster } from './components/ui/toaster';
import Subscriptions from './components/Subscriptions';
import UserProfile from './components/UserProfile';

function App() {
  return (
    <UserProvider>
      <Toaster />
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
                  <Route path="subscriptions" element={<Subscriptions />} />
                  <Route path="profile/:username" element={<UserProfile />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
