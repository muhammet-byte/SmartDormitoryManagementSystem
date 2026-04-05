import React, { useState, useEffect } from 'react';

function AdminPanel() {
  // --- STATE (HAFIZA) ---
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalRooms: 0,
    totalCapacity: 0,
    emptyBeds: 0,
    pendingRequests: 0
  });
  const [requests, setRequests] = useState([]);

  // --- VERİ ÇEKME FONKSİYONU ---
  const fetchData = () => {
    // 1. İstatistikleri Çek
    fetch('http://localhost:8080/api/admin/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(error => console.error("İstatistik çekme hatası:", error));

    // 2. Bekleyen Talepleri Çek
    fetch('http://localhost:8080/api/requests/pending')
      .then(res => res.json())
      .then(data => setRequests(data))
      .catch(error => console.error("Talep çekme hatası:", error));
  };

  // Sayfa ilk açıldığında verileri getir
  useEffect(() => {
    fetchData();
  }, []);

  // --- ONAYLA VEYA REDDET İŞLEMİ ---
  const handleAction = async (id, actionType) => {
    try {
      const response = await fetch(`http://localhost:8080/api/requests/${id}/${actionType}`, {
        method: 'PUT'
      });

      if (response.ok) {
        // alert(`İşlem başarılı: Talep ${actionType === 'approve' ? 'Onaylandı' : 'Reddedildi'}!`);
        // İşlem başarılıysa sayfayı yenilemeden güncel verileri tekrar çek (Sayılar anında değişsin)
        fetchData();
      } else {
        const errorText = await response.text();
        alert(`Hata: ${errorText}`);
      }
    } catch (error) {
      alert("Sunucuya bağlanılamadı.");
    }
  };

  return (
    <div style={pageStyle}>

      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>System Management</h1>
          <p style={subtitleStyle}>Track dormitory capacity and manage room requests.</p>
        </div>
        <button style={actionButtonStyle}>+ Add New Student</button>
      </div>

      <div style={metricsContainerStyle}>
        <div style={metricCardStyle}>
          <div style={metricIconStyle}>👥</div>
          <div style={metricValueStyle}>{stats.totalStudents} <span style={{fontSize:'18px', color:'#94a3b8'}}>/ {stats.totalCapacity}</span></div>
          <div style={metricLabelStyle}>Current Occupancy</div>
        </div>

        <div style={metricCardStyle}>
          <div style={metricIconStyle}>🛏️</div>
          <div style={metricValueStyle}>{stats.emptyBeds}</div>
          <div style={metricLabelStyle}>Available Beds</div>
        </div>

        <div style={metricCardStyle}>
          <div style={metricIconStyle}>⏳</div>
          <div style={metricValueStyle}>{stats.pendingRequests}</div>
          <div style={metricLabelStyle}>Pending Requests</div>
        </div>
      </div>

      <div style={contentCardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', margin: 0 }}>Pending Room Requests</h2>
          <input type="text" placeholder="Search Student or Room..." style={searchInputStyle} />
        </div>

        {/* BEKLEYEN TALEPLER LİSTESİ */}
                <div style={{ marginTop: '20px' }}>
                  {requests.length === 0 ? (
                    <div style={emptyStateStyle}>
                      <div style={{ fontSize: '40px', marginBottom: '15px' }}>🗃️</div>
                      <h3 style={{ margin: '0 0 10px 0', color: '#334155' }}>All Requests Processed</h3>
                      <p style={{ margin: 0, color: '#64748b' }}>There are currently no pending room requests in the system.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      {requests.map((req) => (
                        <div key={req.id} style={requestRowStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={studentAvatarStyle}>👤</div>
                            <div>
                              <strong style={{color: '#0f172a', fontSize: '16px'}}>{req.studentUsername}</strong>
                              <div style={{color: '#64748b', fontSize: '14px', marginTop: '4px'}}>
                                Target Room: <span style={{fontWeight: 'bold', color: '#3b82f6'}}>{req.roomName}</span>
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => handleAction(req.id, 'approve')} style={approveButtonStyle}>✓ Approve</button>
                            <button onClick={() => handleAction(req.id, 'reject')} style={rejectButtonStyle}>✕ Reject</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
      </div>

    </div>
  );
}

// --- CSS STİLLERİ ---
const pageStyle = { minHeight: '90vh', padding: '40px 50px', backgroundColor: '#f1f5f9', fontFamily: "'Inter', 'Segoe UI', sans-serif" };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' };
const titleStyle = { fontSize: '28px', color: '#0f172a', marginBottom: '5px', fontWeight: '800' };
const subtitleStyle = { fontSize: '15px', color: '#64748b', margin: 0 };
const actionButtonStyle = { padding: '12px 24px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.3s', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)' };

const metricsContainerStyle = { display: 'flex', gap: '25px', marginBottom: '40px' };
const metricCardStyle = { flex: 1, backgroundColor: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' };
const metricIconStyle = { fontSize: '24px', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '12px', marginBottom: '15px' };
const metricValueStyle = { fontSize: '32px', fontWeight: '800', color: '#0f172a', marginBottom: '5px' };
const metricLabelStyle = { fontSize: '14px', color: '#64748b', fontWeight: '500' };

const contentCardStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' };
const searchInputStyle = { padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '250px', outline: 'none' };
const emptyStateStyle = { padding: '60px 20px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '12px', border: '2px dashed #e2e8f0', marginTop: '20px' };

// YENİ EKLENEN SATIR STİLLERİ
const requestRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' };
const studentAvatarStyle = { fontSize: '24px', backgroundColor: '#e2e8f0', padding: '10px', borderRadius: '50%' };
const approveButtonStyle = { padding: '10px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' };
const rejectButtonStyle = { padding: '10px 20px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' };

export default AdminPanel;