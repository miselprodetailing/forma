/* FORMA: modul za trening. Ubacuje se u app.js (deli S, save, helpers) preko window.FORMA_TRAIN(ctx). */
window.FORMA_TRAIN = (X) => {
  const { $, $$, S, save, today, addDays, dateOf, fmt, r0, r1, esc, uid, vib, toast, confetti, countTo, openSheet, closeSheet, curWeight, MONTHS } = X;
  const T = (S.train ||= { start: null, sessions: [], acts: [], steps: {}, last: {}, live: null, pain: [] });
  S.waist ||= [];
  const ACT = Object.fromEntries(window.AKTIVNOSTI.map(([id, n, met, kmh]) => [id, { id, n, met, kmh }]));
  const V = window.VEZBE;

  /* ---------- math */
  const kcalFor = (met, min) => Math.round((met * curWeight() * min) / 60);
  const dayBurn = (k) => T.acts.filter((a) => a.d === k).reduce((s, a) => s + a.kcal, 0) + T.sessions.filter((x) => x.d === k).reduce((s, x) => s + x.kcal, 0);
  const bonus = (k) => (S.bonusBack ? Math.round(dayBurn(k) * 0.5) : 0);
  const weekStart = (k) => { const d = dateOf(k), wd = (d.getDay() + 6) % 7; return addDays(k, -wd); };
  const inWeek = (k, ws) => k >= ws && k <= addDays(ws, 6);
  const phase = () => {
    if (!T.start) return window.TETIVA[0];
    const w = Math.floor((dateOf(today()) - dateOf(T.start)) / (7 * 864e5)) + 1;
    return window.TETIVA.find((p) => w <= p.do) || window.TETIVA[2];
  };
  const weekNo = () => (T.start ? Math.floor((dateOf(today()) - dateOf(T.start)) / (7 * 864e5)) + 1 : 1);
  const nextDay = () => { const l = T.sessions[T.sessions.length - 1]; return !l ? "A" : { A: "B", B: "C", C: "A" }[l.day]; };
  const walkMin = (ws) => T.acts.filter((a) => inWeek(a.d, ws) && (a.type === "setnja" || a.type === "brzo")).reduce((s, a) => s + a.min, 0)
    + T.sessions.filter((x) => inWeek(x.d, ws)).length * 12;
  const walkKm = () => T.acts.filter((a) => ACT[a.type] && ACT[a.type].kmh).reduce((s, a) => s + (a.min / 60) * ACT[a.type].kmh, 0);
  const weekStreak = () => { let n = 0, ws = weekStart(today()); if (T.sessions.filter((x) => inWeek(x.d, ws)).length < 3) ws = addDays(ws, -7);
    while (T.sessions.filter((x) => inWeek(x.d, ws)).length >= 3) { n++; ws = addDays(ws, -7); } return n; };

  /* ---------- program expansion (tendon block depends on phase) */
  function planFor(dayKey) {
    const P = window.PROGRAM[dayKey], ph = phase(), out = [];
    P.vezbe.forEach(([id, sets, reps, rest]) => {
      if (id === "TETIVA1" || id === "TETIVA2") ph[id === "TETIVA1" ? "T1" : "T2"].forEach(([tid, s, r, rr]) => out.push({ id: tid, sets: s, reps: r, rest: rr, tendon: true }));
      else out.push({ id, sets, reps, rest });
    });
    return out;
  }

  /* ================= RENDER ================= */
  function render() {
    const ws = weekStart(today()), done = T.sessions.filter((x) => inWeek(x.d, ws)).length, wm = walkMin(ws);
    const C = 2 * Math.PI * 52;
    const ring = $("#trRing"); ring.style.strokeDasharray = C; ring.style.strokeDashoffset = C * (1 - Math.min(1, done / 3));
    countTo($("#trDone"), done, 600);
    $("#trWalkTxt").textContent = `${wm} / 150 min`;
    $("#trWalk").style.width = Math.min(100, (wm / 150) * 100) + "%";
    $("#trStreak").textContent = weekStreak();
    $("#trBurn").textContent = fmt(dayBurn(today())) + " kcal";
    const nd = nextDay(), live = T.live;
    $("#trNext").innerHTML = live
      ? `<small>U TOKU</small><b>${esc(window.PROGRAM[live.day].ime)}</b><span>Započeto u ${new Date(live.t0).toLocaleTimeString("sr-RS", { hour: "2-digit", minute: "2-digit" })}</span>`
      : `<small>SLEDEĆI TRENING</small><b>${esc(window.PROGRAM[nd].ime)}</b><span>${planFor(nd).length} vežbi · oko 50–60 min</span>`;
    $("#trStart").textContent = live ? "Nastavi trening ▶" : "Započni trening ▶";
    $$("#trPick button").forEach((b) => b.classList.toggle("on", b.dataset.d === (live ? live.day : nd)));
    const ph = phase();
    $("#tePhase").textContent = ph.ime;
    $("#teWeek").textContent = `Nedelja ${weekNo()}`;
    const lastPain = T.pain[T.pain.length - 1];
    $("#tePain").innerHTML = lastPain ? `Poslednji put bol u tetivi: <b>${lastPain.v}/10</b>${lastPain.v > 3 ? " · ⚠️ vrati prethodnu fazu dok bol ne padne ispod 3" : " · ✅ u redu"}` : "Posle svakog treninga upiši bol u tetivi (0–10).";
    const st = T.steps[today()] || 0;
    $("#trSteps").textContent = st ? `${fmt(st)} koraka · ≈ ${fmt(stepsKcal(st))} kcal` : "Upiši korake sa Google Fit / Samsung Health";
    // history
    const H = [...T.sessions.map((x) => ({ k: "s", d: x.d, t: x.t || 0, o: x })), ...T.acts.map((a) => ({ k: "a", d: a.d, t: a.t || 0, o: a }))]
      .sort((a, b) => (a.d === b.d ? b.t - a.t : a.d < b.d ? 1 : -1)).slice(0, 12);
    $("#trHist").innerHTML = H.length ? H.map((h, i) => {
      const dt = dateOf(h.d), dl = `${dt.getDate()}. ${MONTHS[dt.getMonth()].slice(0, 3)}`;
      if (h.k === "s") return `<li data-i="${i}"><div class="nm"><b>🏋️ ${esc(window.PROGRAM[h.o.day].ime)}</b><small>${dl} · ${h.o.min} min · ${h.o.sets} serija</small></div><div class="kc">${fmt(h.o.kcal)}</div></li>`;
      return `<li data-i="${i}"><div class="nm"><b>${esc(ACT[h.o.type] ? ACT[h.o.type].n : h.o.type)}</b><small>${dl} · ${h.o.min} min</small></div><div class="kc">${fmt(h.o.kcal)}</div></li>`;
    }).join("") : `<li class="empty" style="cursor:default">Još nema treninga. Prvi je najteži, posle ide samo! 💪</li>`;
    $$("#trHist li[data-i]").forEach((li) => (li.onclick = () => {
      const h = H[+li.dataset.i]; if (!confirm("Obrisati ovaj unos?")) return;
      if (h.k === "s") T.sessions = T.sessions.filter((x) => x !== h.o); else T.acts = T.acts.filter((x) => x !== h.o);
      save(); render(); toast("Obrisano");
    }));
  }
  const stepsKcal = (st) => Math.round(st * 0.04 * (curWeight() / 70));

  /* ================= ACTIVITY ================= */
  function openActivity() {
    let type = "setnja", min = 30;
    openSheet(`<div class="sh-title">Dodaj aktivnost</div>
      <div class="actgrid" id="ag">${window.AKTIVNOSTI.map(([id, n]) => `<button data-t="${id}">${n}</button>`).join("")}</div>
      <div class="amt-kcal"><b id="akK">0</b><span>kcal potrošeno</span></div>
      <div class="stepper"><button id="mn">−</button><input id="am" inputmode="numeric" /><button id="pl">+</button></div>
      <div class="quick" id="aq">${[15, 30, 45, 60, 90].map((x) => `<button data-q="${x}">${x} min</button>`).join("")}</div>
      <button class="btn red" id="ok">Sačuvaj</button>`);
    const upd = () => { $("#am").value = min; $$("#ag button").forEach((b) => b.classList.toggle("on", b.dataset.t === type)); countTo($("#akK"), kcalFor(ACT[type].met, min), 300); };
    $$("#ag button").forEach((b) => (b.onclick = () => { type = b.dataset.t; vib(); upd(); }));
    $$("#aq button").forEach((b) => (b.onclick = () => { min = +b.dataset.q; vib(); upd(); }));
    $("#mn").onclick = () => { min = Math.max(5, min - 5); upd(); }; $("#pl").onclick = () => { min += 5; upd(); };
    $("#am").oninput = (e) => { const n = parseInt(e.target.value, 10); if (n > 0) { min = n; countTo($("#akK"), kcalFor(ACT[type].met, min), 200); } };
    $("#ok").onclick = () => {
      T.acts.push({ id: uid(), d: today(), t: Date.now(), type, min, kcal: kcalFor(ACT[type].met, min) });
      save(); closeSheet(); render(); X.checkBadges(); toast(`✅ ${ACT[type].n}: ${fmt(kcalFor(ACT[type].met, min))} kcal`);
    };
    upd(); history.pushState({ sheet: 1 }, "");
  }
  function openSteps() {
    openSheet(`<div class="sh-title">Koraci danas</div><p class="small" style="margin-top:0">Prepiši broj koraka iz Google Fit, Samsung Health ili sa sata.</p>
      <div class="fld">Broj koraka<input id="stv" inputmode="numeric" value="${T.steps[today()] || ""}" placeholder="npr. 12500" /></div>
      <p class="small" id="stk"></p><button class="btn red" id="ok">Sačuvaj</button>`);
    const u = () => { const n = parseInt($("#stv").value, 10) || 0; $("#stk").textContent = n ? `≈ ${fmt(stepsKcal(n))} kcal. Samo informativno: tvoj dnevni cilj već računa da si ceo dan na nogama.` : ""; };
    $("#stv").oninput = u; u();
    $("#ok").onclick = () => { T.steps[today()] = parseInt($("#stv").value, 10) || 0; save(); closeSheet(); render(); };
    history.pushState({ sheet: 1 }, "");
  }

  /* ================= WORKOUT RUNNER ================= */
  function startWorkout(dayKey) {
    if (!T.live || (dayKey && T.live.day !== dayKey && confirm("Prekinuti trening u toku i početi novi?"))) {
      T.live = { day: dayKey || nextDay(), t0: Date.now(), sets: {} }; save();
    }
    openRunner();
  }
  /* ---------- stick-figure animation (two poses, eased back and forth) */
  const ANIMS = new Set();
  function figSvg(q) {
    const c = (a, b, col, w) => (a && b ? `<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>` : "");
    const back = "#7a7a85", front = "#ffffff", acc = "#ff3b2f";
    return c(q.n, q.e2, back, 7) + c(q.e2, q.w2, back, 6) + c(q.p, q.k2, back, 8) + c(q.k2, q.f2, back, 7) + c(q.f2, q.t2, back, 5)
      + c(q.n, q.p, front, 10) + c(q.p, q.k, acc, 9) + c(q.k, q.f, acc, 8) + c(q.f, q.t, acc, 6) + c(q.n, q.e, front, 7) + c(q.e, q.w, front, 6)
      + `<circle cx="${q.h[0].toFixed(1)}" cy="${q.h[1].toFixed(1)}" r="9" fill="${front}"/>`;
  }
  function mountAnim(el, id) {
    const A = window.ANIM[id]; if (!A) { el.remove(); return; }
    const keys = Object.keys(A.A).concat(Object.keys(A.B)).filter((k, i, a) => a.indexOf(k) === i);
    const hold = V[id][5] === "hold";
    const st = { el, t0: performance.now(), dur: hold ? 3200 : 2400 };
    const draw = (now) => {
      const ph = ((now - st.t0) % (st.dur * 2)) / st.dur, x = ph < 1 ? ph : 2 - ph;
      const e = hold ? Math.min(1, x * 2.4) : 0.5 - Math.cos(Math.PI * x) / 2;
      const q = {}; keys.forEach((k) => { const a = A.A[k] || A.B[k], b = A.B[k] || A.A[k]; q[k] = [a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e]; });
      el.innerHTML = `<line x1="0" y1="141" x2="200" y2="141" stroke="#2a2a30" stroke-width="2"/>` + A.props(q) + figSvg(q);
    };
    st.draw = draw; ANIMS.add(st); draw(performance.now());
  }
  let animRaf = null;
  const animLoop = (now) => { ANIMS.forEach((s) => { if (!document.body.contains(s.el)) ANIMS.delete(s); else s.draw(now); }); animRaf = ANIMS.size ? requestAnimationFrame(animLoop) : null; };
  const startAnims = () => { if (!animRaf) animRaf = requestAnimationFrame(animLoop); };

  /* ---------- helpers for set values */
  const topReps = (r) => { const m = String(r).match(/(\d+)\D+(\d+)/); return m ? +m[2] : parseInt(r, 10) || 10; };
  const lowReps = (r) => parseInt(String(r), 10) || 10;
  const secsOf = (r) => { const m = String(r).match(/(\d+)\s*(s|min)/); return m ? (m[2] === "min" ? +m[1] * 60 : +m[1]) : 45; };
  function suggestKg(id, reps) {
    const last = T.last[id]; if (!last || !last.length || last[0].kg == null) return null;
    const kg = last[0].kg, allTop = last.every((x) => (x.reps || 0) >= topReps(reps));
    return allTop ? { kg: Math.round((kg + (kg >= 40 ? 5 : 2.5)) * 2) / 2, up: true } : { kg, up: false };
  }

  function openRunner() {
    const L = T.live, list = planFor(L.day);
    const cards = list.map((e, i) => {
      const v = V[e.id], type = v[5], last = T.last[e.id] || [];
      const sug = type === "ex" ? suggestKg(e.id, e.reps) : null;
      const yt = "https://www.youtube.com/results?search_query=" + encodeURIComponent(v[6]);
      const rows = Array.from({ length: Math.max(1, e.sets) }, (_, s) => {
        const cur = (L.sets[e.id] || [])[s] || {}, pv = last[s] || last[last.length - 1] || {};
        const done = cur.done ? " done" : "";
        if (type === "time") {
          const sec = secsOf(e.reps);
          return `<div class="set time${done}" data-e="${e.id}" data-s="${s}" data-sec="${sec}"><button class="go">▶ Start ${Math.round(sec / 60)} min</button><div class="tbar"><i></i><b class="tlbl">${Math.round(sec / 60)}:00</b></div><button class="chk" aria-label="Gotovo">✓</button></div>`;
        }
        if (type === "hold") {
          const sec = cur.reps || pv.reps || secsOf(e.reps);
          return `<div class="set hold${done}" data-e="${e.id}" data-s="${s}" data-sec="${sec}"><span class="sn">${s + 1}</span><button class="go">▶ Drži ${sec} s</button><div class="tbar"><i></i><b class="tlbl">${sec}</b></div><button class="chk" aria-label="Gotovo">✓</button></div>`;
        }
        const kg = cur.kg ?? (sug ? sug.kg : pv.kg ?? ""), reps = cur.reps ?? pv.reps ?? lowReps(e.reps);
        return `<div class="set${done}" data-e="${e.id}" data-s="${s}"><span class="sn">${s + 1}</span>
          <div class="num"><button class="mi" data-f="k">−</button><input class="in k" inputmode="decimal" placeholder="?" value="${kg}" /><button class="pl" data-f="k">+</button><small>kg</small></div>
          <div class="num"><button class="mi" data-f="r">−</button><input class="in r" inputmode="numeric" value="${reps}" /><button class="pl" data-f="r">+</button><small>puta</small></div>
          <button class="chk" aria-label="Serija gotova">✓</button></div>`;
      }).join("");
      const hint = type !== "ex" ? "" : sug ? (sug.up ? `<span class="last up">💡 Prošli put je bilo lako, danas probaj <b>${sug.kg} kg</b></span>` : `<span class="last">Prošli put: ${last.map((x) => `${x.kg ?? "?"} kg × ${x.reps ?? "?"}`).join(", ")}</span>`)
        : `<span class="last new">Prvi put: izaberi težinu koju možeš da podigneš 15 puta, a uradi ${esc(e.reps)}.</span>`;
      return `<div class="ex${e.tendon ? " tendon" : ""}" style="animation-delay:${i * 50}ms">
        <div class="ex-top"><svg class="fig" viewBox="0 0 200 150" data-a="${e.id}"></svg>
          <div class="ex-h"><b>${esc(v[0])}</b><small class="tech">u teretani: ${esc(v[1])}</small>
          <small>${e.sets > 1 ? e.sets + " serije × " : ""}${esc(e.reps)}${e.rest ? " · odmor " + e.rest + " s" : ""}</small></div></div>
        ${hint}
        <div class="ex-btns"><button class="info">📖 Kako se radi</button><a class="ytb" href="${yt}" target="_blank" rel="noopener">▶ Video</a></div>
        <div class="ex-d" hidden><p><b>Jača:</b> ${esc(v[2])}</p><p>${esc(v[3])}</p>${v[4] ? `<p class="note">🦵 ${esc(v[4])}</p>` : ""}</div>
        ${rows}</div>`;
    }).join("");
    openSheet(`<div class="sh-title">${esc(window.PROGRAM[L.day].ime)}</div>
      <div class="wk-top"><div class="sw"><small>VREME TRENINGA</small><span id="wkClock">00:00</span></div><span id="wkProg">0 / 0 serija</span></div>
      <div class="ph-note">🦶 ${esc(phase().ime)}. Blag bol u tetivi do 3 od 10 je u redu. Ako je jači, stani i smanji.</div>
      <p class="small" style="margin:0 0 10px">Kako ide: uradiš seriju → pritisneš <b>✓</b> → krene odmor → sledeća serija. Brojevi su već upisani, menjaj ih na − / + samo ako treba.</p>
      <div id="exs">${cards}</div>
      <div class="pain"><b>Koliko te boli leva tetiva posle treninga?</b><input type="range" min="0" max="10" step="1" value="${L.pain ?? 0}" id="painR" /><div class="painv"><span>0 ne boli</span><b id="painV">${L.pain ?? 0}/10</b><span>10 jako</span></div></div>
      <button class="btn red" id="finish">Završi trening 🏁</button><button class="btn ghost" id="later">Nastaviću kasnije</button><button class="btn danger" id="cancel">Odustani od treninga</button>`);
    $$("#exs svg.fig").forEach((s) => mountAnim(s, s.dataset.a)); startAnims();
    const total = list.reduce((s, e) => s + Math.max(1, e.sets), 0);
    const prog = () => { const n = Object.values(L.sets).reduce((s, a) => s + a.filter((x) => x && x.done).length, 0); $("#wkProg").textContent = `${n} / ${total} serija`; return n; };
    prog();
    const clk = setInterval(() => { const el = $("#wkClock"); if (!el) return clearInterval(clk); const s = Math.floor((Date.now() - L.t0) / 1000); el.textContent = `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; }, 1000);
    $$(".ex .info").forEach((b) => (b.onclick = () => { const d = b.closest(".ex").querySelector(".ex-d"); d.hidden = !d.hidden; b.classList.toggle("on", !d.hidden); }));
    let runIv = null;
    $$(".set").forEach((row) => {
      const id = row.dataset.e, s = +row.dataset.s, e = list.find((x) => x.id === id);
      const store = () => { const a = (L.sets[id] ||= []); const k = row.querySelector(".k"), r = row.querySelector(".r");
        a[s] = { ...(a[s] || {}), kg: k ? (k.value !== "" ? parseFloat(k.value.replace(",", ".")) : null) : undefined, reps: r ? parseInt(r.value, 10) || 0 : row.dataset.sec ? +row.dataset.sec : undefined }; };
      const spread = () => { const k = row.querySelector(".k"); if (!k || k.value === "") return;
        $$(`.set[data-e="${id}"]`).forEach((o) => { if (+o.dataset.s > s && !o.classList.contains("done")) { const ok = o.querySelector(".k"); if (ok && (ok.value === "" || ok.dataset.auto)) { ok.value = k.value; ok.dataset.auto = "1"; ok.dispatchEvent(new Event("change")); } } }); };
      $$("input", row).forEach((inp) => (inp.onchange = (ev) => { if (ev.isTrusted) delete inp.dataset.auto; store(); save(); if (inp.classList.contains("k")) spread(); }));
      $$(".mi, .pl", row).forEach((btn) => (btn.onclick = () => {
        const inp = row.querySelector(btn.dataset.f === "k" ? ".k" : ".r"), up = btn.classList.contains("pl");
        let v = parseFloat(String(inp.value).replace(",", ".")) || 0;
        v = btn.dataset.f === "k" ? Math.max(0, v + (up ? 2.5 : -2.5)) : Math.max(0, v + (up ? 1 : -1));
        inp.value = btn.dataset.f === "k" ? r1(v) : r0(v); delete inp.dataset.auto; vib(8); store(); save(); if (btn.dataset.f === "k") spread();
      }));
      const markDone = (force) => {
        store(); const a = L.sets[id]; a[s].done = force === undefined ? !a[s].done : force; row.classList.toggle("done", a[s].done); save(); vib(20);
        const n = prog();
        if (a[s].done && e.rest && n < total) restTimer(e.rest);
        if (n === total) { confetti(); toast("💪 Sve serije gotove! Pritisni Završi trening."); }
      };
      row.querySelector(".chk").onclick = () => markDone();
      const go = row.querySelector(".go");
      if (go) go.onclick = () => {
        if (row.classList.contains("running")) { clearInterval(runIv); row.classList.remove("running"); go.textContent = "▶ Nastavi"; return; }
        $$(".set.running").forEach((r) => r.classList.remove("running")); clearInterval(runIv);
        const total = +row.dataset.sec; let left = row._left ?? total; const bar = row.querySelector(".tbar i"), lbl = row.querySelector(".tlbl");
        row.classList.add("running"); go.textContent = "⏸ Pauza";
        const end = Date.now() + left * 1000;
        const tick = () => {
          left = Math.max(0, (end - Date.now()) / 1000); row._left = left;
          bar.style.width = (1 - left / total) * 100 + "%";
          lbl.textContent = total >= 60 ? `${Math.floor(Math.ceil(left) / 60)}:${String(Math.ceil(left) % 60).padStart(2, "0")}` : Math.ceil(left);
          if (left <= 3.2 && left > 0 && total < 60) vib(25);
          if (left <= 0) { clearInterval(runIv); row.classList.remove("running"); row._left = 0; go.textContent = "✓ Gotovo"; vib([200, 80, 200]); toast("✅ Vreme je isteklo, bravo!"); markDone(true); }
        };
        runIv = setInterval(tick, 200); tick();
      };
    });
    $("#painR").oninput = (ev) => { L.pain = +ev.target.value; $("#painV").textContent = L.pain + "/10"; save(); };
    $("#later").onclick = () => { clearInterval(clk); clearInterval(runIv); closeSheet(); render(); };
    $("#cancel").onclick = () => { if (!confirm("Obrisati ovaj trening?")) return; clearInterval(clk); clearInterval(runIv); T.live = null; save(); closeSheet(); render(); };
    $("#finish").onclick = () => {
      const n = prog(); if (!n && !confirm("Nijedna serija nije čekirana. Ipak sačuvati?")) return;
      clearInterval(clk); clearInterval(runIv);
      const min = Math.max(15, Math.round((Date.now() - L.t0) / 60000));
      const sess = { id: uid(), d: today(), t: Date.now(), day: L.day, min: Math.min(min, 150), sets: n, kcal: kcalFor(5.0, Math.min(min, 150)), ex: L.sets, pain: L.pain ?? 0 };
      if (!T.start) T.start = today();
      T.sessions.push(sess);
      Object.entries(L.sets).forEach(([id, arr]) => { const done = arr.filter((x) => x && x.done); if (done.length) T.last[id] = done.map(({ kg, reps }) => ({ kg, reps })); });
      T.pain.push({ d: today(), v: L.pain ?? 0 });
      T.live = null; save(); closeSheet(); render(); confetti(); vib([40, 40, 80]);
      toast(`🏁 Trening sačuvan: ${sess.min} min · ${fmt(sess.kcal)} kcal${(L.pain ?? 0) > 3 ? " · ⚠️ tetiva je bolela, sledeći put lakše" : ""}`, 4000);
      X.checkBadges(); X.renderDay();
    };
    history.pushState({ sheet: 1 }, "");
  }

  /* rest timer overlay */
  let restIv = null;
  function restTimer(sec) {
    let left = sec, end = Date.now() + sec * 1000;
    let ov = $("#rest"); if (!ov) { ov = document.createElement("div"); ov.id = "rest"; document.body.appendChild(ov); }
    const C = 2 * Math.PI * 90;
    ov.innerHTML = `<div class="rest-box"><small>ODMOR</small><svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="90" class="rb"/><circle cx="100" cy="100" r="90" class="rf" id="rf" transform="rotate(-90 100 100)"/></svg><b id="rt">${sec}</b>
      <div class="rest-btns"><button id="rMinus">−15 s</button><button id="rPlus">+15 s</button></div><button class="btn red" id="rSkip">Preskoči odmor</button></div>`;
    ov.classList.add("on");
    const rf = $("#rf"); rf.style.strokeDasharray = C;
    const tick = () => {
      left = Math.max(0, Math.ceil((end - Date.now()) / 1000)); $("#rt").textContent = left; rf.style.strokeDashoffset = C * (1 - left / sec);
      if (left <= 3 && left > 0) vib(30);
      if (left <= 0) { stop(); vib([200, 100, 200]); toast("⏱️ Odmor gotov, sledeća serija!"); }
    };
    const stop = () => { clearInterval(restIv); ov.classList.remove("on"); };
    clearInterval(restIv); restIv = setInterval(tick, 250); tick();
    $("#rSkip").onclick = stop;
    $("#rPlus").onclick = () => { end += 15000; sec += 15; };
    $("#rMinus").onclick = () => { end -= 15000; };
  }

  /* ================= WAIST (Napredak) ================= */
  function renderWaist() {
    const w = S.waist, box = $("#waistInfo");
    if (!w.length) { box.innerHTML = `<p class="small" style="margin:0">Jednom u 2 nedelje izmeri obim struka u visini pupka, ujutru.</p>`; $("#waistChart").innerHTML = ""; return; }
    const first = w[0].cm, last = w[w.length - 1].cm, diff = r1(first - last);
    box.innerHTML = `<div class="wbig"><div><small>POČETAK</small><b>${r1(first)} cm</b></div><div><small>SADA</small><b>${r1(last)} cm</b></div><div><small>MANJE</small><b class="ok">${diff > 0 ? "−" : ""}${Math.abs(diff)} cm</b></div></div>`;
    const W = 340, H = 80, mx = Math.max(...w.map((x) => x.cm)) + 1, mn = Math.min(...w.map((x) => x.cm)) - 1;
    const pts = w.map((x, i) => [w.length === 1 ? W / 2 : 10 + (i / (w.length - 1)) * (W - 20), 8 + ((mx - x.cm) / (mx - mn)) * (H - 16)]);
    $("#waistChart").innerHTML = `<path class="line" d="${pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ")}"/>` + pts.map((p) => `<circle class="dot" cx="${p[0]}" cy="${p[1]}" r="4"/>`).join("");
  }
  function openWaist() {
    const last = S.waist.length ? S.waist[S.waist.length - 1].cm : "";
    openSheet(`<div class="sh-title">Obim struka</div><p class="small" style="margin-top:0">Metar u visini pupka, opušten stomak, ujutru.</p>
      <div class="fld">Centimetri<input id="wc" inputmode="decimal" value="${last}" placeholder="npr. 118" /></div><button class="btn red" id="ok">Sačuvaj</button>`);
    $("#ok").onclick = () => { const cm = parseFloat(String($("#wc").value).replace(",", ".")); if (!(cm > 40 && cm < 250)) { toast("Proveri broj"); return; }
      S.waist = S.waist.filter((x) => x.d !== today()).concat([{ d: today(), cm }]); save(); closeSheet(); renderWaist(); toast("Sačuvano"); };
    history.pushState({ sheet: 1 }, "");
  }

  /* ---------- wire up */
  $("#trStart").onclick = () => { vib(); startWorkout(T.live ? null : $("#trPick button.on").dataset.d); };
  $$("#trPick button").forEach((b) => (b.onclick = () => { if (T.live) { toast("Završi trening u toku pre promene"); return; } $$("#trPick button").forEach((x) => x.classList.toggle("on", x === b));
    $("#trNext").innerHTML = `<small>IZABRAN TRENING</small><b>${esc(window.PROGRAM[b.dataset.d].ime)}</b><span>${planFor(b.dataset.d).length} vežbi · oko 50–60 min</span>`; }));
  $("#trAct").onclick = openActivity;
  $("#trStepsBtn").onclick = openSteps;
  $("#addWaist").onclick = openWaist;
  $("#bonusBack").checked = !!S.bonusBack;
  $("#bonusBack").onchange = (e) => { S.bonusBack = e.target.checked; save(); X.renderDay(); toast(S.bonusBack ? "Pola potrošenih kalorija se vraća u dnevni cilj" : "Potrošene kalorije se ne dodaju u cilj"); };

  return { render, renderWaist, dayBurn, bonus,
    badgeHas: () => ({ t1: T.sessions.length >= 1, t10: T.sessions.length >= 10, t25: T.sessions.length >= 25, t50: T.sessions.length >= 50, km50: walkKm() >= 50, wk4: weekStreak() >= 4 }) };
};
