import { Judge, VideoEntry, ScoringWeights, AspectScores } from '../types';

export const OFFICIAL_JUDGES: Judge[] = [
  {
    id: 1,
    name: 'Feby Yoland Effendy, S.IP., M.Si',
    role: 'Ketua DPD ASITA Sumatera Selatan',
    agency: 'DPD ASITA Sumsel',
    badge: 'J1',
  },
  {
    id: 2,
    name: 'Vinita Citra Karini, SE, M.Si',
    role: 'Anggota Bidang Program dan Sumber Daya DEKRANASDA',
    agency: 'DEKRANASDA Provinsi Sumsel',
    badge: 'J2',
  },
  {
    id: 3,
    name: 'Eko Agus Sugianto',
    role: 'Pengurus KORMI Provinsi Sumatera Selatan',
    agency: 'KORMI Sumsel',
    badge: 'J3',
  },
  {
    id: 4,
    name: 'Kemas Achmad Renaldo',
    role: 'Sutradara dan Produser Film',
    agency: 'Praktisi Perfilman & Multimedia',
    badge: 'J4',
  },
  {
    id: 5,
    name: 'Novtra Berlandho, Sp',
    role: 'Pejabat Dinas Kebudayaan dan Pariwisata',
    agency: 'Disbudpar Provinsi Sumatera Selatan',
    badge: 'J5',
  },
  {
    id: 6,
    name: 'Fikri Haikal',
    role: 'Komisioner Komisi Penyiaran Indonesia Daerah',
    agency: 'KPID Sumatera Selatan',
    badge: 'J6',
  },
];

export const SCORING_WEIGHTS: ScoringWeights = {
  cerita: 0.35,  // 35%
  budaya: 0.15,  // 15%
  potensi: 0.15, // 15%
  visual: 0.15,  // 15%
  audio: 0.10,   // 10%
  editing: 0.05, // 5%
  promosi: 0.05, // 5%
};

export const VIDEO_ENTRIES: VideoEntry[] = [
  {
    id: 1,
    location: 'Pesona jumputan dan tenun tuan kentang. Palembang',
    region: 'Kota Palembang',
    title: 'Merajut Tradisi, Menggerakkan Ekonomi: Pesona Jumputan dan Tenun Tuan Kentang.',
    link: 'https://www.instagram.com/reel/DfgaZF1ALvH/?srtk=MWZxNXl1NjU1NGt4',
    keyHighlights: ['Kerajinan Khas Kain Jumputan & Tenun', 'Ekonomi Kreatif Warga', 'Wisata Budaya Kriya'],
  },
  {
    id: 2,
    location: 'Desa Wisata Bangsal, Kabupaten Ogan Komering Ilir',
    region: 'Kabupaten Ogan Komering Ilir',
    title: 'Merawat Secupak Warisan Rawa Bangsal',
    link: 'https://www.instagram.com/reel/DfkOUcrOliR/?utm_source=ig_web_copy_link&dlrf=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA==',
    keyHighlights: ['Ekosistem Rawa Lebak & Kerbau Rawa', 'Kearifan Lokal OKI', 'Kuliner Gula Puan & Tradisi'],
  },
  {
    id: 3,
    location: 'Desa serambi, Kabupaten Lahat',
    region: 'Kabupaten Lahat',
    title: 'Pesona Desa Serambi Lahat',
    link: 'https://www.instagram.com/reel/DfkIM3FJTiL/?utm_source=ig_web_button_share_sheet&dlrf=MzRlODBiNWFlZA==',
    keyHighlights: ['Panorama Alam Lembah Gumay', 'Kultur Pedesaan', 'Potensi Agrowisata'],
  },
  {
    id: 4,
    location: 'Desa Surya Adi Kec.Mesuji Kabupaten.Ogan Komering Ilir',
    region: 'Kabupaten Ogan Komering Ilir',
    title: 'Wisata Nadi Ekonomi Desa Surya Adi',
    link: 'https://www.instagram.com/reel/DfjvFS6SJiH/?utm_source=ig_web_button_share_sheet&cplk=MzRlODBiNWFlZA==',
    keyHighlights: ['Pemberdayaan Bumdes', 'Inovasi Rekreasi Desa', 'Penggerak Ekonomi Lokal'],
  },
  {
    id: 5,
    location: 'Desa Sugih Waras, Kecamatan Banding Agung, Kabupaten Ogan Komering Ulu Selatan',
    region: 'Kabupaten OKU Selatan',
    title: 'Pesona Wisata Danau Ranau',
    link: 'https://www.instagram.com/reel/Dfi0SWvPC0p/?utm_source=ig_web_button_share_sheet&psln=MzRlODBiNWFlZA==',
    keyHighlights: ['Danau Vulkanik Terbesar Kedua di Sumatera', 'Latar Gunung Seminung', 'Atraksi Air & Homestay'],
  },
  {
    id: 6,
    location: 'Bendungan Watervang. Kota Lubuk Linggau',
    region: 'Kota Lubuklinggau',
    title: 'WATERVANG PESONA JUARA',
    link: 'https://www.instagram.com/reel/DfizPE7qIvS/?utm_source=ig_web_button_share_sheet&psln=MzRlODBiNWFlZA==',
    keyHighlights: ['Heritage Kolonial 1927', 'Wisata Air Terjun Tiruan', 'Ikon Wisata Alam Perkotaan'],
  },
  {
    id: 7,
    location: 'Desa Burai. Kabupaten Ogan Ilir',
    region: 'Kabupaten Ogan Ilir',
    title: 'Pesona Alam, Budaya, dan Keramahan Masyarakat',
    link: 'https://www.instagram.com/reel/DfimPwASRfs/?utm_source=ig_web_button_share_sheet&dlrf=MzRlODBiNWFlZA==',
    keyHighlights: ['Desa Wisata Warna-Warni Burai', 'Kain Tenun Songket Burai', 'Keramahan Tepian Sungai Kelekar'],
  },
  {
    id: 8,
    location: 'Desa Sukaraja, Kecamatan Kota Agung, Kabupaten Lahat',
    region: 'Kabupaten Lahat',
    title: 'desaku surgaku',
    link: 'https://www.instagram.com/reel/DfhjW4Hgfix/?utm_source=ig_web_button_share_sheet&exln=MzRlODBiNWFlZA==',
    keyHighlights: ['Panorama Perbukitan & Persawahan Asri', 'Megalitikum & Budaya', 'Kedamaian Alam Pedesaan'],
  },
  {
    id: 9,
    location: 'Destinasi rumah limas Raden H Munggah, Masjid Al-Furqon, Dekranasda kabupaten Oki. Kabupaten Ogan Komering Ilir',
    region: 'Kabupaten Ogan Komering Ilir',
    title: 'LESTARIKON BUDAYE JIME TIYOH KAYUAGUNG',
    link: 'https://www.instagram.com/reel/DfhjB3BS9mY/?utm_source=ig_web_button_share_sheet&rpxt=MzRlODBiNWFlZA==',
    keyHighlights: ['Rumah Tradisional Limas Kayuagung', 'Arsitektur Sejarah & Religi', 'Kerajinan Tikar Purun'],
  },
  {
    id: 10,
    location: 'Desa Burai. Kabupaten Ogan Ilir',
    region: 'Kabupaten Ogan Ilir',
    title: 'Menepi ke Burai : Merawat tenang di Tepian Kelekar',
    link: 'https://www.instagram.com/reel/DfhepwezXzi/?utm_source=ig_web_button_share_sheet&rpxt=MzRlODBiNWFlZA==',
    keyHighlights: ['Susur Sungai Tradisional', 'Konservasi Budaya Sungai', 'Kehidupan Komunitas Lokal'],
  },
  {
    id: 11,
    location: 'Desa Talang Seleman,Kabupaten Ogan Ilir',
    region: 'Kabupaten Ogan Ilir',
    title: 'Dari sebuah desa sederhana, tumbuh mimpi besar untuk dikenal dunia',
    link: 'https://www.instagram.com/reel/Dfha5SzPHOT/?utm_source=ig_web_button_share_sheet&psln=MzRlODBiNWFlZA==',
    keyHighlights: ['Kerajinan Bambu & Anyaman Tradisi', 'Pariwisata Berbasis Masyarakat', 'Potensi Edukasi Desa'],
  },
  {
    id: 12,
    location: 'Desa Pinang Banjar, Kecamatan Gelumbang, Kabupaten Muara Enim.',
    region: 'Kabupaten Muara Enim',
    title: 'NEGERI DONGENG',
    link: 'https://www.instagram.com/reel/DfhdFfQhxYT/?utm_source=ig_web_button_share_sheet&srtk=MzRlODBiNWFlZA==',
    keyHighlights: ['Pesona Alam Hijau Alami', 'Spot Wisata Tematik Desa', 'Pemberdayaan Pemuda Desa'],
  },
  {
    id: 13,
    location: 'Desa Betung Selatan, Kecamatan Abab, Kabupaten Penukal Abab Lematang Ilir.',
    region: 'Kabupaten PALI',
    title: 'WISATA PAYE BIRU',
    link: 'https://www.instagram.com/reel/Dfhc3LsR9Bo/?utm_source=ig_web_button_share_sheet&dlrf=MzRlODBiNWFlZA==',
    keyHighlights: ['Pesona Danau Rawa Paye Biru', 'Wisata Air & Memancing', 'Ekosistem Hutan Rawa'],
  },
  {
    id: 14,
    location: 'Desa Sumber Asri, Kecamatan Sumber Harta, Kabupaten Musi Rawas',
    region: 'Kabupaten Musi Rawas',
    title: 'NAWASETA',
    link: 'https://www.instagram.com/reel/DfhWceGxyOA/?utm_source=ig_web_button_share_sheet&obrf=MzRlODBiNWFlZA==',
    keyHighlights: ['Agrowisata Buah & Sayur', 'Kearifan Pertanian Organik', 'Harmoni Warga Transmigran & Lokal'],
  },
  {
    id: 15,
    location: 'Candi Bumi Ayu, Kabupaten Penukal Abab Lematang Ilir',
    region: 'Kabupaten PALI',
    title: 'WISATA DESA CANDI BUMI AYU',
    link: 'https://www.instagram.com/reel/DfhFhLopioD/?utm_source=ig_web_copy_link&mdxt=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA==',
    keyHighlights: ['Situs Percandian Hindu Tertua di Sumsel', 'Arkeologi Sejarah Abad ke-9 s/d 13', 'Wisata Edukasi Sejarah'],
  },
  {
    id: 16,
    location: 'KAMPUNG WISATA ANYAMAN, tepian Sungai Musi di Jalan Faqih Usman Lorong Prajurit Nangyu Rt.04 Rw.02 Kelurahan 3/4ulu Kecamatan Seberang Ulu 1 Palembang.',
    region: 'Kota Palembang',
    title: 'Dari Daun Nipah Menjadi Karya Indah | Mengenal pesona desa wisata anyaman , Palembang',
    link: 'https://www.instagram.com/reel/DfhAqSrR5h4/?utm_source=ig_web_button_share_sheet&cplk=MzRlODBiNWFlZA==',
    keyHighlights: ['Kerajinan Anyaman Daun Nipah', 'Tradisi Pesisir Sungai Musi', 'Pengembangan Kriya Rumah Tangga'],
  },
  {
    id: 17,
    location: 'Desa janang, kelurahan gunung Dempo, Kecamatan Pagar Alam Selatan, Kota Pagar Alam.',
    region: 'Kota Pagar Alam',
    title: 'ketika keterbatasan menjadi kekuatan',
    link: 'https://www.instagram.com/reel/DfgkijrCv3R/?utm_source=ig_web_button_share_sheet&xtok=MzRlODBiNWFlZA==',
    keyHighlights: ['Kaki Gunung Dempo', 'Wisata Perkebunan Teh & Kopi Robusta', 'Semangat Inovasi Warga'],
  },
  {
    id: 18,
    location: 'Kampung Gerabah Maju Bersama, kecamatan Sei Selincah, Kalidoni, kota Palembang, Sumatera Selatan.',
    region: 'Kota Palembang',
    title: 'Jejak Tanah Liat di Bumi Sriwijaya, Pesona Kampung Gerabah Maju Bersama',
    link: 'https://www.instagram.com/reel/DfgGwbHy150/?utm_source=ig_web_button_share_sheet&exln=MzRlODBiNWFlZA==',
    keyHighlights: ['Warisan Pembuatan Gerabah Kuno', 'Edukasi Membentuk Tanah Liat', 'Pelestarian Budaya Kuno Palembang'],
  },
  {
    id: 19,
    location: 'Desa Pinang Banjar, Kecamatan Gelumbang, Kabupaten Muara Enim',
    region: 'Kabupaten Muara Enim',
    title: 'DIBALIK INDAHNYA PINANG BANJAR',
    link: 'https://www.instagram.com/reel/Dfef4sthQ4S/?utm_source=ig_web_button_share_sheet&mdxt=MzRlODBiNWFlZA=',
    keyHighlights: ['Potensi Budaya Desa', 'Kehidupan Harmonis Masyarakat', 'Panorama Alam'],
  },
  {
    id: 20,
    location: 'Desa Ulu Danau, Kecamatan Sindang Danau, Kabupaten Ogan Komering Ulu Selatan',
    region: 'Kabupaten OKU Selatan',
    title: 'SURGA ALAM TERSEMBUNYI DI PELOSOK NEGERI',
    link: 'https://www.instagram.com/reel/DfXVN5oSTdz/?utm_source=ig_web_button_share_sheet&obrf=MzRlODBiNWFlZA==',
    keyHighlights: ['Danau Alami & Hutan Lindung Asri', 'Kesejukan Dataran Tinggi', 'Kearifan Adat Sindang Danau'],
  },
  {
    id: 21,
    location: 'Kampung Kapitan, Palembang',
    region: 'Kota Palembang',
    title: 'wisata langsung aja ke Kampung Kapitan',
    link: 'https://www.instagram.com/reel/DfUo9O5BzeQ/?utm_source=ig_web_button_share_sheet&exln=MzRlODBiNWFlZA==',
    keyHighlights: ['Cagar Budaya Tionghoa-Palembang', 'Sejarah Perwira Tionghoa Abad ke-14', 'Arsitektur Paduan Melayu & Tionghoa'],
  },
];

export function calculateTotalScore(scores: AspectScores): number {
  if (!scores) return 0;
  const c = (typeof scores.cerita === 'number' ? scores.cerita : 0) * SCORING_WEIGHTS.cerita;
  const b = (typeof scores.budaya === 'number' ? scores.budaya : 0) * SCORING_WEIGHTS.budaya;
  const p = (typeof scores.potensi === 'number' ? scores.potensi : 0) * SCORING_WEIGHTS.potensi;
  const v = (typeof scores.visual === 'number' ? scores.visual : 0) * SCORING_WEIGHTS.visual;
  const a = (typeof scores.audio === 'number' ? scores.audio : 0) * SCORING_WEIGHTS.audio;
  const e = (typeof scores.editing === 'number' ? scores.editing : 0) * SCORING_WEIGHTS.editing;
  const pr = (typeof scores.promosi === 'number' ? scores.promosi : 0) * SCORING_WEIGHTS.promosi;
  
  const total = c + b + p + v + a + e + pr;
  return Math.round(total * 100) / 100;
}

export function isVideoEvaluationComplete(scores: AspectScores): boolean {
  if (!scores) return false;
  return (
    typeof scores.cerita === 'number' &&
    typeof scores.budaya === 'number' &&
    typeof scores.potensi === 'number' &&
    typeof scores.visual === 'number' &&
    typeof scores.audio === 'number' &&
    typeof scores.editing === 'number' &&
    typeof scores.promosi === 'number'
  );
}

export const REGIONS_LIST = [
  'Semua Wilayah',
  'Kota Palembang',
  'Kabupaten Ogan Komering Ilir',
  'Kabupaten Ogan Ilir',
  'Kabupaten Lahat',
  'Kabupaten OKU Selatan',
  'Kabupaten Muara Enim',
  'Kabupaten PALI',
  'Kabupaten Musi Rawas',
  'Kota Lubuklinggau',
  'Kota Pagar Alam',
];
