import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminPanel() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', roomNumber: '' });
  const navigate = useNavigate();

  // 1. Veritabanındaki öğrencileri çekme (GET)
  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/students');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 2. Formdaki kutucuklara yazı yazabilmemiz için
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Yeni öğrenci kaydetme (POST)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:8080/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setFormData({ firstName: '', lastName: '', email: '', roomNumber: '' }); // Formu temizle
      fetchStudents(); // Listeyi güncelle
    } catch (error) {
      console.error("Kaydetme hatası:", error);
    }
  };

  // Çıkış yapma fonksiyonu
  const handleLogout = () => {
    navigate('/'); // Giriş ekranına geri döner
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Yurt Yönetim Paneli (ADMIN) 🏢</h1>
        <button onClick={handleLogout} style={logoutButtonStyle}>Çıkış Yap</button>
      </div>

      <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>Yeni Öğrenci Kaydı</h3>
        <form onSubmit={handleSubmit}>
          <input name="firstName" placeholder="Ad" value={formData.firstName} onChange={handleChange} style={inputStyle} required />
          <input name="lastName" placeholder="Soyad" value={formData.lastName} onChange={handleChange} style={inputStyle} required />
          <input name="email" placeholder="E-posta" value={formData.email} onChange={handleChange} style={inputStyle} required />
          <input name="roomNumber" placeholder="Oda No" value={formData.roomNumber} onChange={handleChange} style={inputStyle} required />
          <button type="submit" style={saveButtonStyle}>Kaydet</button>
        </form>
      </div>

      <h3>Kayıtlı Öğrenciler</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f4f4f4' }}>
            <th style={tableHeaderStyle}>ID</th>
            <th style={tableHeaderStyle}>Ad Soyad</th>
            <th style={tableHeaderStyle}>Email</th>
            <th style={tableHeaderStyle}>Oda</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s.id}>
              <td style={tableCellStyle}>{s.id}</td>
              <td style={tableCellStyle}>{s.firstName} {s.lastName}</td>
              <td style={tableCellStyle}>{s.email}</td>
              <td style={tableCellStyle}>{s.roomNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Stiller
const inputStyle = { margin: '5px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' };
const tableHeaderStyle = { padding: '12px', border: '1px solid #ddd', textAlign: 'left' };
const tableCellStyle = { padding: '10px', border: '1px solid #ddd' };
const saveButtonStyle = { padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };
const logoutButtonStyle = { padding: '8px 15px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };

export default AdminPanel;