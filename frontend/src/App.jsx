import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';

import Login from './Login';
import AdminPanel from './AdminPanel';
import StudentHome from './StudentHome';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [role, setRole] = useState(localStorage.getItem('userRole'));

  useEffect(() => {
    setRole(localStorage.getItem('userRole'));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    setRole(null);
    navigate('/');
  };

  return (
    <div>
      <nav style={navStyle}>
        <div style={logoStyle}>Dormitory System</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>

          {!role && <Link to="/" style={linkStyle}>Log In</Link>}
          {role === 'ADMIN' && <Link to="/admin" style={linkStyle}>Admin Panel</Link>}
          {role === 'STUDENT' && <Link to="/student-home" style={linkStyle}>Student Panel</Link>}
          {role && (
            <button onClick={handleLogout} style={logoutBtnStyle}>Log Out</button>
          )}
        </div>
      </nav>

      <div>
        <Routes>
          <Route
            path="/"
            element={
              role === 'ADMIN' ? <Navigate to="/admin" /> :
              role === 'STUDENT' ? <Navigate to="/student-home" /> :
              <Login setRole={setRole} />
            }
          />
          <Route path="/admin" element={role === 'ADMIN' ? <AdminPanel /> : <Navigate to="/" />} />
          <Route path="/student-home" element={role === 'STUDENT' ? <StudentHome /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

const navStyle = { backgroundColor: '#0f172a', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' };
const logoStyle = { fontSize: '20px', fontWeight: '800', letterSpacing: '0.5px' };
const linkStyle = { color: '#e2e8f0', textDecoration: 'none', marginLeft: '25px', fontWeight: '500', fontSize: '15px', transition: 'color 0.2s' };
const logoutBtnStyle = { backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', marginLeft: '25px', cursor: 'pointer', fontWeight: '600', transition: 'background 0.3s' };

export default App;
