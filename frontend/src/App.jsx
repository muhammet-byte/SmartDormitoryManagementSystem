import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import MapView from './pages/admin/MapView';
import MaintenanceRequests from './pages/admin/MaintenanceRequests';
import Payments from './pages/admin/Payments';
import AdminLeaveRequests from './pages/admin/LeaveRequests';
import StudentsList from './pages/admin/StudentsList';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import RoomSearch from './pages/student/RoomSearch';
import StudentLeaveOperations from './pages/student/LeaveOperations';

export default function App() {
  return (
    <Router>
      <div style={{ display: 'flex', gap: '20px', padding: '20px', backgroundColor: '#001529' }}>
        <Link to="/admin" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Admin Panel</Link>
        <Link to="/student" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Student Panel</Link>
      </div>
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<h2>Dorm Management System</h2>} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/map" element={<MapView />} />
          <Route path="/admin/maintenance" element={<MaintenanceRequests />} />
          <Route path="/admin/payments" element={<Payments />} />
          <Route path="/admin/leave-requests" element={<AdminLeaveRequests />} />
          <Route path="/admin/students" element={<StudentsList />} />

          {/* Student Routes */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/rooms" element={<RoomSearch />} />
          <Route path="/student/leave" element={<StudentLeaveOperations />} />
        </Routes>
      </div>
    </Router>
  );
}
