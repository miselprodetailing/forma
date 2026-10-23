/* Trening: aktivnosti (MET) i program 3x nedeljno u teretani, prilagođen kolenima i oporavku leve ahilove tetive. */
window.AKTIVNOSTI = [
  ["setnja", "🚶 Šetnja", 3.5, 5],
  ["brzo", "🚶‍♂️ Brzo hodanje", 4.3, 6],
  ["teretana", "🏋️ Teretana", 5.0, 0],
  ["bicikl", "🚴 Bicikl (napolju)", 6.8, 0],
  ["sobni", "🚲 Sobni bicikl", 5.5, 0],
  ["elipticni", "🏃 Eliptični trenažer", 5.0, 0],
  ["plivanje", "🏊 Plivanje", 6.0, 0],
  ["kardio", "❤️ Kardio sprave", 6.0, 0],
  ["fudbal", "⚽ Fudbal / mali fudbal", 7.0, 0],
  ["trcanje", "🏃‍♂️ Trčanje", 8.3, 9],
  ["posao", "🔧 Težak fizički rad (dodatni)", 4.0, 0],
];

/* Vežbe: [običan naziv, kako se zove u teretani, šta jača, kako se radi, napomena za kolena/tetivu, tip (ex|hold|time), YouTube pretraga] */
window.VEZBE = {
  zagrevanje: ["Zagrevanje na biciklu", "sobni bicikl ili eliptični", "celo telo", "Vozi lagano 8–10 minuta, toliko da možeš da pričaš. Zagrevaju se kolena i tetiva.", "Sedište podesi da ti je koleno blago savijeno kad je pedala dole.", "time", "stationary bike warm up"],
  legpress: ["Guranje nogama na spravi", "leg press", "butine i zadnjica", "Sedni, stopala stavi visoko na ploču u širini ramena. Spuštaj polako dok koleno ne bude pod pravim uglom, pa odgurni nazad. Kolena na kraju ne zaključavaj.", "Ne spuštaj niže od pravog ugla. Stopala visoko = manje boli koleno.", "ex", "leg press proper form"],
  sedeciprsti: ["Podizanje na prste sedeći", "seated calf raise", "list i ahilova tetiva", "Sedi, kolena pod pravim uglom, prednji deo stopala na stepeniku ili ploči. Podigni pete najviše što možeš, zadrži 1 sekundu, pa spuštaj POLAKO, brojeći do 3.", "Najvažnija vežba za tvoju tetivu. Levu nogu možeš da radiš jednu seriju više.", "ex", "seated calf raise"],
  izometrija: ["Stajanje na prstima uz zid", "izometrija lista", "list i ahilova tetiva", "Stani na prste obe noge, rukama se pridržavaj za zid i samo DRŽI. Ne mrdaj, samo stoj gore. Kasnije samo na levoj nozi.", "Ovo smiruje bol u tetivi. Blag bol do 3 od 10 je u redu.", "hold", "isometric calf raise achilles"],
  stojeciprsti: ["Podizanje na prste na stepeniku, sporo spuštanje", "eccentric calf raise", "list i ahilova tetiva", "Stani prednjim delom stopala na stepenik. Podigni se na obe noge, pa prebaci težinu na LEVU nogu i spuštaj se samo njom polako (3–4 sekunde) dok peta ne padne malo ispod stepenika.", "Sporo spuštanje najviše jača tetivu.", "ex", "eccentric heel drop achilles"],
  jednonozni: ["Podizanje na prste jednom nogom", "single leg calf raise", "list i ahilova tetiva", "Na stepeniku, na jednoj nozi: gore za 1 sekundu, dole polako za 3. Prvo leva, pa desna. Kad postane lako, uzmi bučicu u ruku.", "Cilj: da leva noga uradi isto koliko i desna.", "ex", "single leg calf raise"],
  latpull: ["Povlačenje šipke odozgo ka grudima", "lat pulldown", "leđa i ruke", "Sedi, uhvati šipku široko. Grudi isturi napred i povuci šipku do gornjeg dela grudi, laktovi idu ka dole. Vraćaj polako gore.", "", "ex", "lat pulldown proper form"],
  chest: ["Guranje ručki od grudi", "chest press mašina", "grudi, ramena, zadnji deo ruke", "Sedi, ručke su u visini grudi. Gurni napred skoro do kraja (ne zaključavaj laktove) i vrati polako za 2 sekunde.", "", "ex", "machine chest press form"],
  row: ["Povlačenje ručke ka stomaku sedeći", "sedeće veslanje na sajli", "leđa", "Sedi, leđa prava, noge malo savijene. Povuci ručku do stomaka i stisni lopatice jednu ka drugoj. Vrati polako.", "", "ex", "seated cable row form"],
  plank: ["Daska na laktovima", "plank", "stomak i leđa", "Osloni se na podlaktice i prste nogu. Telo pravo kao daska, od glave do peta. Stegni stomak i zadnjicu i drži. Ako je teško, spusti kolena na pod.", "", "hold", "forearm plank form"],
  rdl: ["Pregibanje u kukovima sa bučicama", "rumunsko mrtvo dizanje", "zadnji deo butine, zadnjica, leđa", "Stani sa bučicama u rukama, kolena malo savijena. Gurni zadnjicu nazad i pusti da bučice klize niz noge do ispod kolena. Leđa stalno prava. Gore stisni zadnjicu.", "Kolena se skoro ne savijaju, pa ih ova vežba ne opterećuje.", "ex", "dumbbell romanian deadlift form"],
  hipthrust: ["Podizanje kukova, leđa na klupi", "hip thrust", "zadnjica i zadnji deo butine", "Leđa (lopatice) nasloni na klupu, stopala na pod, teg na kukove. Podigni kukove dok telo ne bude ravno kao sto, stisni zadnjicu 1 sekundu, pa spusti.", "Jaka zadnjica štiti kolena.", "ex", "hip thrust form"],
  shoulder: ["Guranje iznad glave sedeći", "potisak za ramena", "ramena", "Sedi uspravno, bučice ili ručke kod ušiju. Gurni gore skoro do kraja i spusti polako do ušiju.", "", "ex", "seated dumbbell shoulder press form"],
  assisted: ["Zgibovi uz pomoć sprave", "assisted pull-up", "leđa i ruke", "Kolena na jastuk sprave koja te gura gore. Uhvati šipku i povuci se dok brada ne pređe šipku, pa se polako spusti. Što veći teg na spravi, lakše je.", "", "ex", "assisted pull up machine form"],
  pallof: ["Guma ispred grudi, ne daj da te okrene", "Pallof press", "stomak sa strane (trup)", "Stani bočno pored sajle ili gume, drži je oberučke ispred grudi. Gurni ruke pravo napred, drži 2 sekunde i ne daj da te povuče u stranu. Uradi obe strane.", "", "ex", "pallof press form"],
  boxsquat: ["Sedanje na klupu i ustajanje", "box squat", "butine i zadnjica", "Stani ispred klupe. Sedi nazad polako dok ne dodirneš klupu, pa odmah ustani. Ruke drži ispred sebe. Kasnije možeš da držiš bučicu na grudima.", "Klupa mora biti dovoljno visoka da koleno ne ide ispod pravog ugla. Ako koleno boli, uzmi višu.", "ex", "box squat to bench form"],
  legcurl: ["Savijanje nogu na spravi", "leg curl", "zadnji deo butine", "Sedi ili lezi na spravu, jastuk je iznad pete. Savij nogu do kraja, zadrži 1 sekundu, pa vraćaj polako.", "", "ex", "seated leg curl form"],
  inclinedb: ["Guranje bučica na kosoj klupi", "kosi potisak bučicama", "grudi i ramena", "Lezi na klupu podignutu malo (oko 30°). Bučice kod grudi, gurni ih gore, pa polako spusti.", "", "ex", "incline dumbbell press form"],
  dbrow: ["Veslanje bučicom jednom rukom", "one arm dumbbell row", "leđa", "Jednu ruku i koleno nasloni na klupu. Drugom rukom povuci bučicu ka kuku, lakat uz telo. Spusti polako.", "", "ex", "one arm dumbbell row form"],
  facepull: ["Povlačenje gume ka licu", "face pull", "zadnji deo ramena, držanje", "Uhvati gumu ili sajlu u visini lica. Povuci je ka licu, laktovi visoko, i na kraju raširi ruke.", "Dobro za držanje i ramena.", "ex", "face pull form"],
  deadbug: ["Ležeći, ruka i noga naizmenično", "dead bug", "duboki stomak", "Lezi na leđa, ruke pravo gore, kolena savijena gore. Polako spusti jednu ruku iza glave i suprotnu nogu napred, pa vrati. Leđa sve vreme pritisnuta uz pod.", "", "ex", "dead bug exercise form"],
  hodanje: ["Brzo hodanje na traci uzbrdo", "incline walk", "kondicija i kalorije", "Hodaj brzo 10–15 minuta, nagib trake 3–6%, kao da žuriš. Bez trčanja.", "Hodanje uzbrdo je blaže za kolena od trčanja. Ako tetiva boli, smanji nagib.", "time", "incline treadmill walking"],
};

/* Program: A / B / C. [vežba, serije, "ponavljanja", odmor u sekundama]. Vežbe za tetivu zavise od faze. */
window.PROGRAM = {
  A: { ime: "Trening A · noge i gornji deo", vezbe: [["zagrevanje", 1, "8 min", 0], ["legpress", 3, "10–12", 90], ["TETIVA1", 0, "", 60], ["latpull", 3, "10–12", 75], ["chest", 3, "10–12", 75], ["row", 3, "12", 75], ["plank", 3, "30 s", 45]] },
  B: { ime: "Trening B · zadnja strana i ramena", vezbe: [["zagrevanje", 1, "8 min", 0], ["rdl", 3, "10", 90], ["hipthrust", 3, "12", 75], ["TETIVA2", 0, "", 60], ["shoulder", 3, "10–12", 75], ["assisted", 3, "8–10", 90], ["pallof", 3, "10 po strani", 45], ["hodanje", 1, "12 min", 0]] },
  C: { ime: "Trening C · celo telo", vezbe: [["zagrevanje", 1, "8 min", 0], ["boxsquat", 3, "8–10", 90], ["TETIVA1", 0, "", 60], ["legcurl", 3, "12", 75], ["inclinedb", 3, "10", 75], ["dbrow", 3, "10 po ruci", 75], ["facepull", 3, "15", 45], ["deadbug", 3, "10", 45]] },
};

/* Faze za ahilovu tetivu po nedeljama od prvog treninga */
window.TETIVA = [
  { do: 2, ime: "Faza 1 · smirivanje (nedelja 1–2)", T1: [["izometrija", 5, "45 s", 60], ["sedeciprsti", 3, "15 lako", 60]], T2: [["izometrija", 5, "45 s", 60]] },
  { do: 6, ime: "Faza 2 · jačanje (nedelja 3–6)", T1: [["sedeciprsti", 3, "12–15", 60], ["stojeciprsti", 3, "15", 60]], T2: [["stojeciprsti", 3, "15", 60], ["izometrija", 3, "45 s samo leva", 60]] },
  { do: 999, ime: "Faza 3 · snaga (od 7. nedelje)", T1: [["sedeciprsti", 4, "10 teže", 75], ["jednonozni", 3, "10–12 svaka noga", 60]], T2: [["jednonozni", 3, "12", 60], ["stojeciprsti", 2, "15", 60]] },
];

/* Animacije: čovečuljak iz profila, dve poze (A i B) koje se smenjuju. Tačke: h glava, n vrat/rame, e lakat, w šaka, p kuk, k koleno, f članak, t prsti; *2 = druga (zadnja) strana. */
(() => {
  const ST = { h: [100, 30], n: [100, 43], e: [100, 63], w: [100, 82], p: [100, 86], k: [101, 113], f: [100, 138], t: [111, 140] };
  const S = (o) => Object.assign({}, ST, o);
  const L = (a, b, c = "#55555e", w = 4) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
  const R = (x, y, w, h, c = "#3a3a42") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${c}"/>`;
  const DB = (p) => R(p[0] - 7, p[1] - 3, 14, 6, "#9aa0aa");
  window.ANIM = {
    zagrevanje: { A: S({ h: [104, 36], n: [100, 48], e: [113, 62], w: [126, 70], p: [88, 90], k: [114, 82], f: [108, 110], t: [118, 112], k2: [108, 96], f2: [98, 126], t2: [108, 128] }),
      B: S({ h: [104, 36], n: [100, 48], e: [113, 62], w: [126, 70], p: [88, 90], k: [108, 96], f: [98, 126], t: [108, 128], k2: [114, 82], f2: [108, 110], t2: [118, 112] }),
      props: () => L([80, 92], [96, 92], "#3a3a42", 6) + L([90, 94], [104, 118], "#3a3a42", 5) + L([104, 118], [126, 72], "#3a3a42", 5) + L([126, 72], [128, 64], "#3a3a42", 5) + `<circle cx="104" cy="118" r="14" fill="none" stroke="#2a2a30" stroke-width="4"/>` },
    hodanje: { A: S({ k: [107, 112], f: [114, 138], t: [124, 139], k2: [95, 112], f2: [86, 136], t2: [96, 139], e: [93, 62], w: [88, 78], e2: [107, 62], w2: [114, 76] }),
      B: S({ k: [95, 112], f: [86, 136], t: [96, 139], k2: [107, 112], f2: [114, 138], t2: [124, 139], e: [107, 62], w: [114, 76], e2: [93, 62], w2: [88, 78] }),
      props: () => L([50, 143], [160, 136], "#3a3a42", 6) + L([140, 136], [140, 70], "#3a3a42", 4) + L([140, 70], [122, 70], "#3a3a42", 4) },
    legpress: { A: S({ h: [52, 66], n: [60, 76], e: [72, 92], w: [86, 100], p: [86, 104], k: [104, 76], f: [130, 88], t: [134, 78] }),
      B: S({ h: [52, 66], n: [60, 76], e: [72, 92], w: [86, 100], p: [86, 104], k: [120, 88], f: [154, 74], t: [158, 64] }),
      props: (q) => L([46, 60], [82, 112], "#3a3a42", 7) + L([82, 112], [100, 112], "#3a3a42", 7) + L([q.t[0] - 4, q.t[1] - 22], [q.f[0] + 6, q.f[1] + 18], "#9aa0aa", 6) },
    sedeciprsti: { A: S({ h: [80, 44], n: [80, 57], e: [94, 78], w: [106, 94], p: [80, 100], k: [108, 100], f: [108, 130], t: [121, 128] }),
      B: S({ h: [80, 40], n: [80, 53], e: [94, 74], w: [106, 90], p: [80, 96], k: [108, 95], f: [110, 120], t: [121, 128] }),
      props: () => R(60, 102, 36, 6) + R(64, 108, 4, 32) + R(88, 108, 4, 32) + R(114, 128, 22, 12, "#2a2a30") },
    izometrija: { A: S({ e: [114, 58], w: [128, 58], f: [100, 134], t: [112, 140] }),
      B: S({ h: [100, 22], n: [100, 35], e: [114, 50], w: [128, 52], p: [100, 78], k: [101, 105], f: [101, 126], t: [111, 140] }),
      props: () => R(130, 10, 8, 132, "#2a2a30") },
    stojeciprsti: { A: S({ h: [100, 34], n: [100, 47], e: [112, 60], w: [126, 62], p: [100, 90], k: [101, 116], f: [98, 138], t: [111, 130] }),
      B: S({ h: [100, 20], n: [100, 33], e: [112, 46], w: [126, 50], p: [100, 76], k: [101, 103], f: [102, 120], t: [112, 130] }),
      props: () => R(104, 130, 34, 12, "#2a2a30") + R(130, 10, 8, 132, "#2a2a30") },
    jednonozni: { A: S({ h: [100, 34], n: [100, 47], e: [112, 60], w: [126, 62], p: [100, 90], k: [101, 116], f: [98, 138], t: [111, 130], k2: [92, 114], f2: [80, 106], t2: [76, 112] }),
      B: S({ h: [100, 20], n: [100, 33], e: [112, 46], w: [126, 50], p: [100, 76], k: [101, 103], f: [102, 120], t: [112, 130], k2: [92, 100], f2: [80, 92], t2: [76, 98] }),
      props: () => R(104, 130, 34, 12, "#2a2a30") + R(130, 10, 8, 132, "#2a2a30") },
    latpull: { A: S({ h: [100, 48], n: [100, 61], e: [90, 40], w: [84, 20], p: [100, 102], k: [126, 102], f: [126, 136], t: [136, 138] }),
      B: S({ h: [100, 48], n: [100, 61], e: [84, 80], w: [90, 62], p: [100, 102], k: [126, 102], f: [126, 136], t: [136, 138] }),
      props: (q) => L([q.w[0] - 26, q.w[1]], [q.w[0] + 26, q.w[1]], "#9aa0aa", 5) + L([q.w[0], q.w[1]], [88, 0], "#2a2a30", 2) + R(84, 104, 30, 6) },
    chest: { A: S({ h: [78, 45], n: [80, 58], e: [66, 72], w: [86, 62], p: [80, 102], k: [106, 102], f: [106, 136], t: [116, 138] }),
      B: S({ h: [78, 45], n: [80, 58], e: [98, 62], w: [120, 61], p: [80, 102], k: [106, 102], f: [106, 136], t: [116, 138] }),
      props: (q) => R(66, 40, 7, 66) + R(70, 104, 34, 6) + L([q.w[0], q.w[1] - 10], [q.w[0], q.w[1] + 10], "#9aa0aa", 5) },
    row: { A: S({ h: [70, 50], n: [72, 63], e: [96, 74], w: [118, 80], p: [70, 106], k: [100, 92], f: [124, 106], t: [128, 96] }),
      B: S({ h: [66, 50], n: [68, 63], e: [52, 80], w: [78, 84], p: [70, 106], k: [100, 92], f: [124, 106], t: [128, 96] }),
      props: (q) => R(50, 108, 50, 6) + L([q.w[0], q.w[1]], [160, 96], "#2a2a30", 2) + R(126, 88, 8, 24, "#3a3a42") },
    plank: { A: S({ h: [42, 106], n: [54, 112], e: [54, 136], w: [74, 137], p: [100, 117], k: [126, 124], f: [152, 132], t: [156, 140] }),
      B: S({ h: [42, 104], n: [54, 110], e: [54, 136], w: [74, 137], p: [100, 113], k: [126, 122], f: [152, 132], t: [156, 140] }), props: () => "" },
    rdl: { A: S({ k: [104, 113], w: [101, 84] }),
      B: S({ h: [140, 66], n: [128, 70], e: [127, 90], w: [126, 108], p: [88, 90], k: [104, 114], f: [100, 138] }), props: (q) => DB(q.w) },
    hipthrust: { A: S({ h: [38, 88], n: [52, 94], e: [64, 110], w: [80, 116], p: [80, 122], k: [106, 102], f: [116, 138], t: [127, 140] }),
      B: S({ h: [38, 88], n: [52, 94], e: [66, 92], w: [82, 92], p: [84, 96], k: [110, 98], f: [116, 138], t: [127, 140] }),
      props: (q) => R(24, 96, 32, 44) + `<circle cx="${q.p[0]}" cy="${q.p[1] - 8}" r="9" fill="#9aa0aa"/>` },
    shoulder: { A: S({ h: [100, 45], n: [100, 58], e: [86, 62], w: [86, 42], p: [100, 102], k: [126, 102], f: [126, 136], t: [136, 138] }),
      B: S({ h: [100, 45], n: [100, 58], e: [93, 38], w: [95, 16], p: [100, 102], k: [126, 102], f: [126, 136], t: [136, 138] }),
      props: (q) => DB(q.w) + R(84, 104, 30, 6) + R(90, 50, 6, 56) },
    assisted: { A: S({ h: [100, 30], n: [100, 42], e: [96, 26], w: [100, 12], p: [100, 84], k: [100, 110], f: [84, 106], t: [76, 104] }),
      B: S({ h: [100, 10], n: [100, 24], e: [86, 30], w: [100, 12], p: [100, 66], k: [100, 92], f: [84, 88], t: [76, 86] }),
      props: (q) => L([66, 10], [134, 10], "#9aa0aa", 5) + R(82, q.k[1] + 2, 26, 6) },
    pallof: { A: S({ e: [108, 66], w: [116, 58] }), B: S({ e: [120, 58], w: [140, 58] }), props: (q) => L(q.w, [168, 58], "#2a2a30", 3) },
    boxsquat: { A: S({ e: [112, 56], w: [126, 58], k: [103, 112] }),
      B: S({ h: [104, 50], n: [98, 62], e: [114, 70], w: [128, 70], p: [80, 100], k: [106, 100], f: [104, 138] }), props: () => R(58, 102, 30, 38) },
    legcurl: { A: S({ h: [80, 45], n: [80, 58], e: [86, 80], w: [90, 100], p: [80, 102], k: [108, 102], f: [138, 104], t: [142, 96] }),
      B: S({ h: [80, 45], n: [80, 58], e: [86, 80], w: [90, 100], p: [80, 102], k: [108, 102], f: [112, 130], t: [122, 132] }),
      props: (q) => R(64, 104, 50, 6) + R(66, 46, 7, 60) + `<circle cx="${q.f[0] + 2}" cy="${q.f[1] - 8}" r="7" fill="#9aa0aa"/>` },
    inclinedb: { A: S({ h: [60, 80], n: [72, 88], e: [84, 104], w: [80, 86], p: [112, 110], k: [132, 100], f: [134, 138], t: [144, 140] }),
      B: S({ h: [60, 80], n: [72, 88], e: [82, 70], w: [90, 52], p: [112, 110], k: [132, 100], f: [134, 138], t: [144, 140] }),
      props: (q) => L([54, 92], [116, 118], "#3a3a42", 8) + DB(q.w) },
    dbrow: { A: S({ h: [50, 76], n: [62, 82], e: [70, 102], w: [72, 120], p: [112, 82], k: [110, 108], f: [132, 108], t: [138, 104], e2: [62, 98], w2: [60, 110], k2: [120, 112], f2: [122, 138], t2: [132, 140] }),
      B: S({ h: [50, 76], n: [62, 82], e: [84, 70], w: [80, 92], p: [112, 82], k: [110, 108], f: [132, 108], t: [138, 104], e2: [62, 98], w2: [60, 110], k2: [120, 112], f2: [122, 138], t2: [132, 140] }),
      props: (q) => R(48, 112, 92, 7) + DB(q.w) },
    facepull: { A: S({ e: [118, 46], w: [138, 42] }), B: S({ e: [88, 36], w: [110, 32] }), props: (q) => L(q.w, [168, 40], "#2a2a30", 3) },
    deadbug: { A: S({ h: [40, 122], n: [52, 126], e: [54, 108], w: [56, 90], p: [98, 128], k: [100, 104], f: [124, 104], t: [126, 96], e2: [54, 108], w2: [58, 90], k2: [98, 104], f2: [122, 104], t2: [124, 96] }),
      B: S({ h: [40, 122], n: [52, 126], e: [38, 120], w: [22, 120], p: [98, 128], k: [122, 124], f: [148, 128], t: [152, 120], e2: [54, 108], w2: [58, 90], k2: [98, 104], f2: [122, 104], t2: [124, 96] }), props: () => "" },
  };
})();
