// Interfaz: hélice, corte y proyección, y reflejo por rotación.
(() => {
  const $ = (id) => document.getElementById(id);
  const num = (x, d = 3) => Number(x.toFixed(d)).toLocaleString("es-AR");
  const PENDIENTES = {
    fib: 1 / Simetria.PHI,
    raiz2: Math.SQRT2 - 1,
    mitad: 1 / 2,
    dostercios: 2 / 3,
    tresquintos: 3 / 5,
  };
  const C = 0.25;
  const HELICE = Simetria.helice({ vueltas: 3, r: 1, c: C, n: 360 });
  let timer = null;

  // --- 1. Hélice ---------------------------------------------------------
  function dibujarHelice() {
    const alfa = (parseFloat($("alfa").value) * Math.PI) / 180;
    $("v-alfa").textContent = Math.round(parseFloat($("alfa").value)) + "°";
    const { ctx, w, h } = Grafico.preparar($("c-helice"), 220);
    const col = Grafico.colores();
    const zMax = HELICE[HELICE.length - 1][2];
    const k = (w - 60) / zMax, s = Math.min(60, h / 3.2);
    const cy = h / 2;
    const P = ([x, y, z]) => {
      const a = x * Math.cos(alfa) + y * Math.sin(alfa);
      const b = -x * Math.sin(alfa) + y * Math.cos(alfa);
      return [20 + z * k + b * s * 0.35, cy - a * s + b * s * 0.25, b];
    };
    // Eje
    ctx.strokeStyle = col.border; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(10, cy); ctx.lineTo(w - 10, cy); ctx.stroke(); ctx.setLineDash([]);
    for (let i = 1; i < HELICE.length; i++) {
      const [x0, y0, b0] = P(HELICE[i - 1]);
      const [x1, y1] = P(HELICE[i]);
      ctx.strokeStyle = col.series[0];
      ctx.globalAlpha = b0 < 0 ? 0.5 : 1; // lo de atrás, más tenue
      ctx.lineWidth = b0 < 0 ? 1.5 : 2.5;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    }
    ctx.globalAlpha = 1;

    Grafico.lineas($("c-onda"), {
      series: [{ nombre: "Sombra de costado", puntos: Simetria.sombraLateral(HELICE, alfa), color: col.series[1] }],
      xMin: 0, xMax: zMax, yMin: -1.3, yMax: 1.3,
      xEtiqueta: "posición a lo largo del eje", yEtiqueta: "sombra",
      verticales: [{ x: 2 * Math.PI * C, etiqueta: "una vuelta" }],
      alto: 220,
    });
  }

  $("alfa").addEventListener("input", dibujarHelice);
  $("girar").addEventListener("click", () => {
    if (timer) { clearInterval(timer); timer = null; $("girar").textContent = "Girar la hélice"; return; }
    $("girar").textContent = "Parar";
    timer = setInterval(() => {
      $("alfa").value = (parseFloat($("alfa").value) + 2) % 360;
      dibujarHelice();
    }, 30);
  });

  // --- 2. Corte y proyección ---------------------------------------------
  function dibujarRed() {
    const pendiente = PENDIENTES[$("pend").value];
    const r = Simetria.cortarYProyectar({ pendiente, cantidad: 400 });
    const L = [...r.pasos].filter((c) => c === "L").length;
    const S = r.pasos.length - L;
    const p = Simetria.periodo(r.pasos, 100);
    $("s-L").textContent = L;
    $("s-S").textContent = S;
    $("s-ratio").textContent = num(L / S);
    $("s-per").textContent = p ? `Sí, cada ${p} pasos` : "No";

    const { ctx, w, h } = Grafico.preparar($("c-red"), 300);
    const col = Grafico.colores();
    const M = 14;
    const sc = Math.min((w - 20) / M, (h - 20) / (M * pendiente + 2.5));
    const ox = 12, oy = h - 14 - sc * 1.2;
    const X = (m) => ox + m * sc, Y = (n) => oy - n * sc;
    const ca = Math.cos(r.angulo), sa = Math.sin(r.angulo);

    // Franja de corte: puntos con u entre u0 y u0 + ancho (u = −m·sen + n·cos).
    ctx.fillStyle = col.series[1]; ctx.globalAlpha = 0.12;
    const franja = (u) => [[X(-sa * u - ca), Y(ca * u - sa)], [X(-sa * u + ca * (M + 2)), Y(ca * u + sa * (M + 2))]];
    const [a1, a2] = franja(r.u0), [b1, b2] = franja(r.u0 + r.ancho);
    ctx.beginPath(); ctx.moveTo(...a1); ctx.lineTo(...a2); ctx.lineTo(...b2); ctx.lineTo(...b1); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;

    // Red
    const dentro = new Set(r.puntos.map((q) => q.m + "," + q.n));
    for (let m = -1; m <= M + 1; m++) {
      for (let n = -1; n <= Math.ceil(M * pendiente) + 2; n++) {
        if (X(m) < 0 || X(m) > w || Y(n) < 0 || Y(n) > h) continue;
        const ok = dentro.has(m + "," + n) && m <= M;
        ctx.beginPath(); ctx.arc(X(m), Y(n), ok ? 4 : 2, 0, 2 * Math.PI);
        ctx.fillStyle = ok ? col.series[1] : col.muted; ctx.fill();
      }
    }
    // Recta y proyecciones
    ctx.strokeStyle = col.series[0]; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(M + 1), Y((M + 1) * pendiente)); ctx.stroke();
    ctx.lineWidth = 1; ctx.globalAlpha = 0.5;
    for (const q of r.puntos) {
      if (q.m > M) continue;
      const px = q.s * ca, py = q.s * sa;
      ctx.beginPath(); ctx.moveTo(X(q.m), Y(q.n)); ctx.lineTo(X(px), Y(py)); ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Cadena
    const anchoL = 26, anchoS = Math.max(8, anchoL * pendiente);
    $("cadena").innerHTML = [...r.pasos.slice(0, 60)]
      .map((c) => `<span class="${c}" style="width:${c === "L" ? anchoL : anchoS}px">${c}</span>`).join("");
  }
  $("pend").addEventListener("change", dibujarRed);

  // --- 3. Reflejo ----------------------------------------------------------
  function dibujarF() {
    const th = (parseFloat($("theta").value) * Math.PI) / 180;
    $("v-theta").textContent = $("theta").value + "°";
    const col = Grafico.colores();
    // 3D oblicua
    {
      const { ctx, w, h } = Grafico.preparar($("c-f3d"), 220);
      const s = Math.min(w, h) / 3.2, cx = w / 2, cy = h / 2;
      const P = ([x, y, z]) => [cx + x * s + z * s * 0.45, cy - y * s - z * s * 0.25];
      ctx.strokeStyle = col.border; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(cx, cy - 1.3 * s); ctx.lineTo(cx, cy + 1.3 * s); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = col.series[2]; ctx.lineWidth = 6; ctx.lineCap = "round";
      for (const seg of Simetria.LETRA_F) {
        const [p0, p1] = Simetria.girarPorTerceraDimension(seg, th).map(P);
        ctx.beginPath(); ctx.moveTo(...p0); ctx.lineTo(...p1); ctx.stroke();
      }
    }
    // Lo que se ve en el plano
    {
      const { ctx, w, h } = Grafico.preparar($("c-f2d"), 220);
      const s = Math.min(w, h) / 3.2, cx = w / 2, cy = h / 2;
      ctx.lineCap = "round";
      ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.setLineDash([4, 4]);
      for (const [[x0, y0], [x1, y1]] of Simetria.LETRA_F) { ctx.beginPath(); ctx.moveTo(cx + x0 * s, cy - y0 * s); ctx.lineTo(cx + x1 * s, cy - y1 * s); ctx.stroke(); }
      ctx.setLineDash([]);
      ctx.strokeStyle = col.series[2]; ctx.lineWidth = 6;
      for (const seg of Simetria.LETRA_F) {
        const [[x0, y0], [x1, y1]] = Simetria.girarPorTerceraDimension(seg, th);
        ctx.beginPath(); ctx.moveTo(cx + x0 * s, cy - y0 * s); ctx.lineTo(cx + x1 * s, cy - y1 * s); ctx.stroke();
      }
    }
    const g = parseFloat($("theta").value);
    $("txt-f").textContent = g === 0 ? "En el plano: la F original." : g === 90 ? "De canto: desde el plano se ve como una línea." : g === 180 ? "Espejada. Ningún movimiento dentro del plano llega a esto." : "Desde el plano, la F se angosta: está saliendo del plano.";
  }
  $("theta").addEventListener("input", dibujarF);

  window.addEventListener("resize", () => { dibujarHelice(); dibujarRed(); dibujarF(); });
  dibujarHelice();
  dibujarRed();
  dibujarF();
})();
