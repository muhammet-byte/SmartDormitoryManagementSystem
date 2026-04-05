import React, { useState } from 'react';

function StudentHome() {
  const [bedTime, setBedTime] = useState('12 AM');
  const [wakeTime, setWakeTime] = useState('8 AM');
  const [department, setDepartment] = useState('');
  const [noiseLevel, setNoiseLevel] = useState(3);
  const [cleanliness, setCleanliness] = useState(3);
  const [kitchenUsage, setKitchenUsage] = useState('Sık');

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!department) {
      alert("Lütfen bölümünüzü seçin!");
      return;
    }

    // Metinleri veritabanı için sayılara dönüştürme mantığı
    const timeMapping = {
      '8 PM': 20, '10 PM': 22, '12 AM': 24, '2 AM': 2,
      '6 AM': 6, '8 AM': 8, '10 AM': 10, '12 PM': 12
    };

    const kitchenMapping = { 'Nadir': 1, 'Sık': 2, 'Çoğunlukla': 3 };

    const studentProfile = {
      department: department,
      sleepTime: timeMapping[bedTime],
      wakeUpTime: timeMapping[wakeTime],
      cleanlinessScore: parseInt(cleanliness),
      noiseTolerance: parseInt(noiseLevel),
      kitchenUsage: kitchenMapping[kitchenUsage]
    };

    try {
      const response = await fetch('http://localhost:8080/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentProfile)
      });

      if (response.ok) {
        alert("Profil verileri başarıyla senkronize edildi! ✅");
      } else {
        alert("Kaydetme hatası! Sunucu yanıtını kontrol edin.");
      }
    } catch (error) {
      alert("Backend bağlantı hatası!");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2>Akıllı Tercih Formu ⚙️</h2>
        <form onSubmit={handleSaveProfile}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Bölüm:</label>
            <select value={department} onChange={(e) => setDepartment(e.target.value)} style={selectStyle}>
              <option value="">Seçiniz...</option>
              <option value="Computer Engineering">Bilgisayar Mühendisliği</option>
              <option value="Industrial Engineering">Endüstri Mühendisliği</option>
              <option value="Law">Hukuk</option>
            </select>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Uyku & Uyanma:</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <select value={bedTime} onChange={(e) => setBedTime(e.target.value)} style={selectStyle}>
                <option value="8 PM">8 PM</option><option value="10 PM">10 PM</option>
                <option value="12 AM">12 AM</option><option value="2 AM">2 AM</option>
              </select>
              <select value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} style={selectStyle}>
                <option value="6 AM">6 AM</option><option value="8 AM">8 AM</option>
                <option value="10 AM">10 AM</option><option value="12 PM">12 PM</option>
              </select>
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Gürültü Toleransı (1-5):</label>
            <input type="range" min="1" max="5" value={noiseLevel} onChange={(e) => setNoiseLevel(e.target.value)} style={{ width: '100%' }} />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Mutfak Kullanımı:</label>
            <div style={{ display: 'flex', gap: '5px' }}>
              {['Nadir', 'Sık', 'Çoğunlukla'].map(opt => (
                <button key={opt} type="button" onClick={() => setKitchenUsage(opt)}
                  style={kitchenUsage === opt ? activeButtonStyle : passiveButtonStyle}>{opt}</button>
              ))}
            </div>
          </div>

          <button type="submit" style={saveButtonStyle}>Bilgileri Veritabanına Yaz</button>
        </form>
      </div>
    </div>
  );
}

const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5' };
const cardStyle = { padding: '30px', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '400px' };
const formGroupStyle = { marginBottom: '15px' };
const labelStyle = { display: 'block', fontWeight: 'bold', marginBottom: '5px' };
const selectStyle = { width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ddd' };
const saveButtonStyle = { width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '10px' };
const activeButtonStyle = { flex: 1, padding: '8px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' };
const passiveButtonStyle = { flex: 1, padding: '8px', backgroundColor: '#e4e6eb', color: '#333', border: 'none', borderRadius: '5px' };

export default StudentHome;