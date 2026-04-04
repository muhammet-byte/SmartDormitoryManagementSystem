import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }) // Kullanıcı adı ve şifreyi gönderiyoruz
      });

      if (response.ok) {
        const user = await response.json(); // Backend'den gelen kullanıcı verisi

        // Backend'deki role göre yönlendirme yapıyoruz
        if (user.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/student-home');
        }
      } else {
        alert("Hatalı kullanıcı adı veya şifre! ❌");
      }
    } catch (error) {
      console.error("Bağlantı hatası:", error);
      alert("Backend sunucusuna ulaşılamıyor! 📡");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2>Yurt Giriş Sistemi 🔑</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Kullanıcı Adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />
          <button type="submit" style={buttonStyle}>Giriş Yap</button>
        </form>
      </div>
    </div>
  );
}

// Stiller aynı kalabilir...
const containerStyle = { display: 'flex', justifyContent: 'center', marginTop: '100px', fontFamily: 'Arial' };
const cardStyle = { padding: '30px', border: '1px solid #ccc', borderRadius: '10px', textAlign: 'center', width: '300px' };
const inputStyle = { width: '90%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ddd' };
const buttonStyle = { width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };

export default Login;