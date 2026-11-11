import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Judge, AspectScores, RecommendationType, JudgeScoresMap, VideoEvaluation } from './types';
import {
  OFFICIAL_JUDGES,
  VIDEO_ENTRIES,
  calculateTotalScore,
  isVideoEvaluationComplete,
} from './data/judgesAndVideos';
import { Header } from './components/Header';
import { ScoringWorkspace } from './components/ScoringWorkspace';
import { RecapTable } from './components/RecapTable';
import { PlenoBoard } from './components/PlenoBoard';
import { GuideModal } from './components/GuideModal';
import { JudgeSelectorModal } from './components/JudgeSelectorModal';
import { DataManagementModal } from './components/DataManagementModal';
import { Check, ShieldCheck, MapPin, Award } from 'lucide-react';

const STORAGE_KEY_PREFIX = 'APDW_2026_SCORES_JUDGE_';
const ACTIVE_JUDGE_KEY = 'APDW_2026_ACTIVE_JUDGE';

export default function App() {
  const [currentJudgeId, setCurrentJudgeId] = useState<number | null>(() => {
    const saved = localStorage.getItem(ACTIVE_JUDGE_KEY);
    return saved ? parseInt(saved, 10) : 1; // Default to Judge 1 (Feby Yoland)
  });

  const [activeTab, setActiveTab] = useState<'scoring' | 'recap' | 'pleno'>('scoring');
  const [isJudgeModalOpen, setIsJudgeModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // In-memory cache for all judges' scores
  const [allJudgesScores, setAllJudgesScores] = useState<Record<number, JudgeScoresMap>>({});

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  }, []);

  // Load scores for a specific judge from localStorage
  const loadJudgeScoresFromStorage = useCallback((judgeId: number): JudgeScoresMap => {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${judgeId}`);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error('Error loading scores for judge', judgeId, e);
    }
    return {};
  }, []);

  // Save scores for a specific judge to localStorage
  const saveJudgeScoresToStorage = useCallback(
    (judgeId: number, scores: JudgeScoresMap) => {
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}${judgeId}`, JSON.stringify(scores));
      } catch (e) {
        console.error('Error saving scores for judge', judgeId, e);
      }
    },
    []
  );

  // Initialize and load all judges scores on mount
  useEffect(() => {
    const loaded: Record<number, JudgeScoresMap> = {};
    OFFICIAL_JUDGES.forEach((j) => {
      loaded[j.id] = loadJudgeScoresFromStorage(j.id);
    });
    setAllJudgesScores(loaded);
  }, [loadJudgeScoresFromStorage]);

  // Current judge scores map
  const currentScoresMap: JudgeScoresMap = useMemo(() => {
    if (!currentJudgeId) return {};
    return allJudgesScores[currentJudgeId] || {};
  }, [currentJudgeId, allJudgesScores]);

  const currentJudge = useMemo(() => {
    return OFFICIAL_JUDGES.find((j) => j.id === currentJudgeId) || null;
  }, [currentJudgeId]);

  // Select a new active judge
  const handleSelectJudge = useCallback((judgeId: number) => {
    setCurrentJudgeId(judgeId);
    localStorage.setItem(ACTIVE_JUDGE_KEY, judgeId.toString());
    setIsJudgeModalOpen(false);
    showToast(`Beralih ke Dewan Juri: ${OFFICIAL_JUDGES.find((j) => j.id === judgeId)?.name}`);
  }, [showToast]);

  // Update a single aspect score for current judge
  const handleUpdateScore = useCallback(
    (videoId: number, aspect: keyof AspectScores, value: number | '') => {
      if (!currentJudgeId) return;

      setAllJudgesScores((prev) => {
        const judgeMap = { ...(prev[currentJudgeId] || {}) };
        const prevEval = judgeMap[videoId] || {
          scores: {},
          totalScore: 0,
          notes: '',
          recommendation: '',
        };

        const updatedScores: AspectScores = {
          ...prevEval.scores,
          [aspect]: value,
        };

        const newTotal = calculateTotalScore(updatedScores);

        judgeMap[videoId] = {
          ...prevEval,
          scores: updatedScores,
          totalScore: newTotal,
          updatedAt: new Date().toISOString(),
        };

        saveJudgeScoresToStorage(currentJudgeId, judgeMap);

        return {
          ...prev,
          [currentJudgeId]: judgeMap,
        };
      });
    },
    [currentJudgeId, saveJudgeScoresToStorage]
  );

  // Update qualitative notes
  const handleUpdateNotes = useCallback(
    (videoId: number, notes: string) => {
      if (!currentJudgeId) return;

      setAllJudgesScores((prev) => {
        const judgeMap = { ...(prev[currentJudgeId] || {}) };
        const prevEval = judgeMap[videoId] || {
          scores: {},
          totalScore: 0,
          notes: '',
          recommendation: '',
        };

        judgeMap[videoId] = {
          ...prevEval,
          notes,
          updatedAt: new Date().toISOString(),
        };

        saveJudgeScoresToStorage(currentJudgeId, judgeMap);

        return {
          ...prev,
          [currentJudgeId]: judgeMap,
        };
      });
    },
    [currentJudgeId, saveJudgeScoresToStorage]
  );

  // Update recommendation status
  const handleUpdateRecommendation = useCallback(
    (videoId: number, recommendation: RecommendationType) => {
      if (!currentJudgeId) return;

      setAllJudgesScores((prev) => {
        const judgeMap = { ...(prev[currentJudgeId] || {}) };
        const prevEval = judgeMap[videoId] || {
          scores: {},
          totalScore: 0,
          notes: '',
          recommendation: '',
        };

        judgeMap[videoId] = {
          ...prevEval,
          recommendation,
          updatedAt: new Date().toISOString(),
        };

        saveJudgeScoresToStorage(currentJudgeId, judgeMap);

        return {
          ...prev,
          [currentJudgeId]: judgeMap,
        };
      });
    },
    [currentJudgeId, saveJudgeScoresToStorage]
  );

  // Quick preset filler (e.g. set all 7 aspects to 85)
  const handleQuickPreset = useCallback(
    (videoId: number, score: number) => {
      if (!currentJudgeId) return;

      setAllJudgesScores((prev) => {
        const judgeMap = { ...(prev[currentJudgeId] || {}) };
        const prevEval = judgeMap[videoId] || {
          scores: {},
          totalScore: 0,
          notes: '',
          recommendation: '',
        };

        const updatedScores: AspectScores = {
          cerita: score,
          budaya: score,
          potensi: score,
          visual: score,
          audio: score,
          editing: score,
          promosi: score,
        };

        const newTotal = calculateTotalScore(updatedScores);

        judgeMap[videoId] = {
          ...prevEval,
          scores: updatedScores,
          totalScore: newTotal,
          updatedAt: new Date().toISOString(),
        };

        saveJudgeScoresToStorage(currentJudgeId, judgeMap);
        return {
          ...prev,
          [currentJudgeId]: judgeMap,
        };
      });
      showToast(`Video #${videoId} diset ke nilai ${score}`);
    },
    [currentJudgeId, saveJudgeScoresToStorage, showToast]
  );

  // Reset evaluation for single video
  const handleResetVideo = useCallback(
    (videoId: number) => {
      if (!currentJudgeId) return;

      setAllJudgesScores((prev) => {
        const judgeMap = { ...(prev[currentJudgeId] || {}) };
        delete judgeMap[videoId];
        saveJudgeScoresToStorage(currentJudgeId, judgeMap);
        return {
          ...prev,
          [currentJudgeId]: judgeMap,
        };
      });
      showToast(`Nilai Video #${videoId} telah dikosongkan`);
    },
    [currentJudgeId, saveJudgeScoresToStorage, showToast]
  );

  // Calculate completed count for a judge
  const getJudgeCompletedCount = useCallback(
    (judgeId: number): number => {
      const map = allJudgesScores[judgeId] || {};
      let count = 0;
      VIDEO_ENTRIES.forEach((v) => {
        if (isVideoEvaluationComplete(map[v.id]?.scores || {})) {
          count++;
        }
      });
      return count;
    },
    [allJudgesScores]
  );

  // Seed sample evaluations for testing plenary review
  const handleSeedSamplePlenoData = useCallback(() => {
    // Generate realistic sample scores for judges other than the current judge (or all if empty)
    const newAll: Record<number, JudgeScoresMap> = { ...allJudgesScores };

    OFFICIAL_JUDGES.forEach((judge) => {
      // If judge is not the active one or has no scores yet
      if (judge.id !== currentJudgeId || Object.keys(newAll[judge.id] || {}).length === 0) {
        const jMap: JudgeScoresMap = {};
        VIDEO_ENTRIES.forEach((v) => {
          // Semi-randomized realistic base between 78 and 94
          const base = 80 + ((v.id * 7 + judge.id * 11) % 15);
          const jitter = (fieldOffset: number) =>
            Math.min(98, Math.max(70, base + (((v.id + fieldOffset) % 7) - 3)));

          const scores: AspectScores = {
            cerita: jitter(1),
            budaya: jitter(2),
            potensi: jitter(3),
            visual: jitter(4),
            audio: jitter(5),
            editing: jitter(6),
            promosi: jitter(7),
          };

          const total = calculateTotalScore(scores);
          let rec: RecommendationType = '';
          if (total >= 90) rec = 'calon_juara';
          else if (total >= 86) rec = 'nominasi';
          else if (total >= 80) rec = 'potensial';

          jMap[v.id] = {
            scores,
            totalScore: total,
            notes: `Evaluasi #${v.id}: ${v.keyHighlights?.join(', ')}. Konten audio visual menarik.`,
            recommendation: rec,
            updatedAt: new Date().toISOString(),
          };
        });

        newAll[judge.id] = jMap;
        saveJudgeScoresToStorage(judge.id, jMap);
      }
    });

    setAllJudgesScores(newAll);
    showToast('Simulasi data 6 dewan juri berhasil dimuat untuk Sidang Pleno!');
  }, [allJudgesScores, currentJudgeId, saveJudgeScoresToStorage, showToast]);

  const handleClearOtherJudgesData = useCallback(() => {
    const newAll: Record<number, JudgeScoresMap> = {};
    if (currentJudgeId) {
      newAll[currentJudgeId] = allJudgesScores[currentJudgeId] || {};
    }
    OFFICIAL_JUDGES.forEach((j) => {
      if (j.id !== currentJudgeId) {
        localStorage.removeItem(`${STORAGE_KEY_PREFIX}${j.id}`);
      }
    });
    setAllJudgesScores(newAll);
    showToast('Data juri lainnya telah dibersihkan.');
  }, [allJudgesScores, currentJudgeId, showToast]);

  const handleResetAllData = useCallback(() => {
    OFFICIAL_JUDGES.forEach((j) => {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}${j.id}`);
    });
    setAllJudgesScores({});
    showToast('Seluruh data penilaian telah dibersihkan.');
  }, [showToast]);

  const handleGetAllDataJSON = useCallback(() => {
    return JSON.stringify(allJudgesScores, null, 2);
  }, [allJudgesScores]);

  const handleImportDataJSON = useCallback(
    (jsonStr: string): boolean => {
      try {
        const parsed = JSON.parse(jsonStr);
        if (typeof parsed === 'object' && parsed !== null) {
          OFFICIAL_JUDGES.forEach((j) => {
            if (parsed[j.id]) {
              saveJudgeScoresToStorage(j.id, parsed[j.id]);
            }
          });
          setAllJudgesScores(parsed);
          showToast('Data berhasil diimpor!');
          return true;
        }
      } catch (e) {
        console.error('Import error:', e);
      }
      return false;
    },
    [saveJudgeScoresToStorage, showToast]
  );

  const completedCount = useMemo(() => {
    if (!currentJudgeId) return 0;
    return getJudgeCompletedCount(currentJudgeId);
  }, [currentJudgeId, getJudgeCompletedCount]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 antialiased selection:bg-amber-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2.5 text-xs font-semibold animate-fade-in no-print">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main App Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentJudge={currentJudge}
        onOpenJudgeSelector={() => setIsJudgeModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        onOpenDataModal={() => setIsDataModalOpen(true)}
        completedCount={completedCount}
        totalVideos={VIDEO_ENTRIES.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Banner Informing Current Judge & Event Context */}
        {currentJudge && (
          <div className="mb-6 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-900 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
                {currentJudge.badge}
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-blue-900">
                    Dewan Juri Terautentikasi
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{currentJudge.agency}</span>
                </div>
                <h2 className="text-base font-bold font-serif text-slate-900">
                  {currentJudge.name}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Penyimpanan Mandiri Otomatis</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Scoring Workspace */}
        {activeTab === 'scoring' && (
          <ScoringWorkspace
            videos={VIDEO_ENTRIES}
            scoresMap={currentScoresMap}
            onUpdateScore={handleUpdateScore}
            onUpdateNotes={handleUpdateNotes}
            onUpdateRecommendation={handleUpdateRecommendation}
            onQuickPreset={handleQuickPreset}
            onReset={handleResetVideo}
            completedCount={completedCount}
            totalVideos={VIDEO_ENTRIES.length}
          />
        )}

        {/* Tab 2: Recap Table & Official Print View */}
        {activeTab === 'recap' && currentJudge && (
          <RecapTable
            currentJudge={currentJudge}
            videos={VIDEO_ENTRIES}
            scoresMap={currentScoresMap}
            onSelectVideoToScore={(vId) => {
              setActiveTab('scoring');
              setTimeout(() => {
                const el = document.getElementById(`video-card-${vId}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }, 100);
            }}
          />
        )}

        {/* Tab 3: Pleno Board (Aggregate for 6 Judges) */}
        {activeTab === 'pleno' && (
          <PlenoBoard
            videos={VIDEO_ENTRIES}
            getAllJudgeScores={() => allJudgesScores}
            onSeedSamplePlenoData={handleSeedSamplePlenoData}
            onClearOtherJudgesData={handleClearOtherJudgesData}
            activeJudgeId={currentJudgeId || 1}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 mt-16 border-t border-slate-800 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <p className="font-serif font-bold text-white text-sm">
                  Anugerah Pesona Desa Wisata (APDW) Sumatera Selatan 2026
                </p>
                <p className="text-[11px] text-slate-400">
                  Dinas Kebudayaan dan Pariwisata Provinsi Sumatera Selatan
                </p>
              </div>
            </div>

            <div className="text-center md:text-right text-[11px] text-slate-400">
              <p>Sistem Penjurian Mandiri & Sidang Pleno Lomba Video Desa Wisata</p>
              <p className="mt-0.5 text-slate-500">
                Pemerintah Provinsi Sumatera Selatan &copy; 2026. Hak Cipta Dilindungi.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <JudgeSelectorModal
        isOpen={isJudgeModalOpen}
        onClose={() => setIsJudgeModalOpen(false)}
        currentJudgeId={currentJudgeId}
        onSelectJudge={handleSelectJudge}
        getJudgeCompletedCount={getJudgeCompletedCount}
      />

      <GuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      <DataManagementModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        getAllDataJSON={handleGetAllDataJSON}
        onImportDataJSON={handleImportDataJSON}
        onResetAllData={handleResetAllData}
      />
    </div>
  );
}
