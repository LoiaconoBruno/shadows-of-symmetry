// Simetrías discretas como sombras de simetrías continuas en una dimensión más.
//
// 1. Hélice → onda: la hélice es simétrica ante cualquier giro combinado con
//    un avance (continua). Vista de costado, su sombra es una onda que solo se
//    repite a saltos de una vuelta (discreta).
// 2. Corte y proyección: se toma la red cuadrada de 2D, se corta una franja a
//    lo largo de una recta de pendiente dada y se proyectan sus puntos sobre
//    la recta. Sale una cadena 1D de pasos largos (L) y cortos (S). Con
//    pendiente racional la cadena se repite; con pendiente irracional nunca
//    (cuasiperiódica). Con pendiente 1/φ es la cadena de Fibonacci.
// 3. Reflejo: espejar una figura plana es lo mismo que girarla 180° por la
//    tercera dimensión.
const Simetria = (() => {
  const PHI = (1 + Math.sqrt(5)) / 2;

  // Puntos de una hélice: [x, y, z] con radio r y avance c por radián.
  function helice({ vueltas = 3, r = 1, c = 0.25, n = 400 } = {}) {
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const th = (2 * Math.PI * vueltas * i) / n;
      pts.push([r * Math.cos(th), r * Math.sin(th), c * th]);
    }
    return pts;
  }

  // Sombra de costado mirando desde el ángulo alfa: [z, coordenada lateral].
  function sombraLateral(pts, alfa = 0) {
    return pts.map(([x, y, z]) => [z, x * Math.cos(alfa) + y * Math.sin(alfa)]);
  }

  // Corte y proyección de la red Z² sobre una recta de pendiente dada.
  // Devuelve los puntos aceptados ordenados a lo largo de la recta y la cadena de pasos.
  function cortarYProyectar({ pendiente, cantidad = 200, desplazamiento = 0.0123 }) {
    const al = Math.atan(pendiente);
    const ca = Math.cos(al), sa = Math.sin(al);
    const ancho = ca + sa; // proyección del cuadrado unidad sobre la perpendicular
    const u0 = -ancho / 2 + desplazamiento;
    const aceptados = [];
    // Recorre columnas m; para cada una, solo hay a lo sumo un par de n posibles.
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
      const dm = aceptados[i].m - aceptados[i - 1].m;
      const dn = aceptados[i].n - aceptados[i - 1].n;
      pasos.push(dm === 1 && dn === 0 ? "L" : dm === 0 && dn === 1 ? "S" : "?");
    }
    return { angulo: al, ancho, u0, puntos: aceptados, pasos: pasos.join(""), largoL: ca, largoS: sa };
  }

  // Palabra de Fibonacci por sustitución L → LS, S → L.
  function palabraFibonacci(largo) {
    let w = "L";
    while (w.length < largo) w = w.replace(/./g, (ch) => (ch === "L" ? "LS" : "L"));
    return w.slice(0, largo);
  }

  // Menor período p ≤ maxP tal que la cadena se repite exactamente cada p. null si no hay.
  function periodo(cadena, maxP = 60) {
    for (let p = 1; p <= maxP && p < cadena.length / 2; p++) {
      let ok = true;
      for (let i = 0; i + p < cadena.length; i++) if (cadena[i] !== cadena[i + p]) { ok = false; break; }
      if (ok) return p;
    }
    return null;
  }

  // Gira la figura plana alrededor del eje vertical por la tercera dimensión y
  // la vuelve a proyectar sobre el plano. Con θ = π queda espejada.
  function girarPorTerceraDimension(puntos, theta) {
    return puntos.map(([x, y]) => [x * Math.cos(theta), y, x * Math.sin(theta)]);
  }

  // Una letra F (asimétrica: se nota cuando se espeja), como lista de segmentos.
  const LETRA_F = [
    [[-0.4, -1], [-0.4, 1]],
    [[-0.4, 1], [0.6, 1]],
    [[-0.4, 0.1], [0.35, 0.1]],
  ];

  return { PHI, helice, sombraLateral, cortarYProyectar, palabraFibonacci, periodo, girarPorTerceraDimension, LETRA_F };
})();

if (typeof module !== "undefined") module.exports = Simetria;
