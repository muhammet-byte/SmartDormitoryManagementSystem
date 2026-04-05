import React, { useState, useEffect } from 'react';

function StudentHome() {
  // --- AUTH: GET USER FROM STORAGE ---
  const loggedInUser = localStorage.getItem('username') || 'guest';

  // --- STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMatches, setShowMatches] = useState(false);
  const [matchedRooms, setMatchedRooms] = useState([]);
  const [requestedRooms, setRequestedRooms] = useState([]);
  const [myRequest, setMyRequest] = useState(null);

  // Form Preferences
  const [bedTime, setBedTime] = useState('12 AM');
  const [wakeTime, setWakeTime] = useState('8 AM');
  const [department, setDepartment] = useState('');
  const [noiseLevel, setNoiseLevel] = useState(3);
  const [kitchenUsage, setKitchenUsage] = useState('Often');

  // --- FETCHING DATA ---
  const fetchMyStatus = () => {
    // CRITICAL FIX: URL matches the Backend's @GetMapping("/my_status/{username}")
    fetch(`http://localhost:8080/api/requests/my_status/${loggedInUser}`)
      .then(res => res.status === 200 ? res.json() : null)
      .then(data => {
        setMyRequest(data);
        if (data && data.targetRoomId) setRequestedRooms([data.targetRoomId]);
      })
      .catch(err => console.log("Status check failed", err));
  };

  useEffect(() => {
    fetchMyStatus();
  }, []);

  // Mock data for current room (Can be made dynamic later)
  const currentRoom = {
      roomNumber: "Waiting for Assignment", // Başlığı değiştirdik
      beds: [
        { id: 1, name: "You (Student)", status: "occupied", isMe: true },
        { id: 2, name: "Available", status: "empty", isMe: false }, // Ahmet artık yok
        { id: 3, name: "Available", status: "empty", isMe: false },
        { id: 4, name: "Available", status: "empty", isMe: false }
      ]
  };

  // --- ACTIONS ---
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!department) {
      alert("Please select your department!");
      return;
    }

    const timeMapping = { '8 PM': 20, '10 PM': 22, '12 AM': 24, '2 AM': 2, '6 AM': 6, '8 AM': 8, '10 AM': 10, '12 PM': 12 };
    const kitchenMapping = { 'Rarely': 1, 'Often': 2, 'Mostly': 3 };

    const studentPreferences = {
      username: loggedInUser,
      department: department,
      bedTime: bedTime, // Matches Backend Entity
      wakeTime: wakeTime,
      noiseLevel: parseInt(noiseLevel),
      kitchenUsage: kitchenMapping[kitchenUsage]
    };

    try {
      const response = await fetch('http://localhost:8080/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentPreferences)
      });

      if (response.ok) {
        const bestRooms = await response.json();
        setMatchedRooms(bestRooms);
        setIsModalOpen(false);
        setShowMatches(true);
      }
    } catch (error) {
      alert("Algorithm connection failed!");
    }
  };

  const handleJoinRequest = async (roomId, roomName) => {
    const requestPayload = {
      studentUsername: loggedInUser,
      targetRoomId: roomId,
      roomName: roomName,
      status: "PENDING"
    };

    try {
      const response = await fetch('http://localhost:8080/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      });

      if (response.ok) {
        alert(`✅ Success! Your request for ${roomName} has been submitted.`);
        setRequestedRooms([...requestedRooms, roomId]);
        fetchMyStatus();
      }
    } catch (error) {
      alert("Request failed! Check CORS or Database connection.");
    }
  };

  // --- VIEW: MATCHES GRID ---
  if (showMatches) {
    return (
      <div style={pageStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={titleStyle}>Dormitory Global Explorer</h1>
            <p style={subtitleStyle}>Best matches based on your lifestyle and department.</p>
          </div>
          <button onClick={() => setShowMatches(false)} style={outlineButtonStyle}>← Back to Dashboard</button>
        </div>

        <div style={fourColumnGridStyle}>
          {matchedRooms.map((room) => {
            const occupiedBedsCount = 4 - room.availableBeds;
            const bedVisuals = Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={i < occupiedBedsCount ? occupiedBedStyle : emptyBedStyle}>
                {i < occupiedBedsCount ? "👤" : "+"}
              </div>
            ));

            const isRequested = requestedRooms.includes(room.roomId) || (myRequest && myRequest.targetRoomId === room.roomId);

            return (
              <div key={room.roomId} style={matchCardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <h3 style={{ margin: '0', color: '#0f172a', fontSize: '18px' }}>{room.roomName}</h3>
                  <div style={scoreBadgeStyle}>{room.matchScore}%</div>
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#64748b' }}>Capacity ({room.availableBeds} available)</p>
                  <div style={{ display: 'flex', gap: '8px' }}>{bedVisuals}</div>
                </div>
                <button
                  onClick={() => handleJoinRequest(room.roomId, room.roomName)}
                  disabled={isRequested}
                  style={isRequested ? actionButtonStyleDisabled : actionButtonStyleFull}
                >
                  {isRequested ? "Request Sent ✔️" : "Join This Room"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // --- VIEW: DASHBOARD ---
  return (
    <div style={pageStyle}>
      <div style={dashboardHeaderStyle}>
        <div>
          <h1 style={titleStyle}>Student Dashboard</h1>
          <p style={subtitleStyle}>Welcome back, <span style={{color: '#3b82f6', fontWeight: 'bold'}}>{loggedInUser}</span></p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setIsModalOpen(true)} style={actionButtonStyle}>✨ Find Better Room</button>
        </div>
      </div>

      {/* --- STATUS BANNER --- */}
      {myRequest && (
        <div style={statusBannerStyle(myRequest.status)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '24px' }}>
              {myRequest.status === 'PENDING' ? '⏳' : myRequest.status === 'APPROVED' ? '✅' : '❌'}
            </span>
            <div>
              <h4 style={{ margin: 0 }}>Application Status: {myRequest.roomName}</h4>
              <p style={{ margin: 0, fontSize: '13px', opacity: 0.9 }}>
                {myRequest.status === 'PENDING' ? 'Your request is being reviewed by the administration.' :
                 myRequest.status === 'APPROVED' ? 'Approved! Please visit the office for keys.' :
                 'Your request was declined. Please try a different room.'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div style={roomInfoCardStyle}>
        <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#0f172a', fontSize: '20px' }}>Current Residence: <span style={{ color: '#3b82f6' }}>{currentRoom.roomNumber}</span></h2>
        </div>
        <div style={dashboardBedsGridStyle}>
          {currentRoom.beds.map((bed) => (
            <div key={bed.id} style={bedCardStyle(bed.status, bed.isMe)}>
              <div style={bedNumberStyle}>Bed Slot {bed.id}</div>
              <div style={bedNameStyle(bed.status)}>{bed.name}</div>
              {bed.status === 'empty' && <div style={emptyBadgeStyle}>Empty</div>}
            </div>
          ))}
        </div>
      </div>

      {/* --- MODAL (MEGA DEPARTMENT LIST) --- */}
      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h2 style={{ margin: 0, color: '#0f172a' }}>Personal Preferences</h2>
              <button onClick={() => setIsModalOpen(false)} style={closeButtonStyle}>✕</button>
            </div>

            <form onSubmit={handleRequestSubmit}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>🎓 Department</label>
                <select value={department} onChange={(e) => setDepartment(e.target.value)} style={selectStyle}>
                  <option value="" disabled>Search or select department...</option>
                  <optgroup label="Engineering">
                    <option value="Computer Engineering">Computer Engineering</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Aerospace Engineering">Aerospace Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Industrial Engineering">Industrial Engineering</option>
                    <option value="Electrical & Electronics">Electrical & Electronics</option>
                  </optgroup>
                  <optgroup label="Health & Medicine">
                    <option value="Medicine">Medicine</option>
                    <option value="Dentistry">Dentistry</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Molecular Biology">Molecular Biology</option>
                  </optgroup>
                  <optgroup label="Social Sciences">
                    <option value="Law">Law</option>
                    <option value="Psychology">Psychology</option>
                    <option value="International Relations">International Relations</option>
                    <option value="Economics">Economics</option>
                    <option value="Architecture">Architecture</option>
                  </optgroup>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>🌙 Bedtime</label>
                  <select value={bedTime} onChange={(e) => setBedTime(e.target.value)} style={selectStyle}>
                    <option value="10 PM">Early (10 PM)</option>
                    <option value="12 AM">Normal (12 AM)</option>
                    <option value="2 AM">Night Owl (2 AM)</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>☀️ Wake-up</label>
                  <select value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} style={selectStyle}>
                    <option value="6 AM">Early Bird (6 AM)</option>
                    <option value="8 AM">Normal (8 AM)</option>
                    <option value="10 AM">Late (10 AM)</option>
                  </select>
                </div>
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>🔊 Noise Tolerance: {noiseLevel}/5</label>
                <input type="range" min="1" max="5" value={noiseLevel} onChange={(e) => setNoiseLevel(e.target.value)} style={{ width: '100%', accentColor: '#0f172a' }} />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>🍳 Kitchen Usage</label>
                <select value={kitchenUsage} onChange={(e) => setKitchenUsage(e.target.value)} style={selectStyle}>
                  <option value="Rarely">Rarely (I eat out)</option>
                  <option value="Often">Often (I cook basic meals)</option>
                  <option value="Mostly">Mostly (Masterchef status)</option>
                </select>
              </div>

              <button type="submit" style={submitButtonStyle}>Generate Matches</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- STYLES (Keep as is, but small tweaks for professional look) ---
const pageStyle = { minHeight: '90vh', padding: '40px 50px', backgroundColor: '#f8fafc', fontFamily: "'Inter', -apple-system, sans-serif" };
const statusBannerStyle = (status) => ({
    padding: '20px', borderRadius: '15px', marginBottom: '20px', color: 'white',
    backgroundColor: status === 'PENDING' ? '#f59e0b' : status === 'APPROVED' ? '#10b981' : '#ef4444',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
});
const dashboardHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' };
const titleStyle = { fontSize: '28px', color: '#0f172a', fontWeight: '800', margin: 0 };
const subtitleStyle = { fontSize: '15px', color: '#64748b', margin: 0 };
const actionButtonStyle = { padding: '12px 24px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' };
const outlineButtonStyle = { padding: '10px 16px', backgroundColor: 'white', color: '#3b82f6', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' };
const roomInfoCardStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' };
const dashboardBedsGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' };
const bedCardStyle = (status, isMe) => ({ padding: '20px', borderRadius: '15px', border: isMe ? '2px solid #3b82f6' : '1px solid #e2e8f0', backgroundColor: status === 'empty' ? '#f8fafc' : isMe ? '#eff6ff' : 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.2s' });
const bedNumberStyle = { fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' };
const bedNameStyle = (status) => ({ fontSize: '15px', fontWeight: '600', color: status === 'empty' ? '#cbd5e1' : '#1e293b' });
const emptyBadgeStyle = { marginTop: '10px', padding: '4px 10px', backgroundColor: '#f1f5f9', color: '#94a3b8', fontSize: '11px', borderRadius: '20px', fontWeight: 'bold' };
const fourColumnGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' };
const matchCardStyle = { backgroundColor: 'white', padding: '24px', borderRadius: '20px', borderTop: '5px solid #10b981', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' };
const scoreBadgeStyle = { padding: '6px 12px', backgroundColor: '#d1fae5', color: '#065f46', fontWeight: '800', borderRadius: '10px', fontSize: '16px' };
const occupiedBedStyle = { width: '35px', height: '35px', backgroundColor: '#f1f5f9', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px' };
const emptyBedStyle = { width: '35px', height: '35px', backgroundColor: 'transparent', border: '2px dashed #e2e8f0', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#cbd5e1' };
const actionButtonStyleFull = { width: '100%', padding: '12px', backgroundColor: '#f8fafc', color: '#3b82f6', border: '1px solid #e2e8f0', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', marginTop: 'auto' };
const actionButtonStyleDisabled = { ...actionButtonStyleFull, backgroundColor: '#f1f5f9', color: '#94a3b8', cursor: 'not-allowed', border: 'none' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' };
const closeButtonStyle = { background: '#f1f5f9', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', color: '#0f172a', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const modalCardStyle = { backgroundColor: 'white', padding: '35px', borderRadius: '28px', width: '95%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', zIndex: 1001, maxHeight: '90vh', overflowY: 'auto' };
// 1. Select kutularını ve içindeki yazıları belirginleştiriyoruz
const selectStyle = {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: '2px solid #e2e8f0', // Kenarlıkları biraz daha kalınlaştırdık
    outline: 'none',
    backgroundColor: '#ffffff', // Saf beyaz arka plan
    color: '#0f172a', // Koyu lacivert/siyah yazı rengi (ZORUNLU)
    fontSize: '15px',
    fontWeight: '500',
    appearance: 'auto', // Bazı tarayıcılarda ok işaretinin görünmesi için
    cursor: 'pointer'
};

// 2. Etiketlerin (Label) rengini koyulaştırıyoruz
const labelStyle = {
    display: 'block',
    fontWeight: '700',
    marginBottom: '10px',
    fontSize: '14px',
    color: '#1e293b', // Daha belirgin bir gri/siyah
    textAlign: 'left'
};

// 3. Form gruplarının altına mesafe ekleyerek nefes aldırıyoruz
const formGroupStyle = {
    marginBottom: '25px',
    textAlign: 'left'
};
const submitButtonStyle = { width: '100%', padding: '16px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '700', cursor: 'pointer', marginTop: '10px', transition: 'transform 0.1s' };

export default StudentHome;