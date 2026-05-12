import React, { useState, useEffect } from 'react';
import { Wrench, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { getAllMaintenanceRequests, updateMaintenanceStatus } from '../../services/maintenanceService';

export default function Maintenance() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const data = await getAllMaintenanceRequests();
      setRequests(data);
    } catch (error) {
      console.error("Talepler çekilemedi", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateMaintenanceStatus(id, { status: newStatus });
      fetchRequests();
    } catch (error) {
      alert("Durum güncellenirken hata oluştu.");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-gray-800">Arıza ve Şikayet Yönetimi</h1>

      <div className="grid grid-cols-1 gap-4">
        {requests.map((req) => (
          <div key={req.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${req.type === 'COMPLAINT' ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}`}>
                {req.type === 'COMPLAINT' ? <AlertTriangle size={24} /> : <Wrench size={24} />}
              </div>
              <div>
                <p className="font-bold text-gray-800">{req.type === 'COMPLAINT' ? 'Oda Şikayeti' : 'Teknik Arıza'}</p>
                <p className="text-sm font-medium text-gray-500">Oda: {req.room?.roomNumber || 'Bilinmiyor'} • Öğrenci: {req.student?.firstName} {req.student?.lastName}</p>
                <p className="text-sm text-gray-700 mt-2 bg-gray-50 p-2 rounded-lg">{req.description}</p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              {req.status === 'PENDING' ? (
                <>
                  <span className="text-xs font-bold bg-orange-100 text-orange-700 px-3 py-1 rounded-full flex items-center gap-1"><Clock size={14} /> Bekliyor</span>
                  <button onClick={() => handleStatusUpdate(req.id, 'COMPLETED')} className="mt-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">Çözüldü İşaretle</button>
                </>
              ) : (
                <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full flex items-center gap-1"><CheckCircle size={14} /> Çözüldü</span>
              )}
            </div>
          </div>
        ))}
        {requests.length === 0 && <p className="text-gray-500 text-center py-10">Kayıtlı talep bulunmuyor.</p>}
      </div>
    </div>
  );
}