import React from 'react';
import { VideoEntry, AspectScores, RecommendationType, VideoEvaluation } from '../types';
import { SCORING_WEIGHTS, calculateTotalScore, isVideoEvaluationComplete } from '../data/judgesAndVideos';
import { ExternalLink, Instagram, MapPin, CheckCircle, RotateCcw, Sparkles } from 'lucide-react';

interface VideoItemCardProps {
  video: VideoEntry;
  evaluation?: VideoEvaluation;
  onUpdateScore: (videoId: number, aspect: keyof AspectScores, value: number | '') => void;
  onUpdateNotes: (videoId: number, notes: string) => void;
  onUpdateRecommendation: (videoId: number, recommendation: RecommendationType) => void;
  onQuickPreset: (videoId: number, score: number) => void;
  onReset: (videoId: number) => void;
}

export const VideoItemCard: React.FC<VideoItemCardProps> = ({
  video,
  evaluation,
  onUpdateScore,
  onUpdateNotes,
  onUpdateRecommendation,
  onQuickPreset,
  onReset,
}) => {
  const scores = evaluation?.scores || {};
  const total = calculateTotalScore(scores);
  const isComplete = isVideoEvaluationComplete(scores);

  const handleScoreChange = (aspect: keyof AspectScores, rawVal: string) => {
    if (rawVal === '') {
      onUpdateScore(video.id, aspect, '');
      return;
    }
    const parsed = parseFloat(rawVal);
    if (isNaN(parsed)) {
      onUpdateScore(video.id, aspect, '');
    } else {
      const clamped = Math.min(100, Math.max(0, parsed));
      onUpdateScore(video.id, aspect, clamped);
    }
  };

  const handleStep = (aspect: keyof AspectScores, delta: number) => {
    const current = typeof scores[aspect] === 'number' ? (scores[aspect] as number) : 75;
    const next = Math.min(100, Math.max(0, current + delta));
    onUpdateScore(video.id, aspect, next);
  };

  return (
    <article
      id={`video-card-${video.id}`}
      className={`bg-white rounded-2xl border transition-shadow duration-200 overflow-hidden shadow-xs ${
        isComplete ? 'border-emerald-200/90' : 'border-slate-200'
      }`}
    >
      {/* Card Header */}
      <div className="bg-slate-50/80 p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 ${
              isComplete
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 text-amber-400'
            }`}
          >
            {isComplete ? <CheckCircle className="w-5 h-5" /> : `#${video.id}`}
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span className="font-semibold text-blue-900">{video.region}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="truncate max-w-[260px] sm:max-w-md">{video.location}</span>
              </span>
            </div>

            <h3 className="font-serif font-bold text-slate-900 text-base sm:text-lg leading-snug">
              {video.title}
            </h3>

            {video.keyHighlights && video.keyHighlights.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-[11px] text-slate-500">
                <span className="text-slate-400">Potensi:</span>
                {video.keyHighlights.map((hl, i) => (
                  <span key={i} className="text-slate-600">
                    {hl}
                    {i < video.keyHighlights!.length - 1 ? ' ·' : ''}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Button & Total Score Widget */}
        <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-200">
          <a
            href={video.link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-2 transition"
          >
            <Instagram className="w-4 h-4 text-rose-600" />
            <span>Tonton Video Instagram</span>
            <ExternalLink className="w-3 h-3 text-rose-500" />
          </a>

          <div className="bg-slate-900 text-white px-4 py-1.5 rounded-xl text-center border border-slate-800 min-w-[96px] shadow-xs">
            <span className="block text-[9px] uppercase tracking-wider text-amber-400 font-bold">
              Total Skor
            </span>
            <span className="text-xl font-extrabold text-amber-400 font-mono tabular-nums">
              {total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Card Body: 7 Aspect Inputs */}
      <div className="p-4 sm:p-6 space-y-5">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Nilai Komponen (Rentang 0 – 100)
            </div>

            {/* Quick Fill Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <span className="text-slate-400 hidden sm:inline">Set Nilai:</span>
              <button
                type="button"
                onClick={() => onQuickPreset(video.id, 90)}
                className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition font-medium cursor-pointer"
                title="Isi semua aspek 90 (Unggul)"
              >
                90 (Unggul)
              </button>
              <button
                type="button"
                onClick={() => onQuickPreset(video.id, 85)}
                className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 transition font-medium cursor-pointer"
                title="Isi semua aspek 85 (Sangat Baik)"
              >
                85 (Sangat Baik)
              </button>
              <button
                type="button"
                onClick={() => onQuickPreset(video.id, 80)}
                className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition font-medium cursor-pointer"
                title="Isi semua aspek 80 (Baik)"
              >
                80 (Baik)
              </button>
              <button
                type="button"
                onClick={() => onReset(video.id)}
                className="px-2 py-0.5 rounded text-slate-400 hover:text-rose-600 transition flex items-center gap-1 cursor-pointer"
                title="Kosongkan nilai video ini"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* 7 Aspect Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {/* Cerita 35% */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus-within:border-blue-600 transition">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold text-slate-800">Cerita</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">
                  35%
                </span>
              </div>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="0–100"
                value={scores.cerita !== undefined ? scores.cerita : ''}
                onChange={(e) => handleScoreChange('cerita', e.target.value)}
                className="w-full text-center font-bold text-slate-900 bg-white border border-slate-300 rounded-lg py-1 px-1.5 text-sm font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <div className="flex justify-between mt-1 text-[10px] text-slate-400">
                <button
                  type="button"
                  onClick={() => handleStep('cerita', -5)}
                  className="hover:text-slate-800 px-1 font-mono"
                >
                  -5
                </button>
                <button
                  type="button"
                  onClick={() => handleStep('cerita', +5)}
                  className="hover:text-slate-800 px-1 font-mono"
                >
                  +5
                </button>
              </div>
            </div>

            {/* Budaya 15% */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus-within:border-blue-600 transition">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold text-slate-800">Budaya</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">
                  15%
                </span>
              </div>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="0–100"
                value={scores.budaya !== undefined ? scores.budaya : ''}
                onChange={(e) => handleScoreChange('budaya', e.target.value)}
                className="w-full text-center font-bold text-slate-900 bg-white border border-slate-300 rounded-lg py-1 px-1.5 text-sm font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <div className="flex justify-between mt-1 text-[10px] text-slate-400">
                <button
                  type="button"
                  onClick={() => handleStep('budaya', -5)}
                  className="hover:text-slate-800 px-1 font-mono"
                >
                  -5
                </button>
                <button
                  type="button"
                  onClick={() => handleStep('budaya', +5)}
                  className="hover:text-slate-800 px-1 font-mono"
                >
                  +5
                </button>
              </div>
            </div>

            {/* Potensi 15% */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus-within:border-blue-600 transition">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold text-slate-800">Potensi</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">
                  15%
                </span>
              </div>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="0–100"
                value={scores.potensi !== undefined ? scores.potensi : ''}
                onChange={(e) => handleScoreChange('potensi', e.target.value)}
                className="w-full text-center font-bold text-slate-900 bg-white border border-slate-300 rounded-lg py-1 px-1.5 text-sm font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <div className="flex justify-between mt-1 text-[10px] text-slate-400">
                <button
                  type="button"
                  onClick={() => handleStep('potensi', -5)}
                  className="hover:text-slate-800 px-1 font-mono"
                >
                  -5
                </button>
                <button
                  type="button"
                  onClick={() => handleStep('potensi', +5)}
                  className="hover:text-slate-800 px-1 font-mono"
                >
                  +5
                </button>
              </div>
            </div>

            {/* Visual 15% */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus-within:border-blue-600 transition">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold text-slate-800">Visual</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">
                  15%
                </span>
              </div>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="0–100"
                value={scores.visual !== undefined ? scores.visual : ''}
                onChange={(e) => handleScoreChange('visual', e.target.value)}
                className="w-full text-center font-bold text-slate-900 bg-white border border-slate-300 rounded-lg py-1 px-1.5 text-sm font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <div className="flex justify-between mt-1 text-[10px] text-slate-400">
                <button
                  type="button"
                  onClick={() => handleStep('visual', -5)}
                  className="hover:text-slate-800 px-1 font-mono"
                >
                  -5
                </button>
                <button
                  type="button"
                  onClick={() => handleStep('visual', +5)}
                  className="hover:text-slate-800 px-1 font-mono"
                >
                  +5
                </button>
              </div>
            </div>

            {/* Audio 10% */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus-within:border-blue-600 transition">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold text-slate-800">Audio</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">
                  10%
                </span>
              </div>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="0–100"
                value={scores.audio !== undefined ? scores.audio : ''}
                onChange={(e) => handleScoreChange('audio', e.target.value)}
                className="w-full text-center font-bold text-slate-900 bg-white border border-slate-300 rounded-lg py-1 px-1.5 text-sm font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <div className="flex justify-between mt-1 text-[10px] text-slate-400">
                <button
                  type="button"
                  onClick={() => handleStep('audio', -5)}
                  className="hover:text-slate-800 px-1 font-mono"
                >
                  -5
                </button>
                <button
                  type="button"
                  onClick={() => handleStep('audio', +5)}
                  className="hover:text-slate-800 px-1 font-mono"
                >
                  +5
                </button>
              </div>
            </div>

            {/* Editing 5% */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus-within:border-blue-600 transition">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold text-slate-800">Editing</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">
                  5%
                </span>
              </div>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="0–100"
                value={scores.editing !== undefined ? scores.editing : ''}
                onChange={(e) => handleScoreChange('editing', e.target.value)}
                className="w-full text-center font-bold text-slate-900 bg-white border border-slate-300 rounded-lg py-1 px-1.5 text-sm font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <div className="flex justify-between mt-1 text-[10px] text-slate-400">
                <button
                  type="button"
                  onClick={() => handleStep('editing', -5)}
                  className="hover:text-slate-800 px-1 font-mono"
                >
                  -5
                </button>
                <button
                  type="button"
                  onClick={() => handleStep('editing', +5)}
                  className="hover:text-slate-800 px-1 font-mono"
                >
                  +5
                </button>
              </div>
            </div>

            {/* Promosi 5% */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus-within:border-blue-600 transition">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold text-slate-800">Promosi</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">
                  5%
                </span>
              </div>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="0–100"
                value={scores.promosi !== undefined ? scores.promosi : ''}
                onChange={(e) => handleScoreChange('promosi', e.target.value)}
                className="w-full text-center font-bold text-slate-900 bg-white border border-slate-300 rounded-lg py-1 px-1.5 text-sm font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <div className="flex justify-between mt-1 text-[10px] text-slate-400">
                <button
                  type="button"
                  onClick={() => handleStep('promosi', -5)}
                  className="hover:text-slate-800 px-1 font-mono"
                >
                  -5
                </button>
                <button
                  type="button"
                  onClick={() => handleStep('promosi', +5)}
                  className="hover:text-slate-800 px-1 font-mono"
                >
                  +5
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Qualitative Notes & Recommendation Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          <div className="lg:col-span-2">
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              Catatan Kualitatif, Kekuatan & Masukan Dewan Juri:
            </label>
            <textarea
              rows={2}
              value={evaluation?.notes || ''}
              onChange={(e) => onUpdateNotes(video.id, e.target.value)}
              placeholder="Tuliskan catatan khusus terkait orisinalitas cerita, kejelasan voice-over, eksposur potensi desa, atau catatan teknis video..."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-600 text-slate-800 resize-y"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              Rekomendasi Pleno:
            </label>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() =>
                  onUpdateRecommendation(
                    video.id,
                    evaluation?.recommendation === 'calon_juara' ? '' : 'calon_juara'
                  )
                }
                className={`p-2 rounded-lg text-left border transition text-[11px] font-semibold cursor-pointer ${
                  evaluation?.recommendation === 'calon_juara'
                    ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                Unggulan Juara
              </button>

              <button
                type="button"
                onClick={() =>
                  onUpdateRecommendation(
                    video.id,
                    evaluation?.recommendation === 'nominasi' ? '' : 'nominasi'
                  )
                }
                className={`p-2 rounded-lg text-left border transition text-[11px] font-semibold cursor-pointer ${
                  evaluation?.recommendation === 'nominasi'
                    ? 'bg-blue-600 text-white border-blue-700 font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                Nominasi 5 Besar
              </button>

              <button
                type="button"
                onClick={() =>
                  onUpdateRecommendation(
                    video.id,
                    evaluation?.recommendation === 'potensial' ? '' : 'potensial'
                  )
                }
                className={`p-2 rounded-lg text-left border transition text-[11px] font-semibold cursor-pointer ${
                  evaluation?.recommendation === 'potensial'
                    ? 'bg-emerald-600 text-white border-emerald-700 font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                Potensial
              </button>

              <button
                type="button"
                onClick={() =>
                  onUpdateRecommendation(
                    video.id,
                    evaluation?.recommendation === 'perlu_pembinaan'
                      ? ''
                      : 'perlu_pembinaan'
                  )
                }
                className={`p-2 rounded-lg text-left border transition text-[11px] font-semibold cursor-pointer ${
                  evaluation?.recommendation === 'perlu_pembinaan'
                    ? 'bg-rose-600 text-white border-rose-700 font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                Perlu Pembinaan
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
