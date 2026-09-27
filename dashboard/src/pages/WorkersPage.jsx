import { useState } from 'react';
import { UserPlus, Phone, Mail, MapPin, CheckCircle, Clock, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_WORKERS = [
  { id: '1', name: 'Rauf Əliyev', email: 'rauf@baku.gov.az', phone: '+994 50 111 2233', district: 'Nəsimi', tasksAssigned: 12, tasksCompleted: 10, status: 'active', joinedDate: '2024-01-15' },
  { id: '2', name: 'Nigar Həsənova', email: 'nigar@baku.gov.az', phone: '+994 55 222 3344', district: 'Binəqədi', tasksAssigned: 8, tasksCompleted: 7, status: 'active', joinedDate: '2024-02-20' },
  { id: '3', name: 'Tural Məmmədov', email: 'tural@baku.gov.az', phone: '+994 70 333 4455', district: 'Sabunçu', tasksAssigned: 15, tasksCompleted: 14, status: 'busy', joinedDate: '2023-11-05' },
  { id: '4', name: 'Leyla Quliyeva', email: 'leyla@baku.gov.az', phone: '+994 51 444 5566', district: 'Xəzər', tasksAssigned: 6, tasksCompleted: 6, status: 'active', joinedDate: '2024-03-10' },
  { id: '5', name: 'Kamran İsmayılov', email: 'kamran@baku.gov.az', phone: '+994 77 555 6677', district: 'Suraxanı', tasksAssigned: 20, tasksCompleted: 18, status: 'active', joinedDate: '2023-09-01' },
  { id: '6', name: 'Aytən Babayeva', email: 'ayten@baku.gov.az', phone: '+994 50 666 7788', district: 'Qaradağ', tasksAssigned: 4, tasksCompleted: 4, status: 'offline', joinedDate: '2024-04-22' },
];

const STATUS_STYLES = {
  active: 'bg-green-400/10 text-green-400 border-green-400/20',
  busy: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
  offline: 'bg-slate-500/20 text-slate-400 border-slate-500/20',
};

export default function WorkersPage() {
  const [workers] = useState(MOCK_WORKERS);
  const [search, setSearch] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const [invite, setInvite] = useState({ name: '', email: '', district: '' });

  const filtered = workers.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.district.toLowerCase().includes(search.toLowerCase())
  );

  const handleInvite = () => {
    if (!invite.email || !invite.name) return toast.error('Please fill in all fields');
    toast.success(`Invitation sent to ${invite.email}`);
    setShowInvite(false);
    setInvite({ name: '', email: '', district: '' });
  };

  const totalTasks = workers.reduce((s, w) => s + w.tasksAssigned, 0);
  const totalCompleted = workers.reduce((s, w) => s + w.tasksCompleted, 0);
  const activeCount = workers.filter(w => w.status === 'active').length;

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Workers', value: workers.length, color: 'text-blue-400' },
          { label: 'Active Now', value: activeCount, color: 'text-green-400' },
          { label: 'Tasks Completed', value: `${totalCompleted}/${totalTasks}`, color: 'text-yellow-400' },
        ].map((s, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p className="text-slate-500 text-sm mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter + Invite */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name or district..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-green-brand"
          />
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-brand hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-green-brand/20"
        >
          <UserPlus className="w-4 h-4" /> Invite Worker
        </button>
      </div>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(worker => {
          const completionRate = Math.round((worker.tasksCompleted / worker.tasksAssigned) * 100) || 0;
          return (
            <div key={worker.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-green-brand/15 rounded-full flex items-center justify-center text-green-400 font-bold text-lg border border-green-brand/20">
                    {worker.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">{worker.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {worker.district}
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border ${STATUS_STYLES[worker.status]}`}>
                  {worker.status}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-400 mb-4">
                <a href={`mailto:${worker.email}`} className="flex items-center gap-2 hover:text-green-400 transition-colors">
                  <Mail className="w-3.5 h-3.5" /> {worker.email}
                </a>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" /> {worker.phone}
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-500 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Completion Rate
                  </span>
                  <span className="text-white font-medium">{completionRate}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-green-brand transition-all"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
                <div className="flex justify-between mt-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {worker.tasksAssigned} assigned</span>
                  <span className="text-green-400">{worker.tasksCompleted} done</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-white">Invite New Worker</h3>
              <button onClick={() => setShowInvite(false)} className="text-slate-500 hover:text-white">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Full Name</label>
                <input type="text" value={invite.name} onChange={e => setInvite(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-green-brand"
                  placeholder="Worker's full name" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Email Address</label>
                <input type="email" value={invite.email} onChange={e => setInvite(p => ({ ...p, email: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-green-brand"
                  placeholder="worker@municipality.gov" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">District</label>
                <input type="text" value={invite.district} onChange={e => setInvite(p => ({ ...p, district: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-green-brand"
                  placeholder="e.g. Nəsimi" />
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowInvite(false)} className="flex-1 py-2.5 border border-slate-700 text-slate-300 rounded-xl text-sm hover:bg-slate-800 transition-colors">Cancel</button>
                <button onClick={handleInvite} className="flex-1 py-2.5 bg-green-brand hover:bg-green-600 text-white rounded-xl text-sm font-medium transition-colors">Send Invite</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
