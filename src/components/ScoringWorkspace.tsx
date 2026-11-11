import React, { useState, useMemo } from 'react';
import { VideoEntry, JudgeScoresMap, AspectScores, RecommendationType } from '../types';
import { VideoItemCard } from './VideoItemCard';
import { REGIONS_LIST, isVideoEvaluationComplete } from '../data/judgesAndVideos';
import { Search, Filter, ArrowUpDown, CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface ScoringWorkspaceProps {
  videos: VideoEntry[];
  scoresMap: JudgeScoresMap;
  onUpdateScore: (videoId: number, aspect: keyof AspectScores, value: number | '') => void;
  onUpdateNotes: (videoId: number, notes: string) => void;
  onUpdateRecommendation: (videoId: number, recommendation: RecommendationType) => void;
  onQuickPreset: (videoId: number, score: number) => void;
  onReset: (videoId: number) => void;
  completedCount: number;
  totalVideos: number;
}

export const ScoringWorkspace: React.FC<ScoringWorkspaceProps> = ({
  videos,
  scoresMap,
  onUpdateScore,
  onUpdateNotes,
  onUpdateRecommendation,
  onQuickPreset,
  onReset,
  completedCount,
  totalVideos,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [selectedRegion, setSelectedRegion] = useState('Semua Wilayah');
  const [sortBy, setSortBy] = useState<'id' | 'score_desc' | 'score_asc'>('id');

  // Stats calculation
  const stats = useMemo(() => {
    let totalScoreSum = 0;
    let scoredCount = 0;
    let maxScore = 0;

    Object.values(scoresMap).forEach((ev) => {
      if (ev.totalScore > 0) {
        totalScoreSum += ev.totalScore;
        scoredCount += 1;
        if (ev.totalScore > maxScore) maxScore = ev.totalScore;
      }
    });

    const avgScore = scoredCount > 0 ? (totalScoreSum / scoredCount).toFixed(2) : '0.00';
    const percent = Math.round((completedCount / totalVideos) * 100);

    return { avgScore, maxScore: maxScore.toFixed(2), percent };
  }, [scoresMap, completedCount, totalVideos]);

  // Filter and sort videos
  const filteredVideos = useMemo(() => {
    return videos
      .filter((video) => {
        // Query match
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          video.title.toLowerCase().includes(q) ||
          video.location.toLowerCase().includes(q) ||
          video.region.toLowerCase().includes(q);

        // Region match
        const matchesRegion =
          selectedRegion === 'Semua Wilayah' || video.region === selectedRegion;

        // Status match
        const isComplete = isVideoEvaluationComplete(scoresMap[video.id]?.scores || {});
        let matchesStatus = true;
        if (statusFilter === 'completed') matchesStatus = isComplete;
        if (statusFilter === 'pending') matchesStatus = !isComplete;

        return matchesQuery && matchesRegion && matchesStatus;
      })
      .sort((a, b) => {
        const scoreA = scoresMap[a.id]?.totalScore || 0;
        const scoreB = scoresMap[b.id]?.totalScore || 0;

        if (sortBy === 'score_desc') return scoreB - scoreA || a.id - b.id;
        if (sortBy === 'score_asc') return scoreA - scoreB || a.id - b.id;
        return a.id - b.id;
      });
  }, [videos, searchQuery, selectedRegion, statusFilter, sortBy, scoresMap]);

  const scrollToVideo = (id: number) => {
    const el = document.getElementById(`video-card-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Stat Ribbon */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Progress Indicator */}
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
              <svg className="w-14 h-14 transform -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-slate-100"
                  fill="transparent"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-amber-500 transition-all duration-300"
                  strokeDasharray={138}
                  strokeDashoffset={138 - (138 * stats.percent) / 100}
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-xs font-mono font-bold text-slate-800">
                {stats.percent}%
              </span>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Progres Penilaian Mandiri
              </div>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                <span className="text-blue-900 font-extrabold">{completedCount}</span> dari{' '}
                {totalVideos} Video Selesai
              </div>
            </div>
          </div>

          <div className="hidden lg:block h-8 w-[1px] bg-slate-200"></div>

          {/* Metric Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Rata-Rata Nilai</span>
              <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
                {stats.avgScore}
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Nilai Tertinggi</span>
              <span className="text-base font-bold text-amber-600 font-mono tabular-nums">
                {stats.maxScore}
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
              <span className="text-slate-500 block text-[11px]">Sisa Perlu Dinilai</span>
              <span className="text-base font-bold text-slate-700 font-mono tabular-nums">
                {totalVideos - completedCount} Video
              </span>
            </div>
          </div>

          {/* Quick Status Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({totalVideos})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer whitespace-nowrap ${
                statusFilter === 'pending'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Belum ({totalVideos - completedCount})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer whitespace-nowrap ${
                statusFilter === 'completed'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Selesai ({completedCount})
            </button>
          </div>
        </div>

        {/* Quick Jump Rail for Video #1 - #21 */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
          <span className="text-[11px] text-slate-400 font-medium shrink-0 mr-1">
            Lompat ke Video:
          </span>
          {videos.map((v) => {
            const isDone = isVideoEvaluationComplete(scoresMap[v.id]?.scores || {});
            const hasSomeScore = (scoresMap[v.id]?.totalScore || 0) > 0;
            return (
              <button
                key={v.id}
                onClick={() => scrollToVideo(v.id)}
                className={`w-7 h-7 rounded-lg text-[11px] font-mono font-bold flex items-center justify-center shrink-0 transition cursor-pointer ${
                  isDone
                    ? 'bg-emerald-600 text-white'
                    : hasSomeScore
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                title={`Video #${v.id}: ${v.title} (${isDone ? 'Selesai' : 'Belum Lengkap'})`}
              >
                {v.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari desa, kabupaten, atau judul video..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-600 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Hapus
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap sm:flex-nowrap">
          {/* Region Filter */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full sm:w-auto text-xs bg-slate-50 border border-slate-200 rounded-xl py-2 px-2.5 text-slate-700 focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              {REGIONS_LIST.map((reg) => (
                <option key={reg} value={reg}>
                  {reg}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full sm:w-auto text-xs bg-slate-50 border border-slate-200 rounded-xl py-2 px-2.5 text-slate-700 focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="id">Urut Nomor (1–21)</option>
              <option value="score_desc">Nilai Tertinggi ke Terendah</option>
              <option value="score_asc">Nilai Terendah ke Tertinggi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Videos List Container */}
      <div className="space-y-5">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <VideoItemCard
              key={video.id}
              video={video}
              evaluation={scoresMap[video.id]}
              onUpdateScore={onUpdateScore}
              onUpdateNotes={onUpdateNotes}
              onUpdateRecommendation={onUpdateRecommendation}
              onQuickPreset={onQuickPreset}
              onReset={onReset}
            />
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">
              Tidak Ada Video yang Sesuai
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Tidak ditemukan video untuk kata kunci atau filter yang Anda pilih. Silakan atur ulang pencarian atau filter status.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedRegion('Semua Wilayah');
                setStatusFilter('all');
              }}
              className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
