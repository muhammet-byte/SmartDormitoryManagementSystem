export default function AdminDashboard() {
  return (
    <div>
      <h2>Admin Dashboard</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>

        <div style={cardStyle}>
          <h3>Total Rooms</h3>
          <p>48</p>
        </div>

        <div style={cardStyle}>
          <h3>Occupied</h3>
          <p>42 / 48</p>
        </div>

        <div style={cardStyle}>
          <h3>Available</h3>
          <p>6</p>
        </div>

      </div>

      <div style={infoCardsContainer}>
        <div style={infoCard}>
          <h3>Maintenance Requests</h3>
          <p>8 Pending</p>
        </div>
        <div style={infoCard}>
          <h3>Leave Requests</h3>
          <p>3 Pending</p>
        </div>
        <div style={infoCard}>
          <h3>Payments Due</h3>
          <p>5 Students</p>
        </div>
      </div>

      <div style={buttonGrid}>
        <Link to="/admin/map" style={buttonBlue}>View Floor Map</Link>
        <Link to="/admin/maintenance" style={buttonBlue}>Maintenance Requests</Link>
        <Link to="/admin/payments" style={buttonGreen}>Payments</Link>
        <Link to="/admin/leave-requests" style={buttonBlue}>Leave Requests</Link>
        <Link to="/admin/students" style={buttonGreen}>Students List</Link>
      </div>

    </div>
  );
}

const cardStyle = { backgroundColor: '#1f2937', padding: '20px', borderRadius: '12px', color: 'white', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' };
const infoCardsContainer = { display: 'flex', gap: '20px', marginTop: '30px' };
const infoCard = { backgroundColor: '#374151', padding: '20px', borderRadius: '12px', color: 'white', flex: 1, textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' };
const buttonGrid = { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginTop: '40px' };
const buttonBlue = { backgroundColor: '#2563eb', color: 'white', padding: '12px', borderRadius: '8px', textAlign: 'center', textDecoration: 'none', fontWeight: '600', transition: 'background 0.3s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' };
const buttonGreen = { backgroundColor: '#10b981', color: 'white', padding: '12px', borderRadius: '8px', textAlign: 'center', textDecoration: 'none', fontWeight: '600', transition: 'background 0.3s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' };
