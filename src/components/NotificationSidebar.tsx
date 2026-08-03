import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Bell, CheckCircle2, AlertTriangle, Info, AlertOctagon } from 'lucide-react';

export const NotificationSidebar: React.FC = () => {
  const { notifications } = useGameStore();

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />;
      case 'error':
        return <AlertOctagon className="w-4 h-4 text-rose-400 flex-shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />;
    }
  };

  return (
    <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between pb-3 border-b border-stone-800">
        <h3 className="font-extrabold text-stone-100 flex items-center gap-2 text-base">
          <Bell className="w-5 h-5 text-amber-500" />
          <span>Daily Event Feed</span>
        </h3>
        <span className="px-2 py-0.5 rounded-full bg-stone-950 text-stone-400 text-xs font-mono font-bold">
          {notifications.length} Logs
        </span>
      </div>

      {notifications.length === 0 ? (
        <div className="py-12 text-center text-stone-400 text-xs italic">
          No notifications recorded yet. Advance days to see daily logs.
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto max-h-[600px] pr-1 flex-1">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border text-xs space-y-1 transition ${
                item.type === 'success'
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-stone-200'
                  : item.type === 'warning'
                  ? 'bg-amber-950/40 border-amber-800/60 text-stone-200'
                  : item.type === 'error'
                  ? 'bg-rose-950/40 border-rose-800/60 text-stone-200'
                  : 'bg-stone-950 border-stone-800 text-stone-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getNotifIcon(item.type)}
                  <h4 className="font-bold text-stone-100">{item.title}</h4>
                </div>
                <span className="text-[10px] font-mono text-stone-400">
                  Y{item.year} D{item.day}
                </span>
              </div>
              <p className="text-stone-300 pl-6 leading-relaxed text-[11px]">{item.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
