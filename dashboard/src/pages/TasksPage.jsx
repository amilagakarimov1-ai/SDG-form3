import { useState, useRef } from 'react';
import { MapPin, User, Clock, Plus, X, CheckCircle, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';

const PRIORITY_STYLES = {
  urgent: 'text-red-400 bg-red-400/10 border-red-400/20',
  high:   'text-orange-400 bg-orange-400/10 border-orange-400/20',
  medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  low:    'text-green-400 bg-green-400/10 border-green-400/20',
};

const TYPE_ICONS = {
  full_bin: '🗑️', broken_bin: '⚠️', road_damage: '🛣️',
  broken_light: '💡', illegal_dumping: '🚮', other: '📋',
};

const COLUMNS = [
  { key: 'open',        label: 'Açıq',        color: 'border-t-slate-400',  headerBg: 'bg-slate-500/10',  count_color: 'text-slate-400' },
  { key: 'assigned',    label: 'Təyin Edilib', color: 'border-t-blue-500',   headerBg: 'bg-blue-500/10',   count_color: 'text-blue-400' },
  { key: 'in_progress', label: 'Davam Edir',   color: 'border-t-yellow-500', headerBg: 'bg-yellow-500/10', count_color: 'text-yellow-400' },
  { key: 'resolved',    label: 'Həll Edildi',  color: 'border-t-green-500',  headerBg: 'bg-green-500/10',  count_color: 'text-green-400' },
];

const INITIAL_TASKS = {
  open: [
    { id: 1, title: 'Sahil boulevard zibil qutusu',   type: 'full_bin',        priority: 'high',   address: 'Sahil metrosu, 12',   worker: null,          timeAgo: '15 dəq əvvəl' },
    { id: 2, title: 'Nizami küçəsi yol zədəsi',        type: 'road_damage',     priority: 'urgent', address: 'Nizami küçəsi, 45',   worker: null,          timeAgo: '32 dəq əvvəl' },
    { id: 3, title: 'Fəvvarələr meydanı işıq dirəyi', type: 'broken_light',    priority: 'medium', address: 'Fəvvarələr meydanı',  worker: null,          timeAgo: '1 saat əvvəl' },
  ],
  assigned: [
    { id: 4, title: 'İçərişəhər qanunsuz zibil',      type: 'illegal_dumping', priority: 'high',   address: 'İçərişəhər, 5',      worker: 'Əli Hüseynov', timeAgo: '2 saat əvvəl' },
    { id: 5, title: 'Binəqədi zibil qutusu',           type: 'full_bin',        priority: 'low',    address: 'Binəqədi, 89',       worker: 'Röya Muradova', timeAgo: '3 saat əvvəl' },
  ],
  in_progress: [
    { id: 6, title: 'Nəsimi rayon yol zədəsi',        type: 'road_damage',     priority: 'urgent', address: 'Nəsimi, Rəşid Behbudov 22', worker: 'Kamran Əliyev', timeAgo: '5 saat əvvəl' },
  ],
  resolved: [
    { id: 7, title: 'Bulvar zibil qutusu boşaldıldı', type: 'full_bin',        priority: 'medium', address: 'Bulvar, Dəniz kənarı', worker: 'Əli Hüseynov', timeAgo: 'Dünən' },
    { id: 8, title: 'Sabunçu sınmış işıq diərği',     type: 'broken_light',    priority: 'low',    address: 'Sabunçu, Lənkəran 11', worker: 'Röya Muradova', timeAgo: '2 gün əvvəl' },
  ],
};

/* ─── Task Card ─── */
function TaskCard({ task, colKey, onDragStart, onMoveToStage }) {
  const dragRef = useRef(null);

  return (
    <div
      ref={dragRef}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('taskId', String(task.id));
        e.dataTransfer.setData('fromCol', colKey);
        onDragStart?.(task.id);
      }}
      className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-slate-500 transition-all cursor-grab active:cursor-grabbing shadow-md group select-none"
    >
      <div className="flex justify-between items-start mb-2 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <GripVertical className="w-4 h-4 text-slate-600 group-hover:text-slate-400 flex-shrink-0 transition-colors" />
          <span className="text-sm flex-shrink-0">{TYPE_ICONS[task.type] || '📋'}</span>
          <h4 className="font-semibold text-white text-sm leading-tight truncate">{task.title}</h4>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border flex-shrink-0 ${PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium}`}>
          {task.priority === 'urgent' ? 'Təcili' : task.priority === 'high' ? 'Yüksək' : task.priority === 'medium' ? 'Orta' : 'Aşağı'}
        </span>
      </div>

      <div className="space-y-1.5 mt-3">
        <p className="text-xs text-slate-400 flex items-center gap-1.5">
          <MapPin className="w-3 h-3 flex-shrink-0" /> {task.address}
        </p>
        {task.worker && (
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <User className="w-3 h-3 flex-shrink-0" /> {task.worker}
          </p>
        )}
        <p className="text-[10px] text-slate-500 flex items-center gap-1 pt-2 mt-2 border-t border-slate-700/60">
          <Clock className="w-3 h-3" /> {task.timeAgo}
        </p>
      </div>

      {/* Quick move buttons */}
      <div className="mt-3 flex gap-1 flex-wrap">
        {COLUMNS.filter(c => c.key !== colKey).map(col => (
          <button
            key={col.key}
            onClick={(e) => { e.stopPropagation(); onMoveToStage(task.id, colKey, col.key); }}
            className="text-[10px] text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 rounded px-2 py-0.5 transition-colors"
          >
            → {col.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Drop Column ─── */
function DropColumn({ col, tasks, onDrop, onDragStart, onMoveToStage }) {
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div
      className={`flex flex-col min-w-[260px] w-72 bg-slate-900/50 rounded-2xl border-t-4 ${col.color} border border-slate-800 flex-shrink-0 transition-all ${isDragOver ? 'ring-2 ring-green-500/50 bg-slate-800/60' : ''}`}
      onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        const taskId = parseInt(e.dataTransfer.getData('taskId'));
        const fromCol = e.dataTransfer.getData('fromCol');
        if (fromCol !== col.key) {
          onDrop(taskId, fromCol, col.key);
        }
      }}
    >
      {/* Column header */}
      <div className={`px-4 py-3 rounded-t-xl ${col.headerBg} flex items-center justify-between`}>
        <h3 className="font-bold text-white text-sm">{col.label}</h3>
        <span className={`text-xs font-bold ${col.count_color} bg-slate-900/60 px-2 py-0.5 rounded-full`}>
          {tasks.length}
        </span>
      </div>

      {/* Drop zone hint */}
      {isDragOver && (
        <div className="mx-3 mt-3 border-2 border-dashed border-green-500/50 rounded-xl h-16 flex items-center justify-center text-green-400/60 text-xs">
          Buraya burax
        </div>
      )}

      {/* Cards */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] min-h-[120px]">
        {tasks.length === 0 && !isDragOver && (
          <div className="flex flex-col items-center justify-center h-24 text-slate-600 text-xs text-center">
            <p>Tapşırıq yoxdur</p>
            <p className="text-[10px] mt-1 opacity-60">Kart buraya sürükləyin</p>
          </div>
        )}
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            colKey={col.key}
            onDragStart={onDragStart}
            onMoveToStage={onMoveToStage}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Create Task Modal ─── */
function CreateTaskModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ title: '', type: 'full_bin', priority: 'medium', address: '', worker: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.address) { toast.error('Başlıq və ünvan tələb olunur'); return; }
    onCreate(form);
    onClose();
    toast.success('Tapşırıq yaradıldı!');
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <h2 className="text-lg font-bold text-white">Yeni Tapşırıq</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Başlıq</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-green-500"
              placeholder="Tapşırıq başlığı..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Növ</label>
              <select value={form.type} onChange={e => set('type', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-green-500">
                <option value="full_bin">🗑️ Dolu Qutu</option>
                <option value="road_damage">🛣️ Yol Zədəsi</option>
                <option value="broken_light">💡 Sınmış İşıq</option>
                <option value="illegal_dumping">🚮 Qanunsuz Zibil</option>
                <option value="other">📋 Digər</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Prioritet</label>
              <select value={form.priority} onChange={e => set('priority', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-green-500">
                <option value="urgent">🔴 Təcili</option>
                <option value="high">🟠 Yüksək</option>
                <option value="medium">🟡 Orta</option>
                <option value="low">🟢 Aşağı</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Ünvan</label>
            <input value={form.address} onChange={e => set('address', e.target.value)} required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-green-500"
              placeholder="Bakı, küçə adı..." />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">İşçi (istəyə bağlı)</label>
            <input value={form.worker} onChange={e => set('worker', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-green-500"
              placeholder="İşçi adı..." />
          </div>
          <button type="submit"
            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-colors">
            Tapşırıq Yarat
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── MAIN TasksPage ─── */
export default function TasksPage() {
  const [columns, setColumns] = useState(INITIAL_TASKS);
  const [showCreate, setShowCreate] = useState(false);
  const nextId = useRef(100);

  /* Move a task from one column to another */
  const moveTask = (taskId, fromCol, toCol) => {
    if (fromCol === toCol) return;
    setColumns(prev => {
      const task = prev[fromCol].find(t => t.id === taskId);
      if (!task) return prev;
      const colLabel = COLUMNS.find(c => c.key === toCol)?.label ?? toCol;
      toast.success(`"${task.title}" → ${colLabel}`);
      return {
        ...prev,
        [fromCol]: prev[fromCol].filter(t => t.id !== taskId),
        [toCol]:   [...prev[toCol], { ...task }],
      };
    });
  };

  /* Create a new task */
  const createTask = (form) => {
    const id = nextId.current++;
    setColumns(prev => ({
      ...prev,
      open: [{
        id,
        title: form.title,
        type: form.type,
        priority: form.priority,
        address: form.address,
        worker: form.worker || null,
        timeAgo: 'İndi',
      }, ...prev.open],
    }));
  };

  const totalTasks = Object.values(columns).reduce((s, arr) => s + arr.length, 0);

  return (
    <div className="h-full flex flex-col gap-4">
      {showCreate && <CreateTaskModal onClose={() => setShowCreate(false)} onCreate={createTask} />}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Tapşırıqlar</h1>
          <p className="text-slate-400 text-sm mt-0.5">Cəmi {totalTasks} tapşırıq · Sürükləyərək mərhələ dəyişin</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-green-900/30"
        >
          <Plus className="w-5 h-5" /> Yeni Tapşırıq
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {COLUMNS.map(col => (
          <div key={col.key} className={`${col.headerBg} border border-slate-800 rounded-xl p-3 text-center`}>
            <p className={`text-2xl font-extrabold ${col.count_color}`}>{columns[col.key].length}</p>
            <p className="text-slate-400 text-xs mt-0.5">{col.label}</p>
          </div>
        ))}
      </div>

      {/* Drag instruction banner */}
      <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-2">
        <GripVertical className="w-4 h-4" />
        <span>Tapşırıqları sürükləyərək (<strong className="text-slate-400">drag & drop</strong>) bir mərhələdən digərinə keçirin, və ya kartın altındakı düymələrdən istifadə edin.</span>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
        {COLUMNS.map(col => (
          <DropColumn
            key={col.key}
            col={col}
            tasks={columns[col.key]}
            onDrop={moveTask}
            onMoveToStage={moveTask}
          />
        ))}
      </div>
    </div>
  );
}
