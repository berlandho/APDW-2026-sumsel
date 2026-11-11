import React, { useMemo } from 'react';
import { Judge, VideoEntry, JudgeScoresMap } from '../types';
import { calculateTotalScore, isVideoEvaluationComplete } from '../data/judgesAndVideos';
import { FileSpreadsheet, Printer, Award, Trophy, Medal, MessageSquareText } from 'lucide-react';

interface RecapTableProps {
  currentJudge: Judge;
  videos: VideoEntry[];
  scoresMap: JudgeScoresMap;
  onSelectVideoToScore: (videoId: number) => void;
}

export const RecapTable: React.FC<RecapTableProps> = ({
  currentJudge,
  videos,
  scoresMap,
  onSelectVideoToScore,
}) => {
  // Rank videos based on totalScore
  const rankedVideos = useMemo(() => {
    return [...videos].sort((a, b) => {
      const scoreA = scoresMap[a.id]?.totalScore || 0;
      const scoreB = scoresMap[b.id]?.totalScore || 0;
      return scoreB - scoreA || a.id - b.id;
    });
  }, [videos, scoresMap]);

  // Export to CSV with UTF-8 BOM
  const handleExportCSV = () => {
    const BOM = '\uFEFF';
    const headers = [
      'Peringkat',
      'No Video',
      'Judul Video',
      'Desa Wisata / Lokasi',
      'Kabupaten / Kota',
      'Cerita (35%)',
      'Budaya (15%)',
      'Potensi (15%)',
      'Visual (15%)',
      'Audio (10%)',
      'Editing (5%)',
      'Promosi (5%)',
      'TOTAL SKOR',
      'Rekomendasi Pleno',
      'Catatan Evaluasi Juri',
      'Link Video Instagram',
    ];

    const rows = rankedVideos.map((video, idx) => {
      const evalData = scoresMap[video.id];
      const scores = evalData?.scores || {};
      const total = evalData?.totalScore || 0;
      const notes = (evalData?.notes || '').replace(/"/g, '""');
      const rec = evalData?.recommendation || '-';

      return [
        idx + 1,
        video.id,
        `"${video.title.replace(/"/g, '""')}"`,
        `"${video.location.replace(/"/g, '""')}"`,
        `"${video.region.replace(/"/g, '""')}"`,
        scores.cerita !== undefined ? scores.cerita : 0,
        scores.budaya !== undefined ? scores.budaya : 0,
        scores.potensi !== undefined ? scores.potensi : 0,
        scores.visual !== undefined ? scores.visual : 0,
        scores.audio !== undefined ? scores.audio : 0,
        scores.editing !== undefined ? scores.editing : 0,
        scores.promosi !== undefined ? scores.promosi : 0,
        total.toFixed(2),
        `"${rec}"`,
        `"${notes}"`,
        `"${video.link}"`,
      ].join(';');
    });

    const metadataHeader = [
      `"LEMBAR PENILAIAN MANDIRI DEWAN JURI - APDW SUMSEL 2026"`,
      `"Nama Juri: ${currentJudge.name}"`,
      `"Instansi / Jabatan: ${currentJudge.role}"`,
      `"Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}"`,
      '',
    ].join('\n');

    const csvContent = BOM + metadataHeader + headers.join(';') + '\n' + rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `Rekap_Nilai_APDW_2026_${currentJudge.name.replace(/[^a-zA-Z0-9]/g, '_')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const todayFormatted = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-8">
      {/* Official Printed Header (Only visible on paper print) */}
      <div className="hidden print-only text-black border-b-2 border-black pb-4 mb-6">
        <div className="text-center font-serif">
          <h2 className="text-sm font-bold tracking-wider uppercase">
            Pemerintah Provinsi Sumatera Selatan
          </h2>
          <h1 className="text-base font-extrabold tracking-tight uppercase">
            Dinas Kebudayaan dan Pariwisata
          </h1>
          <p className="text-[10pt] font-sans text-gray-700">
            Jalan Demang Lebar Daun No. 235 Palembang, Sumatera Selatan | Laman: disbudpar.sumselprov.go.id
          </p>
        </div>
        <div className="border-t border-black my-2"></div>
        <div className="text-center mt-3">
          <h3 className="text-sm font-bold uppercase underline">
            Berita Acara & Rekapitulasi Penilaian Dewan Juri
          </h3>
          <p className="text-[10pt] font-semibold">
            Lomba Video Anugerah Pesona Desa Wisata (APDW) Provinsi Sumatera Selatan 2026
          </p>
          <div className="mt-2 text-[10pt] font-mono text-left inline-block">
            <p><strong>Nama Anggota Juri:</strong> {currentJudge.name}</p>
            <p><strong>Lembaga / Jabatan:</strong> {currentJudge.role}</p>
            <p><strong>Tanggal Penilaian:</strong> {todayFormatted}</p>
          </div>
        </div>
      </div>

      {/* Screen View Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-900 font-bold uppercase tracking-wider mb-1">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Rekapitulasi Resmi Penjurian Mandiri</span>
          </div>
          <h2 className="font-serif font-bold text-slate-900 text-xl sm:text-2xl">
            Peringkat & Lembar Hasil Nilai Juri
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Data penilaian atas nama dewan juri <strong className="text-slate-800">{currentJudge.name}</strong> ({currentJudge.role}).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-600 text-white flex items-center gap-2 transition cursor-pointer shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Ekspor Excel (CSV)</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2 transition cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>

      {/* Top 3 Podium Highlights (no-print) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 no-print">
        {/* Juara 1 */}
        {rankedVideos[0] && (
          <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl border-2 border-amber-300 p-5 shadow-xs relative overflow-hidden">
            <div className="absolute -right-3 -bottom-3 text-amber-200/50">
              <Trophy className="w-24 h-24" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center font-mono">
                1
              </span>
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Peringkat Pertama
              </span>
            </div>
            <h4 className="font-serif font-bold text-slate-900 text-sm line-clamp-2">
              {rankedVideos[0].title}
            </h4>
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">
              {rankedVideos[0].location}
            </p>
            <div className="mt-3 pt-3 border-t border-amber-200/60 flex items-center justify-between">
              <span className="text-xs text-slate-500">Skor Akhir:</span>
              <span className="font-mono text-xl font-extrabold text-amber-700">
                {(scoresMap[rankedVideos[0].id]?.totalScore || 0).toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Juara 2 */}
        {rankedVideos[1] && (
          <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-300 p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-7 h-7 rounded-lg bg-slate-400 text-white font-bold text-xs flex items-center justify-center font-mono">
                2
              </span>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Peringkat Kedua
              </span>
            </div>
            <h4 className="font-serif font-bold text-slate-900 text-sm line-clamp-2">
              {rankedVideos[1].title}
            </h4>
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">
              {rankedVideos[1].location}
            </p>
            <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">Skor Akhir:</span>
              <span className="font-mono text-xl font-extrabold text-slate-800">
                {(scoresMap[rankedVideos[1].id]?.totalScore || 0).toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Juara 3 */}
        {rankedVideos[2] && (
          <div className="bg-gradient-to-br from-amber-50/40 to-white rounded-2xl border border-amber-200 p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-7 h-7 rounded-lg bg-amber-700 text-white font-bold text-xs flex items-center justify-center font-mono">
                3
              </span>
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Peringkat Ketiga
              </span>
            </div>
            <h4 className="font-serif font-bold text-slate-900 text-sm line-clamp-2">
              {rankedVideos[2].title}
            </h4>
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">
              {rankedVideos[2].location}
            </p>
            <div className="mt-3 pt-3 border-t border-amber-200/50 flex items-center justify-between">
              <span className="text-xs text-slate-500">Skor Akhir:</span>
              <span className="font-mono text-xl font-extrabold text-amber-900">
                {(scoresMap[rankedVideos[2].id]?.totalScore || 0).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Recap Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold uppercase tracking-wider border-b border-slate-200 text-[11px]">
                <th className="p-3.5 text-center w-12">Rank</th>
                <th className="p-3.5 text-center w-12">No</th>
                <th className="p-3.5 min-w-[200px]">Desa Wisata / Kab-Kota</th>
                <th className="p-3.5 min-w-[220px]">Judul Karya Video</th>
                <th className="p-3 text-center">Cerita (35%)</th>
                <th className="p-3 text-center">Budaya (15%)</th>
                <th className="p-3 text-center">Potensi (15%)</th>
                <th className="p-3 text-center">Visual (15%)</th>
                <th className="p-3 text-center">Audio (10%)</th>
                <th className="p-3 text-center">Edit (5%)</th>
                <th className="p-3 text-center">Promo (5%)</th>
                <th className="p-3.5 text-center bg-amber-100 text-slate-950 font-extrabold border-x border-amber-200 min-w-[90px]">
                  TOTAL SKOR
                </th>
                <th className="p-3.5 text-center min-w-[130px] no-print">Rekomendasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {rankedVideos.map((video, idx) => {
                const evalData = scoresMap[video.id];
                const scores = evalData?.scores || {};
                const total = evalData?.totalScore || 0;
                const isComplete = isVideoEvaluationComplete(scores);

                return (
                  <tr
                    key={video.id}
                    className={`hover:bg-slate-50/80 transition ${
                      idx < 3 ? 'bg-amber-50/20' : ''
                    }`}
                  >
                    {/* Rank */}
                    <td className="p-3 text-center font-mono font-bold">
                      {idx === 0 ? (
                        <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 inline-flex items-center justify-center text-xs font-bold">
                          1
                        </span>
                      ) : idx === 1 ? (
                        <span className="w-6 h-6 rounded-full bg-slate-400 text-white inline-flex items-center justify-center text-xs font-bold">
                          2
                        </span>
                      ) : idx === 2 ? (
                        <span className="w-6 h-6 rounded-full bg-amber-700 text-white inline-flex items-center justify-center text-xs font-bold">
                          3
                        </span>
                      ) : (
                        <span className="text-slate-500">{idx + 1}</span>
                      )}
                    </td>

                    {/* Original Video ID */}
                    <td className="p-3 text-center font-mono font-bold text-slate-600">
                      #{video.id}
                    </td>

                    {/* Location */}
                    <td className="p-3 font-medium text-slate-900">
                      <span className="block font-semibold">{video.region}</span>
                      <span className="text-slate-500 text-[11px] line-clamp-1">
                        {video.location}
                      </span>
                    </td>

                    {/* Title */}
                    <td className="p-3 font-serif font-medium text-slate-800">
                      {video.title}
                    </td>

                    {/* 7 Aspect Scores */}
                    <td className="p-3 text-center font-mono tabular-nums text-slate-700">
                      {scores.cerita !== undefined ? scores.cerita : '-'}
                    </td>
                    <td className="p-3 text-center font-mono tabular-nums text-slate-700">
                      {scores.budaya !== undefined ? scores.budaya : '-'}
                    </td>
                    <td className="p-3 text-center font-mono tabular-nums text-slate-700">
                      {scores.potensi !== undefined ? scores.potensi : '-'}
                    </td>
                    <td className="p-3 text-center font-mono tabular-nums text-slate-700">
                      {scores.visual !== undefined ? scores.visual : '-'}
                    </td>
                    <td className="p-3 text-center font-mono tabular-nums text-slate-700">
                      {scores.audio !== undefined ? scores.audio : '-'}
                    </td>
                    <td className="p-3 text-center font-mono tabular-nums text-slate-700">
                      {scores.editing !== undefined ? scores.editing : '-'}
                    </td>
                    <td className="p-3 text-center font-mono tabular-nums text-slate-700">
                      {scores.promosi !== undefined ? scores.promosi : '-'}
                    </td>

                    {/* Total Score */}
                    <td className="p-3 text-center font-mono tabular-nums font-extrabold text-sm text-blue-950 bg-amber-50/60 border-x border-amber-200">
                      {total.toFixed(2)}
                    </td>

                    {/* Recommendation */}
                    <td className="p-3 text-center no-print">
                      {evalData?.recommendation === 'calon_juara' ? (
                        <span className="text-[11px] font-bold text-amber-800">
                          Unggulan Juara
                        </span>
                      ) : evalData?.recommendation === 'nominasi' ? (
                        <span className="text-[11px] font-bold text-blue-800">
                          Nominasi 5 Besar
                        </span>
                      ) : evalData?.recommendation === 'potensial' ? (
                        <span className="text-[11px] font-medium text-emerald-800">
                          Potensial
                        </span>
                      ) : evalData?.recommendation === 'perlu_pembinaan' ? (
                        <span className="text-[11px] font-medium text-rose-700">
                          Perlu Pembinaan
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Qualitative Notes Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="font-serif font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
          <MessageSquareText className="w-5 h-5 text-blue-800" />
          <span>Rangkuman Catatan & Evaluasi Kualitatif Dewan Juri</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rankedVideos
            .filter((v) => scoresMap[v.id]?.notes && scoresMap[v.id]?.notes.trim().length > 0)
            .map((video) => (
              <div
                key={video.id}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900">
                    #{video.id}. {video.title}
                  </span>
                  <span className="font-mono text-blue-800 font-bold">
                    {(scoresMap[video.id]?.totalScore || 0).toFixed(2)}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] mb-2">{video.location}</p>
                <p className="text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-200">
                  "{scoresMap[video.id]?.notes}"
                </p>
              </div>
            ))}
        </div>

        {rankedVideos.filter(
          (v) => scoresMap[v.id]?.notes && scoresMap[v.id]?.notes.trim().length > 0
        ).length === 0 && (
          <p className="text-xs text-slate-400 italic">
            Belum ada catatan kualitatif yang diisikan. Anda dapat menambahkan catatan pada setiap kartu video di Lembar Penilaian.
          </p>
        )}
      </div>

      {/* Official Sign-off Box (for Print & Paper Official Documentation) */}
      <div className="mt-12 pt-6 border-t border-slate-300 print-only">
        <div className="flex justify-end">
          <div className="text-center w-72 text-[11pt]">
            <p>Palembang, {todayFormatted}</p>
            <p className="font-bold mt-1">DEWAN JURI PENILAI,</p>
            <div className="h-24"></div>
            <p className="font-bold border-b border-black pb-0.5 inline-block min-w-[200px]">
              {currentJudge.name}
            </p>
            <p className="text-[10pt] text-gray-700 mt-1">{currentJudge.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
