import { Routes, Route, Navigate } from 'react-router-dom'; // 'BrowserRouter as Router' buradan silindi

// Login Sayfası
import Login from './pages/Login';

// Admin Sayfaları ve Layout
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import MapView from './pages/admin/MapView';
import StudentsList from './pages/admin/StudentsList';
import MaintenanceRequests from './pages/admin/MaintenanceRequests';
import Payments from './pages/admin/Payments';
import LeaveRequests from './pages/admin/LeaveRequests';
import RoomChangeRequests from './pages/admin/RoomChangeRequests';

// Öğrenci Sayfaları ve Layout
import StudentLayout from './components/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import RoomSearch from './pages/student/RoomSearch';
import RoomStatus from './pages/student/RoomStatus';
import LeaveOperations from './pages/student/LeaveOperations';
import Addresses from './pages/student/Addresses';

export default function App() {
  return (
    // <Router> etiketlerini buradan kaldırdık, sadece <Routes> kaldı
    <Routes>
      {/* Varsayılan olarak Login paneline yönlendirir */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* Yönetici (Admin) Rotaları */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="map" element={<MapView />} />
        <Route path="students" element={<StudentsList />} />
        <Route path="maintenance" element={<MaintenanceRequests />} />
        <Route path="payments" element={<Payments />} />
        <Route path="leaves" element={<LeaveRequests />} />
        <Route path="room-changes" element={<RoomChangeRequests />} />
      </Route>

      {/* Öğrenci (Student) Rotaları */}
      <Route path="/student" element={<StudentLayout />}>
        <Route path="leaves" element={<LeaveOperations />} />
        <Route path="addresses" element={<Addresses />} />
        <Route element={<RoomStatus />} path="room-status" />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="room-search" element={<RoomSearch />} />
      </Route>
    </Routes>
  );
}

const navStyle = { backgroundColor: '#0f172a', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' };
const logoStyle = { fontSize: '20px', fontWeight: '800', letterSpacing: '0.5px' };
const linkStyle = { color: '#e2e8f0', textDecoration: 'none', marginLeft: '25px', fontWeight: '500', fontSize: '15px', transition: 'color 0.2s' };
const logoutBtnStyle = { backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', marginLeft: '25px', cursor: 'pointer', fontWeight: '600', transition: 'background 0.3s' };