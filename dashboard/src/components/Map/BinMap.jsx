import { useEffect, useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import useMapStore from '../../store/mapStore';
import { Route as RouteIcon, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

/* ─────────────────────────────────────────────
   Baku bins — realistic addresses, mixed statuses
───────────────────────────────────────────── */
const BAKU_BINS = [
  { id: '1',  lat: 40.4093, lng: 49.8671, status: 'full',      name: 'Qutu #001', address: 'Fəvvarələr Meydanı' },
  { id: '2',  lat: 40.4023, lng: 49.8520, status: 'empty',     name: 'Qutu #002', address: 'Sahil Metro' },
  { id: '3',  lat: 40.4083, lng: 49.8751, status: 'half_full', name: 'Qutu #003', address: 'Bulvar Park, Sahə A' },
  { id: '4',  lat: 40.4150, lng: 49.8510, status: 'full',      name: 'Qutu #004', address: 'Bulvar Park, Sahə B' },
  { id: '5',  lat: 40.3953, lng: 49.8427, status: 'empty',     name: 'Qutu #005', address: 'Nizami küçəsi, Mərkəz' },
  { id: '6',  lat: 40.4170, lng: 49.8630, status: 'full',      name: 'Qutu #006', address: 'Heydər Əliyev Mərkəzi' },
  { id: '7',  lat: 40.4010, lng: 49.8600, status: 'half_full', name: 'Qutu #007', address: '28 May küçəsi' },
  { id: '8',  lat: 40.4200, lng: 49.8450, status: 'full',      name: 'Qutu #008', address: 'Koroğlu Metro' },
  { id: '9',  lat: 40.3900, lng: 49.8700, status: 'empty',     name: 'Qutu #009', address: 'Nəriman Nərimanov' },
  { id: '10', lat: 40.4250, lng: 49.8550, status: 'full',      name: 'Qutu #010', address: 'Binəqədi Bazarı' },
];

const STATUS_LABELS = {
  empty:     'Boş',
  half_full: 'Yarı Dolu',
  full:      'Dolu',
};

const STATUS_COLORS = {
  empty:     '#22c55e',
  half_full: '#eab308',
  full:      '#ef4444',
};

/* ─────────────────────────────────────────────
   DivIcon factory — memoised per color
───────────────────────────────────────────── */
function makeIcon(color) {
  return new L.DivIcon({
    className: '',
    html: `<div style="
      background:${color};
      width:22px;height:22px;
      border-radius:50%;
      border:3px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.5);
    "></div>`,
    iconSize:   [22, 22],
    iconAnchor: [11, 11],
    popupAnchor:[0, -14],
  });
}

/* ─────────────────────────────────────────────
   Fit-map helper (runs inside MapContainer)
───────────────────────────────────────────── */
function FitRoute({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 1) {
      map.fitBounds(L.latLngBounds(positions), { padding: [40, 40] });
    }
  }, [positions, map]);
  return null;
}

/* ─────────────────────────────────────────────
   Main BinMap component
───────────────────────────────────────────── */
export default function BinMap() {
  const { filters, setFilters, setRouteData, routeData } = useMapStore();
  const [routeLine, setRouteLine]       = useState([]);
  const [loadingRoute, setLoadingRoute] = useState(false);

  /* Memoised icons — not recreated on each render */
  const icons = useMemo(() => ({
    empty:     makeIcon(STATUS_COLORS.empty),
    half_full: makeIcon(STATUS_COLORS.half_full),
    full:      makeIcon(STATUS_COLORS.full),
  }), []);

  /* Filtered bins */
  const filteredBins = useMemo(
    () => filters === 'all' ? BAKU_BINS : BAKU_BINS.filter(b => b.status === filters),
    [filters],
  );

  /* ── Optimal route via OSRM ── */
  const calculateRoute = useCallback(async () => {
    const targets = BAKU_BINS.filter(b => b.status === 'full');
    if (targets.length < 2) {
      toast.error('Marşrut üçün ən azı 2 dolu qutu lazımdır');
      return;
    }
    setLoadingRoute(true);
    toast.loading('Optimal marşrut hesablanır...', { id: 'route' });
    try {
      const coords = targets.map(b => `${b.lng},${b.lat}`).join(';');
      const { data } = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`,
        { timeout: 10000 },
      );
      if (data?.routes?.length) {
        const r = data.routes[0];
        const latlngs = r.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        setRouteLine(latlngs);
        const rd = {
          bins:     targets.length,
          distance: (r.distance / 1000).toFixed(1) + ' km',
          time:     Math.round(r.duration / 60) + ' dəq',
        };
        setRouteData(rd);
        toast.success('Optimal marşrut tapıldı!', { id: 'route' });
      }
    } catch {
      toast.error('Marşrut hesablana bilmədi', { id: 'route' });
    }
    setLoadingRoute(false);
  }, [setRouteData]);

  const clearRoute = useCallback(() => {
    setRouteLine([]);
    setRouteData(null);
  }, [setRouteData]);

  const FILTER_BTNS = [
    { key: 'all',      label: 'Hamısı' },
    { key: 'empty',    label: 'Boş' },
    { key: 'half_full',label: 'Yarı Dolu' },
    { key: 'full',     label: 'Dolu' },
  ];

  return (
    <div className="relative w-full h-full" style={{ minHeight: '500px' }}>
      <MapContainer
        center={[40.3703, 49.8454]}
        zoom={13}
        style={{ height: '100%', width: '100%', minHeight: '500px' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {filteredBins.map(bin => (
          <Marker
            key={bin.id}
            position={[bin.lat, bin.lng]}
            icon={icons[bin.status] ?? icons.empty}
          >
            <Popup minWidth={220}>
              <div className="font-sans p-1">
                <h3 className="font-bold text-base mb-0.5">{bin.name}</h3>
                <p className="text-gray-500 text-sm mb-2">{bin.address}</p>
                <span
                  className="inline-block px-2 py-0.5 rounded text-xs font-bold text-white mb-3"
                  style={{ background: STATUS_COLORS[bin.status] }}
                >
                  {STATUS_LABELS[bin.status] ?? bin.status}
                </span>
                <div className="flex gap-2 mt-1">
                  <button
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 px-2 rounded transition-colors"
                    onClick={() => toast.success(`Tapşırıq yaradıldı: ${bin.name}`)}
                  >
                    Tapşırıq Yarat
                  </button>
                  <button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-1.5 px-2 rounded transition-colors"
                    onClick={() => toast.success(`${bin.name} boşaldıldı ✓`)}
                  >
                    Boşaldıldı
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {routeLine.length > 1 && (
          <>
            <Polyline
              positions={routeLine}
              color="#3b82f6"
              weight={5}
              opacity={0.8}
              dashArray="12,6"
            />
            <FitRoute positions={routeLine} />
          </>
        )}
      </MapContainer>

      {/* ── Top controls ── */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap gap-2 items-start justify-between">
        {/* Filter buttons */}
        <div className="flex gap-1.5 bg-white rounded-xl shadow-lg p-1.5 flex-wrap">
          {FILTER_BTNS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilters(key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                filters === key
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {label}
              {key !== 'all' && (
                <span className="ml-1 text-xs opacity-60">
                  ({BAKU_BINS.filter(b => b.status === key).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Route button */}
        <button
          onClick={routeLine.length > 0 ? clearRoute : calculateRoute}
          disabled={loadingRoute}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg font-bold text-sm transition-all disabled:opacity-60 ${
            routeLine.length > 0
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {routeLine.length > 0 ? (
            <><X className="w-4 h-4" /> Marşrutu Sil</>
          ) : (
            <><RouteIcon className="w-4 h-4" /> {loadingRoute ? 'Hesablanır...' : 'Optimal Marşrut'}</>
          )}
        </button>
      </div>

      {/* ── Route stats panel ── */}
      {routeData && (
        <div className="absolute top-16 right-3 z-[1000] bg-white rounded-xl shadow-lg p-4 min-w-[180px] border border-blue-100">
          <p className="font-bold text-sm text-slate-700 mb-2 flex items-center gap-1">
            <RouteIcon className="w-4 h-4 text-blue-600" /> Marşrut Məlumatı
          </p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Qutular:</span>
              <span className="font-bold">{routeData.bins}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Məsafə:</span>
              <span className="font-bold">{routeData.distance}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Vaxt:</span>
              <span className="font-bold">{routeData.time}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Legend ── */}
      <div className="absolute bottom-6 right-3 z-[1000] bg-white rounded-xl shadow-lg p-3 text-sm border border-slate-100">
        <p className="font-bold text-slate-700 mb-2">Vəziyyət</p>
        <div className="space-y-1.5">
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <div key={key} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ background: STATUS_COLORS[key] }}
              />
              <span className="text-slate-600">{label}</span>
              <span className="text-slate-400 text-xs ml-auto">
                {BAKU_BINS.filter(b => b.status === key).length}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
