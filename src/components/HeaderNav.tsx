import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { sound } from '../utils/audio';
import {
  Pause,
  ChevronRight,
  Sun,
  CloudRain,
  Flame,
  Zap,
  Snowflake,
  Volume2,
  VolumeX,
  RotateCcw,
  LayoutDashboard,
  Sprout,
  Store,
  Warehouse,
  Receipt,
  DollarSign,
  TrendingUp,
  Wrench,
  Users,
  Landmark,
  Dna,
} from 'lucide-react';
import type { WeatherType } from '../types/game';

export const HeaderNav: React.FC = () => {
  const {
    year,
    season,
    dayOfYear,
    cash,
    netWorth,
    gameSpeed,
    currentWeather,
    selectedRegion,
    activeTab,
    gameStarted,
    setGameSpeed,
    nextDay,
    setActiveTab,
    restartGame,
  } = useGameStore();

  const [muted, setMuted] = React.useState(false);

  useEffect(() => {
    if (gameSpeed === 0 || !gameStarted) return;
    const speedMs = 1500 / gameSpeed;
    const timer = setInterval(() => {
      nextDay();
    }, speedMs);
    return () => clearInterval(timer);
  }, [gameSpeed, gameStarted, nextDay]);

  const toggleSound = () => {
    const isMuted = sound.toggleMute();
    setMuted(isMuted);
  };

  const getWeatherIcon = (weather: WeatherType) => {
    switch (weather) {
      case 'Sunny':
        return <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />;
      case 'Rainy':
        return <CloudRain className="w-5 h-5 text-blue-400" />;
      case 'Drought':
        return <Flame className="w-5 h-5 text-orange-500" />;
      case 'Storm':
        return <Zap className="w-5 h-5 text-purple-400" />;
      case 'Frost':
        return <Snowflake className="w-5 h-5 text-cyan-300" />;
    }
  };

  const getSeasonColor = (s: string) => {
    switch (s) {
      case 'Spring':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50';
      case 'Summer':
        return 'bg-amber-950/80 text-amber-300 border-amber-700/50';
      case 'Fall':
        return 'bg-orange-950/80 text-orange-300 border-orange-700/50';
      case 'Winter':
        return 'bg-slate-900/80 text-cyan-300 border-cyan-700/50';
      default:
        return 'bg-gray-800 text-gray-200';
    }
  };

  if (!gameStarted) return null;

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur border-b border-stone-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand & Region */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-amber-700 p-0.5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-stone-900 rounded-[10px] flex items-center justify-center">
                <Sprout className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-stone-100 tracking-wide">AGRONOMICS</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-mono">
                  PROTOTYPE
                </span>
              </div>
              {selectedRegion && (
                <p className="text-xs text-stone-400 font-medium">{selectedRegion.name}</p>
              )}
            </div>
          </div>

          {/* Time & Environment Stats */}
          <div className="hidden md:flex items-center gap-3 bg-stone-950/60 p-1.5 rounded-xl border border-stone-800/80">
            {/* Calendar */}
            <div className="flex items-center gap-2 px-3 py-1 bg-stone-900 rounded-lg border border-stone-800">
              <span className="text-xs text-stone-400 font-medium">Year {year}</span>
              <span className={`text-xs px-2 py-0.5 rounded-md font-semibold border ${getSeasonColor(season)}`}>
                {season}
              </span>
              <span className="text-xs font-mono text-stone-300">Day {dayOfYear}</span>
            </div>

            {/* Weather */}
            <div className="flex items-center gap-2 px-3 py-1 bg-stone-900 rounded-lg border border-stone-800">
              {getWeatherIcon(currentWeather)}
              <span className="text-xs font-semibold text-stone-200">{currentWeather}</span>
            </div>

            {/* Time Controls */}
            <div className="flex items-center gap-1 pl-1">
              <button
                onClick={() => setGameSpeed(0)}
                className={`p-1.5 rounded-lg transition ${
                  gameSpeed === 0 ? 'bg-amber-600 text-white' : 'bg-stone-800 text-stone-400 hover:text-white'
                }`}
                title="Pause Engine"
              >
                <Pause className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setGameSpeed(1)}
                className={`px-2 py-1 text-xs font-bold rounded-lg transition ${
                  gameSpeed === 1 ? 'bg-emerald-600 text-white' : 'bg-stone-800 text-stone-400 hover:text-white'
                }`}
                title="Normal Speed (1x)"
              >
                1x
              </button>
              <button
                onClick={() => setGameSpeed(2)}
                className={`px-2 py-1 text-xs font-bold rounded-lg transition ${
                  gameSpeed === 2 ? 'bg-emerald-600 text-white' : 'bg-stone-800 text-stone-400 hover:text-white'
                }`}
                title="Fast Speed (2x)"
              >
                2x
              </button>
              <button
                onClick={() => setGameSpeed(5)}
                className={`px-2 py-1 text-xs font-bold rounded-lg transition ${
                  gameSpeed === 5 ? 'bg-emerald-600 text-white' : 'bg-stone-800 text-stone-400 hover:text-white'
                }`}
                title="Super Fast (5x)"
              >
                5x
              </button>
              <button
                onClick={nextDay}
                className="flex items-center gap-1 px-3 py-1 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-lg transition shadow-md"
                title="Advance Single Day"
              >
                <span>Next Day</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Financial Totals & Actions */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <DollarSign className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="font-mono font-bold text-lg text-emerald-400 transition-all duration-300 transform hover:scale-105">
                  {cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center gap-1 justify-end text-xs text-stone-400 font-mono">
                <TrendingUp className="w-3 h-3 text-amber-500" />
                <span>Net Worth: ${netWorth.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 border-l border-stone-800 pl-3">
              <button
                onClick={toggleSound}
                className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
                title={muted ? 'Unmute Sound' : 'Mute Sound'}
              >
                {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>

              <button
                onClick={restartGame}
                className="p-2 rounded-lg bg-stone-800 hover:bg-rose-900/60 text-stone-400 hover:text-rose-300 transition"
                title="Restart Simulation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar border-t border-stone-800/60">
          <button
            onClick={() => setActiveTab('desk')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition ${
              activeTab === 'desk'
                ? 'border-emerald-500 text-emerald-400 bg-stone-850'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Desk Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('fields')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition ${
              activeTab === 'fields'
                ? 'border-emerald-500 text-emerald-400 bg-stone-850'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>Fields & Plots</span>
          </button>

          <button
            onClick={() => setActiveTab('seeds')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition ${
              activeTab === 'seeds'
                ? 'border-emerald-500 text-emerald-400 bg-stone-850'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Dna className="w-4 h-4" />
            <span>Seed Broker & R&D</span>
          </button>

          <button
            onClick={() => setActiveTab('market')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition ${
              activeTab === 'market'
                ? 'border-emerald-500 text-emerald-400 bg-stone-850'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Market & Sales</span>
          </button>

          <button
            onClick={() => setActiveTab('barn')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition ${
              activeTab === 'barn'
                ? 'border-emerald-500 text-emerald-400 bg-stone-850'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Warehouse className="w-4 h-4" />
            <span>Barn Inventory</span>
          </button>

          <button
            onClick={() => setActiveTab('garage')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition ${
              activeTab === 'garage'
                ? 'border-emerald-500 text-emerald-400 bg-stone-850'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Garage & Fleet</span>
          </button>

          <button
            onClick={() => setActiveTab('roster')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition ${
              activeTab === 'roster'
                ? 'border-emerald-500 text-emerald-400 bg-stone-850'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Staff & Roster</span>
          </button>

          <button
            onClick={() => setActiveTab('bank')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition ${
              activeTab === 'bank'
                ? 'border-emerald-500 text-emerald-400 bg-stone-850'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>Local Bank & Risk</span>
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition ${
              activeTab === 'ledger'
                ? 'border-emerald-500 text-emerald-400 bg-stone-850'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Financial Ledger</span>
          </button>
        </div>
      </div>
    </header>
  );
};
