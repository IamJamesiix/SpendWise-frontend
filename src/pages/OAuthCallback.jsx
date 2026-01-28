import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/Authcontext';

export const OAuthCallback = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  useEffect(() => {
    // The backend handles the OAuth flow and redirects here with JWT in cookie
    // We just need to check if user is authenticated and redirect to dashboard
    const checkAuth = () => {
      const storedUser = localStorage.getItem('spendwise_user');
      if (storedUser) {
        navigate('/dashboard', { replace: true });
      } else {
        // If no user data, try to fetch it or redirect to login
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      }
    };

    checkAuth();
  }, [navigate, updateUser]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '4px solid #e9ecef',
        borderTopColor: '#8B5CF6',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <h2 style={{ color: 'var(--text-primary)' }}>Completing sign in...</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Please wait while we finish setting up your account.</p>
    </div>
  );
};