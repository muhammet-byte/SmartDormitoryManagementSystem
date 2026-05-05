import React, { useState, useEffect } from 'react';
import { Search, Plus, Clock, Loader2, X } from 'lucide-react';
import { getAllMaintenanceRequests, updateMaintenanceStatus, createMaintenanceRequest } from '../../services/maintenanceService';

export default function MaintenanceRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State'leri
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRequestData, setNewRequestData] = useState({
    description: '',
    priority: 'MEDIUM'
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await getAllMaintenanceRequests();
      setRequests(data);
    } catch (error) {
      console.error("Veriler yüklenemedi!");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateMaintenanceStatus(id, newStatus);
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (error) {
      alert("Durum güncellenirken hata oluştu.");
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      const savedData = await createMaintenanceRequest(newRequestData);
      setRequests([savedData, ...requests]); // Yeni kaydı listenin en başına ekle
      setIsModalOpen(false); // Modalı kapat
      setNewRequestData({ description: '', priority: 'MEDIUM' }); // Formu sıfırla
    } catch (error) {
      alert("Kayıt oluşturulurken bir hata oluştu.");
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'PENDING');
  const inProgressRequests = requests.filter(r => r.status === 'IN_PROGRESS');

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-4 relative">
      {/* Üst Arama Barı ve Yeni Kayıt Butonu */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 shrink-0">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Arıza metni ara..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 shadow-sm transition-colors">
          <Plus size={16} /> Yeni Kayıt
        </button>
      </div>

      {/* Sütunlar */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 items-start overflow-hidden">

        {/* Bekleyen İşler */}
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 flex flex-col h-full overflow-hidden">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center justify-between shrink-0">
            Bekleyen İşler
            <span className="bg-orange-100 text-orange-700 px-2.5 py-1 rounded-lg text-xs font-black">{pendingRequests.length}</span>
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {pendingRequests.map((req) => (
              <div key={req.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-300 transition-colors shrink-0">
                <div className="flex justify-between items-start mb-2.5">
                  <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md">
                    {req.room ? `Blok ${req.room.block?.blockNumber} - Oda ${req.room.roomNumber}` : 'Genel Alan'}
                  </span>
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${req.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {req.priority === 'HIGH' ? 'Yüksek' : req.priority === 'MEDIUM' ? 'Orta' : 'Düşük'}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-800 leading-snug">{req.description}</p>
                <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-2">
                  <p className="text-[11px] font-medium text-gray-400 flex items-center gap-1">
                    <Clock size={12} /> {new Date(req.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                  <button onClick={() => handleStatusChange(req.id, 'IN_PROGRESS')} className="text-[10px] font-bold bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600 transition-colors">İşleme Al</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* İşlemdekiler */}
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 flex flex-col h-full overflow-hidden">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center justify-between shrink-0">
            İşlemdekiler
            <span className="bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg text-xs font-black">{inProgressRequests.length}</span>
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {inProgressRequests.map((req) => (
              <div key={req.id} className="bg-white p-4 rounded-xl shadow-sm border-2 border-indigo-200 shrink-0">
                <div className="flex justify-between items-start mb-2.5">
                  <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md">
                    {req.room ? `Blok ${req.room.block?.blockNumber} - Oda ${req.room.roomNumber}` : 'Genel Alan'}
                  </span>
                  <span className="px-2 py-1 rounded-md text-xs font-bold bg-orange-100 text-orange-700">
                    {req.priority === 'HIGH' ? 'Yüksek' : req.priority === 'MEDIUM' ? 'Orta' : 'Düşük'}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-800 leading-snug">{req.description}</p>
                <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-2">
                  <p className="text-[11px] font-medium text-gray-400 flex items-center gap-1">
                    <Clock size={12} /> {new Date(req.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                  <button onClick={() => handleStatusChange(req.id, 'COMPLETED')} className="text-[10px] font-bold bg-emerald-500 text-white px-2 py-1 rounded hover:bg-emerald-600 transition-colors">Tamamlandı</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Yeni Kayıt Modalı */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"><X size={24} /></button>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Yeni Bakım/Arıza Kaydı</h2>
              <form onSubmit={handleCreateRequest} className="space-y-4">

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Öncelik Durumu</label>
                  <select
                    value={newRequestData.priority}
                    onChange={(e) => setNewRequestData({ ...newRequestData, priority: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="LOW">Düşük Öncelik</option>
                    <option value="MEDIUM">Orta Öncelik</option>
                    <option value="HIGH">Yüksek Öncelik (Acil!)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Arıza Detayı</label>
                  <textarea
                    required
                    rows="3"
                    value={newRequestData.description}
                    onChange={(e) => setNewRequestData({ ...newRequestData, description: e.target.value })}
                    placeholder="Örn: 2. Blok Ortak Alan kalöriferi su akıtıyor..."
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  ></textarea>
                </div>

                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg transition-colors">
                  Kaydı Oluştur
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}