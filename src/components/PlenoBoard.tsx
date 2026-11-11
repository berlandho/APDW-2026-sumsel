import React, { useMemo } from 'react';
import { Judge, VideoEntry, JudgeScoresMap } from '../types';
import { OFFICIAL_JUDGES } from '../data/judgesAndVideos';
import { Users, Trophy, FileSpreadsheet, Printer, Sparkles, CheckCircle2 } from 'lucide-react';

interface PlenoBoardProps {
  videos: VideoEntry[];
  getAllJudgeScores: () => Record<number, JudgeScoresMap>;
  onSeedSamplePlenoData: () => void;
  onClearOtherJudgesData: () => void;
  activeJudgeId: number;
}

export const PlenoBoard: React.FC<PlenoBoardProps> = ({
  videos,
  getAllJudgeScores,
  onSeedSamplePlenoData,
  onClearOtherJudgesData,
  activeJudgeId,
}) => {
  const allScores = getAllJudgeScores();

  // Compute composite score for each video
  const plenoResults = useMemo(() => {
    return videos
      .map((video) => {
        let sum = 0;
        let count = 0;
        const judgeScoresList: Record<number, number> = {};

        OFFICIAL_JUDGES.forEach((judge) => {
          const score = allScores[judge.id]?.[video.id]?.totalScore;
          if (typeof score === 'number' && score > 0) {
            judgeScoresList[judge.id] = score;
            sum += score;
            count += 1;
          } else {
            judgeScoresList[judge.id] = 0;
          }
        });

        const average = count > 0 ? sum / count : 0;
        return {
          video,
          judgeScoresList,
          activeJudgesCount: count,
          average: Math.round(average * 100) / 100,
        };
      })
      .sort((a, b) => b.average - a.average || a.video.id - b.video.id);
  }, [videos, allScores]);

  // Export Pleno to CSV
  const handleExportPlenoCSV = () => {
    const BOM = '\uFEFF';
    const judgeHeaders = OFFICIAL_JUDGES.map((j) => `"${j.badge} (${j.name})"`).join(';');
    const headerLine = `Peringkat;No Video;Desa Wisata;Kabupaten / Kota;Judul Video;${judgeHeaders};RATA-RATA PLENO;Keterangan`;

    const rows = plenoResults.map((item, idx) => {
      const scores = OFFICIAL_JUDGES.map((j) => item.judgeScoresList[j.id]?.toFixed(2) || '0.00').join(';');
      return [
        idx + 1,
        item.video.id,
        `"${item.video.location.replace(/"/g, '""')}"`,
        `"${item.video.region.replace(/"/g, '""')}"`,
        `"${item.video.title.replace(/"/g, '""')}"`,
        scores,
        item.average.toFixed(2),
        idx === 0 ? 'Juara 1' : idx === 1 ? 'Juara 2' : idx === 2 ? 'Juara 3' : idx < 5 ? 'Top 5 Finalis' : 'Peserta',
      ].join(';');
    });

    const titleHeader = [
      `"BERITA ACARA SIDANG PLENO DEWAN JURI APDW SUMATERA SELATAN 2026"`,
      `"Dinas Kebudayaan dan Pariwisata Provinsi Sumatera Selatan"`,
      `"Tanggal: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}"`,
      '',
    ].join('\n');

    const csv = BOM + titleHeader + headerLine + '\n' + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Berita_Acara_Pleno_APDW_Sumsel_2026.csv`);
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
      {/* Printable Kop Surat for Pleno */}
      <div className="hidden print-only text-black border-b-2 border-black pb-4 mb-6">
        <div className="text-center font-serif">
          <h2 className="text-sm font-bold tracking-wider uppercase">
            Pemerintah Provinsi Sumatera Selatan
          </h2>
          <h1 className="text-base font-extrabold tracking-tight uppercase">
            Dinas Kebudayaan dan Pariwisata
          </h1>
          <p className="text-[10pt] font-sans text-gray-700">
            Jalan Demang Lebar Daun No. 235 Palembang | Telepon: (0711) 356661
          </p>
        </div>
        <div className="border-t border-black my-2"></div>
        <div className="text-center mt-3">
          <h3 className="text-sm font-bold uppercase underline">
            Berita Acara Sidang Pleno Penetapan Pemenang
          </h3>
          <p className="text-[10pt] font-semibold">
            Lomba Video Anugerah Pesona Desa Wisata (APDW) Provinsi Sumatera Selatan 2026
          </p>
          <p className="text-[10pt] text-gray-700 mt-1">
            Berdasarkan hasil musyawarah dan kompilasi penilaian 6 (enam) orang Anggota Dewan Juri resmi pada {todayFormatted}.
          </p>
        </div>
      </div>

      {/* Screen Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-900 font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4 text-amber-500" />
            <span>Kompilasi Sidang Pleno</span>
          </div>
          <h2 className="font-serif font-bold text-slate-900 text-xl sm:text-2xl">
            Kompilasi Nilai Gabungan 6 Dewan Juri
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Rekapitulasi skor rata-rata gabungan seluruh juri untuk menentukan 3 Besar Juara & Nominasi APDW Sumsel 2026.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onSeedSamplePlenoData}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 transition cursor-pointer flex items-center gap-1.5"
            title="Muat simulasi skor untuk juri lainnya untuk meninjau kalkulasi pleno"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Simulasi Nilai 6 Juri</span>
          </button>
          <button
            onClick={handleExportPlenoCSV}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-600 text-white flex items-center gap-2 transition cursor-pointer shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Ekspor Berita Acara</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2 transition cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Cetak Pleno</span>
          </button>
        </div>
      </div>

      {/* Status of 6 Judges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 no-print">
        {OFFICIAL_JUDGES.map((judge) => {
          const evalMap = allScores[judge.id] || {};
          let scored = 0;
          Object.values(evalMap).forEach((ev) => {
            if (ev.totalScore > 0) scored++;
          });
          const isDone = scored === videos.length;
          const isActive = judge.id === activeJudgeId;

          return (
            <div
              key={judge.id}
              className={`p-3 rounded-xl border text-xs ${
                isActive
                  ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-500'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-800">{judge.badge}</span>
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
              <p className="font-semibold text-slate-900 truncate" title={judge.name}>
                {judge.name}
              </p>
              <p className="text-[10px] text-slate-500 truncate">{judge.agency}</p>
              <div className="mt-2 text-[10px] font-mono font-bold text-slate-700">
                {scored} / {videos.length} dinilai
              </div>
            </div>
          );
        })}
      </div>

      {/* Pleno Master Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold uppercase tracking-wider border-b border-slate-200 text-[11px]">
                <th className="p-3.5 text-center w-12">Rank</th>
                <th className="p-3.5 text-center w-12">No</th>
                <th className="p-3.5 min-w-[200px]">Desa Wisata / Kab-Kota</th>
                <th className="p-3.5 min-w-[220px]">Judul Karya</th>
                {OFFICIAL_JUDGES.map((judge) => (
                  <th
                    key={judge.id}
                    className="p-3 text-center min-w-[70px]"
                    title={`${judge.name} (${judge.agency})`}
                  >
                    {judge.badge}
                  </th>
                ))}
                <th className="p-3.5 text-center bg-amber-100 text-slate-950 font-extrabold border-x border-amber-200 min-w-[100px]">
                  RATA-RATA PLENO
                </th>
                <th className="p-3.5 text-center min-w-[120px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {plenoResults.map((item, idx) => (
                <tr
                  key={item.video.id}
                  className={`hover:bg-slate-50 transition ${
                    idx === 0
                      ? 'bg-amber-100/40 font-semibold'
                      : idx === 1
                      ? 'bg-slate-100/60'
                      : idx === 2
                      ? 'bg-amber-50/30'
                      : ''
                  }`}
                >
                  <td className="p-3.5 text-center font-mono font-bold">
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

                  <td className="p-3.5 text-center font-mono font-bold text-slate-600">
                    #{item.video.id}
                  </td>

                  <td className="p-3.5 font-medium text-slate-900">
                    <span className="block font-semibold">{item.video.region}</span>
                    <span className="text-slate-500 text-[11px] line-clamp-1">
                      {item.video.location}
                    </span>
                  </td>

                  <td className="p-3.5 font-serif text-slate-800">
                    {item.video.title}
                  </td>

                  {OFFICIAL_JUDGES.map((judge) => {
                    const score = item.judgeScoresList[judge.id] || 0;
                    return (
                      <td
                        key={judge.id}
                        className="p-3 text-center font-mono tabular-nums text-slate-700"
                      >
                        {score > 0 ? score.toFixed(1) : '-'}
                      </td>
                    );
                  })}

                  <td className="p-3.5 text-center font-mono tabular-nums font-extrabold text-sm text-blue-950 bg-amber-50/70 border-x border-amber-200">
                    {item.average.toFixed(2)}
                  </td>

                  <td className="p-3.5 text-center">
                    {idx === 0 ? (
                      <span className="font-bold text-amber-700">Juara I</span>
                    ) : idx === 1 ? (
                      <span className="font-bold text-slate-800">Juara II</span>
                    ) : idx === 2 ? (
                      <span className="font-bold text-amber-900">Juara III</span>
                    ) : idx < 5 ? (
                      <span className="font-semibold text-blue-800">Top 5 Finalis</span>
                    ) : (
                      <span className="text-slate-400">Peserta</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6 Judges Signature Block for Official Pleno Print */}
      <div className="mt-12 pt-6 border-t border-slate-300 print-only">
        <h4 className="text-center font-serif font-bold text-[11pt] uppercase mb-6">
          Tanda Tangan Dewan Juri Sidang Pleno
        </h4>
        <div className="grid grid-cols-3 gap-y-12 gap-x-6 text-center text-[10pt]">
          {OFFICIAL_JUDGES.map((judge) => (
            <div key={judge.id} className="flex flex-col items-center">
              <p className="font-semibold">{judge.role}</p>
              <div className="h-20"></div>
              <p className="font-bold border-b border-black pb-0.5 inline-block min-w-[180px]">
                {judge.name}
              </p>
              <p className="text-[9pt] text-gray-700">{judge.agency}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
