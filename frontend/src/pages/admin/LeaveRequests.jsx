import React, { useState, useEffect } from 'react';
import { Search, Plus, Check, X, Trash2, Loader2 } from 'lucide-react';
import { getAllLeaveRequests, updateLeaveStatus, deleteLeaveRequest } from '../../services/leaveService';

export default function LeaveRequests() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const data = await getAllLeaveRequests();
        setLeaveRequests(data);
      } catch (error) {
        console.error("Veriler yüklenemedi");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaves();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateLeaveStatus(id, newStatus);
      setLeaveRequests(prevRequests =>
        prevRequests.map(req => req.id === id ? { ...req, status: newStatus } : req)
      );
    } catch (error) {
      alert("Durum güncellenirken bir hata oluştu!");
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm('Bu izin kaydını silmek istediğinize emin misiniz?')) {
      try {
        await deleteLeaveRequest(id);
        setLeaveRequests(prevRequests => prevRequests.filter(req => req.id !== id));
      } catch (error) {
        alert("Silme işlemi başarısız oldu.");
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>;
  }

  // Tarih formatlamak için ufak bir yardımcı fonksiyon
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <h3 className="font-bold text-gray-800 text-lg hidden sm:block">İzin & Konaklama Kayıtları</h3>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Öğrenci ara..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 transition-colors">
            <Plus size={16} /> İzin Ekle
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="sticky top-0 bg-gray-50/95 backdrop-blur-sm z-10 shadow-sm border-b border-gray-200">
            <tr className="text-gray-500 text-xs uppercase tracking-wider">
              <th className="py-3 px-5 font-bold">Öğrenci Bilgisi</th>
              <th className="py-3 px-5 font-bold">Mazeret & Adres</th>
              <th className="py-3 px-5 font-bold">Tarih Aralığı</th>
              <th className="py-3 px-5 font-bold">Durum</th>
              <th className="py-3 px-5 font-bold text-right">Aksiyon</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {leaveRequests.map((leave) => (
              <tr key={leave.id} className="hover:bg-indigo-50/30 transition-colors group">
                <td className="py-2.5 px-5">
                  <p className="font-bold text-gray-800">{leave.student?.firstName} {leave.student?.lastName}</p>
                  <p className="text-xs font-bold text-indigo-600 mt-0.5"><span className="text-gray-400 font-medium">İletişim:</span> {leave.student?.phone}</p>
                </td>
                <td className="py-2.5 px-5">
                  <p className="text-gray-800 font-semibold">{leave.description}</p>
                  <p className="text-gray-500 text-xs font-medium truncate max-w-[200px]" title={leave.address?.fullAddress}>
                    {leave.address?.city} - {leave.address?.fullAddress}
                  </p>
                </td>
                <td className="py-2.5 px-5 text-gray-500 text-xs font-medium">
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> {formatDate(leave.startDate)}</div>
                  <div className="flex items-center gap-2 mt-1"><div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div> {formatDate(leave.endDate)}</div>
                </td>
                <td className="py-2.5 px-5">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${leave.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                    {leave.status === 'APPROVED' ? 'Onaylandı' : leave.status === 'PENDING' ? 'Bekliyor' : 'Reddedildi'}
                  </span>
                </td>
                <td className="py-2.5 px-5 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {leave.status === 'PENDING' ? (
                    <>
                      <button onClick={() => handleUpdateStatus(leave.id, 'APPROVED')} className="p-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors" title="Onayla"><Check size={18} /></button>
                      <button onClick={() => handleUpdateStatus(leave.id, 'REJECTED')} className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors" title="Reddet"><X size={18} /></button>
                    </>
                  ) : (
                    <button onClick={() => handleDelete(leave.id)} className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Sil"><Trash2 size={16} /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}