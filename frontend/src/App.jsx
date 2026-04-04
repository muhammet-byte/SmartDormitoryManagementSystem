import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import AdminPanel from './AdminPanel';
function App() {
  return (
    <Router>
      <Routes>
        {/* Ana sayfa açıldığında giriş ekranı gelsin */}
        <Route path="/" element={<Login />} />

        {/* /admin yazıldığında senin yaptığın o panel gelsin */}
        <Route path="/admin" element={<AdminPanel />} />

        {/* Henüz yapmadığımız öğrenci ana sayfası için yer ayıralım */}
        <Route path="/student-home" element={<div><h1>Öğrenci Sayfası (Yapım Aşamasında...) 🏗️</h1></div>} />
      </Routes>
    </Router>
  );
}

export default App;