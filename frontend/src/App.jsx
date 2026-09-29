import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { store } from './store/store';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import AdminPage from './pages/AdminPage';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import { restoreSession } from './store/slices/authSlice';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

function AppContent() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  useEffect(() => { if (token) dispatch(restoreSession()); }, [dispatch, token]);
  return (
    <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/posts/:id" element={<PostDetailPage />} />
              <Route path="/login" element={<AuthPage mode="login" />} />
              <Route path="/signup" element={<AuthPage mode="signup" />} />
              <Route path="/write" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute role="admin"><AdminPage adminMode /></ProtectedRoute>} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
