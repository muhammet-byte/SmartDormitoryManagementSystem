import React, { useState, useEffect } from 'react';
import { CalendarDays, CheckCircle, XCircle, Clock, Send, Info } from 'lucide-react';
import { createLeaveRequest, getStudentLeaves } from '../../services/leaveService';

export default function LeaveOperations({ data }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [pastLeaves, setPastLeaves] = useState([]);

  // Geçmiş İzinleri Yükle
  const loadLeaves = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    try {
      const leaves = await getStudentLeaves(userId);
      setPastLeaves(leaves.reverse()); // En yeni izinler en üstte
    } catch (error) {
      console.error("Geçmiş izinler yüklenemedi", error);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  // Form Gönderimi
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');

    // NOT: Veritabanı (SQL) "address_id" alanını zorunlu tutuyor.
    // Eğer öğrencinin adresi yoksa hata almamak için geçici olarak 1 gönderiyoruz.
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
    }
  };

  // Bugünden önceki tarihlerin seçilmesini engellemek için
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">

      {/* İZİN TALEBİ FORMU */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <CalendarDays className="text-indigo-500" /> Yeni İzin Talebi Oluştur
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Ayrılış Tarihi</label>
              <input
                type="date"
                min={today}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Dönüş Tarihi</label>
              <input
                type="date"
                min={startDate || today}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">Gidiş Adresi / İzin Sebebi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="3"
              placeholder="Gideceğiniz şehir, adres veya izin sebebinizi kısaca belirtin..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            ></textarea>
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2">
            <Send size={18} /> Talebi Onaya Gönder
          </button>
        </form>
      </div>

      {/* GEÇMİŞ İZİNLERİM */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Info className="text-indigo-500" /> Geçmiş İzin Taleplerim
        </h2>

        <div className="space-y-3">
          {pastLeaves.length > 0 ? (
            pastLeaves.map((leave) => (
              <div key={leave.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-gray-800 text-sm">
                    {new Date(leave.startDate).toLocaleDateString('tr-TR')} - {new Date(leave.endDate).toLocaleDateString('tr-TR')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 max-w-md truncate">{leave.description}</p>
                </div>

                <div className="shrink-0">
                  {leave.status === 'APPROVED' ? (
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
                      <CheckCircle size={14} /> Onaylandı
                    </span>
                  ) : leave.status === 'REJECTED' ? (
                    <span className="bg-rose-100 text-rose-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
                      <XCircle size={14} /> Reddedildi
                    </span>
                  ) : (
                    <span className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
                      <Clock size={14} /> Bekliyor
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">Henüz bir izin talebiniz bulunmuyor.</p>
          )}
        </div>
      </div>

    </div>
  );
}