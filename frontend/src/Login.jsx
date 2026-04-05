import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  // Form verileri için state'ler
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('STUDENT'); // Varsayılan: Öğrenci
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // 1. Backend'e giriş isteği atıyoruz
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const user = await response.json(); // Backend'den dönen gerçek kullanıcı verisi

        // 2. ROL KONTROLÜ: Seçilen rol ile veritabanındaki rol tutuyor mu?
        if (user.role === selectedRole) {
          if (user.role === 'ADMIN') {
            navigate('/admin'); // Yönetici sayfasına yönlendir
          } else {
            navigate('/student-home'); // Öğrenci sayfasına yönlendir
          }
        } else {
          alert(`Yetki Hatası: Bu hesap bir ${user.role} hesabıdır. Lütfen doğru giriş tipini seçin.`);
        }
      } else {
        // HTTP 401 veya 404 durumu
        alert("Kullanıcı adı veya şifre hatalı! ❌");
      }
    } catch (error) {
      console.error("Bağlantı hatası:", error);
      alert("Sunucuya (Backend) ulaşılamadı! 📡");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ marginBottom: '20px' }}>Yurt Giriş Sistemi 🔑</h2>

        <form onSubmit={handleLogin}>
          {/* Kullanıcı Adı */}
          <input
            type="text"
            placeholder="Kullanıcı Adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
            required
          />

          {/* Şifre */}
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />

          {/* Giriş Tipi Seçimi (Rol Ayrımı) */}
          <div style={roleSelectStyle}>
            <label style={{ marginRight: '10px', fontSize: '14px' }}>Giriş Tipi:</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              style={selectStyle}
            >
              <option value="STUDENT">Öğrenci</option>
              <option value="ADMIN">Yönetici (Admin)</option>
            </select>
          </div>

          <button type="submit" style={buttonStyle}>Giriş Yap</button>
        </form>
      </div>
    </div>
  );
}

// Geçici Tasarım Stilleri (Daha sonra CSS dosyasına taşınabilir)
const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#f4f7f6',
  fontFamily: 'Arial, sans-serif'
};

const cardStyle = {
  padding: '40px',
  backgroundColor: 'white',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  borderRadius: '12px',
  textAlign: 'center',
  width: '350px'
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  margin: '10px 0',
  borderRadius: '8px',
  border: '1px solid #ddd',
  boxSizing: 'border-box'
};

const roleSelectStyle = {
  margin: '15px 0',
  textAlign: 'left',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const selectStyle = {
  padding: '8px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  cursor: 'pointer'
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  marginTop: '20px',
  background: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold',
  transition: 'background 0.3s'
};

export default Login;