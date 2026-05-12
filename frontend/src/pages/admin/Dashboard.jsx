import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, AlertTriangle, CalendarDays, Home, ArrowRight, Loader2 } from 'lucide-react';
import { getDashboardStats } from '../../services/adminService';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("İstatistikler yüklenemedi");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Üst Karşılama */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Sistem Özeti</h1>
          <p className="text-gray-500 font-medium">SmartDorm yurt yönetim panelinin güncel durumu.</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-gray-400">Tarih</p>
          <p className="font-black text-indigo-600">{new Date().toLocaleDateString('tr-TR')}</p>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Toplam Öğrenci */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600"><Users size={28} /></div>
          <div>
            <p className="text-sm font-bold text-gray-400 mb-1">Kayıtlı Öğrenci</p>
            <p className="text-3xl font-black text-gray-800">{stats?.totalStudents || 0}</p>
          </div>
        </div>

        {/* Doluluk Oranı */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600"><Home size={28} /></div>
          <div>
            <p className="text-sm font-bold text-gray-400 mb-1">Doluluk Oranı</p>
            <p className="text-3xl font-black text-gray-800">%{stats?.occupancyRate || 0}</p>
          </div>
        </div>

        {/* Bekleyen Arızalar */}
        <Link to="/admin/maintenance" className="bg-white p-6 rounded-3xl shadow-sm border border-rose-100 flex items-center justify-between group hover:shadow-md transition-all">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-rose-50 rounded-2xl text-rose-600 group-hover:bg-rose-500 group-hover:text-white transition-colors"><AlertTriangle size={28} /></div>
            <div>
              <p className="text-sm font-bold text-rose-400 mb-1">Bekleyen Arıza</p>
              <p className="text-3xl font-black text-gray-800">{stats?.pendingMaintenance || 0}</p>
            </div>
          </div>
          <ArrowRight className="text-rose-300 group-hover:translate-x-1 group-hover:text-rose-500 transition-all" />
        </Link>

        {/* Bekleyen İzinler */}
        <Link to="/admin/leaves" className="bg-white p-6 rounded-3xl shadow-sm border border-orange-100 flex items-center justify-between group hover:shadow-md transition-all">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-orange-50 rounded-2xl text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors"><CalendarDays size={28} /></div>
            <div>
              <p className="text-sm font-bold text-orange-400 mb-1">Onay Bekleyen İzin</p>
              <p className="text-3xl font-black text-gray-800">{stats?.pendingLeaves || 0}</p>
            </div>
          </div>
          <ArrowRight className="text-orange-300 group-hover:translate-x-1 group-hover:text-orange-500 transition-all" />
        </Link>

      </div>

    </div>
  );
}