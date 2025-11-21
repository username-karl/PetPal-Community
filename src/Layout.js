import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', background: '#1f2937', color: 'white', padding: '20px' }}>
        <h2 style={{ color: '#4f46e5', marginBottom: '30px' }}>PetCare+</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
          <Link to="/pets" style={{ color: 'white', textDecoration: 'none' }}>My Pets</Link>
          <Link to="/community" style={{ color: 'white', textDecoration: 'none' }}>Community</Link>
        </nav>
      </div>

      {/* Main Area */}
      <div style={{ flex: 1 }}>
        <header style={{ padding: '15px', borderBottom: '1px solid #ddd', background: 'white', display: 'flex', justifyContent: 'space-between' }}>
          <h3>Welcome, {user?.name}</h3>
          <button onClick={logout} className="btn-danger">Logout</button>
        </header>
        <div style={{ padding: '20px' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}