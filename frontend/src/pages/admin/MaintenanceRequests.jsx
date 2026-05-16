import React, { useState, useEffect } from 'react';
import { Wrench, CheckCircle, Clock, AlertTriangle, Loader2, Check } from 'lucide-react';
import { getAllMaintenanceRequests, updateMaintenanceStatus } from '../../services/maintenanceService';

export default function Maintenance() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const data = await getAllMaintenanceRequests();
      setRequests(data.reverse()); // En yeni talepler üstte
    } catch (error) {
      console.error("Talepler çekilemedi", error);
    } finally {
      setLoading(false);
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

  const getStatusDetails = (status) => {
    if (status === 'COMPLETED') {
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        line: 'border-l-emerald-500',
        text: 'Çözüldü'
      };
    }
    return {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      line: 'border-l-amber-500',
      text: 'Beklemede'
    };
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

      {/* BAŞLIK */}
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Arıza ve Şikayet Yönetimi</h1>
        <p className="text-sm text-slate-500 mt-1">Öğrenciler tarafından bildirilen teknik oditoryum arızalarını ve konaklama şikayetlerini buradan yönetin.</p>
      </div>

      {/* TALEPLER LİSTESİ */}
      <div className="grid grid-cols-1 gap-4">
        {requests.map((req) => {
          const status = getStatusDetails(req.status);
          return (
            <div key={req.id} className={`bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 ${status.line} hover:shadow-md transition-all duration-200`}>

              <div className="flex items-start gap-4 min-w-0 flex-1">
                <div className={`p-3 rounded-xl shrink-0 border ${
                  req.type === 'COMPLAINT' ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-indigo-50 border-indigo-100 text-indigo-600'
                }`}>
                  {req.type === 'COMPLAINT' ? <AlertTriangle size={18} /> : <Wrench size={18} />}
                </div>
                <div className="min-w-0 space-y-1">
                  <p className="font-bold text-slate-900 text-sm">
                    {req.type === 'COMPLAINT' ? 'Oda Şikayeti' : 'Teknik Arıza'}
                  </p>
                  <p className="text-slate-400 text-[11px] font-semibold tracking-wide uppercase">
                    Oda: <span className="text-slate-700 font-bold">{req.room?.roomNumber || 'Bilinmiyor'}</span> • Öğrenci: <span className="text-slate-700 font-bold">{req.student?.firstName} {req.student?.lastName}</span>
                  </p>
                  <p className="text-slate-600 text-sm leading-relaxed pt-1 break-words bg-slate-50/50 p-3 rounded-xl border border-slate-100 italic">
                    "{req.description}"
                  </p>
                </div>
              </div>

              {/* DURUM VE AKSİYON ALANI */}
              <div className="flex flex-col items-start md:items-end gap-3 shrink-0 pt-2 md:pt-0">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 border text-xs font-semibold rounded-full ${status.bg}`}>
                  <span className="w-1 h-1 rounded-full bg-current" />
                  {status.text}
                </span>

                {req.status === 'PENDING' && (
                  <button
                    onClick={() => handleStatusUpdate(req.id, 'COMPLETED')}
                    className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm"
                  >
                    <Check size={12} /> Çözüldü İşaretle
                  </button>
                )}
              </div>

            </div>
          );
        })}

        {requests.length === 0 && (
          <div className="bg-slate-50/50 border border-slate-200 border-dashed rounded-2xl py-16 text-center">
            <p className="text-slate-400 font-medium text-sm">Sisteme kayıtlı aktif teknik destek talebi bulunmuyor.</p>
          </div>
        )}
      </div>
    </div>
  );
}