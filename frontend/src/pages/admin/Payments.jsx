import React, { useState, useEffect } from 'react';
import { Search, Filter, FileText, Loader2 } from 'lucide-react';
import { getAllPayments } from '../../services/paymentService';

export default function Payments() {
  const [paymentsList, setPaymentsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 YENİ: Arama terimini hafızada tutacak state
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getAllPayments();

        // Gelen verileri tutara (expectedAmount) göre en büyükten küçüğe sıralar
        const sortedData = data.sort((a, b) => b.expectedAmount - a.expectedAmount);

        setPaymentsList(sortedData);
      } catch (error) {
        console.error("Veriler yüklenemedi");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-800" size={32} />
      </div>
    );
  }

  // Üst taraftaki elit metrikler (Genel durumu göstermesi için tüm listeyi hesaplamaya devam ediyor)
  const totalPaid = paymentsList.filter(p => p.status === 'PAID').reduce((acc, curr) => acc + curr.expectedAmount, 0);
  const totalPending = paymentsList.filter(p => p.status === 'PENDING' || p.status === 'OVERDUE').reduce((acc, curr) => acc + curr.expectedAmount, 0);

  // 🔥 SİHİRLİ KISIM: Tablo için verileri arama terimine göre anlık olarak filtreliyoruz
  const filteredPayments = paymentsList.filter((payment) => {
    const firstName = payment.student?.firstName?.toLowerCase() || '';
    const lastName = payment.student?.lastName?.toLowerCase() || '';
    const fullName = `${firstName} ${lastName}`;
    const invoiceNo = payment.invoiceNo?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();

    // Ad, Soyad, Tam Ad veya Fatura No içinde arama terimi geçiyor mu?
    return fullName.includes(search) || invoiceNo.includes(search);
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAID':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-full"><span className="w-1 h-1 bg-emerald-500 rounded-full" /> Ödendi</span>;
      case 'PENDING':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold rounded-full"><span className="w-1 h-1 bg-amber-500 rounded-full" /> Bekliyor</span>;
      case 'OVERDUE':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold rounded-full"><span className="w-1 h-1 bg-rose-500 rounded-full" /> Gecikti</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 py-2 animate-in fade-in duration-300">

      {/* BAŞLIK */}
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Finans ve Ödemeler</h1>
        <p className="text-sm text-slate-500 mt-1">Öğrencilerin taksit ve depozito tahsilat durumlarını canlı olarak izleyin.</p>
      </div>

      {/* 2'Lİ SADE VE ELİT METRİKLER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 shrink-0">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm border-l-4 border-l-emerald-500">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Tahsil Edilen</p>
          <h3 className="text-2xl font-black text-slate-900">₺{totalPaid.toLocaleString('tr-TR')}</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm border-l-4 border-l-amber-500">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Bekleyen Tahsilat</p>
          <h3 className="text-2xl font-black text-slate-900">₺{totalPending.toLocaleString('tr-TR')}</h3>
        </div>
      </div>

      {/* VERİ TABLOSU KAPSAYICISI */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50/40">

          {/* AKTİFLEŞTİRİLEN ARAMA İNPUTU */}
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Fatura no veya öğrenci adı..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Klavyeden basılan her harfte state güncellenir
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-all"
            />
          </div>

          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Filter size={14} /> Filtrele
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-5">Öğrenci & Fatura No</th>
                <th className="py-3.5 px-5">Ödeme Türü</th>
                <th className="py-3.5 px-5">Tutar</th>
                <th className="py-3.5 px-5">Durum</th>
                <th className="py-3.5 px-5 text-right">Aksiyon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {/* Artık doğrudan paymentsList değil, filtrelenmiş liste (filteredPayments) dönüyor */}
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50/40 transition-colors group">
                  <td className="py-3.5 px-5">
                    <p className="font-semibold text-slate-900">{payment.student?.firstName} {payment.student?.lastName}</p>
                    <p className="text-xs text-slate-400 font-medium font-mono mt-0.5">{payment.invoiceNo} • {new Date(payment.dueDate).toLocaleDateString('tr-TR')}</p>
                  </td>
                  <td className="py-3.5 px-5 text-slate-600 font-medium">
                    {payment.paymentType === 'MONTHLY_INSTALLMENT' ? 'Aylık Taksit' : 'Depozito'}
                  </td>

                  <td className="py-3.5 px-5 font-bold text-slate-900">₺{payment.expectedAmount.toLocaleString('tr-TR')}</td>

                  <td className="py-3.5 px-5">{getStatusBadge(payment.status)}</td>
                  <td className="py-3.5 px-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-slate-600 bg-slate-50 border border-slate-200 hover:bg-white rounded-lg transition-all font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 ml-auto shadow-sm">
                      <FileText size={13} /> Makbuz
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Arama sonucunda hiçbir fatura eşleşmezse kullanıcıya bilgi veriyoruz */}
          {filteredPayments.length === 0 && (
             <div className="text-center py-12 text-slate-400 font-medium bg-slate-50/20">
               Aranan kriterlere uygun fatura veya öğrenci kaydı bulunamadı.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}