import React, { useState } from 'react';
import { Database, Download, Upload, Trash2, X, Check, AlertTriangle } from 'lucide-react';
import { JudgeScoresMap } from '../types';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  getAllDataJSON: () => string;
  onImportDataJSON: (jsonStr: string) => boolean;
  onResetAllData: () => void;
}

export const DataManagementModal: React.FC<DataManagementModalProps> = ({
  isOpen,
  onClose,
  getAllDataJSON,
  onImportDataJSON,
  onResetAllData,
}) => {
  const [importText, setImportText] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  if (!isOpen) return null;

  const handleDownloadBackup = () => {
    const dataStr = getAllDataJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `APDW_Sumsel_2026_Penjurian_Backup_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setFeedback({
      type: 'success',
      message: 'File cadangan JSON berhasil diunduh ke komputer Anda.',
    });
  };

  const handleImport = () => {
    if (!importText.trim()) {
      setFeedback({ type: 'error', message: 'Silakan tempel teks JSON terlebih dahulu.' });
      return;
    }

    const success = onImportDataJSON(importText);
    if (success) {
      setFeedback({
        type: 'success',
        message: 'Data berhasil dipulihkan! Semua nilai juri telah dimuat.',
      });
      setImportText('');
    } else {
      setFeedback({
        type: 'error',
        message: 'Format JSON tidak valid atau data rusak. Mohon periksa kembali.',
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = onImportDataJSON(content);
        if (success) {
          setFeedback({
            type: 'success',
            message: `File "${file.name}" berhasil diimpor! Data nilai telah dimuat.`,
          });
        } else {
          setFeedback({
            type: 'error',
            message: 'Gagal memproses file. Pastikan file adalah format JSON cadangan APDW.',
          });
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
              <Database className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif text-slate-900">
                Manajemen Cadangan & Sinkronisasi Data
              </h3>
              <p className="text-xs text-slate-500">
                Ekspor atau impor data nilai seluruh dewan juri
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {feedback && (
          <div
            className={`mt-4 p-3 rounded-xl border text-xs flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {feedback.type === 'success' ? (
              <Check className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <div className="mt-6 space-y-6 text-xs text-slate-700">
          {/* Export Section */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-700" />
              1. Unduh File Cadangan Nilai (JSON)
            </h4>
            <p className="text-slate-500 text-[11px]">
              Simpan seluruh rekaman nilai dan catatan dari semua dewan juri ke dalam satu file berkas digital. File ini dapat Anda kirimkan ke sekretariat atau dibuka di komputer lain.
            </p>
            <button
              onClick={handleDownloadBackup}
              className="mt-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Unduh File Cadangan (.json)</span>
            </button>
          </div>

          {/* Import Section */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-700" />
              2. Pulihkan / Impor File Cadangan
            </h4>
            <p className="text-slate-500 text-[11px]">
              Pilih file .json hasil ekspor sebelumnya atau tempelkan teks JSON untuk memulihkan lembar penilaian.
            </p>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Unggah File JSON:
              </label>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-900 file:text-white hover:file:bg-blue-800 cursor-pointer"
              />
            </div>

            <div className="pt-2">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Atau Tempel Teks Cadangan JSON:
              </label>
              <textarea
                rows={3}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder='{"judge_1": {...}}'
                className="w-full text-xs font-mono p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
              />
              <button
                onClick={handleImport}
                className="mt-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold transition cursor-pointer"
              >
                Terapkan Data JSON
              </button>
            </div>
          </div>

          {/* Danger Zone: Reset */}
          <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 space-y-2">
            <h4 className="font-bold text-rose-900 text-sm flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-600" />
              3. Bersihkan Seluruh Data Penilaian
            </h4>
            <p className="text-rose-700 text-[11px]">
              Tindakan ini akan mengosongkan seluruh nilai dan catatan dari semua dewan juri di peramban ini. Pastikan Anda telah mengunduh cadangan terlebih dahulu jika diperlukan.
            </p>
            <button
              onClick={() => {
                if (
                  confirm(
                    'PERINGATAN: Apakah Anda yakin ingin menghapus seluruh data penilaian di peramban ini?'
                  )
                ) {
                  onResetAllData();
                  setFeedback({
                    type: 'success',
                    message: 'Seluruh data lokal telah dibersihkan.',
                  });
                }
              }}
              className="mt-2 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition cursor-pointer text-xs"
            >
              Kosongkan Seluruh Data
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
