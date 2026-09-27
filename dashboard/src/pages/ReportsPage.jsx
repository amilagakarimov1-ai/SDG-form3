import { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { getReports } from '../api/reports';

const VERDICT_STYLES = {
  confirmed: { cls: 'bg-green-400/10 text-green-400 border-green-400/20', icon: CheckCircle, label: 'Confirmed' },
  rejected: { cls: 'bg-red-400/10 text-red-400 border-red-400/20', icon: XCircle, label: 'Rejected' },
  manual_review: { cls: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20', icon: AlertCircle, label: 'Review' },
};

const STATUS_STYLES = {
  task_created: 'bg-blue-400/10 text-blue-400',
  confirmed: 'bg-green-400/10 text-green-400',
  rejected: 'bg-red-400/10 text-red-400',
  pending_ai: 'bg-yellow-400/10 text-yellow-400',
};

const TYPE_LABELS = {
  full_bin: '🗑️ Full Bin',
  broken_bin: '⚠️ Broken Bin',
  road_damage: '🛣️ Road Damage',
  broken_light: '💡 Broken Light',
  illegal_dumping: '🚮 Illegal Dump',
  other: '📋 Other',
};

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterVerdict, setFilterVerdict] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    getReports().then(data => {
      setReports(data);
      setLoading(false);
    });
  }, []);

  const filtered = reports.filter(r => {
    const matchType = filterType === 'all' || r.report_type === filterType;
    const matchVerdict = filterVerdict === 'all' || r.ai_verdict === filterVerdict;
    const matchSearch = !search || r.address?.toLowerCase().includes(search.toLowerCase());
    return matchType && matchVerdict && matchSearch;
  });

  return (
    <div className="space-y-5">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by address..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-green-brand transition-colors"
          />
        </div>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-green-brand"
        >
          <option value="all">All Types</option>
          <option value="full_bin">Full Bin</option>
          <option value="road_damage">Road Damage</option>
          <option value="broken_light">Broken Light</option>
          <option value="illegal_dumping">Illegal Dumping</option>
          <option value="other">Other</option>
        </select>
        <select
          value={filterVerdict}
          onChange={e => setFilterVerdict(e.target.value)}
          className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-green-brand"
        >
          <option value="all">All AI Verdicts</option>
          <option value="confirmed">Confirmed</option>
          <option value="rejected">Rejected</option>
          <option value="manual_review">Manual Review</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-white">Citizen Reports</h3>
          <span className="text-xs text-slate-500 bg-slate-800 px-2.5 py-1 rounded-full">{filtered.length} records</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="w-8 h-8 border-2 border-green-brand border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading reports...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Filter className="w-10 h-10 mx-auto mb-3 opacity-30" />
            No reports match your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500 uppercase tracking-wider border-b border-slate-800">
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3 text-center">AI Verdict</th>
                  <th className="px-6 py-3 text-center">Confidence</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-center">🪙 Coins</th>
                  <th className="px-6 py-3">Time</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map(report => {
                  const verdict = VERDICT_STYLES[report.ai_verdict] || VERDICT_STYLES.manual_review;
                  const VerdictIcon = verdict.icon;
                  return (
                    <tr
                      key={report.id}
                      className="hover:bg-slate-800/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedReport(report)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-white font-medium">{TYPE_LABELS[report.report_type] || report.report_type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-300 text-xs">{report.address || `${report.latitude?.toFixed(4)}, ${report.longitude?.toFixed(4)}`}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${verdict.cls}`}>
                          <VerdictIcon className="w-3 h-3" />
                          {verdict.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 bg-slate-800 rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full"
                              style={{
                                width: `${(report.ai_confidence || 0) * 100}%`,
                                backgroundColor: report.ai_confidence > 0.75 ? '#22c55e' : report.ai_confidence > 0.5 ? '#eab308' : '#ef4444',
                              }}
                            />
                          </div>
                          <span className="text-xs text-slate-400 w-8">{Math.round((report.ai_confidence || 0) * 100)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${STATUS_STYLES[report.status] || 'text-slate-400'}`}>
                          {report.status?.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`font-bold ${report.coins_awarded > 0 ? 'text-yellow-400' : 'text-slate-600'}`}>
                          {report.coins_awarded > 0 ? `+${report.coins_awarded}` : '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {timeAgo(report.created_at)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="p-1.5 text-slate-500 hover:text-green-400 hover:bg-slate-800 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedReport(null)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-white">{TYPE_LABELS[selectedReport.report_type]}</h3>
              <button onClick={() => setSelectedReport(null)} className="text-slate-500 hover:text-white text-xl leading-none">✕</button>
            </div>
            {selectedReport.photo_url ? (
              <img src={selectedReport.photo_url} alt="Report" className="w-full h-48 object-cover rounded-xl mb-4 border border-slate-800" />
            ) : (
              <div className="w-full h-48 bg-slate-800 rounded-xl mb-4 flex items-center justify-center text-slate-600 border border-slate-700">
                <span className="text-4xl">📸</span>
              </div>
            )}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Address</span>
                <span className="text-white">{selectedReport.address || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Coordinates</span>
                <span className="text-white font-mono text-xs">{selectedReport.latitude?.toFixed(5)}, {selectedReport.longitude?.toFixed(5)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">AI Confidence</span>
                <span className="text-white">{Math.round((selectedReport.ai_confidence || 0) * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Coins Awarded</span>
                <span className={selectedReport.coins_awarded > 0 ? 'text-yellow-400 font-bold' : 'text-slate-500'}>
                  {selectedReport.coins_awarded > 0 ? `+${selectedReport.coins_awarded} 🪙` : 'None'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
