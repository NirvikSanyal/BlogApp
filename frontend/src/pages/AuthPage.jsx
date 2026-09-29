import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, login, signup } from '../store/slices/authSlice';

const AuthPage = ({ mode, embedded = false, onModeChange, onSuccess }) => {
  const isSignup = mode === 'signup';
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { user, status, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => { dispatch(clearAuthError()); }, [dispatch, mode]);
  if (user && !embedded) return <Navigate to="/write" replace />;
  if (user && embedded) return null;

  const submit = async (event) => {
    event.preventDefault();
    const action = isSignup ? signup(form) : login({ email: form.email, password: form.password });
    const result = await dispatch(action);
    if (!result.error) {
      onSuccess?.();
      navigate(location.state?.from || '/write', { replace: true });
    }
  };

  const content = (
    <>
      {!embedded && <><p className="eyebrow">{isSignup ? 'Join the conversation' : 'Welcome back'}</p><h1>{isSignup ? 'Create your writer account' : 'Sign in to keep writing'}</h1></>}
      <p className="auth-intro">Read freely. Sign in when you are ready to publish your own ideas.</p>
      {error && <div className="alert" role="alert">{error}</div>}
      <form onSubmit={submit} className="auth-form">
        {isSignup && <label>Display name<input name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength="80" autoComplete="name" /></label>}
        <label>Email address<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required autoComplete="email" /></label>
        <label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength="8" autoComplete={isSignup ? 'new-password' : 'current-password'} /></label>
        <button className="primary-btn full-btn" disabled={status === 'loading'}>{status === 'loading' ? 'Please wait...' : isSignup ? 'Create account' : 'Sign in'}</button>
      </form>
      <p className="auth-switch">{isSignup ? 'Already have an account?' : 'New to Mini Blog?'} {embedded ? <button type="button" className="text-button" onClick={() => onModeChange(isSignup ? 'login' : 'signup')}>{isSignup ? 'Sign in' : 'Create one'}</button> : <Link to={isSignup ? '/login' : '/signup'}>{isSignup ? 'Sign in' : 'Create one'}</Link>}</p>
    </>
  );

  if (embedded) return content;
  return <section className="auth-page container"><div className="auth-card">{content}</div></section>;
};

export default AuthPage;
