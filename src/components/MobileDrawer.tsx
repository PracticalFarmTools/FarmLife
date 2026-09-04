import React from 'react';
import { useGameStore } from '../store/gameStore';
import { sound } from '../utils/audio';
import {
  X,
  Dna,
  Wrench,
  Users,
  Landmark,
  Receipt,
  Bell,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  AlertOctagon,
  ChevronRight,
  Flame,
  Building2,
  Cpu,
} from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const {
    activeTab,
    setActiveTab,
    notifications,
    operatingLoan,
    storageFacility,
    getDailyBurnRate,
    restartGame,
  } = useGameStore();

  const [muted, setMuted] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<'menu' | 'notifications' | 'intel'>('menu');

  if (!isOpen) return null;

  const toggleSound = () => {
    const isMuted = sound.toggleMute();
    setMuted(isMuted);
  };

  const handleTabSelect = (tab: typeof activeTab) => {
    setActiveTab(tab);
    onClose();
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'error':
        return <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-400 shrink-0" />;
    }
  };

  const dailyBurn = getDailyBurnRate();

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-stone-900 border-l border-stone-800 shadow-2xl flex flex-col justify-between p-5 overflow-y-auto safe-area-bottom">
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-stone-100 uppercase tracking-wider">
                Farm Management Hub
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section Switcher */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-stone-950 rounded-xl border border-stone-800 text-xs font-bold">
            <button
              onClick={() => setActiveSection('menu')}
              className={`py-1.5 rounded-lg transition text-center ${
                activeSection === 'menu' ? 'bg-amber-600 text-stone-950 shadow' : 'text-stone-400'
              }`}
            >
              Operations
            </button>
            <button
              onClick={() => setActiveSection('notifications')}
              className={`py-1.5 rounded-lg transition text-center relative ${
                activeSection === 'notifications' ? 'bg-amber-600 text-stone-950 shadow' : 'text-stone-400'
              }`}
            >
              Feed
              {notifications.length > 0 && (
                <span className="ml-1 px-1 py-0.2 rounded-full bg-stone-900 text-[10px]">
                  {notifications.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveSection('intel')}
              className={`py-1.5 rounded-lg transition text-center ${
                activeSection === 'intel' ? 'bg-amber-600 text-stone-950 shadow' : 'text-stone-400'
              }`}
            >
              Intel
            </button>
          </div>

          {/* SECTION 1: OPERATIONS MENU */}
          {activeSection === 'menu' && (
            <div className="space-y-2">
              <button
                onClick={() => handleTabSelect('seeds')}
                className={`w-full p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
                  activeTab === 'seeds'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-stone-950 border-stone-800 text-stone-200 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Dna className="w-5 h-5 text-purple-400" />
                  <div>
                    <span className="text-sm font-bold block">Seed Broker & R&D</span>
                    <span className="text-[10px] text-stone-400">GMO Traits & Breeding</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-500" />
              </button>

              <button
                onClick={() => handleTabSelect('garage')}
                className={`w-full p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
                  activeTab === 'garage'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-stone-950 border-stone-800 text-stone-200 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Wrench className="w-5 h-5 text-amber-400" />
                  <div>
                    <span className="text-sm font-bold block">Garage & Fleet</span>
                    <span className="text-[10px] text-stone-400">Tractors & Implements</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-500" />
              </button>

              <button
                onClick={() => handleTabSelect('roster')}
                className={`w-full p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
                  activeTab === 'roster'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-stone-950 border-stone-800 text-stone-200 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-400" />
                  <div>
                    <span className="text-sm font-bold block">Staff & Labor</span>
                    <span className="text-[10px] text-stone-400">H-2A Crew & Managers</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-500" />
              </button>

              <button
                onClick={() => handleTabSelect('bank')}
                className={`w-full p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
                  activeTab === 'bank'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-stone-950 border-stone-800 text-stone-200 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Landmark className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="text-sm font-bold block">Bank & Credit</span>
                    <span className="text-[10px] text-stone-400">Loans, Insurance & Hedging</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-500" />
              </button>

              <button
                onClick={() => handleTabSelect('ledger')}
                className={`w-full p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
                  activeTab === 'ledger'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-stone-950 border-stone-800 text-stone-200 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Receipt className="w-5 h-5 text-amber-500" />
                  <div>
                    <span className="text-sm font-bold block">Financial Ledger</span>
                    <span className="text-[10px] text-stone-400">Audit & Profit/Loss</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-500" />
              </button>

              <button
                onClick={() => handleTabSelect('endless')}
                className={`w-full p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
                  activeTab === 'endless'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-stone-950 border-stone-800 text-stone-200 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  <div>
                    <span className="text-sm font-bold block">Automation & Tech</span>
                    <span className="text-[10px] text-stone-400">Robotics & AI Real Estate</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-500" />
              </button>
            </div>
          )}

          {/* SECTION 2: LOGS & NOTIFICATIONS */}
          {activeSection === 'notifications' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-amber-400" />
                  <span>Daily Feed ({notifications.length})</span>
                </span>
              </div>

              {notifications.length === 0 ? (
                <p className="text-xs text-stone-500 italic py-6 text-center">No logs recorded yet.</p>
              ) : (
                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-stone-950 border border-stone-800 rounded-xl text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-stone-100">
                          {getNotifIcon(item.type)}
                          <span className="text-[11px] truncate max-w-[170px]">{item.title}</span>
                        </div>
                        <span className="text-[9px] font-mono text-stone-500">
                          Y{item.year} D{item.day}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 leading-tight pl-5">{item.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SECTION 3: INTEL & VITALS */}
          {activeSection === 'intel' && (
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-stone-950 border border-stone-800 rounded-xl space-y-1">
                <span className="text-stone-400 flex items-center gap-1 text-[10px] font-mono uppercase">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>Daily Cash Outflow Burn</span>
                </span>
                <strong className="text-rose-400 font-mono text-base block">
                  -${dailyBurn.toLocaleString()}/day
                </strong>
              </div>

              <div className="p-3.5 bg-stone-950 border border-stone-800 rounded-xl space-y-1">
                <span className="text-stone-400 flex items-center gap-1 text-[10px] font-mono uppercase">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Cold Storage Status</span>
                </span>
                <strong
                  className={`font-mono text-sm block ${
                    storageFacility.hasColdStorage
                      ? storageFacility.isPowerOutage
                        ? 'text-rose-400'
                        : 'text-cyan-400'
                      : 'text-stone-500'
                  }`}
                >
                  {storageFacility.hasColdStorage
                    ? storageFacility.isPowerOutage
                      ? 'Blackout Spike (65°F)'
                      : 'Active (34°F)'
                    : 'Facility Unbuilt'}
                </strong>
              </div>

              <div className="p-3.5 bg-stone-950 border border-stone-800 rounded-xl space-y-1">
                <span className="text-stone-400 text-[10px] font-mono uppercase block">
                  Spring Credit Line
                </span>
                <strong className="font-mono text-sm block text-amber-400">
                  {operatingLoan ? `$${operatingLoan.principal.toLocaleString()} Drawn` : 'No Active Debt'}
                </strong>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
          <button
            onClick={toggleSound}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs font-bold text-stone-300 cursor-pointer"
          >
            {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span>{muted ? 'Unmute' : 'Mute'}</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Restart the farming simulation from scratch?')) {
                restartGame();
                onClose();
              }
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs font-bold text-rose-400 hover:bg-rose-950/40 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
