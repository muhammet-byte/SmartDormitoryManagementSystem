import React, { useState, useEffect } from 'react';
import { CalendarDays, CheckCircle, XCircle, Clock, Send, Info, Sparkles, MapPin, Loader2 } from 'lucide-react';
import { createLeaveRequest, getStudentLeaves } from '../../services/leaveService';

export default function LeaveOperations({ data }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [pastLeaves, setPastLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Geçmiş İzinleri Yükle
  const loadLeaves = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      const leaves = await getStudentLeaves(userId);
      setPastLeaves(leaves.reverse()); // En yeni izinler en üstte
    } catch (error) {
      console.error("Geçmiş izinler yüklenemedi", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  // Form Gönderimi
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const userId = localStorage.getItem('userId');

    // Orijinal korunan SQL kısıtlaması mantığın
    const addressId = data?.profile?.addresses?.[0]?.id || 1;

    const payload = {
      startDate,
      endDate,
      description,
      userId,
      addressId
    };

    try {
      await createLeaveRequest(payload);
      alert("İzin talebiniz yöneticiye başarıyla iletildi!");
      setStartDate('');
      setEndDate('');
      setDescription('');
      loadLeaves(); // Listeyi anında güncelle
    } catch (error) {
      const backendError = error.response?.data || error.message;
      alert("TALEBİNİZ İLETİLEMEDİ!\n\nHata: " + backendError);
    } finally {
      setSubmitting(false);
    }
  };

  // Tarih kısıtlaması
  const today = new Date().toISOString().split('T')[0];

  // Premium Durum Rozetleri
  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase flex items-center gap-1 shrink-0"><CheckCircle size={12} /> Onaylandı</span>;
      case 'REJECTED':
        return <span className="bg-rose-50 text-rose-600 border border-rose-100 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase flex items-center gap-1 shrink-0"><XCircle size={12} /> Reddedildi</span>;
      default:
        return <span className="bg-amber-50 text-amber-600 border border-amber-100 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase flex items-center gap-1 shrink-0"><Clock size={12} /> Beklemede</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 px-2 py-2 animate-in fade-in duration-500">

      {/* ÜST HEADER ALANI */}
      <header className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          İzin İşlemleri <Sparkles className="text-indigo-500" size={20} />
        </h1>
        <p className="text-slate-400 text-xs font-medium mt-0.5">Yurt dışarısında konaklayacağınız günler için resmi izin bildirimlerinizi buradan yönetin.</p>
      </header>

      {/* İKİLİ KOLON DÜZENİ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* SOL TARAF: İZİN TALEBİ FORMU */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-100/40 space-y-5">
          <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
             <CalendarDays size={14} className="text-indigo-500" /> Yeni Talep Oluştur
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-0.5">Ayrılış Tarihi</label>
                <input
                  type="date"
                  min={today}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full bg-slate-50/60 border border-slate-100 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-0.5">Dönüş Tarihi</label>
                <input
                  type="date"
                  min={startDate || today}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="w-full bg-slate-50/60 border border-slate-100 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-0.5">Gidiş Adresi / İzin Sebebi</label>
              <div className="relative">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows="4"
                  placeholder="Gideceğiniz açık adres veya mazeretinizi belirtin..."
                  className="w-full bg-slate-50/60 border border-slate-100 rounded-2xl px-4 py-3 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                />
                <MapPin className="absolute right-4 bottom-4 text-slate-300" size={16} />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-slate-900 text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-2xl hover:bg-indigo-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm shadow-slate-900/10 active:scale-[0.99] disabled:opacity-50"
            >
              {submitting ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
              {submitting ? 'Gönderiliyor...' : 'Talebi Onaya Gönder'}
            </button>
          </form>
        </div>

        {/* SAĞ TARAF: GEÇMİŞ İZİNLERİM LİSTESİ */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
               <Info size={14} className="text-emerald-500" /> İzin Geçmişi
            </span>
            <span className="text-[10px] font-bold text-slate-300 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">Toplam {pastLeaves.length} Kayıt</span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
            {loading ? (
              <div className="py-16 text-center"><Loader2 className="animate-spin mx-auto text-slate-300" size={28} /></div>
            ) : pastLeaves.length > 0 ? (
              pastLeaves.map((leave) => (
                <div key={leave.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-slate-200/80 transition-all group flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="bg-slate-50 p-2 rounded-lg text-slate-400 group-hover:text-indigo-500 transition-colors">
                        <CalendarDays size={16} />
                      </div>
                      <p className="font-black text-slate-800 text-xs">
                        {new Date(leave.startDate).toLocaleDateString('tr-TR')} - {new Date(leave.endDate).toLocaleDateString('tr-TR')}
                      </p>
                    </div>

                    <div className="bg-slate-50/40 p-3 rounded-xl border border-slate-100">
                      <p className="text-slate-500 text-xs font-bold leading-relaxed break-words">
                        {leave.description}
                      </p>
                    </div>
                  </div>

                  <div className="sm:pt-1">
                    {getStatusBadge(leave.status)}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-slate-50/20 border-2 border-dashed border-slate-100 rounded-[32px] py-16 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-200 mb-3 shadow-sm border border-slate-50">
                   <Info size={22} />
                </div>
                <p className="text-slate-400 font-black text-xs uppercase tracking-tight">Henüz bir izin talebiniz bulunmuyor</p>
                <p className="text-slate-300 text-[10px] font-bold mt-0.5">Oluşturduğunuz izin kayıtları onay durumlarıyla birlikte burada listelenir.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}