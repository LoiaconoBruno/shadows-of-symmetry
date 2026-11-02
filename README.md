# Simetría vista desde la dimensión N+1

Tres visualizaciones interactivas de una tesis: **lo que en una dimensión se repite "a saltos" puede ser la sombra de algo perfectamente suave en una dimensión más.**

1. **Hélice → onda.** Una hélice en 3D es simétrica ante cualquier giro combinado con un avance (simetría continua). Su sombra de costado es una onda que solo se repite cada vuelta (simetría discreta).
2. **Red cuadrada → cadena de Fibonacci.** El método de corte y proyección, de 2D a 1D: con pendiente racional la cadena se repite; con pendiente irracional nunca se repite, aunque está perfectamente ordenada (un cuasicristal en una dimensión).
3. **Un reflejo es un giro en una dimensión más.** Una F no se puede espejar moviéndola dentro del plano, pero sí girándola 180° por la tercera dimensión.

## Por qué

Es una idea que aparece en muchos campos a la vez (señales y Fourier, cuasicristales, Kaluza-Klein, sistemas dinámicos, reflejos), ideal para un paper de síntesis. Estas son las dos visualizaciones base que la idea pedía como próximo paso, más la del reflejo.

## Instalación

No hace falta instalar nada. Es una página estática sin dependencias. Para correr los tests hace falta Node 18 o más nuevo.

## Uso

Abrí `index.html` con doble clic.

Ejemplo:

1. **Hélice.** Apretá **Girar la hélice**: la hélice gira de forma continua y, en el gráfico de la derecha, la onda solo se corre a lo largo del eje. Girar es lo mismo que avanzar. Apretá **Parar** para detenerla.
2. **Corte y proyección.** Con **1/φ ≈ 0,618 (Fibonacci)** hay **247** pasos largos y **153** cortos (L/S = **1,614**, cerca de φ ≈ 1,618), y **¿Se repite? No**. Abajo se ve la cadena: `LSLSLLSLLSLS...`, nunca con dos S seguidas.
3. Elegí **2/3**: ahora **¿Se repite? Sí, cada 5 pasos**. Elegí **3/5 (casi 1/φ, pero racional)**: también se repite, aunque se parece mucho a Fibonacci.
4. **Reflejo.** Llevá el deslizador a 90°: desde el plano, la F se ve como una línea (está de canto). A 180°: queda **espejada**.

## Cómo funciona

- **Hélice:** puntos `(cos θ, sen θ, c·θ)`. La sombra mirando desde el ángulo α es `cos(θ − α)`: girar la hélice α equivale a correr la onda `c·α` a lo largo del eje.
- **Corte y proyección:** recta de pendiente `tan α` por el origen. Se aceptan los puntos `(m, n)` de la red cuya coordenada perpendicular `u = −m·sen α + n·cos α` cae en una franja de ancho `cos α + sen α` (la sombra del cuadrado unidad). Ordenados a lo largo de la recta, cada paso es `(1, 0)` (largo, L) o `(0, 1)` (corto, S).
- **Período:** se busca el menor p con el que la cadena se repite exactamente (hasta 100 pasos).
- **Reflejo:** girar la figura un ángulo θ alrededor del eje vertical por la tercera dimensión lleva `x` a `x·cos θ`. Con θ = 180°, `x → −x`.

La lógica está en `src/simetria.js`, sin DOM, y se testea con:

```bash
npm test
```

Los tests comprueban, entre otras cosas, que la cadena con pendiente 1/φ es un tramo de la palabra de Fibonacci (sustitución L → LS, S → L).

## Limitaciones

- Las ideas son conocidas en matemática y física: el aporte está en la síntesis y en las visualizaciones, no en un resultado nuevo.
- El corte y proyección se muestra en el caso más simple (2D → 1D). Los mosaicos de Penrose salen de 5D → 2D (de Bruijn, 1981).
- "¿Se repite?" busca períodos de hasta 100 pasos sobre 400: una cadena racional con período más largo figuraría como "No".

## Próximos pasos

- Agregar Kaluza-Klein y la pregunta de Noether: si subís a N+1 para volver continua una simetría discreta, ¿aparece una cantidad conservada?
- Versión 2D → mosaico de Penrose.
- Armar el índice del paper "Simetrías discretas como sombras de simetrías continuas".

## Licencia

MIT
