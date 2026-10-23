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

/* Vežbe: id, naziv, mišići, opis, napomena za kolena/tetivu, tip (ex = tegovi/reps, hold = sekunde) */
window.VEZBE = {
  zagrevanje: ["Zagrevanje: sobni bicikl ili eliptični", "celo telo", "8–10 minuta laganim tempom, da se zagreju kolena i tetiva. Možeš da pričaš dok voziš.", "Sedište bicikla podesi tako da je koleno blago savijeno u najnižoj tački.", "time"],
  legpress: ["Leg press (potisak nogama)", "butine, zadnjica", "Stopala visoko i u širini ramena na ploči. Spuštaj kontrolisano dok koleno ne bude pod oko 90°, pa potisni nazad bez zaključavanja kolena.", "Ne spuštaj ispod 90°. Stopala visoko = manje pritiska na kolena.", "ex"],
  sedeciprsti: ["Sedeće podizanje na prste (sprava ili tegovi na kolenima)", "list (soleus), ahilova tetiva", "Sedi, koleno pod 90°, prednji deo stopala na stepeniku. Podigni pete što više, zadrži 1 s, pa spuštaj SPORO 3 sekunde.", "Glavna vežba za tetivu. Radi obe noge, a levu možeš i jednu seriju više.", "ex"],
  izometrija: ["Izometrija lista uz zid", "list, ahilova tetiva", "Stani na prste obe noge, uz zid za ravnotežu, i drži 45 s. Kasnije samo na levoj nozi.", "Smanjuje bol u tetivi. Bol do 3/10 je u redu.", "hold"],
  stojeciprsti: ["Stojeće podizanje na prste, sporo spuštanje", "list (gastroknemius), tetiva", "Na stepeniku: podigni se na obe noge, prebaci težinu na LEVU i spuštaj se samo njom 3–4 s ispod nivoa stepenika. Vrati se na obe.", "Ekscentrična (spora) faza najviše jača tetivu.", "ex"],
  jednonozni: ["Jednonožno podizanje na prste (leva pa desna)", "list, tetiva", "Na stepeniku, jedna noga: gore 1 s, dole sporo 3 s. Kad postane lako, drži bučicu u ruci.", "Cilj: da leva noga uradi isto koliko i desna.", "ex"],
  latpull: ["Lat pulldown (vučenje šipke ka grudima)", "leđa, biceps", "Široki hvat, grudi napred, povuci šipku do gornjeg dela grudi, laktovi ka dole. Vrati polako.", "", "ex"],
  chest: ["Chest press mašina", "grudi, rame, triceps", "Ručke u visini grudi, gurni napred bez zaključavanja laktova, vrati polako 2 s.", "", "ex"],
  row: ["Sedeće veslanje (sajla)", "leđa", "Leđa prava, povuci ručku ka stomaku, lopatice skupi, vrati polako.", "", "ex"],
  plank: ["Plank na podlakticama", "stomak, trup", "Telo u pravoj liniji od glave do peta, stomak i zadnjica stegnuti. Ako je teško, oslonac na kolena.", "", "hold"],
  rdl: ["Rumunsko mrtvo dizanje (bučice)", "zadnja loža, zadnjica, leđa", "Kolena blago savijena, zadnjica ide nazad, bučice klize niz butine do ispod kolena. Leđa prava. Gore stegni zadnjicu.", "Kolena se gotovo ne savijaju, pa im je lako.", "ex"],
  hipthrust: ["Hip thrust / most za zadnjicu", "zadnjica, zadnja loža", "Leđa na klupi, stopala na podu, tegovi na kukovima. Podigni kukove dok telo ne bude ravno, stegni 1 s.", "Odlično za kolena: jača zadnjicu koja ih štiti.", "ex"],
  shoulder: ["Potisak za ramena (mašina ili bučice sedeći)", "ramena, triceps", "Sedi uspravno, gurni gore do skoro opruženih ruku, spusti do visine ušiju.", "", "ex"],
  assisted: ["Zgibovi uz pomoć (sprava) ili pulldown uskim hvatom", "leđa, biceps", "Pun opseg, kontrolisano spuštanje.", "", "ex"],
  pallof: ["Pallof press (guma ili sajla)", "trup, kosi stomak", "Bočno uz sajlu ili gumu, ruke ispred grudi. Gurni napred i drži 2 s, ne dozvoli da te okrene. Obe strane.", "", "ex"],
  boxsquat: ["Čučanj na klupu (box squat)", "butine, zadnjica", "Stani ispred klupe, sedi nazad DO klupe kontrolisano, kratko dodirni i ustani. Bez tegova ili sa lakom bučicom na grudima.", "Visina klupe = koleno ne ide ispod 90°. Ako koleno boli, uzmi višu klupu.", "ex"],
  legcurl: ["Pregib za zadnju ložu (leg curl mašina)", "zadnja loža", "Kontrolisano savij nogu, zadrži 1 s, spuštaj polako 2–3 s.", "", "ex"],
  inclinedb: ["Kosi potisak bučicama", "gornje grudi, ramena", "Klupa na 30°, bučice od grudi gore, spuštaj polako.", "", "ex"],
  dbrow: ["Veslanje jednom rukom (bučica)", "leđa", "Jedna ruka i koleno na klupi, povuci bučicu ka kuku, lakat uz telo.", "", "ex"],
  facepull: ["Face pull (guma ili sajla)", "zadnje rame, držanje", "Povuci gumu ka licu, laktovi visoko, raširi ruke na kraju.", "Dobro za držanje i ramena.", "ex"],
  deadbug: ["Dead bug (ležeći, suprotna ruka-noga)", "duboki stomak", "Na leđima, ruke gore, kolena pod 90°. Spusti suprotnu ruku i nogu polako, leđa stalno pritisnuta uz pod.", "", "ex"],
  hodanje: ["Brzo hodanje na traci (blagi uspon)", "kondicija, kalorije", "10–15 minuta, nagib 3–6%, tempo kao da žuriš. Bez trčanja.", "Uspon je blaži za kolena od trčanja. Ako tetiva boli, smanji nagib.", "time"],
};

/* Program: A / B / C. Serije: [vežba, serije, "ponavljanja", odmor u sekundama]. Vežbe za tetivu zavise od faze. */
window.PROGRAM = {
  A: { ime: "Trening A · noge i gornji deo", vezbe: [["zagrevanje", 1, "8–10 min", 0], ["legpress", 3, "10–12", 90], ["TETIVA1", 0, "", 60], ["latpull", 3, "10–12", 75], ["chest", 3, "10–12", 75], ["row", 3, "12", 75], ["plank", 3, "20–40 s", 45]] },
  B: { ime: "Trening B · zadnja loža i ramena", vezbe: [["zagrevanje", 1, "8–10 min", 0], ["rdl", 3, "10", 90], ["hipthrust", 3, "12", 75], ["TETIVA2", 0, "", 60], ["shoulder", 3, "10–12", 75], ["assisted", 3, "8–10", 90], ["pallof", 3, "10 po strani", 45], ["hodanje", 1, "10–15 min", 0]] },
  C: { ime: "Trening C · celo telo", vezbe: [["zagrevanje", 1, "8–10 min", 0], ["boxsquat", 3, "8–10", 90], ["TETIVA1", 0, "", 60], ["legcurl", 3, "12", 75], ["inclinedb", 3, "10", 75], ["dbrow", 3, "10 po ruci", 75], ["facepull", 3, "15", 45], ["deadbug", 3, "10", 45]] },
};

/* Faze za ahilovu tetivu po nedeljama od prvog treninga */
window.TETIVA = [
  { do: 2, ime: "Faza 1 · smirivanje (nedelja 1–2)", T1: [["izometrija", 5, "45 s", 60], ["sedeciprsti", 3, "15 (lako)", 60]], T2: [["izometrija", 5, "45 s", 60]] },
  { do: 6, ime: "Faza 2 · jačanje (nedelja 3–6)", T1: [["sedeciprsti", 3, "12–15 sa tegom", 60], ["stojeciprsti", 3, "15 (spuštanje levom)", 60]], T2: [["stojeciprsti", 3, "15 (spuštanje levom)", 60], ["izometrija", 3, "45 s samo leva", 60]] },
  { do: 999, ime: "Faza 3 · snaga (od 7. nedelje)", T1: [["sedeciprsti", 4, "10 teže", 75], ["jednonozni", 3, "10–12 svaka noga", 60]], T2: [["jednonozni", 3, "12 + bučica", 60], ["stojeciprsti", 2, "15 sporo", 60]] },
];
