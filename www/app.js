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
// KURIKULUM 5 UNIT (TOTAL 51 SOAL FAKTUAL MINAHASA)
// =========================================================
const UNITS = [
  {
    id: "unit-1",
    title: "Unit 1: Seni Tari & Musik",
    desc: "Kabasaran, Maengket, Katrili, dan Kolintang",
    color: "#A61C1C",
    lessons: [
      {
        id: "u1-l1",
        title: "Tari Kabasaran",
        icon: "⚔️",
        xpReward: 30,
        questions: [
          {
            type: "multiple-choice",
            image: "./assets/images/kabasaran.jpg",
            visual: "⚔️🛡️",
            question: "Apa sebutan bagi prajurit penjaga negeri yang membawakan Tari Kabasaran di masa lampau?",
            options: ["Waraney", "Walian", "Potuasan", "Pasiowan"],
            answer: "Waraney",
            explanation: "Pada masa lalu, penari Kabasaran merupakan para Waraney (prajurit perang) yang bertugas menjaga keamanan masyarakat Minahasa."
          },
          {
            type: "matching-pairs",
            visual: "🗡️🛡️",
            question: "Cocokkan perlengkapan Tari Kabasaran dengan artinya:",
            pairs: [
              { left: "Santi", right: "Pedang untuk jurus menebas" },
              { left: "Wengkouw", right: "Tombak untuk jurus menusuk" },
              { left: "Kelung", right: "Perisai untuk menangkis" },
              { left: "Rerenge'en", right: "Lonceng kuningan pada busana" }
            ],
            explanation: "Dalam aturan gerak Kabasaran, Santi dipakai menebas, Wengkouw untuk menusuk, Kelung untuk menangkis, dan Rerenge'en sebagai giring-giring."
          },
          {
            type: "true-false",
            image: "./assets/images/kabasaran2.jpg",
            visual: "🧣",
            question: "Benar atau Salah: Busana adat penari Kabasaran didominasi warna merah dan topi berhias paruh burung Uwak (Rangkong).",
            answer: "Benar",
            explanation: "Benar! Busana perang Kabasaran (Pakeyan Nuak) didominasi warna merah dengan hiasan paruh burung Uwak pada penutup kepalanya."
          },
          {
            type: "word-bank",
            visual: "🎭",
            question: "Susun kalimat berikut tentang fungsi Tari Kabasaran masa kini:",
            bank: ["tamu", "Tari", "penyambutan", "Kabasaran", "untuk", "penting"],
            answer: "Tari Kabasaran untuk penyambutan tamu penting",
            explanation: "Saat ini Tari Kabasaran menjadi tarian penyambutan tamu agung dan upacara adat Minahasa."
          }
        ]
      },
      {
        id: "u1-l2",
        title: "Maengket & Katrili",
        icon: "🌾",
        xpReward: 30,
        questions: [
          {
            type: "matching-pairs",
            visual: "💃🌾",
            question: "Cocokkan tiga babak utama Tari Maengket dengan maknanya:",
            pairs: [
              { left: "Maowey Kamberu", right: "Rasa syukur atas panen padi" },
              { left: "Marambak", right: "Gotong royong membangun rumah" },
              { left: "Lalayaan", right: "Tari pergaulan muda-mudi" }
            ],
            explanation: "Tari Maengket memiliki 3 babak: Maowey Kamberu (panen), Marambak (bangun rumah), dan Lalayaan (muda-mudi)."
          },
          {
            type: "fill-input",
            visual: "🏡🤝",
            question: "Ketik nama babak Tari Maengket yang menggambarkan gotong royong mendirikan rumah baru:",
            hint: "Petunjuk: diawali huruf 'Ma...'",
            answer: "Marambak",
            acceptedAnswers: ["marambak"],
            explanation: "Babak Marambak menampilkan semangat kebersamaan warga saat membangun rumah baru."
          },
          {
            type: "multiple-choice",
            visual: "💃🕺",
            question: "Tarian pergaulan Minahasa yang lahir dari akulturasi budaya Eropa (Portugis/Belanda) dengan aba-aba pemimpin tari disebut...",
            options: ["Tari Katrili", "Tari Cakalele", "Tari Saman", "Tari Pakarena"],
            answer: "Tari Katrili",
            explanation: "Tari Katrili (berasal dari Quadrille) berkembang menjadi tarian pergaulan khas masyarakat Minahasa dan Manado."
          }
        ]
      },
      {
        id: "u1-l3",
        title: "Musik Kolintang",
        icon: "🎶",
        xpReward: 35,
        questions: [
          {
            type: "true-false",
            visual: "🌍✨",
            question: "Benar atau Salah: Alat musik Kolintang resmi ditetapkan UNESCO sebagai Warisan Budaya Takbenda pada 5 Desember 2024.",
            answer: "Benar",
            explanation: "Benar! Kolintang masuk dalam daftar Representative List of the Intangible Cultural Heritage of Humanity UNESCO pada 5 Desember 2024."
          },
          {
            type: "multiple-choice",
            visual: "🪵",
            question: "Nama 'Kolintang' berasal dari perpaduan bunyi nada bilah kayunya, yaitu...",
            options: ["Tong (rendah), Ting (tinggi), Tang (tengah)", "Tung, Tang, Tek", "Ko, Lin, Tang", "Gong, Ting, Bung"],
            answer: "Tong (rendah), Ting (tinggi), Tang (tengah)",
            explanation: "Masyarakat Minahasa menamai instrumen ini dari bunyi bilah kayunya: 'tong' (rendah), 'ting' (tinggi), dan 'tang' (tengah)."
          },
          {
            type: "matching-pairs",
            visual: "🎵",
            question: "Cocokkan nama instrumen dalam ansambel Kolintang dengan perannya:",
            pairs: [
              { left: "Ina Tawong / Ina Esa", right: "Pembawa melodi lagu" },
              { left: "Uner", right: "Pengiring nada tinggi (Alto)" },
              { left: "Karua", right: "Pengiring nada tengah (Tenor)" },
              { left: "Loway", right: "Penghasil nada rendah (Bass)" }
            ],
            explanation: "Ansambel Kolintang memiliki pembagian suara lengkap: Ina (melodi), Uner (alto), Karua (tenor), Cella (cello), dan Loway (bass)."
          },
          {
            type: "audio-quiz",
            image: "./assets/images/kolintang.jpg",
            visual: "🪵🎼",
            audioFile: "./assets/audio/o-ina-ni-keke.mp3",
            question: "Putar melodi Kolintang berikut! Lagu daerah Minahasa apakah yang dimainkan?",
            melody: [
              { freq: 329.63, delay: 0 },
              { freq: 392.00, delay: 320 },
              { freq: 392.00, delay: 640 },
              { freq: 329.63, delay: 960 },
              { freq: 349.23, delay: 1280 },
              { freq: 293.66, delay: 1600 }
            ],
            options: ["O Ina Ni Keke", "Rasa Sayange", "Ampar-Ampar Pisang", "Yamko Rambe Yamko"],
            answer: "O Ina Ni Keke",
            explanation: "Susunan nada 3-5-5-3-4-2 adalah pembuka lagu daerah Minahasa 'O Ina Ni Keke'."
          }
        ]
      }
    ]
  },
  {
    id: "unit-2",
    title: "Unit 2: Bahasa & Filosofi",
    desc: "Sub-etnis, Bahasa Tombulu, & Mapalus",
    color: "#0F766E",
    lessons: [
      {
        id: "u2-l1",
        title: "Sub-Etnis & Bahasa",
        icon: "🗣️",
        xpReward: 30,
        questions: [
          {
            type: "multiple-choice",
            visual: "🗺️",
            question: "Kata 'Minahasa' berasal dari kata 'Mina-esa' atau 'Minaesa'an' yang berarti...",
            options: ["Menjadi satu / Persatuan", "Tanah pegunungan tinggi", "Pulau yang dikelilingi laut", "Negeri para nelayan"],
            answer: "Menjadi satu / Persatuan",
            explanation: "Mina-esa berarti menjadi satu atau bersatu, merujuk pada bersatunya sub-etnis di Tanah Malesung."
          },
          {
            type: "multiple-choice",
            visual: "👥",
            question: "Manakah yang termasuk kelompok sub-etnis asli dalam rumpun Minahasa?",
            options: [
              "Tombulu, Tonsea, Tontemboan, Toulour, Tonsawang",
              "Sangir, Talaud, Siau, Bolmong",
              "Toraja, Bugis, Makassar, Mandar",
              "Gorontalo, Suwawa, Limboto"
            ],
            answer: "Tombulu, Tonsea, Tontemboan, Toulour, Tonsawang",
            explanation: "Sub-etnis Minahasa meliputi Tombulu, Tonsea, Tontemboan, Toulour (Tondano), Tonsawang, Pasan/Ratahan, Ponosakan, dan Bantik."
          },
          {
            type: "matching-pairs",
            visual: "📖",
            question: "Cocokkan kosakata Bahasa Tombulu (Minahasa) berikut dengan artinya:",
            pairs: [
              { left: "Wale", right: "Rumah" },
              { left: "Teles", right: "Beli" },
              { left: "Esa", right: "Satu" },
              { left: "Tou", right: "Manusia / Orang" }
            ],
            explanation: "Wale = rumah, Teles = beli, Esa = satu, dan Tou = manusia/orang."
          },
          {
            type: "fill-input",
            visual: "🙏",
            question: "Ketik kata salam pembuka yang ramah dan penuh hormat khas masyarakat Minahasa:",
            hint: "Petunjuk: diawali huruf 'Ta...'",
            answer: "Tabea",
            acceptedAnswers: ["tabea"],
            explanation: "Tabea adalah salam hormat tradisional masyarakat Minahasa untuk menyapa tamu atau sesama warga."
          },
          {
            type: "word-bank",
            visual: "🛍️",
            question: "Susun arti dari penggalan lirik lagu 'tumeles waleko':",
            bank: ["membeli", "dan", "rumah", "Teles", "artinya", "Wale"],
            answer: "Teles artinya membeli dan Wale rumah",
            explanation: "Dalam Bahasa Tombulu, 'teles' berarti beli dan 'wale' berarti rumah."
          }
        ]
      },
      {
        id: "u2-l2",
        title: "Filosofi & Struktur Adat",
        icon: "🤝",
        xpReward: 30,
        questions: [
          {
            type: "word-bank",
            visual: "🌟",
            question: "Susun terjemahan dari semboyan 'Si Tou Timou Tumou Tou':",
            bank: ["memanusiakan", "hidup", "untuk", "Manusia", "orang", "lain"],
            answer: "Manusia hidup untuk memanusiakan orang lain",
            explanation: "Filosofi luhur yang dipopulerkan Dr. Sam Ratulangi ini menekankan bahwa hidup bermakna jika memanusiakan sesama."
          },
          {
            type: "fill-input",
            visual: "🤲🌾",
            question: "Ketik nama sistem gotong royong dan kerja sama timbal balik warisan leluhur Minahasa:",
            hint: "Petunjuk: diawali huruf 'Ma...'",
            answer: "Mapalus",
            acceptedAnswers: ["mapalus"],
            explanation: "Mapalus adalah etos gotong royong tradisional dalam bertani, membangun rumah, hingga kegiatan sosial."
          },
          {
            type: "matching-pairs",
            visual: "👑",
            question: "Cocokkan sebutan pemimpin adat Minahasa masa lampau dengan perannya:",
            pairs: [
              { left: "Walian", right: "Pemimpin upacara adat & religi" },
              { left: "Tonaas", right: "Pemimpin walak & ahli pertanian" },
              { left: "Teterusan", right: "Panglima perang" },
              { left: "Potuasan", right: "Penasihat adat" }
            ],
            explanation: "Masyarakat Minahasa dahulu tidak mengenal sistem raja, melainkan kepemimpinan Walian, Tonaas, Teterusan, dan Potuasan."
          },
          {
            type: "true-false",
            visual: "📜",
            question: "Benar atau Salah: Ungkapan 'Opo Wailan Wangko' dalam bahasa Tombulu berarti Tuhan Yang Maha Besar.",
            answer: "Benar",
            explanation: "Benar! 'Opo Wailan Wangko' merupakan sebutan untuk Tuhan Yang Maha Agung dalam tradisi bahasa Tombulu."
          },
          {
            type: "multiple-choice",
            visual: "🏔️",
            question: "Apakah nama kuno tanah Minahasa sebelum istilah 'Minahasa' populer digunakan?",
            options: ["Malesung", "Majapahit", "Sriwijaya", "Nusa Ina"],
            answer: "Malesung",
            explanation: "Secara historis dan tradisi lisan, tanah Minahasa dahulu dikenal dengan nama Tanah Malesung."
          }
        ]
      }
    ]
  },
  {
    id: "unit-3",
    title: "Unit 3: Arsitektur & Situs",
    desc: "Walewangko, Waruga, Pinawetengan, Moraya",
    color: "#B45309",
    lessons: [
      {
        id: "u3-l1",
        title: "Rumah Walewangko",
        icon: "🏛️",
        xpReward: 30,
        questions: [
          {
            type: "fill-input",
            image: "./assets/images/walewangko.jpg",
            visual: "🪜🏠🪜",
            question: "Ketik nama rumah adat panggung tradisional Minahasa yang juga dikenal sebagai Rumah Pewaris:",
            hint: "Petunjuk: Wale...",
            answer: "Walewangko",
            acceptedAnswers: ["walewangko", "rumah pewaris", "pewaris"],
            explanation: "Walewangko (rumah besar) atau Rumah Pewaris adalah rumah tradisional masyarakat Minahasa."
          },
          {
            type: "multiple-choice",
            visual: "🪜",
            question: "Apa ciri khas paling ikonik di bagian depan Rumah Pewaris (Walewangko)?",
            options: [
              "Memiliki dua tangga di sisi kiri dan kanan",
              "Atapnya berbentuk perahu terbalik",
              "Tidak memiliki jendela sama sekali",
              "Dibangun dari batu karang laut"
            ],
            answer: "Memiliki dua tangga di sisi kiri dan kanan",
            explanation: "Rumah Pewaris memiliki dua tangga di kanan dan kiri depan, yang menurut tradisi lokal bermakna menangkal roh jahat."
          },
          {
            type: "word-bank",
            visual: "🏠",
            question: "Susun ciri bagian depan rumah adat Walewangko:",
            bank: ["tangga", "memiliki", "depan", "Walewangko", "dua", "di"],
            answer: "Walewangko memiliki dua tangga di depan",
            explanation: "Dua tangga di bagian depan rumah menjadi penanda arsitektur khas Walewangko."
          },
          {
            type: "true-false",
            visual: "🪵",
            question: "Benar atau Salah: Struktur kayu rumah panggung Walewangko dirancang tahan terhadap guncangan gempa dan melindungi dari binatang liar.",
            answer: "Benar",
            explanation: "Benar! Tiang penyangga tinggi menjaga rumah dari kelembapan dan hewan liar, serta konstruksi sambungan kayu lentur terhadap gempa."
          },
          {
            type: "multiple-choice",
            visual: "🛋️",
            question: "Dalam tata ruang Rumah Pewaris (Walewangko), fungsi ruang kolong di bawah rumah di masa lalu adalah...",
            options: [
              "Menyimpan hasil panen dan peralatan bertani",
              "Tempat upacara pemakaman keluarga",
              "Menjadi kolam ikan air tawar",
              "Ruang rapat kepala walak"
            ],
            answer: "Menyimpan hasil panen dan peralatan bertani",
            explanation: "Bagian kolong rumah panggung kerap dimanfaatkan sebagai tempat menyimpan peralatan bertani atau hasil bumi."
          }
        ]
      },
      {
        id: "u3-l2",
        title: "Waruga & Situs Sejarah",
        icon: "🪨",
        xpReward: 35,
        questions: [
          {
            type: "multiple-choice",
            image: "./assets/images/waruga.jpg",
            visual: "🗿",
            question: "Di manakah lokasi kompleks situs Waruga terbesar yang memiliki lebih dari 140 makam batu kuno?",
            options: [
              "Desa Sawangan, Kec. Airmadidi, Minahasa Utara",
              "Pulau Bunaken, Manado",
              "Kota Bitung, Selat Lembeh",
              "Kecamatan Amurang, Minahasa Selatan"
            ],
            answer: "Desa Sawangan, Kec. Airmadidi, Minahasa Utara",
            explanation: "Kompleks Waruga Sawangan di Airmadidi, Minahasa Utara menyimpan lebih dari 140 makam batu megalitik."
          },
          {
            type: "multiple-choice",
            visual: "🧭",
            question: "Bagaimana posisi jenazah di dalam kubur batu Waruga dan ke arah mana posisi tubuhnya dihadapkan?",
            options: [
              "Posisi jongkok menghadap ke utara",
              "Berbaring telentang menghadap ke selatan",
              "Duduk bersila menghadap ke barat",
              "Berdiri tegak menghadap ke timur"
            ],
            answer: "Posisi jongkok menghadap ke utara",
            explanation: "Jenazah diletakkan dalam posisi jongkok (seperti bayi dalam kandungan) dan menghadap utara, arah asal nenek moyang."
          },
          {
            type: "fill-input",
            visual: "🪨",
            question: "Ketik nama situs batu berukir di Tompaso tempat leluhur Minahasa bermusyawarah membagi wilayah:",
            hint: "Petunjuk: Watu Pina...",
            answer: "Watu Pinawetengan",
            acceptedAnswers: ["watu pinawetengan", "pinawetengan", "batu pinawetengan"],
            explanation: "Watu Pinawetengan di Tompaso menjadi monumen bersejarah persatuan dan pembagian wilayah keturunan Toar-Lumimuut."
          },
          {
            type: "matching-pairs",
            visual: "🏰",
            question: "Cocokkan situs bersejarah Minahasa dengan lokasinya/peristiwanya:",
            pairs: [
              { left: "Waruga Sawangan", right: "Kompleks makam batu di Minahasa Utara" },
              { left: "Watu Pinawetengan", right: "Situs musyawarah adat di Tompaso" },
              { left: "Benteng Moraya", right: "Situs Perang Tondano di tepi danau" }
            ],
            explanation: "Benteng Moraya berada di Tondano (bekas Minawanua), Watu Pinawetengan di Tompaso, dan Waruga Sawangan di Airmadidi."
          },
          {
            type: "true-false",
            visual: "⏳",
            question: "Benar atau Salah: Pemerintah kolonial Belanda menghentikan tradisi penguburan di dalam Waruga pada abad ke-19 karena alasan kesehatan (wabah kolera/tifus).",
            answer: "Benar",
            explanation: "Benar! Sekitar tahun 1817–1800-an, pemerintah kolonial melarang penguburan dalam Waruga dan menggantinya dengan penguburan di tanah."
          }
        ]
      }
    ]
  },
  {
    id: "unit-4",
    title: "Unit 4: Kuliner & Busana Adat",
    desc: "Tinutuan, Nasi Jaha, & Tenun Bentenan",
    color: "#0369A1",
    lessons: [
      {
        id: "u4-l1",
        title: "Kuliner Khas Minahasa",
        icon: "🍲",
        xpReward: 30,
        questions: [
          {
            type: "fill-input",
            image: "./assets/images/tinutuan.jpg",
            visual: "🥣🥬",
            question: "Ketik nama bubur sayuran khas Manado/Minahasa berbahan beras, labu kuning, kangkung, bayam, dan jagung:",
            hint: "Petunjuk: diawali huruf 'Ti...'",
            answer: "Tinutuan",
            acceptedAnswers: ["tinutuan", "bubur manado"],
            explanation: "Tinutuan (Bubur Manado) biasa disantap pagi hari bersama perkedel nike, ikan asin, atau sambal roa."
          },
          {
            type: "multiple-choice",
            visual: "🎋🍚",
            question: "Bagaimanakah proses tradisional memasak 'Nasi Jaha' khas Minahasa?",
            options: [
              "Beras ketan, santan, dan jahe dimasukkan ke bambu lalu dibakar",
              "Beras biasa dikukus di atas daun pisang",
              "Ketan digoreng dengan minyak kelapa",
              "Direbus bersama kuah santan di kuali tanah"
            ],
            answer: "Beras ketan, santan, dan jahe dimasukkan ke bambu lalu dibakar",
            explanation: "Nasi Jaha dibuat dari beras ketan, santan, serta bumbu jahe/serai yang dipanggang di dalam batang bambu berlapis daun pisang."
          },
          {
            type: "matching-pairs",
            visual: "🍽️",
            question: "Cocokkan nama hidangan khas Sulawesi Utara/Minahasa dengan deskripsinya:",
            pairs: [
              { left: "Cakalang Fufu", right: "Ikan cakalang olahan asap jepit bambu" },
              { left: "Brenebon", right: "Sup kacang merah gurih khas Manado" },
              { left: "Klappertaart", right: "Kue kelapa muda akulturasi Belanda" },
              { left: "Panada", right: "Kue goreng isi suwiran ikan cakalang" }
            ],
            explanation: "Keempat hidangan ini menjadi ikon kuliner Minahasa-Manado yang memadukan bahan lokal dan akulturasi sejarah."
          },
          {
            type: "true-false",
            visual: "🐟",
            question: "Benar atau Salah: Ikan Nike adalah ikan kecil musiman yang menjadi bahan khas pembuatan perkedel pendamping Tinutuan.",
            answer: "Benar",
            explanation: "Benar! Perkedel Nike dan sambal roa merupakan pelengkap favorit saat menyantap Tinutuan."
          },
          {
            type: "audio-quiz",
            visual: "🎵🎋",
            audioFile: "./assets/audio/si-patokaan.mp3",
            question: "Simak melodi Kolintang pembuka lagu rakyat Minahasa yang ceria ini! Lagu apakah yang dimainkan?",
            melody: [
              { freq: 392.00, delay: 0 },
              { freq: 392.00, delay: 260 },
              { freq: 329.63, delay: 520 },
              { freq: 349.23, delay: 780 },
              { freq: 392.00, delay: 1040 },
              { freq: 440.00, delay: 1300 },
              { freq: 392.00, delay: 1600 }
            ],
            options: ["Si Patokaan", "Soleram", "Ampar-Ampar Pisang", "Apuse"],
            answer: "Si Patokaan",
            explanation: "Nada gembira tersebut merupakan pembuka lagu daerah Minahasa 'Si Patokaan'."
          }
        ]
      },
      {
        id: "u4-l2",
        title: "Kain Tenun Bentenan",
        icon: "🧵",
        xpReward: 35,
        questions: [
          {
            type: "multiple-choice",
            image: "./assets/images/kain.jpg",
            visual: "🧣",
            question: "Apa nama kain tenun ikat ganda sakral khas Minahasa yang sempat tidak diproduksi selama lebih dari 200 tahun?",
            options: ["Kain Bentenan", "Kain Songket", "Kain Ulap Doyo", "Kain Gringsing"],
            answer: "Kain Bentenan",
            explanation: "Kain Bentenan merupakan mahakarya tenun Minahasa yang terakhir ditenun pada abad ke-19 (~1880) sebelum akhirnya dilestarikan kembali."
          },
          {
            type: "word-bank",
            visual: "🌿",
            question: "Susun pernyataan mengenai bahan dasar awal Kain Bentenan:",
            bank: ["dari", "Kain", "serat", "Bentenan", "kayu", "Fuya"],
            answer: "Kain Bentenan dari serat kayu Fuya",
            explanation: "Pada awalnya Kain Bentenan dibuat dari serat kulit kayu (Fuya) serta serat pisang/nanas/bambu (Koffo) sebelum memakai benang katun."
          },
          {
            type: "matching-pairs",
            visual: "🎨",
            question: "Cocokkan istilah terkait Kain Bentenan dengan maknanya:",
            pairs: [
              { left: "Fuya", right: "Serat kulit kayu bahan tenun" },
              { left: "Koffo", right: "Serat tanaman pisang/nanas/bambu" },
              { left: "Ka'iwu Patola", right: "Salah satu motif klasik Bentenan" }
            ],
            explanation: "Kain Bentenan memiliki 7 motif klasik antara lain Kokerah, Ka'iwu Patola, Sinoi, Tinonton Mata, Tinompak Kuda, Pinatikan, dan Tonilama."
          },
          {
            type: "true-false",
            visual: "👘",
            question: "Benar atau Salah: Pada masa lampau, Kain Bentenan dianggap sakral dan dipakai oleh pemimpin adat (Tonaas) serta pemimpin upacara (Walian).",
            answer: "Benar",
            explanation: "Benar! Kain Bentenan digunakan dalam upacara daur hidup, pernikahan, hingga ritual adat oleh Tonaas dan Walian."
          },
          {
            type: "multiple-choice",
            visual: "👔",
            question: "Apakah nama baju adat tradisional pria Minahasa berwarna putih/gelap dengan potongan leher tertutup yang kerap dipadukan dengan selendang adat?",
            options: ["Baju Baniang", "Baju Beskap", "Baju Teluk Belanga", "Baju Bodo"],
            answer: "Baju Baniang",
            explanation: "Pria Minahasa mengenakan Baju Baniang (lengan panjang berkerah tertutup) sedangkan wanita mengenakan kebaya khas Minahasa."
          }
        ]
      }
    ]
  },
  {
    id: "unit-5",
    title: "Unit 5: Tokoh & Alam Minahasa",
    desc: "Pahlawan Nasional & Geografi Sulut",
    color: "#6D28D9",
    lessons: [
      {
        id: "u5-l1",
        title: "Pahlawan Minahasa",
        icon: "🎖️",
        xpReward: 35,
        questions: [
          {
            type: "multiple-choice",
            image: "./assets/images/tokoh.jpg",
            visual: "🎓",
            question: "Tokoh Minahasa kelahiran Tondano (1890) yang meraih gelar doktor di Swiss, menjadi Gubernur Sulawesi pertama, dan anggota PPKI adalah...",
            options: ["Dr. Sam Ratulangi", "A.A. Maramis", "L.N. Palar", "Arnold Mononutu"],
            answer: "Dr. Sam Ratulangi",
            explanation: "Dr. G.S.S.J. Sam Ratulangi adalah Pahlawan Nasional, pendidik, jurnalis, sekaligus Gubernur Sulawesi yang pertama."
          },
          {
            type: "word-bank",
            visual: "👩‍🏫",
            question: "Susun kalimat tentang perjuangan Maria Walanda Maramis pada tahun 1917:",
            bank: ["perempuan", "mendirikan", "untuk", "PIKAT", "Maramis", "pendidikan"],
            answer: "Maramis mendirikan PIKAT untuk pendidikan perempuan",
            explanation: "Maria Walanda Maramis mendirikan organisasi PIKAT (Percintaan Ibu Kepada Anak Turunannya) untuk memajukan pendidikan perempuan."
          },
          {
            type: "matching-pairs",
              image: "./assets/images/pahlawan.jpg",
            visual: "🇮🇩",
            question: "Cocokkan nama Pahlawan Nasional asal Minahasa dengan jasa utamanya:",
            pairs: [
              { left: "A.A. Maramis", right: "Anggota Panitia Sembilan & Menteri Keuangan ORI" },
              { left: "L.N. Palar", right: "Diplomat ulung RI di PBB" },
              { left: "Arie Frederik Lasut", right: "Pendiri Jawatan Pertambangan & Geologi" },
              { left: "John Lie", right: "Laksamana Muda AL penembus blokade" }
            ],
            explanation: "Para tokoh Minahasa berperan besar mulai dari perumusan dasar negara, diplomasi PBB, ekonomi, hingga pertahanan laut."
          },
          {
            type: "fill-input",
            visual: "🏛️",
            question: "Ketik nama organisasi perempuan yang didirikan oleh Maria Walanda Maramis pada 8 Juli 1917:",
            hint: "Petunjuk: singkatan 5 huruf kapital (P...)",
            answer: "PIKAT",
            acceptedAnswers: ["pikat"],
            explanation: "PIKAT (Percintaan Ibu Kepada Anak Turunannya) adalah tonggak emansipasi pendidikan wanita di Minahasa."
          },
          {
            type: "true-false",
            visual: "💰",
            question: "Benar atau Salah: A.A. Maramis adalah salah satu tokoh asal Minahasa yang ikut menandatangani Piagam Jakarta dan Oeang Repoeblik Indonesia (ORI).",
            answer: "Benar",
            explanation: "Benar! Tanda tangan A.A. Maramis tertera pada lembaran Oeang Repoeblik Indonesia (ORI) saat menjabat Menteri Keuangan."
          }
        ]
      },
      {
        id: "u5-l2",
        title: "Alam & Satwa Minahasa",
        icon: "🌋",
        xpReward: 35,
        questions: [
          {
            type: "multiple-choice",
            visual: "🏔️",
            question: "Gunung di kawasan Langowan, Kabupaten Minahasa (~1.370 mdpl) yang namanya berasal dari tokoh leluhur Minahasa dalam cerita rakyat Tombulu bernama 'Opo Kawatak' adalah",
            options: ["Gunung Klabat", "Gunung Lokon", "Gunung Kawatak", "Gunung Soputan"],
            answer: "Gunung Kawatak",
            explanation: "Gunung Kawatak terletak di kawasan Langowan, Kabupaten Minahasa dan dikenal menyimpan kisah sejarah leluhur Opo Kawatak serta tradisi adat masyarakat setempat."
          },
          {
            type: "fill-input",
            visual: "🌊",
            question: "Ketik nama danau vulkanik terbesar di Sulawesi Utara yang dikelilingi oleh wilayah sub-etnis Toulour:",
            hint: "Petunjuk: Danau Ton...",
            answer: "Danau Tondano",
            acceptedAnswers: ["danau tondano", "tondano"],
            explanation: "Danau Tondano adalah danau terbesar di Sulawesi Utara dan menjadi sumber kehidupan masyarakat Toulour (orang danau)."
          },
          {
            type: "multiple-choice",
            visual: "🦉",
            question: "Burung endemik yang menjadi lambang identitas masyarakat Minahasa dan dipercaya sebagai pembawa pesan alam adalah...",
            options: ["Burung Manguni", "Burung Maleo", "Burung Cenderawasih", "Burung Jalak Bali"],
            answer: "Burung Manguni",
            explanation: "Burung Manguni (burung hantu) menjadi simbol kebijaksanaan yang juga tersemat pada lambang resmi kabupaten/kota di Minahasa."
          },
          {
            type: "matching-pairs",
            visual: "🐒",
            question: "Cocokkan satwa endemik & asal kata alam Minahasa berikut:",
            pairs: [
              { left: "Kalawat (Klabat)", right: "Sebutan lokal untuk Babirusa" },
              { left: "Yaki", right: "Monyet hitam jambul khas Sulut" },
              { left: "Tarsius", right: "Primata terkecil bermata besar di Tangkoko" }
            ],
            explanation: "Kata 'Klabat' berasal dari bahasa Tonsea 'Kalawat' (babirusa), sedangkan Yaki dan Tarsius hidup di Cagar Alam Tangkoko."
          },
          {
            type: "true-false",
            visual: "🌋",
            question: "Benar atau Salah: Gunung Lokon dan Gunung Mahawu berada di wilayah Kota Tomohon, dataran tinggi Minahasa.",
            answer: "Benar",
            explanation: "Benar! Kota Tomohon dikenal sebagai kota bunga di dataran tinggi yang diapit oleh Gunung Lokon dan Gunung Mahawu."
          }
        ]
      }
    ]
  }
];

const ENCYCLOPEDIA = [
  {
    image: "./assets/images/kabasaran.jpg",
    title: "1. Tari Kabasaran (Tarian Waraney)",
    text: "Berasal dari kata 'Kawasal ni Sarian', Tari Kabasaran memiliki 3 babak: Cakalele (bertarung), Kumoyak (mengayunkan senjata), dan Lalayaan (gembira usai perang). Penari membawa Santi (pedang), Wengkouw (tombak), Kelung (perisai), serta memakai busana merah Pakeyan Nuak berhias paruh burung Uwak."
  },
  {
    image: "./assets/images/maengket.jpg",
    title: "2. Tari Maengket & Tari Katrili",
    text: "Tari Maengket adalah tarian rakyat berpasangan dengan 3 babak: Maowey Kamberu (syukur panen padi), Marambak (gotong royong membangun rumah), dan Lalayaan (pergaulan muda-mudi). Sementara Tari Katrili merupakan tarian pergaulan hasil akulturasi budaya Eropa-Minahasa."
  },
  {
    image: "./assets/images/kolintang.jpg",
    title: "3. Alat Musik Kolintang (UNESCO 2024)",
    text: "Kolintang berasal dari bunyi bilah kayu ringan (kayu telur, bandaran, wenuang, cempaka): tong-ting-tang. Ansambelnya terdiri dari Ina (melodi), Uner (alto), Karua (tenor), Cella (cello), dan Loway (bass). Resmi diakui UNESCO sebagai Warisan Budaya Takbenda pada 5 Desember 2024."
  },
  {
    image: "./assets/images/suku.jpg",
    title: "4. Sub-Etnis & Bahasa Daerah Minahasa",
    text: "Suku Minahasa ('Mina-esa' = menjadi satu) terdiri dari sub-etnis Tombulu, Tonsea, Tontemboan, Toulour (Tondano), Tonsawang, Pasan/Ratahan, Ponosakan, dan Bantik. Kosakata Tombulu antara lain: Wale (rumah), Teles (beli), Esa (satu), Tou (manusia), Tabea (salam hormat), Opo Wailan Wangko (Tuhan Maha Besar)."
  },
  {
    image: "./assets/images/semboyan.jpg",
    title: "5. Filosofi Hidup & Sistem Kepemimpinan",
    text: "Semboyan 'Si Tou Timou Tumou Tou' (manusia hidup untuk memanusiakan orang lain) berpadu dengan tradisi gotong royong Mapalus. Dahulu masyarakat dipimpin oleh Walian (pemimpin adat/religi), Tonaas (pemimpin walak/pertanian), Teterusan (panglima perang), dan Potuasan (penasihat)."
  },
  {
    image: "./assets/images/walewangko.jpg",
    title: "6. Rumah Adat Walewangko (Rumah Pewaris)",
    text: "Walewangko merupakan rumah panggung kayu dengan dua tangga di sisi kiri dan kanan bagian depan yang dipercaya menangkal roh jahat. Konstruksi sambungan kayunya lentur terhadap gempa, sedangkan kolong rumah berfungsi melindungi penghuni dan menyimpan hasil panen."
  },
  {
    image: "./assets/images/waruga.jpg",
    title: "7. Waruga Sawangan, Pinawetengan & Moraya",
    text: "Waruga adalah makam batu megalitik (terbesar di Desa Sawangan, Minahasa Utara, >140 buah) tempat jenazah diletakkan dalam posisi jongkok menghadap utara. Di Tompaso terdapat Watu Pinawetengan (batu musyawarah pembagian wilayah), dan di Tondano terdapat Benteng Moraya saksi Perang Tondano."
  },
  {
    image: "./assets/images/tinutuan.jpg",
    title: "8. Kuliner Khas: Tinutuan hingga Nasi Jaha",
    text: "Tinutuan (Bubur Manado) memadukan beras, labu kuning, kangkung, bayam, dan jagung, biasa disajikan bersama perkedel nike dan sambal roa. Ada pula Nasi Jaha (ketan, santan, jahe dibakar dalam bambu), Cakalang Fufu (ikan asap), Brenebon (sup kacang merah), Panada, dan Klappertaart."
  },
  {
    image: "./assets/images/bentenan.jpg",
    title: "9. Kain Tenun Bentenan & Busana Adat",
    text: "Kain Bentenan adalah tenun ikat ganda sakral Minahasa yang awalnya terbuat dari serat kulit kayu (Fuya) dan serat pisang/nanas (Koffo), dengan 7 motif klasik seperti Kokerah dan Ka'iwu Patola. Busana adat prianya disebut Baju Baniang, sedangkan wanitanya mengenakan kebaya khas Minahasa."
  },
  {
    image: "./assets/images/pahlawan.jpg",
    title: "10. Pahlawan Nasional & Geografi Minahasa",
    text: "Tokoh Pahlawan Nasional asal Minahasa antara lain Dr. Sam Ratulangi, Maria Walanda Maramis (pendiri PIKAT 1917), A.A. Maramis (penandatangan ORI), L.N. Palar (diplomat PBB), Arie Frederik Lasut, dan John Lie. Ikon alamnya meliputi Gunung Klabat (1.995 mdpl, tertinggi di Sulut), Danau Tondano, Burung Manguni, Yaki, dan Tarsius."
  }
];

function getAllLessonIds() {
  return UNITS.flatMap(u => u.lessons.map(l => l.id));
}

const BADGES = [
  { id: "b-first", icon: "🌱", name: "Langkah Pertama", desc: "Selesaikan 1 modul", check: (s) => s.completedLessons.length >= 1 },
  { id: "b-u1", icon: "🎶", name: "Penjaga Kolintang", desc: "Lulus seluruh Unit 1", check: (s) => ["u1-l1","u1-l2","u1-l3"].every(id => s.completedLessons.includes(id)) },
  { id: "b-u2", icon: "🗣️", name: "Penutur Malesung", desc: "Lulus seluruh Unit 2", check: (s) => ["u2-l1","u2-l2"].every(id => s.completedLessons.includes(id)) },
  { id: "b-u3", icon: "🪨", name: "Penjaga Waruga", desc: "Lulus seluruh Unit 3", check: (s) => ["u3-l1","u3-l2"].every(id => s.completedLessons.includes(id)) },
  { id: "b-u4", icon: "🧵", name: "Pelestari Bentenan", desc: "Lulus seluruh Unit 4", check: (s) => ["u4-l1","u4-l2"].every(id => s.completedLessons.includes(id)) },
  { id: "b-u5", icon: "🎖️", name: "Pewaris Waraney", desc: "Lulus seluruh Unit 5", check: (s) => ["u5-l1","u5-l2"].every(id => s.completedLessons.includes(id)) },
  { id: "b-xp200", icon: "⚡", name: "Pejuang 200 XP", desc: "Kumpulkan minimal 200 XP", check: (s) => s.xp >= 200 },
  { id: "b-master", icon: "🦉", name: "Tonaas Agung Budaya", desc: "Selesaikan seluruh 5 Unit", check: (s) => s.completedLessons.length >= getAllLessonIds().length }
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
    const saved = localStorage.getItem("maesa_minahasa_v7");
    return saved ? { ...DEFAULT_STATE, ...JSON.parse(saved) } : { ...DEFAULT_STATE };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function saveState() {
  localStorage.setItem("maesa_minahasa_v7", JSON.stringify(state));
  renderStats();
}

function getSortedLeaderboard() {
  return [
    { name: "Pingkan", avatar: "👩", xp: 280 },
    { name: "Toar", avatar: "🏹", xp: 210 },
    { name: "Keke", avatar: "🌺", xp: 140 },
    { name: "Opo Lumi", avatar: "🦉", xp: 65 },
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
  if (state.xp >= 300) rankEl.textContent = "Tingkat 4 • Tonaas Agung Minahasa";
  else if (state.xp >= 180) rankEl.textContent = "Tingkat 3 • Waraney Sejati";
  else if (state.xp >= 70) rankEl.textContent = "Tingkat 2 • Pengamat Budaya";
  else rankEl.textContent = "Tingkat 1 • Penjelajah Malesung";

  const totalLessons = getAllLessonIds().length;
  const done = state.completedLessons.length;
  const pct = Math.round((done / totalLessons) * 100);
  document.getElementById("learn-progress-text").textContent = `${done} dari ${totalLessons} modul tuntas`;
  document.getElementById("learn-progress-pct").textContent = `${pct}%`;
  document.getElementById("learn-progress-bar").style.width = `${pct}%`;
}

// IKON CENTANG BELAH KETUPAT BENTENAN (MENGGANTIKAN BINTANG)
const COMPLETED_CHECK_SVG = `
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
`;

function renderLearningPath() {
  const container = document.getElementById("learning-path-container");
  container.innerHTML = "";
  const allIds = getAllLessonIds();

  UNITS.forEach((unit, unitIdx) => {
    const unitDone = unit.lessons.filter(l => state.completedLessons.includes(l.id)).length;
    const section = document.createElement("div");
    section.className = "unit-section";

    section.innerHTML = `
      <div class="unit-header">
        <div>
          <span class="unit-badge" style="background: ${unit.color};">Unit ${unitIdx + 1}</span>
          <h3>${unit.title.replace(/^Unit \d+:\s*/, "")}</h3>
          <p>${unit.desc}</p>
        </div>
        <span class="unit-counter">${unitDone} / ${unit.lessons.length} Tuntas</span>
      </div>
    `;

    const grid = document.createElement("div");
    grid.className = "lesson-grid";

    unit.lessons.forEach((lesson) => {
      const globalIndex = allIds.indexOf(lesson.id);
      const isCompleted = state.completedLessons.includes(lesson.id);
      const isUnlocked = globalIndex === 0 || state.completedLessons.includes(allIds[globalIndex - 1]);

      const card = document.createElement("button");
      card.type = "button";
      card.className = `lesson-card ${isCompleted ? "completed" : isUnlocked ? "unlocked" : "locked"}`;
      card.disabled = !isUnlocked;
      card.innerHTML = `
        <div class="lesson-emblem">${isCompleted ? COMPLETED_CHECK_SVG : isUnlocked ? lesson.icon : "🔒"}</div>
        <div class="lesson-info">
          <h4>${lesson.title}</h4>
          <span class="lesson-meta">${lesson.questions.length} Tantangan • +${lesson.xpReward} XP</span>
        </div>
        <span class="lesson-status">${isCompleted ? "Tuntas" : isUnlocked ? "Mulai →" : "Terkunci"}</span>
      `;
      card.addEventListener("click", () => startLesson(lesson));
      grid.appendChild(card);
    });

    section.appendChild(grid);
    container.appendChild(section);
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
    q.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";
      btn.innerHTML = `<span class="opt-badge">${String.fromCharCode(65 + idx)}</span><span>${opt}</span>`;
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
          showFeedback(true, "Tabea! Semua Pasangan Cocok!", q.explanation);
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
  sheet.className = `feedback-card ${isCorrect ? "correct" : "wrong"}`;
  document.getElementById("feedback-icon").textContent = isCorrect ? "✓" : "✕";
  document.getElementById("feedback-title").textContent = title;
  document.getElementById("feedback-desc").textContent = desc;
  sheet.classList.remove("hidden");
  document.getElementById("quiz-footer").classList.add("hidden");
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
      const title = activeQuiz.combo >= 2 ? `Hebat! Combo x${activeQuiz.combo}` : "Tabea! Jawaban Benar!";
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