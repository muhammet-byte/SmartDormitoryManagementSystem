import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, User, Calendar } from 'lucide-react';
import { getAllLeaveRequests, updateLeaveStatus } from '../../services/leaveService';

export default function LeaveRequests() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      const data = await getAllLeaveRequests();
      // En yeni izinler üstte görünsün
      const sortedData = [...data].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
      setLeaves(sortedData);
    } catch (error) {
      console.error("İzinler çekilemedi", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateLeaveStatus(id, { status: newStatus });
      fetchLeaves(); // Başarılı olursa listeyi yenile
    } catch (error) {
      alert("Durum güncellenirken hata oluştu.");
    }
  };

  if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-gray-800">Öğrenci İzin Talepleri</h1>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
              <th className="p-4 font-bold">Öğrenci</th>
              <th className="p-4 font-bold">Tarih Aralığı</th>
              <th className="p-4 font-bold">Mazeret</th>
              <th className="p-4 font-bold">Durum</th>
              <th className="p-4 font-bold text-right">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold text-gray-800 flex items-center gap-2">
                  <User size={16} className="text-indigo-500" />
                  {leave.student?.firstName} {leave.student?.lastName}
                </td>
                <td className="p-4 text-sm font-medium text-gray-600">
                  {new Date(leave.startDate).toLocaleDateString('tr-TR')} - {new Date(leave.endDate).toLocaleDateString('tr-TR')}
                </td>
                <td className="p-4 text-sm font-medium text-gray-600 max-w-xs truncate">
                  {leave.description}
                </td>
                <td className="p-4">
                  {leave.status === 'PENDING' && <span className="text-xs font-bold bg-orange-100 text-orange-700 px-3 py-1 rounded-full flex items-center gap-1 w-max"><Clock size={14} /> Bekliyor</span>}
                  {leave.status === 'APPROVED' && <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full flex items-center gap-1 w-max"><CheckCircle size={14} /> Onaylandı</span>}
                  {leave.status === 'REJECTED' && <span className="text-xs font-bold bg-rose-100 text-rose-700 px-3 py-1 rounded-full flex items-center gap-1 w-max"><XCircle size={14} /> Reddedildi</span>}
                </td>
                <td className="p-4 text-right space-x-2">
                  {leave.status === 'PENDING' && (
                    <>
                      <button onClick={() => handleStatusUpdate(leave.id, 'APPROVED')} className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold transition-colors">Onayla</button>
                      <button onClick={() => handleStatusUpdate(leave.id, 'REJECTED')} className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold transition-colors">Reddet</button>
                    </>
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