import React from 'react';
import { Users, Home, DollarSign, Wrench, Sparkles, ChevronRight } from 'lucide-react';

export default function Dashboard() {
  // İleride bu veriler Backend'den gelecek
  const stats = [
    { title: 'Toplam Öğrenci', value: '452', icon: Users, color: 'bg-blue-500' },
    { title: 'Boş Yatak', value: '28', icon: Home, color: 'bg-emerald-500' },
    { title: 'Aylık Tahsilat', value: '₺345.000', icon: DollarSign, color: 'bg-indigo-500' },
    { title: 'Açık Talepler', value: '9', icon: Wrench, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.color} text-white shrink-0`}>
              <stat.icon size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
              <h3 className="text-xl font-bold text-gray-800 leading-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Akıllı Asistan Özeti */}
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 rounded-2xl shadow-md text-white p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles size={120} />
        </div>
        <div className="relative z-10 flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Sparkles size={24} className="text-indigo-100" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Günün Özeti</h2>
            <p className="text-indigo-200 text-sm mb-4">Sistemdeki son hareketlere göre öncelikli konular:</p>
            <div className="space-y-2">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 flex items-center justify-between border border-white/10 cursor-pointer">
                <p className="text-sm font-medium">A-204 numaralı odadan acil bakım talebi geldi.</p>
                <ChevronRight size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}