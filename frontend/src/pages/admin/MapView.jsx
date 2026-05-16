import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import BlockDetailModal from '../../components/BlockDetailModal';
import { getAllMaintenanceRequests } from '../../services/maintenanceService';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const blocks = [
  { id: 1, name: "1. Blok", lat: 38.741819, lng: 35.477318 },
  { id: 2, name: "2. Blok", lat: 38.741992, lng: 35.477787 },
  { id: 3, name: "3. Blok", lat: 38.742205, lng: 35.478379 },
  { id: 4, name: "4. Blok", lat: 38.742375, lng: 35.478850 },
  { id: 5, name: "5. Blok", lat: 38.741387, lng: 35.477435 },
  { id: 6, name: "6. Blok", lat: 38.741598, lng: 35.478019 },
  { id: 7, name: "7. Blok", lat: 38.741774, lng: 35.478612 },
  { id: 8, name: "8. Blok", lat: 38.741950, lng: 35.479079 },
  { id: 9, name: "9. Blok", lat: 38.740937, lng: 35.477705 },
  { id: 10, name: "10. Blok", lat: 38.741112, lng: 35.478288 },
  { id: 11, name: "11. Blok", lat: 38.741323, lng: 35.478872 },
  { id: 12, name: "12. Blok", lat: 38.741499, lng: 35.479348 },
  { id: 13, name: "13. Blok", lat: 38.740521, lng: 35.477947 },
  { id: 14, name: "14. Blok", lat: 38.740754, lng: 35.478531 },
  { id: 15, name: "15. Blok", lat: 38.740922, lng: 35.479124 },
  { id: 16, name: "16. Blok", lat: 38.741091, lng: 35.479591 }
];

const mapCenter = [38.741450, 35.478400];

export default function MapView() {
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [blockAlerts, setBlockAlerts] = useState({});

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const requests = await getAllMaintenanceRequests();
        const alerts = {};

        requests.forEach(req => {
          if (req.status !== 'COMPLETED' && req.room) {
            const blockId = req.room.block?.id || Math.ceil(req.room.id / 8);
            if (!alerts[blockId]) {
              alerts[blockId] = { repair: 0, complaint: 0 };
            }
            if (req.type === 'COMPLAINT') alerts[blockId].complaint += 1;
            if (req.type === 'REPAIR') alerts[blockId].repair += 1;
          }
        });
        setBlockAlerts(alerts);
      } catch (error) {
        console.error("Harita için arıza verileri çekilemedi:", error);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const getMarkerIcon = (blockId) => {
    const alert = blockAlerts[blockId];
    if (!alert || (alert.repair === 0 && alert.complaint === 0)) {
      return new L.Icon.Default();
    }
    const isComplaint = alert.complaint > 0;
    const badgeColor = isComplaint ? '#ef4444' : '#f59e0b';
    const totalAlerts = alert.complaint + alert.repair;

    const customHtml = `
      <div style="position: relative; width: 25px; height: 41px;">
        <img src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png" style="width: 100%; height: 100%;" />
        <div style="position: absolute; top: -10px; right: -14px; background-color: ${badgeColor}; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 900; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.4); z-index: 1000;">
          ${totalAlerts > 9 ? '9+' : totalAlerts}
        </div>
      </div>
    `;

    return L.divIcon({
      html: customHtml,
      className: 'custom-alert-marker',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 py-2 animate-in fade-in duration-300">

      {/* BAŞLIK */}
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">İnteraktif Yerleşke Planı</h1>
        <p className="text-sm text-slate-500 mt-1">Yurt bloklarının yerleşim düzenini ve anlık arıza yoğunluk haritasını görüntüleyin.</p>
      </div>

      {/* PREMIUM LEJANT SİSTEMİ */}
      <div className="flex gap-4 overflow-x-auto pb-1">
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200/80 text-xs font-bold uppercase tracking-wider text-slate-600 shadow-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div> Sorunsuz Blok
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200/80 text-xs font-bold uppercase tracking-wider text-slate-600 shadow-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div> Bekleyen Tamir var
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200/80 text-xs font-bold uppercase tracking-wider text-slate-600 shadow-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div> Aktif Şikayet var
        </div>
      </div>

      <div className="bg-white p-2 rounded-3xl border border-slate-200/60 shadow-sm">
        <div className="h-[550px] w-full rounded-2xl overflow-hidden relative z-0 border border-slate-100">
          <MapContainer center={mapCenter} zoom={18} scrollWheelZoom={true} className="h-full w-full">
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {blocks.map((block) => {
              const alert = blockAlerts[block.id];
              return (
                <Marker key={block.id} position={[block.lat, block.lng]} icon={getMarkerIcon(block.id)}>
                  <Popup>
                    <div className="text-center p-1.5 min-w-[150px]">
                      <h3 className="font-bold text-slate-900 text-sm mb-2">{block.name}</h3>
                      {alert && (alert.repair > 0 || alert.complaint > 0) && (
                        <div className="mb-3 bg-slate-50 p-2 rounded-xl text-left text-[11px] font-semibold space-y-1 border border-slate-100">
                          {alert.repair > 0 && <p className="text-amber-600">🔧 {alert.repair} Bekleyen Tamir</p>}
                          {alert.complaint > 0 && <p className="text-rose-600">⚠️ {alert.complaint} Aktif Şikayet</p>}
                        </div>
                      )}
                      <button
                        onClick={() => setSelectedBlock(block)}
                        className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold text-[11px] uppercase tracking-wider py-2 rounded-xl transition-all shadow-sm"
                      >
                        Blok Detayını Gör
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>

      {selectedBlock && <BlockDetailModal block={selectedBlock} onClose={() => setSelectedBlock(null)} />}
      <style>{`.custom-alert-marker { background: transparent; border: none; }`}</style>
    </div>
  );
}