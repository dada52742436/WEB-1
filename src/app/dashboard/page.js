'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthRedux } from '@/hooks/redux';
import { useAuthInit } from '@/hooks/useAuthInit';

/**
 * Dashboard page component
 * Protected route that requires authentication
 * Uses Redux for authentication state management
 */
export default function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated, loading, logout } = useAuthRedux();

  // Initialize auth state
  const { isAuthenticated: initAuthenticated, loading: initLoading } = useAuthInit();

  // Redirect if not authenticated (after auth check is complete)
  useEffect(() => {
    if (!initLoading && !initAuthenticated) {
      router.push('/login');
    }
  }, [initAuthenticated, initLoading, router]);

  /**
   * Handles user logout
   * Dispatches logout action and redirects to login page
   */
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Show loading state while checking auth
  if (initLoading || loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!initAuthenticated) {
    return null;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '2px solid #f0f0f0'
      }}>
        <div>
          <h1 style={{ margin: 0 }}>Dashboard</h1>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>Welcome, {user?.username}!</p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ff4757',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </header>

      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: '0 0 20px 0' }}>User Information</h2>
        
        <div style={{ lineHeight: '1.8' }}>
          <div style={{ display: 'flex', marginBottom: '15px' }}>
            <strong style={{ width: '120px' }}>Username:</strong>
            <span>{user?.username}</span>
          </div>
          
          <div style={{ display: 'flex', marginBottom: '15px' }}>
            <strong style={{ width: '120px' }}>Email:</strong>
            <span>{user?.email}</span>
          </div>
          
          <div style={{ display: 'flex', marginBottom: '15px' }}>
            <strong style={{ width: '120px' }}>Member since:</strong>
            <span>
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}