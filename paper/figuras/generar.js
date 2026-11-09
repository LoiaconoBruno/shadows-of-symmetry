#!/usr/bin/env node
// Genera las figuras del paper (SVG) en esta carpeta y escribe las cifras que cita el texto.
// Uso: node paper/figuras/generar.js
// Contiene solo las funciones del modelo que hacen falta. Licencia MIT (ver LICENSE).
// Longitudes en unidades del paso de la red (adimensionales); ángulos en radianes.
"use strict";
const fs = require("node:fs");
const path = require("node:path");

const COLORES = ["#2a55c9", "#c25a00", "#1f7a4d", "#b3261e", "#7a3fb8", "#555555"];
const FUENTE = 'font-family="DejaVu Sans, Helvetica, Arial, sans-serif"';

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Números con coma decimal y signo menos tipográfico.
function num(x) {
  if (x === 0) return "0";
  const a = Math.abs(x);
  let s;
  if (a >= 1e4 || a < 1e-3) {
    const e = Math.floor(Math.log10(a));
    const m = x / 10 ** e;
    s = (Math.abs(m - 1) < 1e-9 ? "" : `${Number(m.toPrecision(2))}×`) + `10^${e}`;
  } else s = String(Number(x.toPrecision(3)));
  return s.replace(".", ",").replace(/-/g, "−");
}

function marcas(min, max, n = 5) {
  const crudo = (max - min) / n;
  const pot = 10 ** Math.floor(Math.log10(crudo));
  const paso = [1, 2, 2.5, 5, 10].map((m) => m * pot).find((p) => p >= crudo);
  const out = [];
  for (let x = Math.ceil(min / paso - 1e-9) * paso; x <= max + paso * 1e-9; x += paso) out.push(Math.abs(x) < paso * 1e-9 ? 0 : x);
  return out;
}

function potencias(min, max) {
  const out = [];
  for (let k = Math.floor(Math.log10(min)); k <= Math.ceil(Math.log10(max)); k++) out.push(10 ** k);
  return out;
}

// Texto con superíndices para etiquetas del tipo 10^3.
function textoSVG(s) {
  return esc(s).replace(/\^(−?[0-9A-Za-z]+)/g, '<tspan baseline-shift="super" font-size="70%">$1</tspan>');
}

/**
 * Gráfico de líneas.
 * op: { series: [{nombre, puntos: [[x,y]], color?, punteada?, grosor?}], xMin, xMax, yMin, yMax,
 *       xEtiqueta, yEtiqueta, logX, logY, verticales: [{x, etiqueta}], horizontales: [{y, etiqueta}],
 *       ancho, alto, leyenda: "arriba" | "abajo" | null }
 */
function grafico(op) {
  const W = op.ancho || 640, H = op.alto || 400;
  const m = { l: 70, r: 18, t: op.leyenda === null ? 16 : 40, b: 56 };
  const tx = (x) => (op.logX ? Math.log10(x) : x);
  const ty = (y) => (op.logY ? Math.log10(y) : y);
  const pts = op.series.flatMap((s) => s.puntos).filter(([x, y]) => isFinite(tx(x)) && isFinite(ty(y)));
  const xMin = op.xMin ?? Math.min(...pts.map((p) => p[0]));
  const xMax = op.xMax ?? Math.max(...pts.map((p) => p[0]));
  const yMin = op.yMin ?? Math.min(...pts.map((p) => p[1]));
  const yMax = op.yMax ?? Math.max(...pts.map((p) => p[1]));
  const X = (x) => m.l + ((tx(x) - tx(xMin)) / (tx(xMax) - tx(xMin))) * (W - m.l - m.r);
  const Y = (y) => H - m.b - ((ty(y) - ty(yMin)) / (ty(yMax) - ty(yMin))) * (H - m.t - m.b);
  const o = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" ${FUENTE} font-size="13">`,
    `<rect width="${W}" height="${H}" fill="#ffffff"/>`];
  const mx = op.logX ? potencias(xMin, xMax) : marcas(xMin, xMax, op.marcasX || 6);
  const my = op.logY ? potencias(yMin, yMax) : marcas(yMin, yMax, op.marcasY || 5);
  for (const x of mx) {
    if (x < xMin - 1e-12 || x > xMax + 1e-12) continue;
    o.push(`<line x1="${X(x)}" y1="${m.t}" x2="${X(x)}" y2="${H - m.b}" stroke="#e3e1db"/>`);
    o.push(`<text x="${X(x)}" y="${H - m.b + 18}" text-anchor="middle" fill="#333">${textoSVG(num(x))}</text>`);
  }
  for (const y of my) {
    if (y < yMin - 1e-12 || y > yMax + 1e-12) continue;
    o.push(`<line x1="${m.l}" y1="${Y(y)}" x2="${W - m.r}" y2="${Y(y)}" stroke="#e3e1db"/>`);
    o.push(`<text x="${m.l - 8}" y="${Y(y) + 4}" text-anchor="end" fill="#333">${textoSVG(num(y))}</text>`);
  }
  o.push(`<rect x="${m.l}" y="${m.t}" width="${W - m.l - m.r}" height="${H - m.t - m.b}" fill="none" stroke="#333"/>`);
  if (op.xEtiqueta) o.push(`<text x="${m.l + (W - m.l - m.r) / 2}" y="${H - 14}" text-anchor="middle" fill="#111">${textoSVG(op.xEtiqueta)}</text>`);
  if (op.yEtiqueta) o.push(`<text transform="translate(18 ${m.t + (H - m.t - m.b) / 2}) rotate(-90)" text-anchor="middle" fill="#111">${textoSVG(op.yEtiqueta)}</text>`);
  o.push(`<clipPath id="area"><rect x="${m.l}" y="${m.t}" width="${W - m.l - m.r}" height="${H - m.t - m.b}"/></clipPath><g clip-path="url(#area)">`);
  (op.verticales || []).forEach((v, j) => {
    o.push(`<line x1="${X(v.x)}" y1="${m.t}" x2="${X(v.x)}" y2="${H - m.b}" stroke="#666" stroke-dasharray="4 4"/>`);
    // etiquetas escalonadas para que no se pisen si las líneas están cerca
    if (v.etiqueta) o.push(`<text x="${X(v.x) + 5}" y="${m.t + 16 + 15 * j}" fill="#444" font-size="12">${textoSVG(v.etiqueta)}</text>`);
  });
  for (const h of op.horizontales || []) {
    o.push(`<line x1="${m.l}" y1="${Y(h.y)}" x2="${W - m.r}" y2="${Y(h.y)}" stroke="#666" stroke-dasharray="4 4"/>`);
    if (h.etiqueta) o.push(`<text x="${W - m.r - 6}" y="${Y(h.y) - 6}" text-anchor="end" fill="#444" font-size="12">${textoSVG(h.etiqueta)}</text>`);
  }
  op.series.forEach((s, i) => {
    const d = [];
    let abierto = false;
    for (const [x, y] of s.puntos) {
      if (!isFinite(tx(x)) || !isFinite(ty(y))) { abierto = false; continue; }
      d.push(`${abierto ? "L" : "M"}${X(x).toFixed(2)} ${Y(y).toFixed(2)}`);
      abierto = true;
    }
    const color = s.color || COLORES[i % COLORES.length];
    o.push(`<path d="${d.join(" ")}" fill="none" stroke="${color}" stroke-width="${s.grosor || 2.2}"${s.punteada ? ' stroke-dasharray="7 5"' : ""} stroke-linejoin="round"/>`);
  });
  o.push("</g>");
  if (op.leyenda !== null) {
    let lx = m.l;
    op.series.forEach((s, i) => {
      if (!s.nombre) return;
      const color = s.color || COLORES[i % COLORES.length];
      o.push(`<line x1="${lx}" y1="${m.t - 16}" x2="${lx + 22}" y2="${m.t - 16}" stroke="${color}" stroke-width="3"${s.punteada ? ' stroke-dasharray="6 4"' : ""}/>`);
      o.push(`<text x="${lx + 28}" y="${m.t - 12}" fill="#111">${textoSVG(s.nombre)}</text>`);
      lx += 40 + s.nombre.length * 7.2;
    });
  }
  o.push("</svg>");
  return o.join("\n");
}

function guardar(nombre, svg) {
  fs.writeFileSync(path.join(__dirname, nombre + ".svg"), svg + "\n");
  console.log("figura:", nombre + ".svg");
}

/**
 * Barras apiladas horizontales. grupos: [{nombre, partes: [valor...]}], categorias: [nombre...]
 */
function barras(op) {
  const W = op.ancho || 640, alto = op.alturaBarra || 34, sep = op.separacion || 22;
  const m = { l: op.margenIzq || 210, r: 30, t: 54, b: 46 };
  const H = m.t + op.grupos.length * (alto + sep) - sep + m.b;
  const total = op.maximo || Math.max(...op.grupos.map((g) => g.partes.reduce((a, b) => a + b, 0)));
  const X = (v) => m.l + (v / total) * (W - m.l - m.r);
  const o = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" ${FUENTE} font-size="13">`,
    `<rect width="${W}" height="${H}" fill="#ffffff"/>`];
  let lx = m.l;
  op.categorias.forEach((c, i) => {
    o.push(`<rect x="${lx}" y="${m.t - 36}" width="14" height="14" fill="${(op.colores || COLORES)[i]}"/>`);
    o.push(`<text x="${lx + 20}" y="${m.t - 24}" fill="#111">${esc(c)}</text>`);
    lx += 34 + c.length * 7.2;
  });
  for (const v of marcas(0, total, op.marcas || 5)) {
    o.push(`<line x1="${X(v)}" y1="${m.t - 6}" x2="${X(v)}" y2="${H - m.b}" stroke="#e3e1db"/>`);
    o.push(`<text x="${X(v)}" y="${H - m.b + 18}" text-anchor="middle" fill="#333">${num(v)}</text>`);
  }
  op.grupos.forEach((g, k) => {
    const y = m.t + k * (alto + sep);
    o.push(`<text x="${m.l - 10}" y="${y + alto / 2 + 5}" text-anchor="end" fill="#111">${esc(g.nombre)}</text>`);
    let acum = 0;
    g.partes.forEach((v, i) => {
      if (!v) return;
      o.push(`<rect x="${X(acum)}" y="${y}" width="${X(acum + v) - X(acum)}" height="${alto}" fill="${(op.colores || COLORES)[i]}"/>`);
      o.push(`<text x="${(X(acum) + X(acum + v)) / 2}" y="${y + alto / 2 + 5}" text-anchor="middle" fill="#fff" font-weight="bold">${num(v)}</text>`);
      acum += v;
    });
  });
  if (op.xEtiqueta) o.push(`<text x="${m.l + (W - m.l - m.r) / 2}" y="${H - 10}" text-anchor="middle" fill="#111">${esc(op.xEtiqueta)}</text>`);
  o.push("</svg>");
  return o.join("\n");
}

/** Diagrama de pasos en fila: cajas con número y texto, unidas por flechas. */
function pasos(lista, op = {}) {
  const W = op.ancho || 640, porFila = op.porFila || 3, cw = (W - 40 - (porFila - 1) * 30) / porFila, ch = op.altoCaja || 92;
  const filas = Math.ceil(lista.length / porFila);
  const H = 20 + filas * ch + (filas - 1) * 40 + 20;
  const o = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" ${FUENTE} font-size="13">`,
    `<rect width="${W}" height="${H}" fill="#ffffff"/>`,
    `<defs><marker id="flecha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#555"/></marker></defs>`];
  const pos = lista.map((_, i) => {
    const f = Math.floor(i / porFila), c = f % 2 === 0 ? i % porFila : porFila - 1 - (i % porFila);
    return { x: 20 + c * (cw + 30), y: 20 + f * (ch + 40) };
  });
  lista.forEach((p, i) => {
    const { x, y } = pos[i];
    o.push(`<rect x="${x}" y="${y}" width="${cw}" height="${ch}" rx="10" fill="#f3f5fc" stroke="${COLORES[0]}" stroke-width="1.5"/>`);
    o.push(`<text x="${x + 12}" y="${y + 24}" fill="${COLORES[0]}" font-weight="bold" font-size="14">${esc(p.titulo)}</text>`);
    (p.lineas || []).forEach((l, j) => o.push(`<text x="${x + 12}" y="${y + 46 + j * 17}" fill="#222">${esc(l)}</text>`));
    if (i + 1 < lista.length) {
      const a = pos[i], b = pos[i + 1];
      if (a.y === b.y) {
        const izq = b.x > a.x;
        o.push(`<line x1="${izq ? a.x + cw : a.x}" y1="${a.y + ch / 2}" x2="${izq ? b.x - 2 : b.x + cw + 2}" y2="${b.y + ch / 2}" stroke="#555" stroke-width="1.6" marker-end="url(#flecha)"/>`);
      } else {
        o.push(`<line x1="${a.x + cw / 2}" y1="${a.y + ch}" x2="${b.x + cw / 2}" y2="${b.y - 2}" stroke="#555" stroke-width="1.6" marker-end="url(#flecha)"/>`);
      }
    }
  });
  o.push("</svg>");
  return o.join("\n");
}

// ---------------------------------------------------------------------------
// Modelo
// ---------------------------------------------------------------------------
const PHI = (1 + Math.sqrt(5)) / 2;

// Hélice (r cos θ, r sen θ, c θ) y su sombra de costado (z, x cos α + y sen α).
function helice({ vueltas = 3, r = 1, c = 0.25, n = 600, alfa = 0 } = {}) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const th = (2 * Math.PI * vueltas * i) / n;
    const x = r * Math.cos(th + alfa), y = r * Math.sin(th + alfa);
    pts.push([c * th, x]); // sombra sobre el plano xz
  }
  return pts;
}

// Corte y proyección de Z² sobre una recta de pendiente dada.
function cortarYProyectar({ pendiente, cantidad = 401, desplazamiento = 0.0123 }) {
  const al = Math.atan(pendiente);
  const ca = Math.cos(al), sa = Math.sin(al);
  const ancho = ca + sa;
  const u0 = -ancho / 2 + desplazamiento;
  const aceptados = [];
  for (let m = 0; aceptados.length < cantidad && m < cantidad * 4; m++) {
    const nMin = Math.ceil((u0 + m * sa) / ca);
    for (let n = nMin; n < nMin + 3; n++) {
      const u = -m * sa + n * ca;
      if (u >= u0 && u < u0 + ancho) aceptados.push({ m, n, s: m * ca + n * sa, u });
    }
  }
  aceptados.sort((p, q) => p.s - q.s);
  const pasos = [];
  for (let i = 1; i < aceptados.length; i++) {
    const dm = aceptados[i].m - aceptados[i - 1].m, dn = aceptados[i].n - aceptados[i - 1].n;
    pasos.push(dm === 1 && dn === 0 ? "L" : dm === 0 && dn === 1 ? "S" : "?");
  }
  return { angulo: al, ancho, u0, puntos: aceptados, pasos: pasos.join(""), largoL: ca, largoS: sa };
}

function palabraFibonacci(largo) {
  let w = "L";
  while (w.length < largo) w = w.replace(/./g, (ch) => (ch === "L" ? "LS" : "L"));
  return w.slice(0, largo);
}

function periodo(cadena, maxP = 100) {
  for (let p = 1; p <= maxP && p < cadena.length / 2; p++) {
    let ok = true;
    for (let i = 0; i + p < cadena.length; i++) if (cadena[i] !== cadena[i + p]) { ok = false; break; }
    if (ok) return p;
  }
  return null;
}

// Cantidad de subpalabras distintas de largo n (complejidad).
function complejidad(w, n) { const s = new Set(); for (let i = 0; i + n <= w.length; i++) s.add(w.slice(i, i + n)); return s.size; }
// Balance: máxima diferencia de cantidad de S entre dos tramos del mismo largo n.
function desbalance(w, n) {
  let mn = Infinity, mx = -Infinity;
  for (let i = 0; i + n <= w.length; i++) { const k = [...w.slice(i, i + n)].filter((c) => c === "S").length; mn = Math.min(mn, k); mx = Math.max(mx, k); }
  return mx - mn;
}

// Giro por la tercera dimensión: (x, y, 0) → (x cos θ, y, x sen θ); se ve (x cos θ, y).
const girar = (pts, th) => pts.map(([x, y]) => [x * Math.cos(th), y, x * Math.sin(th)]);

const f4 = (x) => Number(x.toPrecision(4));

// ---------------------------------------------------------------------------
// Cifras del texto
// ---------------------------------------------------------------------------
const PENDIENTES = [["1/φ", 1 / PHI], ["√2 − 1", Math.SQRT2 - 1], ["1/2", 1 / 2], ["2/3", 2 / 3], ["3/5", 3 / 5]];
const filas = [];
for (const [nombre, pd] of PENDIENTES) {
  const r = cortarYProyectar({ pendiente: pd });
  const L = [...r.pasos].filter((c) => c === "L").length, S = [...r.pasos].filter((c) => c === "S").length;
  const per = periodo(r.pasos);
  filas.push({ nombre, L, S, cociente: L / S, inversa: 1 / pd, per, inicio: r.pasos.slice(0, 19), raros: [...r.pasos].filter((c) => c === "?").length });
  console.log(`${nombre}: L = ${L}, S = ${S}, L/S = ${f4(L / S)} (1/pendiente = ${f4(1 / pd)}), período ${per ?? "ninguno ≤ 100"}, comienzo ${r.pasos.slice(0, 19)}, pasos inválidos ${filas[filas.length - 1].raros}`);
}
const fib = cortarYProyectar({ pendiente: 1 / PHI });
console.log(`¿La cadena 1/φ es un tramo de la palabra de Fibonacci? ${palabraFibonacci(2000).includes(fib.pasos)}`);
console.log(`Posición en la palabra de Fibonacci: ${palabraFibonacci(2000).indexOf(fib.pasos)}`);
const cad35 = cortarYProyectar({ pendiente: 3 / 5 }).pasos;
let iguales = 0; while (iguales < cad35.length && cad35[iguales] === fib.pasos[iguales]) iguales++;
console.log(`3/5 y 1/φ coinciden en los primeros ${iguales} pasos`);
const W = palabraFibonacci(5000);
console.log(`Fibonacci: SS aparece ${W.includes("SS")}; LLL aparece ${W.includes("LLL")}; complejidad n=1..10: ${Array.from({ length: 10 }, (_, i) => complejidad(W, i + 1)).join(" ")}`);
console.log(`Desbalance máximo (n = 1..50): ${Math.max(...Array.from({ length: 50 }, (_, i) => desbalance(W, i + 1)))}`);
const largos = []; { let w = "L"; for (let k = 0; k < 10; k++) { largos.push(w.length); w = w.replace(/./g, (ch) => (ch === "L" ? "LS" : "L")); } }
console.log(`Largos de σ^k(L): ${largos.join(", ")}`);
// Hélice: girar α equivale a correr la sombra cα
{
  const c = 0.25, a = Math.PI / 2;
  const s0 = helice({ alfa: 0 }), s1 = helice({ alfa: a });
  // x(z) con giro α = x(z + cα) sin giro: compara en puntos interiores
  let err = 0;
  for (let i = 100; i < 400; i++) { const [z, x] = s1[i]; err = Math.max(err, Math.abs(x - Math.cos(z / c + a))); }
  console.log(`Hélice: período de la sombra 2πc = ${f4(2 * Math.PI * c)}; corrimiento por un giro de 90° = cπ/2 = ${f4(c * a)}; error máximo ${err.toExponential(1)}`);
}
// Reflejo: la F girada π queda espejada
{
  const F = [[-0.4, -1], [-0.4, 1], [0.6, 1], [0.35, 0.1]];
  const g = girar(F, Math.PI);
  console.log(`F girada 180°: ${g.map(([x, y, z]) => `(${f4(x + 0)}, ${y}, ${Math.abs(z) < 1e-12 ? 0 : f4(z)})`).join(" ")}`);
}
// Aliasing: rueda de 12 rayos a 24 cuadros por segundo
{
  const rayos = 12, fs = 24;
  for (const rps of [1.9, 2, 2.1]) {
    const fRayo = rayos * rps; // frecuencia con que pasa un rayo por una posición
    const fa = fRayo - Math.round(fRayo / fs) * fs;
    console.log(`Rueda a ${rps} vueltas/s: frecuencia de rayos ${f4(fRayo)} Hz, aparente ${f4(fa)} Hz → ${f4(fa / rayos)} vueltas/s`);
  }
}

// ---------------------------------------------------------------------------
// Figura 1: la sombra de la hélice
// ---------------------------------------------------------------------------
guardar("helice", grafico({
  series: [
    { nombre: "Sombra, giro α = 0", puntos: helice({ alfa: 0 }), color: COLORES[0] },
    { nombre: "Sombra, giro α = π/2", puntos: helice({ alfa: Math.PI / 2 }), color: COLORES[1], punteada: true },
  ],
  xMin: 0, xMax: 6 * Math.PI * 0.25, yMin: -1.3, yMax: 1.3,
  verticales: [{ x: 2 * Math.PI * 0.25, etiqueta: "2πc" }],
  xEtiqueta: "Coordenada a lo largo del eje, z", yEtiqueta: "Sombra x",
}));

// ---------------------------------------------------------------------------
// Figura 2: corte y proyección con pendiente 1/φ
// ---------------------------------------------------------------------------
{
  const r = cortarYProyectar({ pendiente: 1 / PHI, cantidad: 21 });
  const ta = Math.tan(r.angulo), ca = Math.cos(r.angulo);
  // recta n = m·tanα y bordes de la franja u = u0, u = u0 + ancho  →  n = m tanα + u/cosα
  const recta = (off) => [[-1, -ta + off / ca], [14, 14 * ta + off / ca]];
  guardar("corte", grafico({
    series: [
      { nombre: "Puntos aceptados", puntos: r.puntos.map((p) => [p.m, p.n]), color: COLORES[1], grosor: 2.6 },
      { nombre: "Recta de pendiente 1/φ", puntos: recta(0), color: COLORES[0] },
      { nombre: "Bordes de la franja", puntos: recta(r.u0), color: COLORES[5], punteada: true, grosor: 1.4 },
      { nombre: "", puntos: recta(r.u0 + r.ancho), color: COLORES[5], punteada: true, grosor: 1.4 },
    ],
    xMin: -1, xMax: 13, yMin: -1, yMax: 9, ancho: 640, alto: 460,
    xEtiqueta: "m", yEtiqueta: "n",
  }));
}

// ---------------------------------------------------------------------------
// Figura 3: convergencia de las frecuencias
// ---------------------------------------------------------------------------
{
  const larga = cortarYProyectar({ pendiente: 1 / PHI, cantidad: 3001 }).pasos;
  const larga2 = cortarYProyectar({ pendiente: Math.SQRT2 - 1, cantidad: 3001 }).pasos;
  const curva = (w) => { const out = []; let L = 0, S = 0; for (let i = 0; i < w.length; i++) { if (w[i] === "L") L++; else S++; if (i >= 9 && S > 0) out.push([i + 1, L / S]); } return out; };
  guardar("frecuencias", grafico({
    series: [
      { nombre: "Pendiente 1/φ", puntos: curva(larga), color: COLORES[0] },
      { nombre: "Pendiente √2 − 1", puntos: curva(larga2), color: COLORES[1] },
    ],
    logX: true, xMin: 10, xMax: 3000, yMin: 1, yMax: 3,
    horizontales: [{ y: PHI, etiqueta: "φ" }, { y: 1 + Math.SQRT2, etiqueta: "1 + √2" }],
    xEtiqueta: "Cantidad de pasos", yEtiqueta: "Cociente #L / #S",
  }));
  const fin = (w) => { const L = [...w].filter((c) => c === "L").length; return L / (w.length - L); };
  console.log(`Con 3000 pasos: L/S(1/φ) = ${f4(fin(larga))}, L/S(√2 − 1) = ${f4(fin(larga2))}`);
}

// ---------------------------------------------------------------------------
// Figura 4: complejidad de subpalabras
// ---------------------------------------------------------------------------
{
  const ns = Array.from({ length: 16 }, (_, i) => i + 1);
  const per = cortarYProyectar({ pendiente: 3 / 5, cantidad: 2001 }).pasos;
  // palabra "aleatoria" reproducible
  let a = 12345; const azar = Array.from({ length: 5000 }, () => { a = (a * 1103515245 + 12345) % 2147483648; return a / 2147483648 < 0.618 ? "L" : "S"; }).join("");
  guardar("complejidad", grafico({
    series: [
      { nombre: "Al azar", puntos: ns.map((n) => [n, complejidad(azar, n)]), color: COLORES[5] },
      { nombre: "Fibonacci (n + 1)", puntos: ns.map((n) => [n, complejidad(W, n)]), color: COLORES[0] },
      { nombre: "Pendiente 3/5 (período 8)", puntos: ns.map((n) => [n, complejidad(per, n)]), color: COLORES[1] },
    ],
    logY: true, xMin: 1, xMax: 16, yMin: 1, yMax: 1e4,
    xEtiqueta: "Largo de la subpalabra, n", yEtiqueta: "Subpalabras distintas",
  }));
  console.log(`Complejidad 3/5, n = 1..10: ${ns.slice(0, 10).map((n) => complejidad(per, n)).join(" ")}`);
}
