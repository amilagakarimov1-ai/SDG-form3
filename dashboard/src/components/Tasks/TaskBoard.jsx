import { Clock, MapPin, User } from 'lucide-react';

const MOCK_TASKS = {
  open: [
    { id: 1, title: 'Overflowing Bin', address: '123 Main St', priority: 'high', timeAgo: '2h ago' },
    { id: 2, title: 'Damaged Container', address: '456 Broadway', priority: 'medium', timeAgo: '5h ago' }
  ],
  assigned: [
    { id: 3, title: 'Regular Pickup', address: '789 Wall St', worker: 'John Doe', priority: 'low', timeAgo: '1d ago' }
  ],
  in_progress: [
    { id: 4, title: 'Spill Cleanup', address: 'Central Park', worker: 'Jane Smith', priority: 'high', timeAgo: '30m ago' }
  ],
  resolved: [
    { id: 5, title: 'Replaced Bin', address: 'Union Square', worker: 'Mike Johnson', priority: 'medium', timeAgo: '2d ago' }
  ]
};

const Column = ({ title, tasks, status }) => (
  <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4 min-w-[300px] flex flex-col h-full">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-bold text-slate-200 capitalize">{title}</h3>
      <span className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded-full">{tasks.length}</span>
    </div>
    <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
      {tasks.map(task => (
        <div key={task.id} className="bg-slate-800 rounded-lg p-3 border border-slate-700 hover:border-slate-600 cursor-pointer transition-colors shadow-md">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-white text-sm">{task.title}</h4>
            <span className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
          </div>
          <div className="space-y-1.5">
            <p className="text-xs text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {task.address}</p>
            {task.worker && <p className="text-xs text-slate-400 flex items-center gap-1"><User className="w-3 h-3" /> {task.worker}</p>}
            <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-2 pt-2 border-t border-slate-700/50"><Clock className="w-3 h-3" /> {task.timeAgo}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function TaskBoard() {
  return (
    <div className="flex gap-4 h-full pb-4">
      <Column title="Open" tasks={MOCK_TASKS.open} status="open" />
      <Column title="Assigned" tasks={MOCK_TASKS.assigned} status="assigned" />
      <Column title="In Progress" tasks={MOCK_TASKS.in_progress} status="in_progress" />
      <Column title="Resolved" tasks={MOCK_TASKS.resolved} status="resolved" />
    </div>
  );
}
