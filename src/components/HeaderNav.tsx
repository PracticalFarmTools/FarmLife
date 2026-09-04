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
  Play,
  Cpu,
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

  const getWeatherIcon = (weather: WeatherType, size = 'w-4 h-4') => {
    switch (weather) {
      case 'Sunny':
        return <Sun className={`${size} text-amber-400 animate-spin-slow`} />;
      case 'Rainy':
        return <CloudRain className={`${size} text-blue-400`} />;
      case 'Drought':
        return <Flame className={`${size} text-orange-500`} />;
      case 'Storm':
        return <Zap className={`${size} text-purple-400`} />;
      case 'Frost':
        return <Snowflake className={`${size} text-cyan-300`} />;
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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Main Header Row */}
        <div className="flex items-center justify-between py-2 sm:py-3 gap-2">
          {/* Left: Brand & Region */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-amber-700 p-0.5 shadow-lg flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-stone-900 rounded-[10px] flex items-center justify-center">
                <Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base text-stone-100 tracking-wide">
                  AGRONOMICS
                </span>
                <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-mono">
                  v2.0
                </span>
              </div>
              {selectedRegion && (
                <p className="text-[10px] sm:text-xs text-stone-400 truncate max-w-[130px] sm:max-w-[200px]">
                  {selectedRegion.name}
                </p>
              )}
            </div>
          </div>

          {/* Center (Desktop): Calendar, Weather & Time Controls */}
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
            <div className="flex items-center gap-1.5 px-3 py-1 bg-stone-900 rounded-lg border border-stone-800">
              {getWeatherIcon(currentWeather)}
              <span className="text-xs font-semibold text-stone-200">{currentWeather}</span>
            </div>

            {/* Time Controls */}
            <div className="flex items-center gap-1 pl-1">
              <button
                onClick={() => setGameSpeed(gameSpeed === 0 ? 1 : 0)}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  gameSpeed === 0 ? 'bg-amber-600 text-white' : 'bg-stone-800 text-stone-400 hover:text-white'
                }`}
                title={gameSpeed === 0 ? 'Resume' : 'Pause'}
              >
                {gameSpeed === 0 ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setGameSpeed(1)}
                className={`px-2 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                  gameSpeed === 1 ? 'bg-emerald-600 text-white' : 'bg-stone-800 text-stone-400 hover:text-white'
                }`}
              >
                1x
              </button>
              <button
                onClick={() => setGameSpeed(2)}
                className={`px-2 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                  gameSpeed === 2 ? 'bg-emerald-600 text-white' : 'bg-stone-800 text-stone-400 hover:text-white'
                }`}
              >
                2x
              </button>
              <button
                onClick={() => setGameSpeed(5)}
                className={`px-2 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                  gameSpeed === 5 ? 'bg-emerald-600 text-white' : 'bg-stone-800 text-stone-400 hover:text-white'
                }`}
              >
                5x
              </button>
              <button
                onClick={nextDay}
                className="flex items-center gap-1 px-3 py-1 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-lg transition shadow-md cursor-pointer"
              >
                <span>Next Day</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right: Cash & Net Worth */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-right">
              <div className="flex items-center gap-0.5 sm:gap-1 justify-end">
                <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 animate-pulse" />
                <span className="font-mono font-extrabold text-sm sm:text-lg text-emerald-400">
                  {cash.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex items-center gap-1 justify-end text-[10px] sm:text-xs text-stone-400 font-mono">
                <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-500" />
                <span>${(netWorth / 1000).toFixed(0)}k Net</span>
              </div>
            </div>

            {/* Desktop sound & reset */}
            <div className="hidden sm:flex items-center gap-1.5 border-l border-stone-800 pl-3">
              <button
                onClick={toggleSound}
                className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition cursor-pointer"
              >
                {muted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
              <button
                onClick={() => {
                  if (confirm('Restart farming simulation?')) {
                    restartGame();
                  }
                }}
                className="p-1.5 rounded-lg bg-stone-800 hover:bg-rose-900/60 text-stone-400 hover:text-rose-300 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE ALWAYS-VISIBLE CLOCK & CONTROL STRIP */}
        <div className="md:hidden flex items-center justify-between gap-1.5 py-1.5 border-t border-stone-800 text-xs">
          {/* Calendar & Weather Badge */}
          <div className="flex items-center gap-1.5 bg-stone-950 px-2 py-1 rounded-lg border border-stone-800 font-mono text-[11px]">
            <span className={`px-1.5 py-0.2 rounded font-bold border text-[10px] ${getSeasonColor(season)}`}>
              {season.slice(0, 2)}
            </span>
            <span className="text-stone-300 font-bold">Y{year} D{dayOfYear}</span>
            <div className="flex items-center gap-0.5 border-l border-stone-800 pl-1">
              {getWeatherIcon(currentWeather, 'w-3.5 h-3.5')}
            </div>
          </div>

          {/* Time Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setGameSpeed(gameSpeed === 0 ? 1 : 0)}
              className={`p-2 rounded-lg text-xs font-bold transition cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center ${
                gameSpeed === 0 ? 'bg-amber-600 text-white' : 'bg-stone-800 text-stone-300'
              }`}
            >
              {gameSpeed === 0 ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setGameSpeed(gameSpeed === 1 ? 2 : gameSpeed === 2 ? 5 : 1)}
              className="px-2.5 py-1.5 rounded-lg bg-stone-800 text-stone-300 font-mono text-[11px] font-bold cursor-pointer min-h-[36px]"
            >
              {gameSpeed === 0 ? '1x' : `${gameSpeed}x`}
            </button>
            <button
              onClick={nextDay}
              className="flex items-center gap-1 px-3 py-1.5 bg-amber-600 active:bg-amber-500 text-stone-950 font-extrabold text-[11px] rounded-lg shadow cursor-pointer min-h-[36px]"
            >
              <span>Next Day</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* DESKTOP TAB NAVIGATION (HIDDEN ON MOBILE, USES BOTTOM TAB BAR INSTEAD) */}
        <div className="hidden lg:flex items-center gap-1 pt-1 overflow-x-auto no-scrollbar border-t border-stone-800/60">
          <button
            onClick={() => setActiveTab('desk')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'desk'
                ? 'border-emerald-500 text-emerald-400 bg-stone-850'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Desk Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('fields')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'fields'
                ? 'border-emerald-500 text-emerald-400 bg-stone-850'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sprout className="w-3.5 h-3.5" />
            <span>Fields & Agronomy</span>
          </button>

          <button
            onClick={() => setActiveTab('seeds')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'seeds'
                ? 'border-emerald-500 text-emerald-400 bg-stone-850'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Dna className="w-3.5 h-3.5" />
            <span>Seed Broker & R&D</span>
          </button>

          <button
            onClick={() => setActiveTab('market')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'market'
                ? 'border-emerald-500 text-emerald-400 bg-stone-850'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Market & Sales</span>
          </button>

          <button
            onClick={() => setActiveTab('barn')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'barn'
                ? 'border-emerald-500 text-emerald-400 bg-stone-850'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Warehouse className="w-3.5 h-3.5" />
            <span>Barn Inventory</span>
          </button>

          <button
            onClick={() => setActiveTab('garage')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'garage'
                ? 'border-emerald-500 text-emerald-400 bg-stone-850'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Garage & Fleet</span>
          </button>

          <button
            onClick={() => setActiveTab('roster')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'roster'
                ? 'border-emerald-500 text-emerald-400 bg-stone-850'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Staff & Roster</span>
          </button>

          <button
            onClick={() => setActiveTab('bank')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'bank'
                ? 'border-emerald-500 text-emerald-400 bg-stone-850'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Bank & Credit</span>
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'ledger'
                ? 'border-emerald-500 text-emerald-400 bg-stone-850'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Ledger</span>
          </button>

          <button
            onClick={() => setActiveTab('endless')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'endless'
                ? 'border-emerald-500 text-emerald-400 bg-stone-850'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Automation & Tech</span>
          </button>
        </div>
      </div>
    </header>
  );
};
