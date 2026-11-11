import React from 'react';
import { X, BookOpen, CheckCircle, Award, Target, HelpCircle } from 'lucide-react';
import { SCORING_WEIGHTS } from '../data/judgesAndVideos';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif text-slate-900">
                Petunjuk Teknis & Rubrik Penilaian Video
              </h3>
              <p className="text-xs text-slate-500">
                Anugerah Pesona Desa Wisata (APDW) Sumatera Selatan 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 space-y-6 text-xs text-slate-700 leading-relaxed">
          {/* Key Question */}
          <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200">
            <div className="flex items-center gap-2 text-amber-900 font-bold mb-1 text-sm">
              <Target className="w-4 h-4 text-amber-600" />
              <span>Pertanyaan Kunci Wajib Dijawab Video:</span>
            </div>
            <p className="text-sm font-serif italic text-amber-950 pl-6">
              "Mengapa wisatawan perlu mengenal dan berkunjung ke desa wisata ini?"
            </p>
          </div>

          {/* Mandatory Video Rules */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Ketentuan Wajib Video Peserta:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block mb-0.5">Minimal 3 Potensi</span>
                <span className="text-slate-500 text-[11px]">
                  Menampilkan setidaknya 3 daya tarik utama (Alam, Budaya, Kerajinan, Kuliner, Homestay, atau Atraksi).
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block mb-0.5">Durasi 3–5 Menit</span>
                <span className="text-slate-500 text-[11px]">
                  Termasuk opening dan closing logo resmi pariwisata Sumatera Selatan.
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block mb-0.5">Format Landscape</span>
                <span className="text-slate-500 text-[11px]">
                  Orientasi horizontal sinematik rasio 16:9 dengan resolusi tajam.
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Aspect Weights */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-700" />
              Bobot & Rincian 7 Aspek Penilaian (Total 100%):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-900">1. Cerita & Kreativitas</span>
                  <span className="font-bold text-blue-700">35%</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Kekuatan alur narasi (storytelling), orisinalitas ide cerita, kedalaman pesan emosional, dan kejelasan pesan pariwisata.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-900">2. Nilai Budaya</span>
                  <span className="font-bold text-blue-700">15%</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Penggambaran kearifan lokal, adat istiadat, tradisi khas, seni daerah, dan interaksi hangat masyarakat desa.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-900">3. Potensi Desa</span>
                  <span className="font-bold text-blue-700">15%</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Eksplorasi keanekaragaman daya tarik wisata (bentang alam, kriya tradisi, kuliner lokal, fasilitas penginapan/homestay).
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-900">4. Kualitas Visual</span>
                  <span className="font-bold text-blue-700">15%</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Komposisi gambar, sinematografi, variasi angle (drone/ground), pencahayaan alami, pewarnaan (color grading), dan kestabilan kamera.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-900">5. Kualitas Audio</span>
                  <span className="font-bold text-blue-700">10%</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Kejelasan voice over/narasi, keselarasan musik pengiring khas daerah, keseimbangan mixing antara vokal dan backsound.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-900">6. Editing & Ritme</span>
                  <span className="font-bold text-blue-700">5%</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Kelancaran transisi antar scene, ritme potongan gambar sesuai tempo musik dan cerita, serta penempatan grafis/subtitle.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 sm:col-span-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-900">7. Daya Pikat Promosi (Call to Action)</span>
                  <span className="font-bold text-blue-700">5%</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Kemampuan video membangkitkan rasa penasaran dan keinginan berwisata nyata ke Sumatera Selatan, disertai informasi akses yang informatif.
                </p>
              </div>
            </div>
          </div>

          {/* Scoring Range Rubric */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-purple-700" />
              Pedoman Rentang Nilai (Skala 0 – 100):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-950">
                <span className="font-bold block text-emerald-800">90 – 100 (Istimewa)</span>
                Sangat unggul, standar promosi internasional/nasional, menyentuh dan sangat memikat.
              </div>
              <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-200 text-blue-950">
                <span className="font-bold block text-blue-800">80 – 89 (Sangat Baik)</span>
                Konsep matang, visual dan audio rapi, potensi desa tereksplorasi dengan baik.
              </div>
              <div className="p-2.5 bg-slate-100 rounded-lg border border-slate-300 text-slate-800">
                <span className="font-bold block text-slate-700">70 – 79 (Baik / Cukup)</span>
                Memenuhi syarat dasar, beberapa aspek visual atau narasi perlu sedikit penguatan.
              </div>
              <div className="p-2.5 bg-rose-50 rounded-lg border border-rose-200 text-rose-950">
                <span className="font-bold block text-rose-800">&lt; 70 (Kurang)</span>
                Belum memenuhi ketentuan utama, audio/visual tidak seimbang atau narasi kurang jelas.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl text-xs transition shadow-sm"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
