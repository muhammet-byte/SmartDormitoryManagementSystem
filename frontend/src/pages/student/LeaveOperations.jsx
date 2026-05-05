import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Send, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function LeaveOperations() {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    addressId: '',
    description: ''
  });

  // Şimdilik sahte veriler. Backend bağlandığında "/api/leaves" üzerinden gelecek.
  const remainingLeaveDays = 60;

  const myAddresses = [
    { id: 1, title: 'Aile Evi', city: 'Kayseri', fullAddress: 'Melikgazi, Alpaslan Mah. No: 12' },
    { id: 2, title: 'Akraba (Amcamlar)', city: 'Ankara', fullAddress: 'Çankaya, Atatürk Bulvarı No: 45' }
  ];

  const pastLeaves = [
    { id: 101, startDate: '2026-04-10', endDate: '2026-04-12', status: 'APPROVED', reason: 'Hafta sonu tatili' },
    { id: 102, startDate: '2026-05-01', endDate: '2026-05-03', status: 'PENDING', reason: 'Bahar şenlikleri' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("İzin talebiniz yönetici onayına gönderildi!");
    setFormData({ startDate: '', endDate: '', addressId: '', description: '' });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row gap-6">

        {/* SOL SÜTUN: İzin Formu ve Kalan Gün */}
        <div className="w-full md:w-2/3 space-y-6">

          {/* Kalan İzin Kartı */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-md flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black mb-1">İzin Durumunuz</h2>
              <p className="text-emerald-100 font-medium">Yıllık 60 günlük izin hakkınızın kalan süresi.</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 text-center">
              <p className="text-4xl font-black">{remainingLeaveDays}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-100 mt-1">Gün Kaldı</p>
            </div>
          </div>

          {/* Yeni İzin Talebi Formu */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Calendar className="text-indigo-600" /> Yeni İzin Talebi Oluştur
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Başlangıç Tarihi</label>
                  <input type="date" required value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bitiş Tarihi</label>
                  <input type="date" required value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-sm font-semibold text-gray-700">İzinde Kalınacak Adres</label>
                  <Link to="/student/addresses" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-lg">
                    <Plus size={14} /> Yeni Adres Ekle
                  </Link>
                </div>
                <select required value={formData.addressId} onChange={e => setFormData({ ...formData, addressId: e.target.value })} className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="">Lütfen kayıtlı bir adres seçin...</option>
                  {myAddresses.map(addr => (
                    <option key={addr.id} value={addr.id}>{addr.title} ({addr.city})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mazeret / Açıklama</label>
                <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="İzin nedeninizi kısaca belirtin..." className="w-full min-h-[100px] border border-gray-200 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
              </div>

              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-200">
                <Send size={18} /> Talebi Yöneticiye İlet
              </button>
            </form>
          </div>
        </div>

        {/* SAĞ SÜTUN: Geçmiş İzinler */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-full">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Clock className="text-gray-500" /> Geçmiş Taleplerim
            </h3>

            <div className="space-y-4">
              {pastLeaves.map(leave => (
                <div key={leave.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold text-gray-800">{leave.reason}</p>
                    {leave.status === 'APPROVED' ? (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle size={12} /> Onaylandı</span>
                    ) : (
                      <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded-full flex items-center gap-1"><AlertCircle size={12} /> Bekliyor</span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-gray-500">
                    {new Date(leave.startDate).toLocaleDateString('tr-TR')} - {new Date(leave.endDate).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}