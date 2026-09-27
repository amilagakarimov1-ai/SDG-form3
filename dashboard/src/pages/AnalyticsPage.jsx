import { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend,
  BarChart, Bar,
} from 'recharts';
import { Trophy, Coins, TrendingUp, Users, FileCheck, AlertTriangle } from 'lucide-react';
import { getReportStats } from '../api/reports';
import { getTaskStats } from '../api/tasks';
import { getLeaderboard } from '../api/routes';

const COLORS = {
  empty: '#22c55e',
  half_full: '#eab308',
  full: '#ef4444',
  overflowing: '#dc2626',
};

const TASK_TREND = [
  { day: 'Mon', opened: 12, resolved: 8 },
  { day: 'Tue', opened: 18, resolved: 14 },
  { day: 'Wed', opened: 9, resolved: 11 },
  { day: 'Thu', opened: 22, resolved: 17 },
  { day: 'Fri', opened: 15, resolved: 20 },
  { day: 'Sat', opened: 6, resolved: 8 },
  { day: 'Sun', opened: 4, resolved: 5 },
];

const BIN_STATUS_DATA = [
  { name: 'Empty', value: 4, color: '#22c55e' },
  { name: 'Half Full', value: 3, color: '#eab308' },
  { name: 'Full', value: 2, color: '#ef4444' },
  { name: 'Overflowing', value: 1, color: '#dc2626' },
];

const StatCard = ({ label, value, icon: Icon, color, change }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl hover:border-slate-700 transition-colors">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-2.5 rounded-lg ${color.replace('text-', 'bg-').replace('400', '400/10')}`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      {change && (
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${change > 0 ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
          {change > 0 ? '+' : ''}{change}%
        </span>
      )}
    </div>
    <p className="text-slate-400 text-sm font-medium mb-1">{label}</p>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
  </div>
);

export default function AnalyticsPage() {
  const [reportStats, setReportStats] = useState(null);
  const [taskStats, setTaskStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getReportStats(), getTaskStats(), getLeaderboard()])
      .then(([rStats, tStats, lb]) => {
        setReportStats(rStats);
        setTaskStats(tStats);
        setLeaderboard(lb);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-brand border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading analytics...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="xl:col-span-2">
          <StatCard label="Total Reports Today" value={reportStats?.total_today?.toLocaleString() || '142'} icon={FileCheck} color="text-blue-400" change={12} />
        </div>
        <div className="xl:col-span-2">
          <StatCard label="Tasks Resolved This Week" value={taskStats?.resolved_this_week?.toLocaleString() || '845'} icon={TrendingUp} color="text-green-400" change={8} />
        </div>
        <div className="xl:col-span-2">
          <StatCard label="Green Coins Awarded" value={(reportStats?.coins_awarded_total || 45200).toLocaleString()} icon={Coins} color="text-yellow-400" change={15} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Active Citizens" value="12.4k" icon={Users} color="text-purple-400" change={5} />
        <StatCard label="Reports Confirmed" value={reportStats?.confirmed_today?.toLocaleString() || '98'} icon={FileCheck} color="text-green-400" change={3} />
        <StatCard label="Reports Pending AI" value={reportStats?.pending_today?.toLocaleString() || '22'} icon={AlertTriangle} color="text-orange-400" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bin Status Pie */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          <h3 className="font-bold text-white mb-1">Bin Status Distribution</h3>
          <p className="text-xs text-slate-500 mb-5">Real-time across all monitored bins</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={BIN_STATUS_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                {BIN_STATUS_DATA.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                itemStyle={{ color: '#e2e8f0' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {BIN_STATUS_DATA.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-slate-400">{item.name}: <span className="text-white font-medium">{item.value}</span></span>
              </div>
            ))}
          </div>
        </div>

        {/* Task Trend Line */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          <h3 className="font-bold text-white mb-1">Task Trend — Last 7 Days</h3>
          <p className="text-xs text-slate-500 mb-5">Opened vs Resolved tasks per day</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={TASK_TREND} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
              <Line type="monotone" dataKey="opened" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 3 }} name="Opened" />
              <Line type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 3 }} name="Resolved" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-5">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <div>
            <h3 className="font-bold text-white">Top Citizens — Green Coin Leaderboard</h3>
            <p className="text-xs text-slate-500">Most active citizens this month</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 text-xs uppercase tracking-wider border-b border-slate-800">
                <th className="pb-3 pr-4">Rank</th>
                <th className="pb-3 pr-4">Citizen</th>
                <th className="pb-3 pr-4 text-right">Reports</th>
                <th className="pb-3 text-right">🪙 Coins</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {leaderboard.map((citizen, i) => (
                <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 pr-4">
                    <span className={`font-bold text-base ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-slate-500'}`}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-brand/20 rounded-full flex items-center justify-center text-green-400 text-xs font-bold border border-green-brand/20">
                        {citizen.full_name?.charAt(0)}
                      </div>
                      <span className="text-white font-medium">{citizen.full_name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-right text-slate-400">{citizen.reports}</td>
                  <td className="py-3 text-right">
                    <span className="text-yellow-400 font-bold">{citizen.coins.toLocaleString()}</span>
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
