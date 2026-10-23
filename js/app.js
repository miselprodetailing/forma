/* FORMA: lični dnevnik kalorija, vode i kilaže. Svi podaci su u localStorage na telefonu. */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const KEY = "forma.v1";
  const MEALS = [["dorucak", "Doručak", "🍳"], ["rucak", "Ručak", "🍲"], ["vecera", "Večera", "🍽️"], ["uzina", "Užina", "🍎"]];
  const DAYS = ["Nedelja", "Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak", "Subota"];
  const DAYS_S = ["N", "P", "U", "S", "Č", "P", "S"];
  const MONTHS = ["januar", "februar", "mart", "april", "maj", "jun", "jul", "avgust", "septembar", "oktobar", "novembar", "decembar"];

  /* ---------- storage */
  const fresh = () => ({
    v: 1, onboarded: false,
    profile: { sex: "m", age: 35, height: 180, start: 90, goal: 80, act: 1.55, pace: 550 },
    days: {}, weights: [], custom: [], combos: [], recent: [], badges: {},
  });
  let S;
  try { S = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY) || "null") || {}); } catch (e) { S = fresh(); }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast("Ne mogu da sačuvam podatke na telefon."); } };
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});

  /* ---------- dates */
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const today = () => iso(new Date());
  const addDays = (k, n) => { const [y, m, d] = k.split("-").map(Number); return iso(new Date(y, m - 1, d + n)); };
  const dateOf = (k) => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
  let cur = today();
  const day = (k) => (S.days[k] ||= { items: [], water: 0 });

  /* ---------- math */
  const curWeight = () => (S.weights.length ? S.weights[S.weights.length - 1].kg : S.profile.start);
  function plan() {
    const p = S.profile, w = curWeight();
    const bmr = Math.round(10 * w + 6.25 * p.height - 5 * p.age + (p.sex === "m" ? 5 : -161));
    const tdee = Math.round(bmr * p.act);
    const floor = Math.max(p.sex === "m" ? 1800 : 1400, bmr);
    const target = Math.round(Math.max(floor, tdee - p.pace) / 10) * 10;
    const def = tdee - target;
    const gw = Math.min(p.goal || w, w);
    const prot = Math.round(1.8 * gw), fat = Math.round(0.8 * gw);
    const carb = Math.max(80, Math.round((target - prot * 4 - fat * 9) / 4));
    const water = Math.round(Math.min(4000, Math.max(2000, w * 33)) / 250);
    return { bmr, tdee, target, def, prot, fat, carb, water, rate: (def * 7) / 7700 };
  }
  const tot = (k) => day(k).items.reduce((a, i) => ({ kcal: a.kcal + i.kcal, p: a.p + i.p, c: a.c + i.c, f: a.f + i.f }), { kcal: 0, p: 0, c: 0, f: 0 });
  const r0 = (n) => Math.round(n);
  const r1 = (n) => Math.round(n * 10) / 10;
  const fmt = (n) => r0(n).toLocaleString("sr-RS");
  const norm = (s) => s.toLowerCase().replace(/[šś]/g, "s").replace(/[đ]/g, "dj").replace(/[čć]/g, "c").replace(/[ž]/g, "z").normalize("NFD").replace(/[̀-ͯ]/g, "");

  /* ---------- food list */
  const BASE = window.HRANA.map(([n, kcal, p, c, f, cat, pn, pg], i) => ({ id: "b" + i, n, kcal, p, c, f, cat, pn, pg }));
  const allFoods = () => [...S.custom, ...BASE];
  const findFood = (id) => allFoods().find((x) => x.id === id);
  const LIQ = ["Pića", "Alkohol"];
  const U = (f) => f.u || (LIQ.includes(f.cat) ? "ml" : "g");

  /* ---------- helpers: animated numbers, toast, confetti */
  function countTo(el, to, dur = 900, suffix = "") {
    const from = parseFloat(el.dataset.v || "0"); el.dataset.v = to;
    if (from === to) { el.textContent = fmt(to) + suffix; return; }
    const t0 = performance.now();
    const step = (t) => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = fmt(from + (to - from) * e) + suffix; if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  let toastT;
  function toast(msg, ms = 2600) { const t = $("#toast"); t.textContent = msg; t.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), ms); }
  function confetti() {
    const c = $("#confetti"), cols = ["#e10600", "#ff8a3d", "#ffd166", "#2ee59d", "#4da3ff", "#ffffff"];
    for (let i = 0; i < 70; i++) {
      const p = document.createElement("i");
      p.style.left = Math.random() * 100 + "vw"; p.style.background = cols[i % cols.length];
      p.style.setProperty("--x", (Math.random() * 200 - 100) + "px"); p.style.setProperty("--r", (Math.random() * 900 - 450) + "deg");
      p.style.animationDelay = Math.random() * 0.4 + "s"; c.appendChild(p); setTimeout(() => p.remove(), 2600);
    }
  }
  const vib = (ms = 12) => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) {} };

  /* ---------- streak + badges */
  function streak() {
    const P = plan(); let n = 0; let k = today();
    const okDay = (key) => { const d = S.days[key]; if (!d || !d.items.length) return false; const t = tot(key).kcal; return t > 0 && t <= P.target * 1.03; };
    if (!okDay(k)) k = addDays(k, -1);
    while (okDay(k)) { n++; k = addDays(k, -1); }
    return n;
  }
  const BADGES = [
    ["first", "📝", "Prvi unos", "Upisao prvi obrok"],
    ["s3", "🔥", "3 dana", "3 dana zaredom u cilju"],
    ["s7", "⚡", "Nedelja", "7 dana zaredom"],
    ["s14", "💪", "2 nedelje", "14 dana zaredom"],
    ["s30", "🏆", "Mesec dana", "30 dana zaredom"],
    ["w1", "💧", "Hidriran", "Ispio svu vodu za dan"],
    ["k2", "📉", "−2 kg", "Skinuo prva 2 kg"],
    ["k5", "🎯", "−5 kg", "Skinuo 5 kg"],
    ["k10", "🚀", "−10 kg", "Skinuo 10 kg"],
    ["k15", "🦾", "−15 kg", "Skinuo 15 kg"],
    ["k20", "👑", "−20 kg", "Skinuo 20 kg"],
    ["goal", "🥇", "CILJ!", "Stigao do cilja"],
  ];
  function checkBadges() {
    const got = [], st = streak(), lost = S.profile.start - curWeight();
    const has = { first: Object.values(S.days).some((d) => d.items.length), s3: st >= 3, s7: st >= 7, s14: st >= 14, s30: st >= 30,
      w1: Object.values(S.days).some((d) => d.water >= plan().water), k2: lost >= 2, k5: lost >= 5, k10: lost >= 10, k15: lost >= 15, k20: lost >= 20,
      goal: S.weights.length > 0 && curWeight() <= S.profile.goal };
    BADGES.forEach(([id, ic, nm]) => { if (has[id] && !S.badges[id]) { S.badges[id] = today(); got.push(`${ic} ${nm}`); } });
    if (got.length) { save(); setTimeout(() => { confetti(); vib([30, 40, 30]); toast("Nova nagrada: " + got.join(", "), 3500); }, 700); }
  }

  /* ---------- TIPS */
  const TIPS = [
    "Proteini drže sitost najduže. Svaki obrok neka ima meso, jaja, ribu ili mlečno.",
    "Čaša vode pre obroka smanjuje apetit.",
    "Sokovi i gazirano su skrivene kalorije. Pređi na vodu, kisela ili zero pića.",
    "Hleb uz kuvano jelo je često 300+ kcal viška. Probaj jednu krišku umesto tri.",
    "Pivo od pola litra ima oko 215 kcal, koliko i jedna kifla.",
    "Roštilj može da prođe: uzmi piletinu ili vešalicu, salatu umesto pomfrita.",
    "Ne preskači doručak ako uveče posle toga jedeš duplo.",
    "Spavanje od 7–8 sati smanjuje želju za slatkim narednog dana.",
    "Vagaj se ujutru, posle toaleta, pre doručka. Gledaj trend nedelje, ne jedan dan.",
    "Šetnja od 30–40 min posle večere troši 150–250 kcal.",
    "Jedi polako. Sitost stiže oko 20 minuta posle prvog zalogaja.",
  ];

  /* ================= RENDER: DANAS ================= */
  const C = 2 * Math.PI * 112;
  function renderDay() {
    const P = plan(), T = tot(cur), d = day(cur);
    const isToday = cur === today();
    const dt = dateOf(cur);
    $("#dayKick").textContent = isToday ? "DANAS" : cur === addDays(today(), -1) ? "JUČE" : DAYS[dt.getDay()].toUpperCase();
    $("#dayName").textContent = `${dt.getDate()}. ${MONTHS[dt.getMonth()]}`;
    $("#dayNext").disabled = isToday;

    const pct = T.kcal / P.target, left = P.target - T.kcal;
    const fg = $("#ringFg"), ov = $("#ringOver");
    fg.style.strokeDasharray = C; fg.style.strokeDashoffset = C * (1 - Math.min(1, pct));
    ov.style.strokeDasharray = C; ov.style.strokeDashoffset = C * (1 - Math.min(1, Math.max(0, pct - 1)));
    fg.classList.toggle("warn", pct >= 0.9 && pct <= 1); fg.classList.toggle("bad", pct > 1);
    $("#ringKick").textContent = left >= 0 ? "PREOSTALO" : "PREKO CILJA";
    const rn = $("#ringNum"); rn.classList.toggle("bad", left < 0); countTo(rn, Math.abs(left));
    countTo($("#stTarget"), P.target); countTo($("#stEaten"), T.kcal);
    $("#stStreak").textContent = streak() + "🔥";
    [["P", T.p, P.prot], ["C", T.c, P.carb], ["F", T.f, P.fat]].forEach(([k, v, t]) => {
      countTo($("#m" + k), v, 700); $("#m" + k + "t").textContent = t; $("#b" + k).style.width = Math.min(100, (v / t) * 100) + "%";
    });

    // alert
    const al = $("#alert"); al.hidden = true; al.className = "alert";
    if (T.kcal > 0) {
      if (pct > 1) { al.hidden = false; al.classList.add("bad"); al.innerHTML = `⚠️ Preko si cilja za <b>${fmt(-left)} kcal</b>. ${overTip(-left)}`; }
      else if (pct >= 0.9) { al.hidden = false; al.classList.add("warn"); al.innerHTML = `⏳ Skoro si na limitu, ostalo ti je još <b>${fmt(left)} kcal</b>. Ako si gladan, uzmi nešto lagano: jogurt, voće, povrće.`; }
      else if (!isToday && pct >= 0.75) { al.hidden = false; al.classList.add("ok"); al.innerHTML = "✅ Dan u granicama. Bravo!"; }
    }

    // water
    const g = $("#glasses"); g.innerHTML = "";
    for (let i = 0; i < P.water; i++) {
      const b = document.createElement("button"); b.className = "gl" + (i < d.water ? " on" : ""); b.setAttribute("aria-label", `Čaša ${i + 1}`);
      b.onclick = () => { d.water = i < d.water ? i : i + 1; save(); vib(); renderDay(); if (d.water >= P.water) { toast("💧 Svu vodu si ispio danas. Svaka čast!"); checkBadges(); } };
      g.appendChild(b);
    }
    $("#waterTxt").textContent = `${r1((d.water * 250) / 1000)} / ${r1((P.water * 250) / 1000)} L`;

    // meals
    const host = $("#meals"); host.innerHTML = "";
    MEALS.forEach(([mk, mn, ic]) => {
      const its = d.items.filter((i) => i.meal === mk);
      const sum = its.reduce((a, i) => a + i.kcal, 0);
      const box = document.createElement("div"); box.className = "meal";
      box.innerHTML = `<div class="meal-h"><h3>${ic} ${mn}</h3><div style="display:flex;align-items:center"><span class="k">${fmt(sum)}<small>kcal</small></span><button class="meal-add" aria-label="Dodaj u ${mn}">+</button></div></div>`;
      if (its.length) {
        const ul = document.createElement("ul"); ul.className = "items";
        its.forEach((it, idx) => {
          const li = document.createElement("li"); li.style.animationDelay = idx * 40 + "ms";
          li.innerHTML = `<div class="nm"><b>${esc(it.n)}</b><small>${esc(it.qty)} · P ${r0(it.p)} · UH ${r0(it.c)} · M ${r0(it.f)}</small></div><div class="kc">${fmt(it.kcal)}</div>`;
          li.onclick = () => openEdit(it); ul.appendChild(li);
        });
        box.appendChild(ul);
        const ft = document.createElement("div"); ft.className = "meal-foot";
        ft.innerHTML = `<button data-a="combo">⭐ Sačuvaj kao obrok</button><button data-a="copy">↺ Ponovi sutra</button>`;
        ft.querySelector('[data-a="combo"]').onclick = () => saveCombo(mk, its);
        ft.querySelector('[data-a="copy"]').onclick = () => { const nk = addDays(cur, 1); its.forEach((i) => day(nk).items.push({ ...i, id: uid() })); save(); toast(`Kopirano u ${mn} za sledeći dan`); };
        box.appendChild(ft);
      } else {
        const e = document.createElement("div"); e.className = "empty"; e.textContent = "Još ništa. Dodaj na +"; box.appendChild(e);
      }
      box.querySelector(".meal-add").onclick = () => openAdd(mk);
      host.appendChild(box);
    });
    $("#tip").textContent = "💡 " + TIPS[(dt.getDate() + dt.getMonth()) % TIPS.length];
  }
  function overTip(over) {
    const walk = Math.round(over / 6);
    return `Nije strašno: sutra skini oko ${fmt(Math.min(over, 500))} kcal ili prošetaj još ~${walk} minuta.`;
  }
  const esc = (s) => String(s).replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
  const uid = () => Math.random().toString(36).slice(2, 10);
  const defaultMeal = () => { const h = new Date().getHours(); return h < 11 ? "dorucak" : h < 16 ? "rucak" : h < 21 ? "vecera" : "uzina"; };

  /* ================= SHEET ================= */
  const sheet = $("#sheet"), bg = $("#sheetBg"), body = $("#sheetBody");
  let stopCam = null;
  function openSheet(html) { body.innerHTML = html; sheet.classList.add("on"); bg.classList.add("on"); sheet.scrollTop = 0; }
  function closeSheet() { sheet.classList.remove("on"); bg.classList.remove("on"); if (stopCam) { stopCam(); stopCam = null; } }
  bg.onclick = closeSheet;
  let sy = null; sheet.addEventListener("touchstart", (e) => { if (sheet.scrollTop <= 0) sy = e.touches[0].clientY; }, { passive: true });
  sheet.addEventListener("touchmove", (e) => { if (sy !== null && e.touches[0].clientY - sy > 90) { sy = null; closeSheet(); } }, { passive: true });
  sheet.addEventListener("touchend", () => (sy = null));
  window.addEventListener("popstate", () => { if (sheet.classList.contains("on")) closeSheet(); });

  /* ---------- add: search */
  let addMeal = "dorucak", addTab = "sve";
  function openAdd(meal) {
    addMeal = meal || defaultMeal();
    openSheet(`<div class="sh-title">Dodaj hranu</div>
      <div class="search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M20 20l-4-4" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>
        <input id="q" placeholder="Pretraži: burek, ćevapi, pivo…" autocomplete="off" enterkeyhint="search" />
        <button class="scan" id="scanBtn" aria-label="Skeniraj barkod"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M3 7V4h3M21 7V4h-3M3 17v3h3M21 17v3h-3M7 8v8M10 8v8M13 8v8M16 8v8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button></div>
      <div class="tabs" id="tabs"><button data-t="sve">Sve</button><button data-t="nedavno">Nedavno</button><button data-t="obroci">⭐ Moji obroci</button><button data-t="moje">Moje namirnice</button></div>
      <ul class="res" id="res"></ul>
      <div class="more-row"><button class="chip" id="newFood">+ Nova namirnica</button><button class="chip" id="quickKcal">⚡ Brzi unos kcal</button></div>`);
    const q = $("#q");
    q.oninput = () => listFoods();
    $$("#tabs button").forEach((b) => (b.onclick = () => { addTab = b.dataset.t; listFoods(); }));
    $("#scanBtn").onclick = openScanner;
    $("#newFood").onclick = () => openNewFood();
    $("#quickKcal").onclick = openQuick;
    addTab = S.recent.length ? "nedavno" : "sve";
    listFoods();
    history.pushState({ sheet: 1 }, "");
  }
  function listFoods() {
    const q = norm(($("#q") || { value: "" }).value.trim());
    $$("#tabs button").forEach((b) => b.classList.toggle("on", b.dataset.t === (q ? "sve" : addTab)));
    const ul = $("#res"); ul.innerHTML = "";
    let rows = [];
    if (!q && addTab === "obroci") {
      if (!S.combos.length) { ul.innerHTML = `<li class="empty" style="cursor:default">Nema sačuvanih obroka. U listi dana klikni „⭐ Sačuvaj kao obrok“.</li>`; return; }
      S.combos.forEach((cb) => {
        const k = cb.items.reduce((a, i) => a + i.kcal, 0);
        const li = document.createElement("li");
        li.innerHTML = `<div class="nm"><b>⭐ ${esc(cb.name)}</b><small>${cb.items.length} stavki</small></div><div class="kc">${fmt(k)}<small>kcal</small></div><span class="plus">+</span>`;
        li.onclick = () => { cb.items.forEach((i) => day(cur).items.push({ ...i, id: uid(), meal: addMeal })); save(); closeSheet(); afterAdd(); };
        li.oncontextmenu = (e) => { e.preventDefault(); if (confirm(`Obrisati obrok „${cb.name}“?`)) { S.combos = S.combos.filter((x) => x !== cb); save(); listFoods(); } };
        ul.appendChild(li);
      });
      return;
    }
    if (!q && addTab === "nedavno") rows = S.recent.map((r) => ({ ...findFood(r.id), last: r })).filter((x) => x.id);
    else if (!q && addTab === "moje") rows = S.custom;
    else if (!q) rows = allFoods();
    else {
      const words = q.split(/\s+/);
      rows = allFoods().map((f) => { const n = norm(f.n); let s = 0; words.forEach((w) => { if (n.startsWith(w)) s += 3; else if (n.includes(" " + w)) s += 2; else if (n.includes(w)) s += 1; else s -= 9; }); return [s, f]; })
        .filter(([s]) => s > 0).sort((a, b) => b[0] - a[0]).map((x) => x[1]);
    }
    if (!rows.length) { ul.innerHTML = `<li class="empty" style="cursor:default">Nema rezultata. Dodaj kao novu namirnicu ili skeniraj barkod.</li>`; return; }
    rows.slice(0, 60).forEach((f, i) => {
      const li = document.createElement("li"); li.style.animationDelay = Math.min(i, 12) * 18 + "ms";
      const sub = f.last ? `zadnji put: ${esc(f.last.qty)}` : `${f.pn} = ${f.pg} ${U(f)} · ${f.cat || "moje"}`;
      li.innerHTML = `<div class="nm"><b>${esc(f.n)}</b><small>${sub}</small></div><div class="kc">${fmt(f.kcal)}<small>kcal/100${U(f)}</small></div><span class="plus">+</span>`;
      li.onclick = () => openAmount(f, null, f.last);
      ul.appendChild(li);
    });
  }

  /* ---------- amount */
  function openAmount(f, edit, last) {
    const unitPortion = edit ? edit.mode === "por" : last ? last.mode === "por" : f.pn && f.pg && f.pn !== "g";
    let mode = unitPortion ? "por" : "g";
    let val = edit ? edit.amt : last ? last.amt : mode === "por" ? 1 : 100;
    let meal = edit ? edit.meal : addMeal;
    const u = U(f);
    openSheet(`<div class="amt-name">${esc(f.n)}</div><div class="amt-sub">${fmt(f.kcal)} kcal na 100 ${u} · ${f.pn} = ${f.pg} ${u}</div>
      <div class="amt-kcal"><b id="aK">0</b><span>kcal</span></div>
      <div class="amt-mac"><div><b id="aP">0</b>proteini</div><div><b id="aC">0</b>ugljeni h.</div><div><b id="aF">0</b>masti</div></div>
      <div class="unit"><button data-u="por">${esc(f.pn)} (${f.pg} ${u})</button><button data-u="g">${u === "ml" ? "mililitri" : "grami"}</button></div>
      <div class="stepper"><button id="mn">−</button><input id="av" inputmode="decimal" /><button id="pl">+</button></div>
      <div class="quick" id="qk"></div>
      <div class="mealpick" id="mp">${MEALS.map(([k, n]) => `<button data-m="${k}">${n}</button>`).join("")}</div>
      <button class="btn red" id="ok">${edit ? "Sačuvaj izmenu" : "Dodaj"}</button>
      ${edit ? '<button class="btn danger" id="del">Obriši</button>' : ""}`);
    const grams = () => (mode === "por" ? val * f.pg : val);
    const upd = () => {
      const g = grams(), k = (f.kcal * g) / 100;
      $("#av").value = mode === "por" ? r1(val) : r0(val);
      countTo($("#aK"), k, 350); $("#aP").textContent = r1((f.p * g) / 100); $("#aC").textContent = r1((f.c * g) / 100); $("#aF").textContent = r1((f.f * g) / 100);
      $$(".unit button").forEach((b) => b.classList.toggle("on", b.dataset.u === mode));
      $$("#mp button").forEach((b) => b.classList.toggle("on", b.dataset.m === meal));
      $("#qk").innerHTML = (mode === "por" ? [0.5, 1, 1.5, 2, 3] : u === "ml" ? [100, 200, 250, 330, 500] : [50, 100, 150, 200, 300]).map((x) => `<button data-q="${x}">${mode === "por" ? x + " " + f.pn : x + " " + u}</button>`).join("");
      $$("#qk button").forEach((b) => (b.onclick = () => { val = +b.dataset.q; vib(); upd(); }));
    };
    $$(".unit button").forEach((b) => (b.onclick = () => { if (b.dataset.u === mode) return; val = b.dataset.u === "g" ? r0(val * f.pg) : r1(val / f.pg) || 1; mode = b.dataset.u; upd(); }));
    const stp = () => (mode === "por" ? (val > 1 || f.pg <= 60 ? 1 : 0.5) : 10);
    $("#mn").onclick = () => { val = Math.max(0, r1(val - stp())); vib(); upd(); };
    $("#pl").onclick = () => { val = r1(val + stp()); vib(); upd(); };
    $("#av").oninput = (e) => { const n = parseFloat(String(e.target.value).replace(",", ".")); if (!isNaN(n)) { val = n; const g = grams(); countTo($("#aK"), (f.kcal * g) / 100, 200); } };
    $("#av").onblur = upd;
    $$("#mp button").forEach((b) => (b.onclick = () => { meal = b.dataset.m; upd(); }));
    $("#ok").onclick = () => {
      const g = grams(); if (!(g > 0)) { toast("Upiši količinu"); return; }
      const qty = mode === "por" ? `${r1(val)} ${f.pn} (${r0(g)} ${u})` : `${r0(g)} ${u}`;
      const it = { id: edit ? edit.id : uid(), fid: f.id, n: f.n, g, amt: val, mode, qty, meal, kcal: (f.kcal * g) / 100, p: (f.p * g) / 100, c: (f.c * g) / 100, f: (f.f * g) / 100, t: Date.now() };
      const d = day(cur);
      if (edit) d.items[d.items.findIndex((x) => x.id === edit.id)] = it; else d.items.push(it);
      S.recent = [{ id: f.id, amt: val, mode, qty }, ...S.recent.filter((r) => r.id !== f.id)].slice(0, 25);
      save(); closeSheet(); afterAdd(!edit);
    };
    if (edit) $("#del").onclick = () => { const d = day(cur); d.items = d.items.filter((x) => x.id !== edit.id); save(); closeSheet(); renderDay(); toast("Obrisano"); };
    upd();
  }
  function openEdit(it) {
    const f = findFood(it.fid) || { id: it.fid, n: it.n, kcal: (it.kcal / it.g) * 100, p: (it.p / it.g) * 100, c: (it.c / it.g) * 100, f: (it.f / it.g) * 100, pn: "porcija", pg: it.g };
    openAmount(f, it); history.pushState({ sheet: 1 }, "");
  }
  function afterAdd(isNew = true) {
    const before = plan().target;
    renderDay(); vib(15);
    const T = tot(cur).kcal;
    if (isNew) {
      if (T > before) { $(".ring-wrap").classList.remove("shake"); void $(".ring-wrap").offsetWidth; $(".ring-wrap").classList.add("shake"); vib([60, 50, 60]); toast(`⚠️ Prešao si dnevni cilj za ${fmt(T - before)} kcal`); }
      else if (T > before * 0.9) toast(`⏳ Ostalo ti je još ${fmt(before - T)} kcal za danas`);
      else toast(`✅ Dodato. Ostalo: ${fmt(before - T)} kcal`);
    }
    checkBadges();
  }

  /* ---------- combos */
  function saveCombo(mk, its) {
    const name = prompt("Ime obroka (npr. Moj doručak):", MEALS.find((m) => m[0] === mk)[1]);
    if (!name) return;
    S.combos.unshift({ name: name.trim(), items: its.map(({ id, ...r }) => r) }); save(); toast(`⭐ Sačuvano: ${name}`);
  }

  /* ---------- quick kcal + new food */
  function openQuick() {
    openSheet(`<div class="sh-title">Brzi unos</div><p class="small" style="margin:0 0 6px">Kad ne znaš tačno šta je, a znaš otprilike kalorije (npr. sa ambalaže ili menija).</p>
      <div class="fld">Šta je<input id="qn" placeholder="npr. Ručak u restoranu" /></div>
      <div class="fld">Kalorije (kcal)<input id="qk2" inputmode="numeric" placeholder="npr. 850" /></div>
      <div class="mealpick" id="mp" style="margin-top:14px">${MEALS.map(([k, n]) => `<button data-m="${k}" class="${k === addMeal ? "on" : ""}">${n}</button>`).join("")}</div>
      <button class="btn red" id="ok">Dodaj</button>`);
    let meal = addMeal;
    $$("#mp button").forEach((b) => (b.onclick = () => { meal = b.dataset.m; $$("#mp button").forEach((x) => x.classList.toggle("on", x === b)); }));
    $("#ok").onclick = () => {
      const k = parseFloat($("#qk2").value); if (!(k > 0)) { toast("Upiši kalorije"); return; }
      day(cur).items.push({ id: uid(), fid: "quick", n: $("#qn").value.trim() || "Brzi unos", g: 100, amt: 1, mode: "por", qty: "brzi unos", meal, kcal: k, p: 0, c: 0, f: 0, t: Date.now() });
      save(); closeSheet(); afterAdd();
    };
  }
  function openNewFood(pre = {}) {
    openSheet(`<div class="sh-title">Nova namirnica</div>
      <div class="fld">Naziv<input id="nn" value="${esc(pre.n || "")}" placeholder="npr. Jogurt Moja Kravica" /></div>
      <div class="unit" id="nu" style="margin-top:12px"><button type="button" data-u="g">Hrana (na 100 g)</button><button type="button" data-u="ml">Piće (na 100 ml)</button></div>
      <p class="small" style="margin:0">Vrednosti sa ambalaže, deo „hranljiva vrednost na 100 g / 100 ml“:</p>
      <div class="grid2"><div class="fld">Kalorije<input id="nk" inputmode="decimal" value="${pre.kcal ?? ""}" /></div><div class="fld">Proteini (g)<input id="np" inputmode="decimal" value="${pre.p ?? ""}" /></div>
      <div class="fld">Ugljeni hidrati (g)<input id="nc" inputmode="decimal" value="${pre.c ?? ""}" /></div><div class="fld">Masti (g)<input id="nf" inputmode="decimal" value="${pre.f ?? ""}" /></div></div>
      <div class="grid2"><div class="fld">Porcija se zove<input id="npn" value="${esc(pre.pn || "porcija")}" /></div><div class="fld" id="npgL">Količina u porciji<input id="npg" inputmode="decimal" value="${pre.pg || 100}" /></div></div>
      <button class="btn red" id="ok">Sačuvaj i dodaj</button>`);
    let nu = pre.u || "g";
    const setU = () => { $$("#nu button").forEach((b) => b.classList.toggle("on", b.dataset.u === nu)); $("#npgL").firstChild.textContent = nu === "ml" ? "Mililitara u porciji" : "Grama u porciji"; };
    $$("#nu button").forEach((b) => (b.onclick = () => { nu = b.dataset.u; if (nu === "ml" && $("#npn").value === "porcija") { $("#npn").value = "flaša"; } setU(); }));
    setU();
    $("#ok").onclick = () => {
      const num = (id) => parseFloat(String($(id).value).replace(",", ".")) || 0;
      const n = $("#nn").value.trim(); if (!n || !(num("#nk") >= 0)) { toast("Upiši naziv i kalorije"); return; }
      const f = { id: "c" + uid(), n, kcal: num("#nk"), p: num("#np"), c: num("#nc"), f: num("#nf"), cat: "moje", u: nu, uv: 2, pn: $("#npn").value.trim() || "porcija", pg: num("#npg") || 100, code: pre.code };
      S.custom.unshift(f); save(); openAmount(f);
    };
  }

  /* ---------- barcode scanner (Open Food Facts) */
  async function lookupCode(code) {
    const mine = S.custom.find((f) => f.code === code);
    if (mine && mine.uv) return openAmount(mine);
    toast("Tražim proizvod…", 4000);
    try {
      const r = await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}.json?fields=product_name,brands,nutriments,serving_quantity,serving_quantity_unit,serving_size,quantity,product_quantity,product_quantity_unit,categories_tags`);
      const j = await r.json();
      if (j.status === 1 && j.product && j.product.nutriments && j.product.nutriments["energy-kcal_100g"] != null) {
        const p = j.product, nt = p.nutriments;
        const qtxt = String(p.quantity || "") + " " + String(p.serving_size || "");
        const liquid = /\b\d+([.,]\d+)?\s*(ml|cl|dl|l)\b/i.test(qtxt) || ["ml", "l", "cl", "dl"].includes(String(p.product_quantity_unit || p.serving_quantity_unit || "").toLowerCase())
          || (p.categories_tags || []).some((t) => /beverage|drink|water|juice|soda|beer|wine/i.test(t));
        // package size in ml / g
        let pack = parseFloat(p.product_quantity) || 0;
        const m = String(p.quantity || "").replace(",", ".").match(/(\d+(\.\d+)?)\s*(ml|cl|dl|l|g|kg)\b/i);
        if (m) { const v = parseFloat(m[1]), un = m[3].toLowerCase(); pack = un === "l" ? v * 1000 : un === "dl" ? v * 100 : un === "cl" ? v * 10 : un === "kg" ? v * 1000 : v; }
        const u = liquid ? "ml" : "g";
        const pn = liquid ? (pack >= 1000 ? "flaša " + r1(pack / 1000) + " L" : pack >= 300 && pack <= 500 ? "limenka/flaša" : "pakovanje") : p.serving_quantity ? "porcija" : "pakovanje";
        const pg = r0(liquid ? pack || p.serving_quantity || 250 : p.serving_quantity || pack || 100);
        const f = { id: mine ? mine.id : "c" + uid(), code, u, uv: 2, n: [p.product_name, p.brands && p.brands.split(",")[0]].filter(Boolean).join(" · ") || "Proizvod " + code,
          kcal: r1(nt["energy-kcal_100g"]), p: r1(nt.proteins_100g || 0), c: r1(nt.carbohydrates_100g || 0), f: r1(nt.fat_100g || 0), cat: liquid ? "Pića" : "skenirano", pn, pg };
        S.custom = S.custom.filter((x) => x.code !== code); S.custom.unshift(f); save(); toast("✅ Pronađeno: " + f.n); openAmount(f); return;
      }
      if (mine) return openAmount(mine);
      toast("Proizvod nije u bazi. Upiši vrednosti sa ambalaže.", 3500); openNewFood({ code });
    } catch (e) { if (mine) return openAmount(mine); toast("Nema interneta. Upiši vrednosti sa ambalaže.", 3500); openNewFood({ code }); }
  }
  async function openScanner() {
    const manual = `<div class="fld">Ili upiši broj barkoda<input id="bc" inputmode="numeric" placeholder="npr. 8600..." /></div><button class="btn ghost" id="bcGo">Traži</button>`;
    if (!("BarcodeDetector" in window) || !navigator.mediaDevices) {
      openSheet(`<div class="sh-title">Barkod</div><p class="small">Ovaj pregledač ne podržava skeniranje kamerom.</p>${manual}`);
      $("#bcGo").onclick = () => { const c = $("#bc").value.trim(); if (c) lookupCode(c); };
      return;
    }
    openSheet(`<div class="sh-title">Skeniraj barkod</div><div class="scanbox"><video id="cam" playsinline muted></video><div class="frame"></div><div class="laser"></div></div>${manual}`);
    $("#bcGo").onclick = () => { const c = $("#bc").value.trim(); if (c) { if (stopCam) stopCam(); lookupCode(c); } };
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      const v = $("#cam"); v.srcObject = stream; await v.play();
      const det = new BarcodeDetector({ formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128"] });
      let alive = true;
      stopCam = () => { alive = false; stream.getTracks().forEach((t) => t.stop()); };
      const loop = async () => {
        if (!alive) return;
        try { const codes = await det.detect(v); if (codes.length) { vib([40, 30, 40]); const c = codes[0].rawValue; stopCam(); stopCam = null; lookupCode(c); return; } } catch (e) {}
        setTimeout(loop, 220);
      };
      loop();
    } catch (e) { toast("Dozvoli pristup kameri u podešavanjima.", 3500); }
  }

  /* ================= NAPREDAK ================= */
  function renderProgress() {
    const p = S.profile, w = curWeight(), lost = p.start - w;
    $("#wNow").textContent = r1(w) + " kg"; $("#wLost").textContent = (lost >= 0 ? "−" : "+") + r1(Math.abs(lost)) + " kg"; $("#wGoal").textContent = r1(p.goal) + " kg";
    const span = p.start - p.goal; $("#wProg").style.width = "0";
    requestAnimationFrame(() => setTimeout(() => ($("#wProg").style.width = Math.max(2, Math.min(100, (lost / span) * 100)) + "%"), 60));
    // ETA
    const P = plan(); let rate = P.rate;
    if (S.weights.length >= 2) {
      const a = S.weights[0], b = S.weights[S.weights.length - 1], days = (dateOf(b.d) - dateOf(a.d)) / 864e5;
      if (days >= 10 && a.kg > b.kg) rate = ((a.kg - b.kg) / days) * 7;
    }
    const left = w - p.goal;
    if (left <= 0) $("#wEta").innerHTML = "🥇 <b>Stigao si do cilja!</b>";
    else { const weeks = left / Math.max(0.2, rate), eta = new Date(Date.now() + weeks * 7 * 864e5);
      $("#wEta").innerHTML = `Ovim tempom (≈ ${r1(rate)} kg nedeljno) cilj stiže oko <b>${eta.getDate()}. ${MONTHS[eta.getMonth()]} ${eta.getFullYear()}.</b>`; }
    drawWeight(); drawWeek(); drawBadges();
  }
  function drawWeight() {
    const svg = $("#wChart"), p = S.profile;
    const pts = S.weights.length ? S.weights : [{ d: today(), kg: p.start }];
    const W = 340, H = 180, pad = 26;
    const ks = pts.map((x) => x.kg).concat([p.goal, p.start]);
    const mx = Math.ceil(Math.max(...ks) + 1), mn = Math.floor(Math.min(...ks) - 1);
    const t0 = dateOf(pts[0].d).getTime(), t1 = Math.max(dateOf(pts[pts.length - 1].d).getTime(), t0 + 7 * 864e5);
    const X = (d) => pad + ((dateOf(d).getTime() - t0) / (t1 - t0)) * (W - pad - 10), Y = (kg) => 10 + ((mx - kg) / (mx - mn)) * (H - 34);
    let g = `<defs><linearGradient id="gArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(255,59,47,0.35)"/><stop offset="1" stop-color="rgba(255,59,47,0)"/></linearGradient></defs>`;
    for (let i = 0; i <= 4; i++) { const kg = mn + ((mx - mn) * i) / 4, y = Y(kg); g += `<line class="gridl" x1="${pad}" x2="${W}" y1="${y}" y2="${y}"/><text x="0" y="${y + 3}">${r0(kg)}</text>`; }
    g += `<line class="goal" x1="${pad}" x2="${W}" y1="${Y(p.goal)}" y2="${Y(p.goal)}"/><text x="${W - 40}" y="${Y(p.goal) - 4}" style="fill:#2ee59d">CILJ</text>`;
    const line = pts.map((x, i) => `${i ? "L" : "M"}${X(x.d).toFixed(1)},${Y(x.kg).toFixed(1)}`).join(" ");
    if (pts.length > 1) g += `<path class="area" d="${line} L${X(pts[pts.length - 1].d)},${H - 24} L${X(pts[0].d)},${H - 24} Z"/>`;
    g += `<path class="line" id="wl" d="${line}"/>`;
    pts.forEach((x) => (g += `<circle class="dot" cx="${X(x.d)}" cy="${Y(x.kg)}" r="4"/>`));
    const f = dateOf(pts[0].d), l = dateOf(pts[pts.length - 1].d);
    g += `<text x="${pad}" y="${H - 6}">${f.getDate()}.${f.getMonth() + 1}.</text><text x="${W - 34}" y="${H - 6}">${l.getDate()}.${l.getMonth() + 1}.</text>`;
    svg.innerHTML = g;
    const path = $("#wl"); if (path && path.getTotalLength) { const L = path.getTotalLength(); path.style.strokeDasharray = L; path.style.strokeDashoffset = L; path.getBoundingClientRect(); path.style.transition = "stroke-dashoffset 1.4s cubic-bezier(.2,.8,.2,1)"; path.style.strokeDashoffset = 0; }
  }
  function drawWeek() {
    const svg = $("#wkChart"), P = plan(), W = 340, H = 170, bw = 30;
    const ks = Array.from({ length: 7 }, (_, i) => addDays(today(), i - 6));
    const vals = ks.map((k) => (S.days[k] ? tot(k).kcal : 0));
    const mx = Math.max(P.target * 1.3, ...vals);
    const Y = (v) => H - 10 - (v / mx) * (H - 24);
    let g = `<line class="tline" x1="0" x2="${W}" y1="${Y(P.target)}" y2="${Y(P.target)}"/><text x="2" y="${Y(P.target) - 4}">cilj ${fmt(P.target)}</text>`;
    vals.forEach((v, i) => {
      const x = 12 + i * ((W - 24) / 7) + ((W - 24) / 7 - bw) / 2, h = Math.max(3, H - 10 - Y(v));
      const col = !v ? "rgba(255,255,255,0.08)" : v > P.target * 1.03 ? "#ff3b2f" : v > P.target * 0.9 ? "#ffb020" : "#2ee59d";
      g += `<rect x="${x}" y="${H - 10}" width="${bw}" height="0" rx="7" fill="${col}"><animate attributeName="height" from="0" to="${h}" dur=".8s" begin="${i * 0.07}s" fill="freeze" calcMode="spline" keySplines=".2 .8 .2 1" keyTimes="0;1"/><animate attributeName="y" from="${H - 10}" to="${H - 10 - h}" dur=".8s" begin="${i * 0.07}s" fill="freeze" calcMode="spline" keySplines=".2 .8 .2 1" keyTimes="0;1"/></rect>`;
    });
    svg.innerHTML = g;
    $("#wkLbl").innerHTML = ks.map((k) => `<span>${DAYS_S[dateOf(k).getDay()]}</span>`).join("");
    const logged = vals.filter((v) => v > 0);
    $("#wkAvg").textContent = logged.length ? `prosek ${fmt(logged.reduce((a, b) => a + b, 0) / logged.length)} kcal` : "";
  }
  function drawBadges() {
    $("#badges").innerHTML = BADGES.map(([id, ic, nm, ds]) => `<div class="bd ${S.badges[id] ? "on" : ""}"><i>${ic}</i><b>${nm}</b><small>${ds}</small></div>`).join("");
  }
  $("#addWeight").onclick = () => {
    openSheet(`<div class="sh-title">Upiši kilažu</div><p class="small" style="margin-top:0">Najbolje ujutru, posle toaleta, pre doručka.</p>
      <div class="stepper" style="margin-top:12px"><button id="mn">−</button><input id="wv" inputmode="decimal" value="${r1(curWeight())}" /><button id="pl">+</button></div>
      <div class="fld">Datum<input id="wd" type="date" value="${today()}" max="${today()}" /></div>
      <button class="btn red" id="ok">Sačuvaj</button>`);
    const wv = $("#wv"), g = () => parseFloat(String(wv.value).replace(",", "."));
    $("#mn").onclick = () => (wv.value = r1(g() - 0.1)); $("#pl").onclick = () => (wv.value = r1(g() + 0.1));
    $("#ok").onclick = () => {
      const kg = g(), d = $("#wd").value || today(); if (!(kg > 30 && kg < 300)) { toast("Proveri kilažu"); return; }
      const prev = curWeight();
      S.weights = S.weights.filter((x) => x.d !== d).concat([{ d, kg }]).sort((a, b) => (a.d < b.d ? -1 : 1));
      save(); closeSheet(); renderProgress(); renderDay();
      const diff = r1(prev - kg); toast(diff > 0 ? `📉 −${diff} kg od prošlog merenja. Odlično!` : diff < 0 ? `Malo gore (+${-diff} kg). Gledaj trend nedelje, ne jedan dan.` : "Sačuvano");
      checkBadges();
    };
    history.pushState({ sheet: 1 }, "");
  };

  /* ================= PROFIL ================= */
  function renderProfile() {
    const P = plan(), f = $("#profForm"), p = S.profile;
    countTo($("#pTarget"), P.target); $("#pBmr").textContent = fmt(P.bmr) + " kcal"; $("#pTdee").textContent = fmt(P.tdee) + " kcal";
    $("#pDef").textContent = "−" + fmt(P.def) + " kcal/dan"; $("#pRate").textContent = "≈ −" + r1(P.rate) + " kg nedeljno";
    ["age", "height", "start", "goal", "sex"].forEach((k) => (f[k].value = p[k]));
    f.act.value = String(p.act); f.pace.value = String(p.pace);
  }
  $("#profForm").onsubmit = (e) => {
    e.preventDefault(); const f = e.target, n = (k) => parseFloat(String(f[k].value).replace(",", "."));
    Object.assign(S.profile, { age: n("age"), height: n("height"), start: n("start"), goal: n("goal"), sex: f.sex.value, act: n("act"), pace: n("pace") });
    save(); renderProfile(); renderDay(); vib(); toast("✅ Plan je ažuriran: " + fmt(plan().target) + " kcal dnevno");
  };
  $("#exportBtn").onclick = () => {
    const blob = new Blob([JSON.stringify(S)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `forma-rezerva-${today()}.json`; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000); toast("Rezervna kopija je sačuvana u Preuzimanja (Downloads)");
  };
  $("#importFile").onchange = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const rd = new FileReader(); rd.onload = () => {
      try { const d = JSON.parse(rd.result); if (!d.days || !d.profile) throw 0; if (!confirm("Zameniti sve trenutne podatke podacima iz rezervne kopije?")) return; S = Object.assign(fresh(), d); save(); renderAll(); toast("✅ Podaci su vraćeni"); }
      catch (err) { toast("Ovo nije ispravna rezervna kopija"); }
    }; rd.readAsText(file);
  };
  let deferredInstall = null;
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferredInstall = e; $("#installBtn").hidden = false; const wb = $("#wInstall"); if (wb) wb.hidden = false; });
  const doInstall = async () => { if (!deferredInstall) { toast("U Chrome meniju ⋮ izaberi „Instaliraj aplikaciju“"); return; } deferredInstall.prompt(); await deferredInstall.userChoice; deferredInstall = null; $("#installBtn").hidden = true; };
  $("#installBtn").onclick = doInstall;

  /* ================= NAV ================= */
  function go(name) {
    $$(".screen").forEach((s) => s.classList.toggle("on", s.id === "scr-" + name));
    $$(".nav [data-go]").forEach((b) => b.classList.toggle("on", b.dataset.go === name));
    window.scrollTo({ top: 0 });
    if (name === "danas") renderDay(); if (name === "napredak") renderProgress(); if (name === "profil") renderProfile();
  }
  $$(".nav [data-go]").forEach((b) => (b.onclick = () => { vib(8); go(b.dataset.go); }));
  $("#fab").onclick = () => { vib(10); openAdd(cur === today() ? defaultMeal() : "rucak"); };
  $("#dayPrev").onclick = () => { cur = addDays(cur, -1); renderDay(); };
  $("#dayNext").onclick = () => { if (cur < today()) { cur = addDays(cur, 1); renderDay(); } };
  let tx = null; $("#scr-danas").addEventListener("touchstart", (e) => (tx = e.touches[0].clientX), { passive: true });
  $("#scr-danas").addEventListener("touchend", (e) => { if (tx === null) return; const dx = e.changedTouches[0].clientX - tx; tx = null; if (Math.abs(dx) > 90) { if (dx > 0) $("#dayPrev").click(); else $("#dayNext").click(); } });
  document.addEventListener("visibilitychange", () => { if (!document.hidden && cur !== today() && $("#scr-danas").classList.contains("on")) { cur = today(); renderDay(); } });

  function renderAll() { renderDay(); renderProfile(); }

  /* ================= WELCOME ================= */
  function welcome() {
    const box = document.createElement("div"); box.className = "welcome"; box.id = "welcome";
    box.innerHTML = `<div class="logo">FOR<span>MA</span></div><p>Tvoj lični dnevnik ishrane. Unesi svoje podatke, a ja ću ti izračunati dnevni cilj.</p>
      <form class="card form" id="wf">
        <div class="grid2">
          <label>Godine<input name="age" type="number" inputmode="numeric" required /></label>
          <label>Visina (cm)<input name="height" type="number" inputmode="numeric" required /></label>
          <label>Kilaža sada<input name="start" type="number" inputmode="decimal" step="0.1" required /></label>
          <label>Ciljna kilaža<input name="goal" type="number" inputmode="decimal" step="0.1" required /></label>
        </div>
        <label>Pol<select name="sex"><option value="m">Muško</option><option value="f">Žensko</option></select></label>
        <label>Aktivnost<select name="act"><option value="1.2">Uglavnom sedim</option><option value="1.375">Malo kretanja</option><option value="1.55" selected>Ceo dan na nogama</option><option value="1.725">Na nogama + treninzi 4–5x nedeljno</option><option value="1.9">Težak fizički posao + treninzi</option></select></label>
        <label>Tempo<select name="pace"><option value="550">Umereno (≈ −0,5 kg nedeljno)</option><option value="800">Brže (≈ −0,75 kg nedeljno)</option><option value="1000" selected>Maksimalno (≈ −1 kg nedeljno)</option></select></label>
        <button class="btn red" type="submit">Izračunaj moj plan</button>
      </form>
      <div id="wRes" hidden>
        <div class="card plan"><div class="plan-big"><small>TVOJ DNEVNI CILJ</small><b id="wT">0</b><span>kcal</span></div>
        <div class="plan-row"><span>Potrošiš dnevno</span><b id="wTd"></b></div>
        <div class="plan-row"><span>Deficit</span><b id="wDf"></b></div>
        <div class="plan-row"><span>Tempo</span><b id="wRt"></b></div>
        <div class="plan-row"><span>Proteini dnevno</span><b id="wPr"></b></div></div>
        <button class="btn red" id="wGo">Kreni 💪</button>
      </div>
      <button class="btn ghost" id="wInstall" ${deferredInstall ? "" : "hidden"}>📲 Instaliraj na telefon</button>`;
    $("#app").prepend(box); $$(".screen").forEach((s) => (s.style.display = "none")); $(".nav").style.display = "none";
    $("#wf").onsubmit = (e) => {
      e.preventDefault(); const f = e.target, n = (k) => parseFloat(String(f[k].value).replace(",", "."));
      Object.assign(S.profile, { age: n("age"), height: n("height"), start: n("start"), goal: n("goal"), sex: f.sex.value, act: n("act"), pace: n("pace") });
      const P = plan();
      $("#wf").hidden = true; $("#wRes").hidden = false;
      $("#wTd").textContent = fmt(P.tdee) + " kcal"; $("#wDf").textContent = "−" + fmt(P.def) + " kcal"; $("#wRt").textContent = "≈ −" + r1(P.rate) + " kg nedeljno"; $("#wPr").textContent = P.prot + " g";
      setTimeout(() => countTo($("#wT"), P.target, 1400), 150);
    };
    $("#wGo").onclick = () => {
      S.onboarded = true; if (!S.weights.length) S.weights.push({ d: today(), kg: S.profile.start }); save();
      box.remove(); $$(".screen").forEach((s) => (s.style.display = "")); $(".nav").style.display = ""; go("danas"); confetti();
    };
    $("#wInstall").onclick = doInstall;
  }

  /* ================= START ================= */
  if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  if (!S.onboarded) welcome(); else go("danas");
})();
