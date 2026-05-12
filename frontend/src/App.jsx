import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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
    <Router>
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
    </Router>
  );
}