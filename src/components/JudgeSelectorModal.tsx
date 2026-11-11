import React from 'react';
import { Judge } from '../types';
import { OFFICIAL_JUDGES, VIDEO_ENTRIES } from '../data/judgesAndVideos';
import { UserCheck, ShieldCheck, CheckCircle2, ChevronRight, Award } from 'lucide-react';

interface JudgeSelectorModalProps {
  currentJudgeId: number | null;
  onSelectJudge: (judgeId: number) => void;
  getJudgeCompletedCount: (judgeId: number) => number;
  isOpen: boolean;
  onClose?: () => void;
}

export const JudgeSelectorModal: React.FC<JudgeSelectorModalProps> = ({
  currentJudgeId,
  onSelectJudge,
  getJudgeCompletedCount,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const totalVideos = VIDEO_ENTRIES.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header with South Sumatra Heritage Accent */}
        <div className="songket-pattern p-6 sm:p-8 text-white text-center relative border-b border-amber-500">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <UserCheck className="w-7 h-7 text-amber-400" />
          </div>
          <span className="text-[11px] font-bold tracking-widest text-amber-300 uppercase block mb-1">
            APDW SUMATERA SELATAN 2026
          </span>
          <h2 className="text-2xl font-bold font-serif">
            Pilih Identitas Dewan Juri
          </h2>
          <p className="text-xs text-slate-200 mt-1.5 max-w-lg mx-auto">
            Silakan pilih nama Anda untuk membuka lembar kerja penilaian mandiri. Setiap dewan juri memiliki ruang data independen yang tersimpan otomatis di perangkat.
          </p>
        </div>

        {/* Judges List */}
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Daftar 6 Anggota Dewan Juri Resmi
            </label>
            <span className="text-xs text-slate-400">Total 21 Video Peserta</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {OFFICIAL_JUDGES.map((judge) => {
              const completedCount = getJudgeCompletedCount(judge.id);
              const isFullyDone = completedCount === totalVideos;
              const isSelected = currentJudgeId === judge.id;

              return (
                <button
                  key={judge.id}
                  onClick={() => onSelectJudge(judge.id)}
                  className={`p-4 rounded-xl text-left border transition cursor-pointer flex items-start gap-3.5 relative group ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-500'
                      : 'border-slate-200 hover:border-amber-500 bg-white hover:bg-amber-50/20'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 transition ${
                      isSelected
                        ? 'bg-blue-900 text-amber-400'
                        : isFullyDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700 group-hover:bg-amber-500 group-hover:text-white'
                    }`}
                  >
                    {isFullyDone ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : (
                      judge.badge
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm truncate group-hover:text-blue-900">
                        {judge.name}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {judge.role}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-[11px]">
                      <span
                        className={`font-mono font-semibold ${
                          isFullyDone
                            ? 'text-emerald-700'
                            : completedCount > 0
                            ? 'text-blue-700'
                            : 'text-slate-400'
                        }`}
                      >
                        {completedCount} / {totalVideos} video dinilai
                      </span>
                      {isSelected && (
                        <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                          Aktif Sekarang
                        </span>
                      )}
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 transition ${
                      isSelected ? 'text-blue-600' : 'group-hover:text-amber-500'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
            <ShieldCheck className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block mb-0.5">
                Integritas & Kerahasiaan Nilai
              </span>
              Nilai yang Anda masukkan disimpan secara aman dan real-time di penyimpanan lokal peramban Anda. Anda dapat kembali kapan saja atau mengekspor lembar nilai resmi saat penilaian selesai.
            </div>
          </div>

          {currentJudgeId && onClose && (
            <div className="mt-6 text-center">
              <button
                onClick={onClose}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium underline"
              >
                Kembali ke Lembar Penilaian Terakhir
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
