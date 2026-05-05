import React, { useState, useEffect } from 'react';
import { Search, Filter, FileText, Loader2 } from 'lucide-react';
import { getAllPayments } from '../../services/paymentService';

export default function Payments() {
  const [paymentsList, setPaymentsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getAllPayments();
        setPaymentsList(data);
      } catch (error) {
        console.error("Veriler yüklenemedi");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>;
  }

  // Dinamik Finans Özeti Hesaplamaları
  const totalPaid = paymentsList.filter(p => p.status === 'PAID').reduce((acc, curr) => acc + curr.expectedAmount, 0);
  const totalOverdue = paymentsList.filter(p => p.status === 'OVERDUE').reduce((acc, curr) => acc + curr.expectedAmount, 0);
  const totalPending = paymentsList.filter(p => p.status === 'PENDING').reduce((acc, curr) => acc + curr.expectedAmount, 0);

  // Status Badge Çevirici
  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAID': return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">Ödendi</span>;
      case 'PENDING': return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-700">Bekliyor</span>;
      case 'OVERDUE': return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-700">Gecikti</span>;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-4">
      {/* Finans Özeti */}
      <div className="flex gap-4 overflow-x-auto pb-1 shrink-0">
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-100 min-w-[200px] flex-1">
          <p className="text-xs font-bold mb-1 uppercase tracking-wider opacity-80">Tahsil Edilen</p>
          <h3 className="text-2xl font-black">₺{totalPaid.toLocaleString('tr-TR')}</h3>
        </div>
        <div className="bg-rose-50 text-rose-800 p-4 rounded-2xl border border-rose-100 min-w-[200px] flex-1">
          <p className="text-xs font-bold mb-1 uppercase tracking-wider opacity-80">Geciken Tahsilat</p>
          <h3 className="text-2xl font-black">₺{totalOverdue.toLocaleString('tr-TR')}</h3>
        </div>
        <div className="bg-indigo-50 text-indigo-800 p-4 rounded-2xl border border-indigo-100 min-w-[200px] flex-1">
          <p className="text-xs font-bold mb-1 uppercase tracking-wider opacity-80">Bekleyen (Gelecek)</p>
          <h3 className="text-2xl font-black">₺{totalPending.toLocaleString('tr-TR')}</h3>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0 bg-gray-50/30">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Fatura No veya Öğrenci Adı..." className="w-full pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50">
            <Filter size={14} /> Filtrele
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="sticky top-0 bg-gray-50/95 backdrop-blur-sm z-10 shadow-sm border-b border-gray-200">
              <tr className="text-gray-500 text-xs uppercase tracking-wider">
                <th className="py-3 px-5 font-bold">Öğrenci & Fatura No</th>
                <th className="py-3 px-5 font-bold">Ödeme Türü</th>
                <th className="py-3 px-5 font-bold">Tutar</th>
                <th className="py-3 px-5 font-bold">Durum</th>
                <th className="py-3 px-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {paymentsList.map((payment) => (
                <tr key={payment.id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="py-3 px-5">
                    <p className="font-bold text-gray-800">{payment.student?.firstName} {payment.student?.lastName}</p>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">{payment.invoiceNo} • {new Date(payment.dueDate).toLocaleDateString('tr-TR')}</p>
                  </td>
                  <td className="py-3 px-5 text-gray-600 font-medium">
                    {payment.paymentType === 'MONTHLY_INSTALLMENT' ? 'Aylık Taksit' : 'Depozito'}
                  </td>
                  <td className="py-3 px-5 font-black text-gray-800 text-base">₺{payment.expectedAmount.toLocaleString('tr-TR')}</td>
                  <td className="py-3 px-5">{getStatusBadge(payment.status)}</td>
                  <td className="py-3 px-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors font-semibold text-xs flex items-center gap-1.5 ml-auto">
                      <FileText size={14} /> Makbuz
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}