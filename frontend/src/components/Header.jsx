import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import AuthPage from '../pages/AuthPage';
import Modal from './Modal';
import '../App.css';

const Header = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [authMode, setAuthMode] = useState(null);

  return (
    <header className="header">
      <div className="container">
        <nav className="navbar">
          <Link to="/" className="logo"><span className="logo-mark">M</span> Mini Blog</Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            {user ? <>
              <Link to="/write" className="nav-link">Write</Link>
              {user.role === 'admin' && <Link to="/admin" className="nav-link">Admin</Link>}
              <span className="user-chip">{user.name}</span>
              <button className="nav-button" onClick={() => dispatch(logout())}>Log out</button>
            </> : <>
              <button className="nav-button" onClick={() => setAuthMode('login')}>Log in</button>
              <button className="nav-cta" onClick={() => setAuthMode('signup')}>Start writing</button>
            </>}
          </div>
        </nav>
      </div>
      {authMode && !user && (
        <Modal
          eyebrow={authMode === 'signup' ? 'Join the conversation' : 'Welcome back'}
          title={authMode === 'signup' ? 'Create your writer account' : 'Sign in to keep writing'}
          onClose={() => setAuthMode(null)}
        >
          <AuthPage mode={authMode} embedded onModeChange={setAuthMode} onSuccess={() => setAuthMode(null)} />
        </Modal>
      )}
    </header>
  );
};

export default Header;
