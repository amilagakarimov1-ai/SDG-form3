import { useState } from 'react';
import { Truck, MapPin, Clock, Route as RouteIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RoutePanel() {
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState(null);

  const handleOptimize = () => {
    setLoading(true);
    setTimeout(() => {
      setRoute({
        bins: 14,
        distance: '12.4 km',
        time: '1h 45m'
      });
      setLoading(false);
      toast.success('Route optimized successfully');
    }, 1500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <Truck className="w-5 h-5 text-blue-400" />
        </div>
        <h2 className="text-lg font-bold text-white">Route Optimization</h2>
      </div>

      <div className="space-y-4 flex-1">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Start Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              defaultValue="Depot A (40.7128, -74.0060)"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <button 
          onClick={handleOptimize}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <RouteIcon className="w-4 h-4" />
          {loading ? 'Optimizing...' : 'Optimize Truck Route'}
        </button>

        {route && (
          <div className="mt-6 p-4 bg-slate-800 rounded-lg border border-slate-700 space-y-3 animate-fade-in">
            <h3 className="text-sm font-bold text-white mb-2">Route Summary</h3>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Total Bins</span>
              <span className="font-semibold text-white">{route.bins}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Distance</span>
              <span className="font-semibold text-white">{route.distance}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> Est. Time</span>
              <span className="font-semibold text-white">{route.time}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
