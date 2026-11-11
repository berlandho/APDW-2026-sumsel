import React from 'react';
import { Judge } from '../types';
import { User, ArrowLeftRight, HelpCircle, FileSpreadsheet, Users, Database, Award } from 'lucide-react';

interface HeaderProps {
  activeTab: 'scoring' | 'recap' | 'pleno';
  onTabChange: (tab: 'scoring' | 'recap' | 'pleno') => void;
  currentJudge: Judge | null;
  onOpenJudgeSelector: () => void;
  onOpenGuideModal: () => void;
  onOpenDataModal: () => void;
  completedCount: number;
  totalVideos: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  currentJudge,
  onOpenJudgeSelector,
  onOpenGuideModal,
  onOpenDataModal,
  completedCount,
  totalVideos,
}) => {
  return (
    <>
      {/* South Sumatra Decorative Songket Bar */}
      <div className="h-1.5 songket-pattern border-b border-amber-500 no-print"></div>

      {/* Strict 3-Zone Top Bar Contract */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between gap-8">
            
            {/* Zone 1: Single Text Element Wordmark */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm shadow-sm">
                <Award className="w-5 h-5 text-slate-950" />
              </div>
              <button
                onClick={() => onTabChange('scoring')}
                className="text-left cursor-pointer group"
              >
                <span className="font-serif font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-amber-400 transition whitespace-nowrap block">
                  APDW Sumsel 2026
                </span>
                <span className="text-[10px] text-slate-400 block -mt-0.5 whitespace-nowrap">
                  Penjurian Mandiri Video Desa Wisata
                </span>
              </button>
            </div>

            {/* Zone 2: Concise Single-Line Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
              <button
                onClick={() => onTabChange('scoring')}
                className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'scoring'
                    ? 'text-amber-400 border-b-2 border-amber-400 font-bold'
                    : 'hover:text-white'
                }`}
              >
                Lembar Penilaian
              </button>
              <button
                onClick={() => onTabChange('recap')}
                className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'recap'
                    ? 'text-amber-400 border-b-2 border-amber-400 font-bold'
                    : 'hover:text-white'
                }`}
              >
                Rekap & Cetak Resmi
              </button>
              <button
                onClick={() => onTabChange('pleno')}
                className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'pleno'
                    ? 'text-amber-400 border-b-2 border-amber-400 font-bold'
                    : 'hover:text-white'
                }`}
              >
                Sidang Pleno 6 Juri
              </button>
              <button
                onClick={onOpenGuideModal}
                className="py-1 hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Petunjuk Bobot</span>
              </button>
              <button
                onClick={onOpenDataModal}
                className="py-1 hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer text-slate-400 hover:text-slate-200"
                title="Cadangkan atau Pulihkan Data"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Data</span>
              </button>
            </nav>

            {/* Zone 3: 1 Primary Action / Active Judge Switcher */}
            <div className="flex items-center gap-3 shrink-0">
              {currentJudge ? (
                <div className="flex items-center gap-2">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-slate-400">Dewan Juri:</p>
                    <p className="text-xs font-bold text-amber-400 truncate max-w-[180px]">
                      {currentJudge.name}
                    </p>
                  </div>
                  <button
                    onClick={onOpenJudgeSelector}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
                    title="Ganti ke Dewan Juri lain"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ganti Juri</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenJudgeSelector}
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <User className="w-4 h-4" />
                  <span>Pilih Dewan Juri</span>
                </button>
              )}
            </div>

          </div>

          {/* Mobile Navigation Strip */}
          <div className="flex md:hidden items-center justify-between gap-1 mt-3 pt-3 border-t border-slate-800 text-xs">
            <button
              onClick={() => onTabChange('scoring')}
              className={`flex-1 py-1.5 px-2 text-center rounded-md font-medium transition ${
                activeTab === 'scoring'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              Penilaian ({completedCount}/{totalVideos})
            </button>
            <button
              onClick={() => onTabChange('recap')}
              className={`flex-1 py-1.5 px-2 text-center rounded-md font-medium transition ${
                activeTab === 'recap'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              Rekapitulasi
            </button>
            <button
              onClick={() => onTabChange('pleno')}
              className={`flex-1 py-1.5 px-2 text-center rounded-md font-medium transition ${
                activeTab === 'pleno'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              Pleno
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
