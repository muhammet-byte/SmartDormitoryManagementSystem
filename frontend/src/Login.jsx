import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setRole }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('STUDENT');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
              const user = await response.json();

              if (user.role === selectedRole) {
                // --- BU İKİ SATIRI GÜNCELLE/EKLE ---
                localStorage.setItem('userRole', user.role);
                localStorage.setItem('username', username); // Formdaki 'username' değerini kaydet

                setRole(user.role);

                if (user.role === 'ADMIN') {
                  navigate('/admin');
                } else {
                  navigate('/student-home');
                }
      // ... geri kalanı aynı
        } else {
          alert(`Authorization Error: This is a ${user.role} account. Please select the correct login type.`);
        }
      } else {
        alert("Invalid username or password! ❌");
      }
    } catch (error) {
      console.error("Connection error:", error);
      alert("Cannot connect to the server (Backend)! 📡");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>

        <div style={headerStyle}>
          <div style={logoCircleStyle}>🏢</div>
          <h2 style={titleStyle}>Dormitory Portal Login</h2>
          <p style={subtitleStyle}>Please enter your account details.</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Username</label>
            <input type="text" placeholder="e.g., student1" value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} required />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Login Type</label>
            <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} style={selectStyle}>
              <option value="STUDENT">👨‍🎓 Student Login</option>
              <option value="ADMIN">🛡️ Administrator (Admin) Login</option>
            </select>
          </div>

          <button type="submit" style={buttonStyle} onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'} onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}>
            Log In to System
          </button>
        </form>
      </div>
    </div>
  );
}

const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #f6f8fd 0%, #f1f5f9 100%)', fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" };
const cardStyle = { padding: '40px 45px', backgroundColor: '#ffffff', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', borderRadius: '20px', width: '100%', maxWidth: '400px', boxSizing: 'border-box' };
const headerStyle = { textAlign: 'center', marginBottom: '35px' };
const logoCircleStyle = { width: '60px', height: '60px', backgroundColor: '#eff6ff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '28px', margin: '0 auto 15px auto', boxShadow: '0 4px 10px rgba(37, 99, 235, 0.1)' };
const titleStyle = { margin: '0 0 8px 0', color: '#0f172a', fontSize: '24px', fontWeight: '700' };
const subtitleStyle = { margin: '0', color: '#64748b', fontSize: '14px' };
const inputGroupStyle = { marginBottom: '20px', textAlign: 'left' };
const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#334155' };
const inputStyle = { width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '15px', color: '#0f172a', boxSizing: 'border-box', outline: 'none', transition: 'all 0.2s ease' };
const selectStyle = { ...inputStyle, cursor: 'pointer', appearance: 'none' };
const buttonStyle = { width: '100%', padding: '15px', marginTop: '10px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: '700', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)', transition: 'background-color 0.3s ease', letterSpacing: '0.5px' };

export default Login;