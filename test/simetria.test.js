const test = require("node:test");
const assert = require("node:assert/strict");
const S = require("../src/simetria.js");

const cerca = (a, b, eps, msg) => assert.ok(Math.abs(a - b) < eps, msg || `${a} ≈ ${b}`);

test("la sombra de costado de la hélice es un coseno", () => {
  const pts = S.helice({ vueltas: 2, r: 1.5, c: 0.3, n: 200 });
  for (const [z, x] of S.sombraLateral(pts, 0)) cerca(x, 1.5 * Math.cos(z / 0.3), 1e-9);
});

test("girar la hélice equivale a moverla a lo largo del eje (simetría de tornillo)", () => {
  const c = 0.3, phi = 0.7;
  const a = S.sombraLateral(S.helice({ vueltas: 2, c, n: 200 }), phi);
  // Mirar desde phi es igual a desplazar la onda c·phi a lo largo de z.
  for (const [z, x] of a) cerca(x, Math.cos(z / c - phi), 1e-9);
});

test("corte y proyección: cada paso es horizontal (L) o vertical (S)", () => {
  for (const pendiente of [1 / S.PHI, 0.5, Math.SQRT2 - 1]) {
    const r = S.cortarYProyectar({ pendiente, cantidad: 300 });
    assert.ok(!r.pasos.includes("?"), `pendiente ${pendiente}`);
    assert.ok(r.pasos.length >= 299);
  }
});

test("con pendiente 1/φ sale la cadena de Fibonacci", () => {
  const r = S.cortarYProyectar({ pendiente: 1 / S.PHI, cantidad: 600 });
  const fib = S.palabraFibonacci(5000);
  assert.ok(fib.includes(r.pasos.slice(0, 80)), "es un tramo de la palabra de Fibonacci");
  const L = [...r.pasos].filter((c) => c === "L").length;
  const Sc = r.pasos.length - L;
  cerca(L / Sc, S.PHI, 0.02);
  assert.ok(!r.pasos.includes("SS"), "nunca hay dos pasos cortos seguidos");
  assert.equal(S.periodo(r.pasos, 100), null, "no se repite");
});

test("con pendiente racional la cadena se repite", () => {
  assert.equal(S.periodo(S.cortarYProyectar({ pendiente: 1 / 2 }).pasos), 3);
  assert.equal(S.periodo(S.cortarYProyectar({ pendiente: 2 / 3 }).pasos), 5);
});

test("la palabra de Fibonacci empieza como se espera", () => {
  assert.equal(S.palabraFibonacci(13), "LSLLSLSLLSLLS");
});

test("girar 180° por la tercera dimensión espeja la figura", () => {
  const pts = [[0.6, 1], [-0.4, 0.1]];
  const g = S.girarPorTerceraDimension(pts, Math.PI);
  cerca(g[0][0], -0.6, 1e-12);
  cerca(g[1][0], 0.4, 1e-12);
  assert.equal(g[0][1], 1);
  // A 90° la figura queda de canto: en el plano se ve como una línea.
  for (const [x] of S.girarPorTerceraDimension(pts, Math.PI / 2)) cerca(x, 0, 1e-12);
});
