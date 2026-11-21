const AudioEngine = {
  ctx: null,
  currentAudio: null,
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  },
  stopCustom() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  },
  // Memutar file MP3/WAV milik sendiri; jika file belum ada, otomatis pakai suara bawaan
  playCustomOrFallback(src, fallbackFn) {
    this.stopCustom();
    if (!src) {
      if (fallbackFn) fallbackFn();
      return;
    }
    let fallenBack = false;
    const runFallback = () => {
      if (fallenBack) return;
      fallenBack = true;
      if (this.currentAudio === audio) this.currentAudio = null;
      if (fallbackFn) fallbackFn();
    };
    const audio = new Audio(src);
    this.currentAudio = audio;
    audio.addEventListener("error", runFallback, { once: true });
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(runFallback);
    }
  },
  playTone(freq, duration = 0.25, type = "sine", gainVal = 0.2) {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  },
  playSuccess() {
    this.playCustomOrFallback("./assets/audio/benar.mp3", () => {
      this.playTone(523.25, 0.14, "triangle", 0.22);
      setTimeout(() => this.playTone(659.25, 0.16, "triangle", 0.22), 90);
      setTimeout(() => this.playTone(783.99, 0.28, "triangle", 0.25), 180);
    });
  },
  playError() {
    this.playCustomOrFallback("./assets/audio/salah.mp3", () => {
      this.playTone(220, 0.18, "sawtooth", 0.15);
      setTimeout(() => this.playTone(170, 0.28, "sawtooth", 0.15), 120);
    });
  },
  playKolintang(freq) {
    this.playTone(freq, 0.55, "sine", 0.35);
    this.playTone(freq * 2, 0.18, "triangle", 0.08);
  },
  playMelody(notes) {
    notes.forEach((n) => {
      setTimeout(() => this.playKolintang(n.freq), n.delay);
    });
  }
};

// =========================================================
// TAMBAH UNIT / PELAJARAN / SOAL BARU DI ARRAY "UNITS" INI
// =========================================================
const UNITS = [
  {
    id: "unit-1",
    title: "Unit 1: Seni Tari & Musik",
    desc: "Kabasaran, Maengket, dan Kolintang",
    color: "#C81E1E",
    lessons: [
      {
        id: "u1-l1",
        title: "Tari Kabasaran",
        icon: "⚔️",
        xpReward: 25,
        questions: [
          {
            type: "multiple-choice",
            image: "./assets/images/kabasaran.jpg",
            visual: "⚔️🛡️",
            question: "Apa sebutan bagi prajurit pria yang membawakan Tari Kabasaran di masa lampau?",
            options: ["Waraney", "Kapel", "Tonaas", "Walian"],
            answer: "Waraney",
            explanation: "Dahulu penari Kabasaran adalah para penjaga desa yang menjadi Waraney (prajurit perang) saat wilayah Minahasa terancam."
          },
          {
            type: "true-false",
            visual: "🧣🗡️",
            question: "Benar atau Salah: Busana adat Tari Kabasaran didominasi warna biru laut sebagai lambang ketenangan.",
            answer: "Salah",
            explanation: "Salah! Busana penari Kabasaran didominasi warna merah menyala yang melambangkan keberanian para Waraney."
          },
          {
            type: "word-bank",
            visual: "🎭",
            question: "Susun kalimat berikut tentang fungsi Tari Kabasaran masa kini:",
            bank: ["tamu", "Tari", "penyambutan", "Kabasaran", "untuk", "penting"],
            answer: "Tari Kabasaran untuk penyambutan tamu penting",
            explanation: "Kini Tari Kabasaran menjadi tarian penyambutan tamu kehormatan dan perayaan budaya."
          }
        ]
      },
      {
        id: "u1-l2",
        title: "Tari Maengket",
        icon: "🌾",
        xpReward: 25,
        questions: [
          {
            type: "matching-pairs",
            visual: "💃🌾",
            question: "Cocokkan nama babak Tari Maengket dengan maknanya:",
            pairs: [
              { left: "Maowey Kamberu", right: "Syukur panen padi" },
              { left: "Marambak", right: "Gotong royong bangun rumah" },
              { left: "Lalayaan", right: "Pergaulan muda-mudi" }
            ],
            explanation: "Tari Maengket terdiri atas 3 babak utama: Maowey Kamberu, Marambak, dan Lalayaan."
          },
          {
            type: "fill-input",
            visual: "🏡🤝",
            question: "Ketik nama babak Tari Maengket yang menggambarkan gotong royong mendirikan rumah baru:",
            hint: "Petunjuk: diawali huruf 'Ma...'",
            answer: "Marambak",
            acceptedAnswers: ["marambak"],
            explanation: "Babak Marambak merepresentasikan kebersamaan warga saat membantu membangun rumah baru."
          }
        ]
      },
      {
        id: "u1-l3",
        title: "Musik Kolintang",
        icon: "🎶",
        xpReward: 30,
        questions: [
          {
            type: "audio-quiz",
            image: "./assets/images/kolintang.jpg",
            visual: "🪵🎼",
            audioFile: "./assets/audio/o-ina-ni-keke.mp3",
            question: "Putar audio/melodi Kolintang di bawah ini! Lagu daerah Minahasa apakah yang dimainkan?",
            melody: [
              { freq: 329.63, delay: 0 },
              { freq: 392.00, delay: 320 },
              { freq: 392.00, delay: 640 },
              { freq: 329.63, delay: 960 },
              { freq: 349.23, delay: 1280 },
              { freq: 293.66, delay: 1600 }
            ],
            options: ["O Ina Ni Keke", "Ampar-Ampar Pisang", "Gundul Pacul", "Rasa Sayange"],
            answer: "O Ina Ni Keke",
            explanation: "Penggalan nada 3-5-5-3-4-2 merupakan pembuka lagu daerah Minahasa terkenal 'O Ina Ni Keke'."
          },
          {
            type: "true-false",
            visual: "🌍✨",
            question: "Benar atau Salah: Kolintang resmi diakui UNESCO sebagai Warisan Budaya Takbenda pada 5 Desember 2024.",
            answer: "Benar",
            explanation: "Benar! Kolintang masuk dalam daftar Warisan Budaya Takbenda UNESCO pada 5 Desember 2024."
          }
        ]
      }
    ]
  },
  {
    id: "unit-2",
    title: "Unit 2: Bahasa & Filosofi",
    desc: "Bahasa Tombulu & Si Tou Timou Tumou Tou",
    color: "#16A34A",
    lessons: [
      {
        id: "u2-l1",
        title: "Kosakata Tombulu",
        icon: "🗣️",
        xpReward: 25,
        questions: [
          {
            type: "matching-pairs",
            visual: "📖",
            question: "Cocokkan kosakata bahasa daerah Minahasa (Tombulu) dengan artinya:",
            pairs: [
              { left: "Wale", right: "Rumah" },
              { left: "Teles", right: "Beli" },
              { left: "Esa", right: "Satu" },
              { left: "Tou", right: "Manusia / Orang" }
            ],
            explanation: "Wale = rumah, Teles = beli, Esa = satu, dan Tou = manusia/orang."
          },
          {
            type: "word-bank",
            visual: "🛍️",
            question: "Susun arti dari frasa lagu 'tumeles waleko':",
            bank: ["membeli", "dan", "rumah", "Teles", "artinya", "Wale"],
            answer: "Teles artinya membeli dan Wale rumah",
            explanation: "Dalam bahasa Tombulu, 'teles' berarti beli dan 'wale' berarti rumah."
          }
        ]
      },
      {
        id: "u2-l2",
        title: "Filosofi & Mapalus",
        icon: "🤝",
        xpReward: 30,
        questions: [
          {
            type: "multiple-choice",
            visual: "🌟",
            question: "Siapa tokoh nasional asal Minahasa yang mempopulerkan filosofi 'Si Tou Timou Tumou Tou'?",
            options: ["Dr. Sam Ratulangi", "A.A. Maramis", "Maria Walanda Maramis", "Pierre Tendean"],
            answer: "Dr. Sam Ratulangi",
            explanation: "Dr. Sam Ratulangi merumuskan filosofi 'Si Tou Timou Tumou Tou' (Manusia hidup untuk memanusiakan orang lain)."
          },
          {
            type: "fill-input",
            visual: "🤲🌾",
            question: "Ketik nama tradisi gotong royong dan kerja sama masyarakat Minahasa:",
            hint: "Petunjuk: diawali huruf 'Ma...'",
            answer: "Mapalus",
            acceptedAnswers: ["mapalus"],
            explanation: "Mapalus adalah sistem kerja sama timbal balik tradisional masyarakat Minahasa."
          }
        ]
      }
    ]
  },
  {
    id: "unit-3",
    title: "Unit 3: Arsitektur & Situs",
    desc: "Walewangko, Waruga & Watu Pinawetengan",
    color: "#D97706",
    lessons: [
      {
        id: "u3-l1",
        title: "Rumah Walewangko",
        icon: "🏛️",
        xpReward: 25,
        questions: [
          {
            type: "fill-input",
            image: "./assets/images/walewangko.jpg",
            visual: "🪜🏠🪜",
            question: "Apa sebutan rumah adat panggung khas Minahasa yang memiliki dua tangga di kanan dan kiri bagian depan?",
            hint: "Petunjuk: Walewangko atau Rumah Pewaris",
            answer: "Walewangko",
            acceptedAnswers: ["walewangko", "rumah pewaris", "pewaris"],
            explanation: "Rumah Pewaris atau Walewangko adalah rumah panggung kayu dengan dua tangga di depan."
          },
          {
            type: "true-false",
            visual: "🪵",
            question: "Benar atau Salah: Rumah tradisional Walewangko dibuat bertiang tinggi (panggung) untuk adaptasi terhadap kelembapan, hewan liar, dan gempa.",
            answer: "Benar",
            explanation: "Benar! Struktur panggung kayu knock-down efektif melindungi penghuni sekaligus tahan gempa."
          }
        ]
      },
      {
        id: "u3-l2",
        title: "Waruga & Pinawetengan",
        icon: "🪨",
        xpReward: 30,
        questions: [
          {
            type: "multiple-choice",
            image: "./assets/images/waruga.jpg",
            visual: "🗿",
            question: "Bagaimana posisi jenazah di dalam makam batu kuno Minahasa yang disebut Waruga?",
            options: ["Posisi jongkok seperti bayi di kandungan", "Berbaring telentang menghadap timur", "Duduk di atas kursi kayu", "Dikremasi menjadi abu"],
            answer: "Posisi jongkok seperti bayi di kandungan",
            explanation: "Waruga berbentuk rumah batu kecil, dengan jenazah diletakkan dalam posisi jongkok."
          },
          {
            type: "matching-pairs",
            visual: "🗺️",
            question: "Cocokkan situs/ikon Minahasa berikut dengan penjelasannya:",
            pairs: [
              { left: "Waruga", right: "Makam batu kuno leluhur" },
              { left: "Watu Pinawetengan", right: "Batu musyawarah pembagian wilayah" },
              { left: "Manguni", right: "Burung hantu simbol kebijaksanaan" }
            ],
            explanation: "Waruga adalah makam batu, Watu Pinawetengan situs musyawarah di Tompaso, dan Manguni burung simbol Minahasa."
          }
        ]
      }
    ]
  },
  {
    id: "unit-4",
    title: "Unit 4: Kuliner & Atribut",
    desc: "Tinutuan, Nasi Jaha, dan Senjata Peda",
    color: "#0284C7",
    lessons: [
      {
        id: "u4-l1",
        title: "Kuliner & Senjata",
        icon: "🍲",
        xpReward: 35,
        questions: [
          {
            type: "fill-input",
            image: "./assets/images/tinutuan.jpg",
            visual: "🥣🥬",
            question: "Ketik nama bubur sayuran khas Manado/Minahasa yang terbuat dari beras, labu kuning, kangkung, dan bayam:",
            hint: "Petunjuk: diawali huruf 'Ti...'",
            answer: "Tinutuan",
            acceptedAnswers: ["tinutuan", "bubur manado"],
            explanation: "Tinutuan atau Bubur Manado adalah kuliner sarat sayuran khas Sulawesi Utara."
          },
          {
            type: "audio-quiz",
            visual: "🎵🎋",
            audioFile: "./assets/audio/si-patokaan.mp3",
            question: "Simak audio/nada Kolintang pembuka lagu daerah Minahasa yang sering mengiringi pesta rakyat! Lagu apakah ini?",
            melody: [
              { freq: 392.00, delay: 0 },
              { freq: 392.00, delay: 260 },
              { freq: 329.63, delay: 520 },
              { freq: 349.23, delay: 780 },
              { freq: 392.00, delay: 1040 },
              { freq: 440.00, delay: 1300 },
              { freq: 392.00, delay: 1600 }
            ],
            options: ["Si Patokaan", "Bungong Jeumpa", "Soleram", "Apuse"],
            answer: "Si Patokaan",
            explanation: "Melodi bersemangat tersebut adalah pembuka lagu rakyat Minahasa 'Si Patokaan'."
          },
          {
            type: "matching-pairs",
            visual: "🍽️🗡️",
            question: "Cocokkan kuliner dan atribut adat Minahasa berikut:",
            pairs: [
              { left: "Nasi Jaha", right: "Ketan & santan dibakar dalam bambu" },
              { left: "Peda / Santi", right: "Senjata parang tradisional" },
              { left: "Cakalang Fufu", right: "Ikan cakalang olahan asap" }
            ],
            explanation: "Nasi Jaha dimasak di bambu, Peda/Santi adalah senjata tradisional, dan Cakalang Fufu adalah ikan asap khas Minahasa."
          }
        ]
      }
    ]
  }
  /*
  // CONTOH MENAMBAH UNIT 5 (Hapus tanda komentar /* dan */ /* jika ingin dipakai):
  ,{
    id: "unit-5",
    title: "Unit 5: Pahlawan & Tokoh Minahasa",
    desc: "Mengenal tokoh sejarah dari Tanah Minahasa",
    color: "#7C3AED",
    lessons: [
      {
        id: "u5-l1",
        title: "Pahlawan Nasional",
        icon: "🎖️",
        xpReward: 30,
        questions: [
          {
            type: "multiple-choice",
            visual: "🏅",
            question: "Pahlawan wanita asal Minahasa yang memperjuangkan pendidikan kaum perempuan melalui PIKAT adalah...",
            options: ["Maria Walanda Maramis", "Cut Nyak Dien", "Dewi Sartika", "Rasuna Said"],
            answer: "Maria Walanda Maramis",
            explanation: "Maria Walanda Maramis mendirikan PIKAT (Percintaan Ibu Kepada Anak Turunannya) pada tahun 1917."
          }
        ]
      }
    ]
  }
  */
];

const ENCYCLOPEDIA = [
  { image: "./assets/images/kabasaran.jpg", title: "⚔️ Tari Kabasaran & Maengket", text: "Tari Kabasaran dibawakan oleh para Waraney berpakaian merah. Tari Maengket adalah tarian rakyat berpasangan dengan 3 babak: Maowey Kamberu (panen), Marambak (gotong royong bangun rumah), dan Lalayaan (muda-mudi)." },
  { image: "./assets/images/kolintang.jpg", title: "🪵 Alat Musik Kolintang", text: "Alat musik pukul dari bilah kayu lokal Minahasa. Pada 5 Desember 2024, Kolintang resmi ditetapkan UNESCO sebagai Warisan Budaya Takbenda." },
  { title: "🗣️ Rumpun Bahasa Minahasa", text: "Minahasa memiliki beberapa sub-bahasa seperti Tombulu, Tonsea, Tontemboan, Toulour (Tondano), dan Tonsawang. Contoh kata: Wale (rumah), Teles (beli), Esa (satu), Tou (manusia)." },
  { image: "./assets/images/walewangko.jpg", title: "🏛️ Walewangko & Waruga", text: "Walewangko (Rumah Pewaris) adalah rumah panggung dengan 2 tangga di depan. Waruga adalah sarkofagus batu kuno tempat makam leluhur dalam posisi jongkok." },
  { title: "🪨 Watu Pinawetengan", text: "Situs batu berukir di Kecamatan Tompaso tempat para leluhur sub-etnis Minahasa bermusyawarah membagi wilayah secara damai." },
  { image: "./assets/images/tinutuan.jpg", title: "🍲 Tinutuan & Nasi Jaha", text: "Tinutuan adalah bubur sayuran khas Sulawesi Utara, sedangkan Nasi Jaha berbahan ketan, santan, dan jahe yang dibakar dalam bambu." }
];

function getAllLessonIds() {
  return UNITS.flatMap(u => u.lessons.map(l => l.id));
}

const BADGES = [
  { id: "b-first", icon: "🌱", name: "Langkah Pertama", desc: "Selesaikan 1 pelajaran", check: (s) => s.completedLessons.length >= 1 },
  { id: "b-kolintang", icon: "🎶", name: "Penjaga Kolintang", desc: "Lulus seluruh Unit 1", check: (s) => ["u1-l1","u1-l2","u1-l3"].every(id => s.completedLessons.includes(id)) },
  { id: "b-xp100", icon: "⚡", name: "Pejuang XP", desc: "Kumpulkan minimal 100 XP", check: (s) => s.xp >= 100 },
  { id: "b-waraney", icon: "🦉", name: "Waraney Budaya", desc: "Selesaikan seluruh unit", check: (s) => s.completedLessons.length >= getAllLessonIds().length }
];

const KOLINTANG_NOTES = [
  { label: "1 (C)", freq: 261.63, height: "100%" },
  { label: "2 (D)", freq: 293.66, height: "94%" },
  { label: "3 (E)", freq: 329.63, height: "88%" },
  { label: "4 (F)", freq: 349.23, height: "82%" },
  { label: "5 (G)", freq: 392.00, height: "76%" },
  { label: "6 (A)", freq: 440.00, height: "70%" },
  { label: "7 (B)", freq: 493.88, height: "64%" },
  { label: "1' (C')", freq: 523.25, height: "58%" }
];

const DEFAULT_STATE = {
  username: "Waraney Muda",
  xp: 0,
  streak: 1,
  completedLessons: [],
  totalAnswered: 0,
  totalCorrect: 0
};

let state = loadState();
let activeQuiz = null;

function loadState() {
  try {
    const saved = localStorage.getItem("maesa_minahasa_v5");
    return saved ? { ...DEFAULT_STATE, ...JSON.parse(saved) } : { ...DEFAULT_STATE };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function saveState() {
  localStorage.setItem("maesa_minahasa_v5", JSON.stringify(state));
  renderStats();
}

function getSortedLeaderboard() {
  return [
    { name: "Pingkan", avatar: "👩", xp: 185 },
    { name: "Toar", avatar: "🏹", xp: 140 },
    { name: "Keke", avatar: "🌺", xp: 90 },
    { name: "Opo Lumi", avatar: "🦉", xp: 45 },
    { name: state.username + " (Anda)", avatar: "🛡️", xp: state.xp, isMe: true }
  ].sort((a, b) => b.xp - a.xp);
}

function renderStats() {
  document.querySelectorAll('[data-stat="streak"]').forEach(el => el.textContent = state.streak);
  document.querySelectorAll('[data-stat="xp"]').forEach(el => el.textContent = state.xp);

  document.getElementById("profile-name").textContent = state.username;
  document.getElementById("prof-xp").textContent = state.xp;
  document.getElementById("prof-lessons").textContent = state.completedLessons.length;
  const acc = state.totalAnswered === 0 ? 100 : Math.round((state.totalCorrect / state.totalAnswered) * 100);
  document.getElementById("prof-accuracy").textContent = `${acc}%`;

  const rankEl = document.getElementById("profile-rank");
  if (state.xp >= 200) rankEl.textContent = "Tingkat 4 • Tonaas Agung Minahasa";
  else if (state.xp >= 120) rankEl.textContent = "Tingkat 3 • Waraney Sejati";
  else if (state.xp >= 50) rankEl.textContent = "Tingkat 2 • Pengamat Budaya";
  else rankEl.textContent = "Tingkat 1 • Penjelajah Malesung";

  const totalLessons = getAllLessonIds().length;
  const done = state.completedLessons.length;
  const questText = document.getElementById("desktop-quest-text");
  const questBar = document.getElementById("desktop-quest-bar");
  if (questText && questBar) {
    questText.textContent = `${done} dari ${totalLessons} pelajaran selesai`;
    questBar.style.width = `${Math.round((done / totalLessons) * 100)}%`;
  }
}

function renderLearningPath() {
  const container = document.getElementById("learning-path-container");
  container.innerHTML = "";
  const allIds = getAllLessonIds();

  UNITS.forEach((unit) => {
    const banner = document.createElement("div");
    banner.className = "unit-banner";
    banner.style.background = unit.color;
    banner.innerHTML = `<div><h3>${unit.title}</h3><p>${unit.desc}</p></div><span>🌺</span>`;
    container.appendChild(banner);

    const nodesWrap = document.createElement("div");
    nodesWrap.className = "unit-nodes";

    unit.lessons.forEach((lesson, idx) => {
      const globalIndex = allIds.indexOf(lesson.id);
      const isCompleted = state.completedLessons.includes(lesson.id);
      const isUnlocked = globalIndex === 0 || state.completedLessons.includes(allIds[globalIndex - 1]);

      const wrapper = document.createElement("div");
      const offsetClass = idx % 3 === 1 ? "node-offset-right" : idx % 3 === 2 ? "node-offset-left" : "";
      wrapper.className = `node-wrapper ${offsetClass}`;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `node-btn ${isCompleted ? "completed" : isUnlocked ? "unlocked" : "locked"}`;
      btn.disabled = !isUnlocked;
      btn.innerHTML = isCompleted ? "★" : isUnlocked ? lesson.icon : "🔒";
      btn.addEventListener("click", () => startLesson(lesson));

      const label = document.createElement("span");
      label.className = "node-label";
      label.textContent = lesson.title;

      wrapper.appendChild(btn);
      wrapper.appendChild(label);
      nodesWrap.appendChild(wrapper);
    });

    container.appendChild(nodesWrap);
  });
}

function renderKolintangAndLibrary() {
  const keysEl = document.getElementById("kolintang-keys");
  keysEl.innerHTML = "";
  KOLINTANG_NOTES.forEach((note) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "kol-key";
    btn.style.height = note.height;
    btn.textContent = note.label.split(" ")[0];
    btn.addEventListener("click", () => {
      AudioEngine.playKolintang(note.freq);
      btn.classList.add("playing");
      setTimeout(() => btn.classList.remove("playing"), 140);
    });
    keysEl.appendChild(btn);
  });

  document.getElementById("encyclopedia-list").innerHTML = ENCYCLOPEDIA.map(item => `
    <article class="ency-card">
      ${item.image ? `<img src="${item.image}" alt="${item.title}" class="ency-img" onerror="this.style.display='none'" />` : ""}
      <h3>${item.title}</h3>
      <p>${item.text}</p>
    </article>
  `).join("");
}

function renderLeaderboard() {
  const sorted = getSortedLeaderboard();
  document.getElementById("leaderboard-list").innerHTML = sorted.map((p, i) => `
    <div class="lb-item ${p.isMe ? "is-me" : ""}">
      <span class="lb-rank">${i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}</span>
      <span class="lb-avatar">${p.avatar}</span>
      <span class="lb-name">${p.name}</span>
      <span class="lb-xp">${p.xp} XP</span>
    </div>
  `).join("");

  const miniLb = document.getElementById("desktop-mini-lb");
  if (miniLb) {
    miniLb.innerHTML = sorted.slice(0, 3).map((p, i) => `
      <div class="mini-lb-row">
        <span>${i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"} ${p.name}</span>
        <span style="color: var(--blue-tondano);">${p.xp} XP</span>
      </div>
    `).join("");
  }
}

function renderBadges() {
  document.getElementById("badges-grid").innerHTML = BADGES.map((b) => {
    const unlocked = b.check(state);
    return `
      <div class="badge-card ${unlocked ? "" : "locked"}">
        <div class="b-icon">${b.icon}</div>
        <h4>${b.name}</h4>
        <p>${b.desc}</p>
      </div>
    `;
  }).join("");
}

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function startLesson(lesson) {
  AudioEngine.init();
  activeQuiz = {
    lesson,
    index: 0,
    combo: 0,
    correctCount: 0,
    selectedAnswer: null,
    wordIndices: []
  };

  document.getElementById("quiz-overlay").classList.remove("hidden");
  renderQuestion();
}

function renderQuestion() {
  AudioEngine.stopCustom();
  const q = activeQuiz.lesson.questions[activeQuiz.index];
  const total = activeQuiz.lesson.questions.length;

  document.getElementById("quiz-progress-bar").style.width = `${(activeQuiz.index / total) * 100}%`;
  document.getElementById("quiz-step-count").textContent = `${activeQuiz.index + 1} / ${total}`;
  document.getElementById("quiz-question").textContent = q.question;

  const visualEl = document.getElementById("quiz-visual");
  visualEl.innerHTML = "";
  if (q.image) {
    const img = document.createElement("img");
    img.src = q.image;
    img.alt = "Ilustrasi Soal";
    img.className = "quiz-img";
    img.onerror = () => {
      img.style.display = "none";
      visualEl.textContent = q.visual || "";
    };
    visualEl.appendChild(img);
  } else {
    visualEl.textContent = q.visual || "";
  }

  const comboPill = document.getElementById("quiz-combo-pill");
  if (activeQuiz.combo >= 2) {
    comboPill.textContent = `🔥 Combo x${activeQuiz.combo}!`;
    comboPill.classList.remove("hidden");
  } else {
    comboPill.classList.add("hidden");
  }

  const inter = document.getElementById("quiz-interaction");
  inter.innerHTML = "";
  activeQuiz.selectedAnswer = null;
  activeQuiz.wordIndices = [];

  const checkBtn = document.getElementById("btn-check-answer");
  checkBtn.disabled = true;
  document.getElementById("quiz-footer").classList.remove("hidden");
  document.getElementById("feedback-sheet").classList.add("hidden");

  if (q.type === "multiple-choice" || q.type === "audio-quiz") {
    document.getElementById("quiz-type-label").textContent =
      q.type === "audio-quiz" ? "SIMAK AUDIO / NADA & JAWAB" : "PILIH JAWABAN YANG TEPAT";

    if (q.type === "audio-quiz") {
      const audioBox = document.createElement("div");
      audioBox.className = "audio-play-box";
      const playBtn = document.createElement("button");
      playBtn.type = "button";
      playBtn.className = "btn-audio-play";
      playBtn.textContent = "🔊 Putar Audio / Melodi";
      playBtn.addEventListener("click", () => {
        AudioEngine.playCustomOrFallback(q.audioFile, () => AudioEngine.playMelody(q.melody));
      });
      audioBox.appendChild(playBtn);
      inter.appendChild(audioBox);
    }

    const list = document.createElement("div");
    list.className = "options-list";
    q.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";
      btn.textContent = opt;
      btn.addEventListener("click", () => {
        list.querySelectorAll(".option-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        activeQuiz.selectedAnswer = opt;
        checkBtn.disabled = false;
      });
      list.appendChild(btn);
    });
    inter.appendChild(list);
  } else if (q.type === "true-false") {
    document.getElementById("quiz-type-label").textContent = "BENAR ATAU SALAH";
    const grid = document.createElement("div");
    grid.className = "tf-grid";

    [{ label: "✓ BENAR", val: "Benar" }, { label: "✕ SALAH", val: "Salah" }].forEach((item) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tf-btn";
      btn.textContent = item.label;
      btn.addEventListener("click", () => {
        grid.querySelectorAll(".tf-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        activeQuiz.selectedAnswer = item.val;
        checkBtn.disabled = false;
      });
      grid.appendChild(btn);
    });
    inter.appendChild(grid);
  } else if (q.type === "word-bank") {
    document.getElementById("quiz-type-label").textContent = "SUSUN KATA MENJADI KALIMAT";
    const answerZone = document.createElement("div");
    answerZone.className = "word-answer-zone";
    const bankZone = document.createElement("div");
    bankZone.className = "word-bank-zone";

    const updateWordUI = () => {
      answerZone.innerHTML = "";
      activeQuiz.wordIndices.forEach((bankIdx) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "word-chip";
        chip.textContent = q.bank[bankIdx];
        chip.addEventListener("click", () => {
          activeQuiz.wordIndices = activeQuiz.wordIndices.filter(i => i !== bankIdx);
          updateWordUI();
        });
        answerZone.appendChild(chip);
      });

      bankZone.innerHTML = "";
      q.bank.forEach((word, i) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = `word-chip ${activeQuiz.wordIndices.includes(i) ? "used" : ""}`;
        chip.textContent = word;
        chip.addEventListener("click", () => {
          if (!activeQuiz.wordIndices.includes(i)) {
            activeQuiz.wordIndices.push(i);
            updateWordUI();
          }
        });
        bankZone.appendChild(chip);
      });

      activeQuiz.selectedAnswer = activeQuiz.wordIndices.map(i => q.bank[i]).join(" ");
      checkBtn.disabled = activeQuiz.wordIndices.length === 0;
    };

    inter.appendChild(answerZone);
    inter.appendChild(bankZone);
    updateWordUI();
  } else if (q.type === "matching-pairs") {
    document.getElementById("quiz-type-label").textContent = "COCOKKAN PASANGAN YANG TEPAT";
    document.getElementById("quiz-footer").classList.add("hidden");

    const leftItems = shuffleArray(q.pairs.map(p => p.left));
    const rightItems = shuffleArray(q.pairs.map(p => p.right));

    let selLeft = null;
    let selRight = null;
    let matchedCount = 0;
    let hadMistake = false;

    const matchGrid = document.createElement("div");
    matchGrid.className = "match-grid";
    const colLeft = document.createElement("div");
    colLeft.className = "match-col";
    const colRight = document.createElement("div");
    colRight.className = "match-col";

    const checkPair = () => {
      if (!selLeft || !selRight) return;
      const isPair = q.pairs.some(p => p.left === selLeft.val && p.right === selRight.val);

      if (isPair) {
        AudioEngine.playTone(659.25, 0.14, "triangle", 0.22);
        selLeft.btn.classList.remove("selected");
        selRight.btn.classList.remove("selected");
        selLeft.btn.classList.add("matched");
        selRight.btn.classList.add("matched");
        matchedCount += 1;
        selLeft = null;
        selRight = null;

        if (matchedCount === q.pairs.length) {
          state.totalAnswered += 1;
          if (!hadMistake) {
            state.totalCorrect += 1;
            activeQuiz.correctCount += 1;
            activeQuiz.combo += 1;
          } else {
            activeQuiz.combo = 0;
          }
          AudioEngine.playSuccess();
          showFeedback(true, "Semua Pasangan Cocok!", q.explanation);
          saveState();
        }
      } else {
        AudioEngine.playError();
        hadMistake = true;
        const lBtn = selLeft.btn;
        const rBtn = selRight.btn;
        lBtn.classList.remove("selected");
        rBtn.classList.remove("selected");
        lBtn.classList.add("wrong-flash");
        rBtn.classList.add("wrong-flash");
        setTimeout(() => {
          lBtn.classList.remove("wrong-flash");
          rBtn.classList.remove("wrong-flash");
        }, 380);
        selLeft = null;
        selRight = null;
      }
    };

    leftItems.forEach((text) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "match-btn";
      btn.textContent = text;
      btn.addEventListener("click", () => {
        colLeft.querySelectorAll(".match-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        selLeft = { val: text, btn };
        checkPair();
      });
      colLeft.appendChild(btn);
    });

    rightItems.forEach((text) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "match-btn";
      btn.textContent = text;
      btn.addEventListener("click", () => {
        colRight.querySelectorAll(".match-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        selRight = { val: text, btn };
        checkPair();
      });
      colRight.appendChild(btn);
    });

    matchGrid.appendChild(colLeft);
    matchGrid.appendChild(colRight);
    inter.appendChild(matchGrid);
  } else if (q.type === "fill-input") {
    document.getElementById("quiz-type-label").textContent = "KETIK JAWABAN SINGKAT";
    const wrap = document.createElement("div");
    wrap.className = "fill-input-wrap";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "quiz-text-input";
    input.placeholder = "Ketik jawaban Anda di sini...";
    input.autocomplete = "off";

    input.addEventListener("input", () => {
      activeQuiz.selectedAnswer = input.value.trim();
      checkBtn.disabled = activeQuiz.selectedAnswer.length === 0;
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !checkBtn.disabled) checkBtn.click();
    });

    const hint = document.createElement("p");
    hint.className = "fill-hint";
    hint.textContent = q.hint || "";

    wrap.appendChild(input);
    wrap.appendChild(hint);
    inter.appendChild(wrap);
    setTimeout(() => input.focus(), 50);
  }
}

function showFeedback(isCorrect, title, desc) {
  const sheet = document.getElementById("feedback-sheet");
  sheet.className = `feedback-sheet ${isCorrect ? "correct" : "wrong"}`;
  document.getElementById("feedback-icon").textContent = isCorrect ? "✓" : "✕";
  document.getElementById("feedback-title").textContent = title;
  document.getElementById("feedback-desc").textContent = desc;
  sheet.classList.remove("hidden");
}

function finishLesson() {
  AudioEngine.stopCustom();
  document.getElementById("quiz-progress-bar").style.width = "100%";
  document.getElementById("quiz-overlay").classList.add("hidden");

  const totalQ = activeQuiz.lesson.questions.length;
  const acc = Math.round((activeQuiz.correctCount / totalQ) * 100);
  const earnedXp = activeQuiz.lesson.xpReward + (acc === 100 ? 10 : 0);

  state.xp += earnedXp;
  if (!state.completedLessons.includes(activeQuiz.lesson.id)) {
    state.completedLessons.push(activeQuiz.lesson.id);
  }
  saveState();

  document.getElementById("res-xp").textContent = `+${earnedXp} XP`;
  document.getElementById("res-acc").textContent = `${acc}%`;
  document.getElementById("result-modal").classList.remove("hidden");

  renderLearningPath();
  renderLeaderboard();
  renderBadges();
}

function switchView(targetId) {
  document.querySelectorAll("[data-target]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.target === targetId);
  });
  document.querySelectorAll(".view").forEach(v => {
    v.classList.toggle("active", v.id === targetId);
  });
  if (targetId === "view-leaderboard") renderLeaderboard();
  if (targetId === "view-profile") renderBadges();
}

function initApp() {
  document.getElementById("btn-check-answer").addEventListener("click", () => {
    const q = activeQuiz.lesson.questions[activeQuiz.index];
    let isCorrect = false;

    if (q.type === "fill-input") {
      const cleanInput = (activeQuiz.selectedAnswer || "").trim().toLowerCase();
      const accepted = q.acceptedAnswers || [q.answer.toLowerCase()];
      isCorrect = accepted.includes(cleanInput);
    } else {
      isCorrect = activeQuiz.selectedAnswer === q.answer;
    }

    state.totalAnswered += 1;

    if (isCorrect) {
      AudioEngine.playSuccess();
      state.totalCorrect += 1;
      activeQuiz.correctCount += 1;
      activeQuiz.combo += 1;
      const title = activeQuiz.combo >= 2 ? `Hebat! Combo x${activeQuiz.combo}` : "Mauliate! Jawaban Benar!";
      showFeedback(true, title, q.explanation);
    } else {
      AudioEngine.playError();
      activeQuiz.combo = 0;
      showFeedback(false, `Jawaban tepat: ${q.answer}`, q.explanation);
    }

    saveState();
  });

  document.getElementById("btn-next-question").addEventListener("click", () => {
    activeQuiz.index += 1;
    if (activeQuiz.index < activeQuiz.lesson.questions.length) {
      renderQuestion();
    } else {
      finishLesson();
    }
  });

  document.querySelectorAll("[data-target]").forEach((btn) => {
    btn.addEventListener("click", () => switchView(btn.dataset.target));
  });

  document.getElementById("btn-quit-quiz").addEventListener("click", () => {
    AudioEngine.stopCustom();
    document.getElementById("quiz-overlay").classList.add("hidden");
  });

  document.getElementById("btn-close-result").addEventListener("click", () => {
    document.getElementById("result-modal").classList.add("hidden");
  });

  document.getElementById("btn-save-name").addEventListener("click", () => {
    const val = document.getElementById("input-username").value.trim();
    if (val) {
      state.username = val;
      saveState();
      renderLeaderboard();
      document.getElementById("input-username").value = "";
    }
  });

  document.getElementById("btn-reset-progress").addEventListener("click", () => {
    if (confirm("Reset seluruh XP, lencana, dan progres belajar?")) {
      state = { ...DEFAULT_STATE };
      saveState();
      renderLearningPath();
      renderLeaderboard();
      renderBadges();
    }
  });

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }

  renderStats();
  renderLearningPath();
  renderKolintangAndLibrary();
  renderLeaderboard();
  renderBadges();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}