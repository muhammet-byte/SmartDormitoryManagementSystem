import React, { useState, useEffect } from 'react';
import { Check, X, Clock, Loader2, CalendarDays, MessageSquare, User } from 'lucide-react';
import { getAllLeaveRequests, updateLeaveStatus } from '../../services/leaveService';

export default function LeaveRequests() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      const data = await getAllLeaveRequests();
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
      fetchLeaves();
    } catch (error) {
      alert("Durum güncellenirken hata oluştu.");
    }
  };

  // Öğrenci listesindeki avatar standardını buraya da getiriyoruz
  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  // Okunaklı ve premium durum rozetleri
  const getStatusDetails = (status) => {
    switch (status) {
      case 'APPROVED':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          line: 'border-l-emerald-500',
          text: 'Onaylandı'
        };
      case 'REJECTED':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          line: 'border-l-rose-500',
          text: 'Reddedildi'
        };
      default:
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          line: 'border-l-amber-500',
          text: 'Beklemede'
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-slate-800" size={32} />
          <p className="text-slate-500 text-sm font-bold tracking-wide uppercase">Talepler Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 py-2 animate-in fade-in duration-300">

      {/* BAŞLIK (Kurumsal ve Okunaklı Yazım) */}
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Öğrenci İzin Talepleri</h1>
        <p className="text-sm text-slate-500 mt-1">Öğrenciler tarafından gönderilen resmi izin başvurularını inceleyebilir, onaylayabilir veya reddedebilirsiniz.</p>
      </div>

      {/* PREMIUM VERİ TABLOSU */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden shadow-slate-100/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">

            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/60">
                <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Öğrenci</th>
                <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tarih Aralığı</th>
                <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mazeret ve Detay</th>
                <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Durum</th>
                <th className="py-3.5 px-5 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">İşlem</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm">
              {leaves.map((leave) => {
                const status = getStatusDetails(leave.status);
                return (
                  <tr key={leave.id} className={`hover:bg-slate-50/40 transition-colors duration-150 border-l-4 ${status.line}`}>

                    {/* 1. ÖĞRENCİ BİLGİSİ (Avatar Destekli) */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm">
                          {getInitials(leave.student?.firstName, leave.student?.lastName)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {leave.student?.firstName} {leave.student?.lastName}
                          </p>
                          <p className="text-[11px] text-slate-400 font-medium">Öğrenci Profili</p>
                        </div>
                      </div>
                    </td>

                    {/* 2. TARİH ARALIĞI */}
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs rounded-xl shadow-sm">
                        <CalendarDays size={13} className="text-slate-400" />
                        {new Date(leave.startDate).toLocaleDateString('tr-TR')} — {new Date(leave.endDate).toLocaleDateString('tr-TR')}
                      </span>
                    </td>

                    {/* 3. MAZERET AÇIKLAMASI */}
                    <td className="py-4 px-5 max-w-xs">
                      <div className="flex items-start gap-1.5 text-slate-600 text-sm">
                        <MessageSquare size={14} className="text-slate-400 shrink-0 mt-0.5" />
                        <p className="truncate hover:text-clip hover:whitespace-normal transition-all duration-150" title={leave.description}>
                          {leave.description}
                        </p>
                      </div>
                    </td>

                    {/* 4. DURUM ROZETİ */}
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 border text-xs font-semibold rounded-full ${status.bg}`}>
                        <span className="w-1 h-1 rounded-full bg-current" />
                        {status.text}
                      </span>
                    </td>

                    {/* 5. AKSİYON BUTONLARI (Elit ve Yumuşak Tonlar) */}
                    <td className="py-4 px-5 text-right">
                      {leave.status === 'PENDING' ? (
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => handleStatusUpdate(leave.id, 'APPROVED')}
                            className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150"
                          >
                            <Check size={12} /> Onayla
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(leave.id, 'REJECTED')}
                            className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150"
                          >
                            <X size={12} /> Reddet
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-slate-400 italic pr-2">İşlem Tamamlandı</span>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}