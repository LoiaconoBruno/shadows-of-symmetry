# Sombras de la simetría: paper de uso y guía de la idea

## Resumen

Este documento acompaña a **Shadows of Symmetry**, una página interactiva que ilustra una tesis: **lo que en una dimensión se repite "a saltos" puede ser la sombra de algo perfectamente suave en una dimensión más**. La página tiene tres visualizaciones: una hélice cuya sombra es una onda, una red cuadrada que cortada y proyectada da la cadena de Fibonacci, y una letra F que se espeja girándola por la tercera dimensión.

La primera parte es un paper de uso: cada control, un ejemplo resuelto con los números de la herramienta y sus límites. La segunda es una guía de la idea, que recorre la noción moderna de simetría (Klein, Noether, Weyl), la hélice como objeto matemático y biológico (de Euler a Watson, Crick y Franklin), los cuasicristales (Penrose, Shechtman, de Bruijn, Levine y Steinhardt) y el método de corte y proyección, las palabras sturmianas y las fracciones continuas, la quiralidad (Kant, Pasteur, Möbius, Kelvin) y la violación de la paridad (Lee, Yang y Wu). Termina con la pregunta que deja abierta la idea: si subir una dimensión vuelve continua una simetría discreta, ¿aparece una cantidad conservada, como en la teoría de Kaluza y Klein?

## Parte I. Paper de uso

### 1. Qué es la herramienta

Shadows of Symmetry es una página estática sin dependencias que se abre desde la [demo en vivo](https://loiaconobruno.github.io/shadows-of-symmetry/) o con doble clic en `index.html`. Tiene tres tarjetas:

1. **Hélice → onda.** Una hélice en 3D y, al lado, su sombra vista de costado.
2. **Red cuadrada (2D) → cadena (1D): corte y proyección.** Una red de puntos, una recta que la atraviesa, una franja alrededor de la recta y la cadena de pasos largos (L) y cortos (S) que resulta de proyectar sobre la recta los puntos que caen en la franja.
3. **Un reflejo es un giro en una dimensión más.** Una letra F que gira alrededor de un eje vertical saliendo del plano.

La lógica está en `src/simetria.js`, sin acceso al DOM. `src/grafico.js` dibuja y `src/app.js` conecta los controles. Los tests se corren con `npm test` (Node 18 o más nuevo).

### 2. Instalación

```bash
git clone https://github.com/LoiaconoBruno/shadows-of-symmetry.git
cd shadows-of-symmetry
npm test
```

Después se abre `index.html` con doble clic.

### 3. Tarjeta 1: hélice → onda

| Control | Qué hace |
|---|---|
| Girar la hélice / Parar | Anima un giro continuo de la hélice alrededor de su eje |
| Ángulo de giro | Deslizador de 0° a 360° para fijar el giro a mano |

A la izquierda se ve la hélice en perspectiva. A la derecha, su sombra lateral: la coordenada horizontal de cada punto en función de la altura. La sombra es una onda (un coseno). Al girar la hélice, la onda no cambia de forma: solo se desplaza a lo largo del eje.

### 4. Tarjeta 2: corte y proyección

| Control | Opciones |
|---|---|
| Pendiente de la recta | 1/φ ≈ 0,618 (Fibonacci) · √2 − 1 ≈ 0,414 · 1/2 · 2/3 · 3/5 (casi 1/φ, pero racional) |

Resultados:

- **Pasos largos (L)** y **pasos cortos (S):** cuántos de cada tipo hay en los 400 pasos de la cadena.
- **L / S:** el cociente entre ambos.
- **¿Se repite?:** si la cadena tiene un período de hasta 100 pasos; si lo tiene, cuál.

Debajo del gráfico aparece la cadena como texto: `LSLSLLSLLS...`.

### 5. Tarjeta 3: el reflejo

| Control | Rango | Qué hace |
|---|---|---|
| Giro por la tercera dimensión | 0° a 180° | Gira la F alrededor del eje vertical, sacándola del plano |

Lo que se ve es la F desde el plano: a medida que gira, se angosta; a 90° queda de canto y se ve como una línea; a 180° vuelve al plano, espejada.

### 6. Ejemplo resuelto

**Hélice.** Al apretar "Girar la hélice", la hélice gira de forma continua y la onda de la derecha se corre a lo largo del eje sin deformarse. Girar la hélice un ángulo α es lo mismo que avanzarla una distancia c·α a lo largo del eje, donde c es el paso por radián. Esa equivalencia es la **simetría de tornillo**, continua. La sombra, en cambio, solo coincide consigo misma si se la corre una vuelta completa (2πc): su simetría es **discreta**.

**Corte y proyección con 1/φ.** Con la pendiente de Fibonacci, la herramienta cuenta **247** pasos largos y **153** cortos. El cociente es **1,614**, cerca de φ ≈ 1,618. "¿Se repite?" responde **No**. La cadena empieza `LSLSLLSLLSLSLLSLSLLSLLSLS...` y nunca tiene dos S seguidas.

**Las otras pendientes.** Con los mismos 400 pasos:

| Pendiente | L | S | L / S | ¿Se repite? | Comienzo de la cadena |
|---|---|---|---|---|---|
| 1/φ ≈ 0,618 | 247 | 153 | 1,614 | No | LSLSLLSLLSLSLLSLSLL… |
| √2 − 1 ≈ 0,414 | 282 | 117 | 2,410 | No | LSLLLSLLSLLSLLLSLLS… |
| 1/2 | 266 | 133 | 2,000 | Sí, cada 3 | LSLLSLLSLLSLLSLLSLL… |
| 2/3 | 239 | 160 | 1,494 | Sí, cada 5 | LSLSLLSLSLLSLSLLSLS… |
| 3/5 | 249 | 150 | 1,660 | Sí, cada 8 | LSLSLLSLLSLSLLSLLSL… |

Dos cosas saltan a la vista. Primero, L/S se acerca a 1/pendiente: φ para Fibonacci, 1 + √2 ≈ 2,414 para la segunda, 2 para 1/2. Segundo, con pendiente racional p/q la cadena se repite cada p + q pasos (3 = 1 + 2, 5 = 2 + 3, 8 = 3 + 5). Y 3/5, que es una aproximación de 1/φ, da una cadena que coincide con la de Fibonacci en sus primeros pasos pero se repite cada 8.

**Reflejo.** Llevando el deslizador a 90°, la F se ve como una línea vertical (está de canto). A 180° queda espejada: la barra superior y la del medio apuntan hacia la izquierda en vez de hacia la derecha. Ningún movimiento dentro del plano (traslaciones y giros) puede producir esa F espejada; un giro por la tercera dimensión sí.

### 7. Cómo leer los resultados

- La hélice muestra el caso más simple: una simetría continua (tornillo) que, vista en una dimensión menos, se ve discreta (período de la onda).
- El corte y proyección muestra el caso más interesante: un objeto periódico y simple (la red cuadrada) que, cortado con una pendiente irracional, da una cadena **ordenada pero no periódica**. El orden se ve en que nunca hay dos S seguidas y en que las frecuencias de L y S son exactas; la falta de período, en que ningún tramo se repite exactamente a intervalos fijos.
- El reflejo muestra que una operación "imposible" en n dimensiones (convertir una figura en su imagen especular sin romperla) es un giro común en n + 1.

#### 7.1 Preguntas frecuentes

**¿Por qué la cadena de √2 − 1 tiene a veces tres L seguidas?** Porque 1/(√2 − 1) = 1 + √2 ≈ 2,414: en promedio hay 2,414 L por cada S, así que entre dos S aparecen dos o tres L. En la de Fibonacci, 1/φ = φ − 1 ≈ 0,618 y φ ≈ 1,618: entre dos S hay una o dos L. En general, entre dos S hay ⌊1/pendiente⌋ o ⌈1/pendiente⌉ L, nunca otra cantidad. Esa es una propiedad de las palabras sturmianas (sección 15).

**¿El "No" de "¿Se repite?" es una prueba de que no hay período?** No. La herramienta busca períodos de hasta 100 pasos sobre una cadena de 400. Para pendientes irracionales se sabe matemáticamente que no hay período. Para una pendiente racional con denominador grande (por ejemplo 89/144), la herramienta respondería "No" aunque haya un período de 233. Es una limitación declarada.

**¿Por qué hay un "desplazamiento" en el código?** La función `cortarYProyectar` corre la franja una cantidad pequeña (0,0123) para evitar que algún punto de la red caiga exactamente sobre el borde. Con desplazamiento cero, un punto en el borde podría entrar o salir según el redondeo, y la cadena tendría un "defecto".

**¿Qué pasa con el reflejo en tres dimensiones?** Que necesita una cuarta. Una mano izquierda no se convierte en una derecha girándola en el espacio; en cuatro dimensiones sí se podría (sección 17).

#### 7.2 Recorrido para una clase

1. **Hélice, a mano.** Mové el deslizador de ángulo de 0° a 90°. *¿Cuánto se corrió la onda?* Un cuarto de período. Pedí que lo expliquen sin mirar la hélice, solo con la onda.
2. **Hélice, animada.** Apretá "Girar la hélice" y preguntá: *¿la onda se mueve hacia arriba o hacia abajo?* Depende del sentido de giro y del sentido del avance; es la diferencia entre un tornillo derecho y uno izquierdo, que conecta con la tarjeta 3.
3. **Corte racional.** Elegí 1/2 y leé la cadena en voz alta: LSL LSL LSL… *¿Cuál es el bloque que se repite?* Después 2/3: LSLSL LSLSL…
4. **Corte casi irracional.** Elegí 3/5 y compará la cadena, letra por letra, con la de 1/φ. *¿En qué paso se separan?*
5. **Corte irracional.** Con 1/φ, buscá dos S seguidas. No las hay. Buscá tres L seguidas. Tampoco. *¿Qué palabras de dos letras aparecen?* LS, SL y LL: tres, o sea n + 1 para n = 2.
6. **Reflejo.** Llevá la F a 90° y preguntá qué ve un habitante del plano. Una línea: la F "desapareció" de su mundo por un instante y volvió dada vuelta.

### 8. Limitaciones

- Las ideas son conocidas en matemática y física: el aporte está en la síntesis y en las visualizaciones.
- El corte y proyección se muestra en el caso más simple (2D → 1D). Los mosaicos de Penrose salen de 5D → 2D.
- "¿Se repite?" busca períodos de hasta 100 pasos sobre 400.
- La hélice tiene parámetros fijos (radio 1, paso 0,25 por radián, tres vueltas).

## Parte II. Guía de la idea

### 9. La tesis y por qué aparece en todas partes

La idea que dio origen a la herramienta se puede decir en una oración: **una simetría discreta en n dimensiones puede ser la sombra de una simetría continua en n + 1**. Lo que se ve "a saltos" (una onda que se repite cada tanto, una cadena que alterna patrones, una figura que solo coincide con su reflejo si se la da vuelta) puede ser la huella de algo suave en un espacio más grande.

Esta idea no pertenece a un solo campo. Aparece en el análisis de Fourier (una oscilación es la sombra de un giro), en cristalografía (los cuasicristales son cortes de cristales periódicos en más dimensiones), en sistemas dinámicos (un mapa discreto es la sección de un flujo continuo), en física de partículas (la carga eléctrica como movimiento en una dimensión escondida) y en la geometría de los reflejos. La herramienta ilustra tres de esos casos. Esta guía cuenta la historia de cada uno y muestra por qué son el mismo fenómeno.

### 10. Qué es una simetría

#### 10.1 Klein y el programa de Erlangen

Hasta el siglo XIX, "simetría" significaba proporción o balance. Felix Klein le dio el sentido moderno en 1872, en un texto conocido como el **programa de Erlangen** (*Vergleichende Betrachtungen über neuere geometrische Forschungen*). Klein propuso que cada geometría se define por un **grupo de transformaciones** y que estudiarla es estudiar las propiedades que esas transformaciones no cambian. La geometría euclidiana es la de las traslaciones, giros y reflejos; la proyectiva, la de las proyecciones; la topología, la de las deformaciones continuas.

En ese lenguaje, una simetría de un objeto es una transformación que lo deja igual. Las simetrías de un objeto forman un grupo: si dos transformaciones lo dejan igual, aplicarlas una después de otra también.

#### 10.2 Simetrías continuas y discretas

Un grupo de simetría puede ser **continuo** o **discreto**. Una circunferencia es simétrica ante cualquier giro alrededor de su centro: el grupo de giros es continuo, porque se puede girar cualquier ángulo. Un cuadrado solo es simétrico ante giros de 90°, 180°, 270° y 360°: el grupo es discreto (y finito). Una red infinita de puntos es simétrica ante traslaciones por múltiplos enteros de un paso: grupo discreto e infinito.

La herramienta trata de cómo pasar de uno al otro: un grupo continuo en n + 1 dimensiones que, al proyectarse o cortarse a n, deja un grupo discreto.

#### 10.3 Weyl y Noether

Hermann Weyl escribió en 1952 un pequeño libro, *Symmetry*, basado en conferencias en Princeton, que todavía es la mejor introducción al tema: de los frisos de los templos griegos a los cristales y a la física. Weyl insistía en que la simetría es una idea que une el arte, la naturaleza y la matemática.

En física, la importancia de las simetrías continuas viene de un teorema de Emmy Noether. En *Invariante Variationsprobleme* (1918, *Nachrichten von der Gesellschaft der Wissenschaften zu Göttingen*, 235–257), Noether demostró que a cada simetría continua de las leyes físicas le corresponde una cantidad conservada: la simetría ante traslaciones en el tiempo da la conservación de la energía; ante traslaciones en el espacio, la del momento; ante giros, la del momento angular. Las simetrías discretas no dan cantidades conservadas de esta manera (dan, en mecánica cuántica, números cuánticos multiplicativos como la paridad). Por eso la pregunta de la sección 18 es interesante: si una simetría discreta es la sombra de una continua, ¿hay una cantidad conservada escondida?

### 11. La hélice: un giro que se ve como una onda

#### 11.1 La simetría de tornillo

La hélice de la herramienta es la curva

$$ (x, y, z) = (cos θ, sen θ, c · θ) $$

donde θ recorre los números reales y c es el avance por radián. Si se la gira un ángulo α alrededor del eje z, cada punto pasa a (cos(θ + α), sen(θ + α), cθ), que es el punto de parámetro θ + α corrido hacia abajo una distancia cα. Es decir: **girar α y avanzar cα deja la hélice igual**. Esa simetría combinada se llama simetría de tornillo o helicoidal, y es continua: vale para cualquier α.

#### 11.2 La sombra

Si se mira la hélice de costado, desde la dirección del eje y, se ve su proyección sobre el plano xz:

$$ x = cos θ,   z = c θ   →   x = cos(z / c) $$

Una onda. Si la hélice se gira α, la sombra pasa a ser x = cos(z/c + α): la misma onda, corrida. Lo que en 3D era un giro, en la sombra es una traslación. Y la sombra solo es igual a sí misma si se la corre un período completo, 2πc: su simetría de traslación es discreta.

La función `sombraLateral` del código calcula exactamente esto, y uno de los tests verifica que girar la hélice equivale a moverla a lo largo del eje.

#### 11.3 Euler y la exponencial compleja

La hélice es la representación geométrica de la fórmula más famosa del análisis. Leonhard Euler publicó en *Introductio in analysin infinitorum* (1748) la identidad

$$ e^(iθ) = cos θ + i sen θ $$

Si se grafica e^(iθ) en el plano complejo en función de θ, el resultado es exactamente la hélice de la herramienta: un punto que gira sobre un círculo de radio 1 mientras avanza. Su sombra sobre el eje real es cos θ; sobre el imaginario, sen θ. Toda oscilación sinusoidal es la sombra de un giro uniforme.

#### 11.4 Fourier: toda onda es una suma de sombras

Joseph Fourier, estudiando la propagación del calor, propuso en *Théorie analytique de la chaleur* (1822) que cualquier función periódica razonable se puede escribir como una suma de senos y cosenos. Con la fórmula de Euler, eso es lo mismo que decir que cualquier señal periódica es la sombra de una suma de giros uniformes a frecuencias distintas: una combinación de hélices. Es la base del procesamiento de señales, de la música electrónica, de la compresión de imágenes y de la mecánica cuántica.

En este lenguaje, la tesis de la herramienta es casi una definición: una función periódica (simetría discreta de traslación) es la proyección de un movimiento circular uniforme (simetría continua de giro).

#### 11.5 La hélice en la naturaleza

La hélice es una de las formas más comunes en biología, y su relación con la sombra fue decisiva en uno de los descubrimientos centrales del siglo XX. En 1952, William Cochran, Francis Crick y Vladimir Vand calcularon cómo difracta los rayos X una hélice de átomos (*Acta Crystallographica*, 5, 581–586). La respuesta fue un patrón en forma de X. Cuando Rosalind Franklin y Raymond Gosling obtuvieron la célebre "fotografía 51" del ADN en su forma B, la X estaba ahí. James Watson y Crick publicaron la estructura de doble hélice en *Nature* en abril de 1953 (171, 737–738), en el mismo número que los artículos de Franklin y Gosling (171, 740–741) y de Maurice Wilkins y colaboradores. La difracción de rayos X es, matemáticamente, una transformada de Fourier: una forma muy sofisticada de mirar la sombra de un objeto periódico para deducir el objeto.

Linus Pauling había propuesto en 1951 la hélice α de las proteínas, otra simetría de tornillo, con 3,6 aminoácidos por vuelta: un caso en el que la simetría continua del modelo ideal se realiza de forma discreta, porque las unidades vienen de a una.

### 12. Cristales: la simetría discreta por excelencia

#### 12.1 La restricción cristalográfica

Un cristal es un arreglo periódico de átomos: tiene simetría de traslación discreta en tres direcciones. Auguste Bravais clasificó en 1850 las redes posibles en tres dimensiones (las 14 redes de Bravais), y Evgraf Fedorov y Arthur Schoenflies enumeraron en 1891 los 230 grupos espaciales. Un resultado sencillo pero fuerte, la **restricción cristalográfica**, dice que un cristal periódico solo puede tener ejes de simetría de giro de orden 1, 2, 3, 4 o 6. La simetría de orden 5 (como la de un pentágono) es imposible: no se puede embaldosar el plano con pentágonos regulares sin dejar huecos.

Durante más de un siglo, eso fue un dogma: los cristales son periódicos y no tienen simetría de orden 5.

#### 12.2 Shechtman, 1982

El 8 de abril de 1982, Dan Shechtman, trabajando en el National Bureau of Standards de Estados Unidos, observó en un microscopio electrónico el patrón de difracción de una aleación de aluminio y manganeso enfriada rápidamente. Tenía puntos nítidos, como un cristal, y simetría de orden 10, que en tres dimensiones corresponde a la simetría del icosaedro. Era imposible para un cristal periódico.

El artículo, firmado con Ilan Blech, Denis Gratias y John Cahn, apareció en 1984 en *Physical Review Letters* (53, 1951–1953) con el título *Metallic phase with long-range orientational order and no translational symmetry*. La comunidad lo recibió con escepticismo; Linus Pauling sostuvo hasta su muerte que se trataba de un "maclado" de cristales comunes. Pero las observaciones se multiplicaron, y en 2011 Shechtman recibió el Premio Nobel de Química. La Unión Internacional de Cristalografía cambió en 1992 la definición de cristal: ya no es "arreglo periódico" sino "sólido con un patrón de difracción esencialmente discreto".

#### 12.3 Levine y Steinhardt: el nombre y la explicación

Pocas semanas después del artículo de Shechtman, Dov Levine y Paul Steinhardt publicaron *Quasicrystals: A new class of ordered structures* (*Physical Review Letters*, 53, 2477–2480, 1984), donde acuñaron el término **cuasicristal** y mostraron que estructuras con orden cuasiperiódico producen patrones de difracción nítidos con simetrías prohibidas para cristales. Steinhardt contó después la historia, incluida la búsqueda de cuasicristales naturales que terminó en un meteorito de Kamchatka, en *The Second Kind of Impossible* (2019).

### 13. Penrose y de Bruijn: el orden sin repetición

#### 13.1 Las baldosas de Penrose

Antes de que se descubrieran los cuasicristales, la matemática ya tenía ejemplos de orden sin período. Roger Penrose presentó en 1974 (*Bulletin of the Institute of Mathematics and its Applications*, 10, 266–271) un conjunto de dos baldosas, las famosas "cometa y dardo" (o, en otra versión, dos rombos), que solo pueden cubrir el plano de manera **no periódica**. Los mosaicos de Penrose tienen simetría local de orden cinco, nunca se repiten de manera exacta a intervalos fijos, pero cualquier región finita aparece infinitas veces. Martin Gardner los popularizó en su columna de *Scientific American* en enero de 1977.

#### 13.2 De Bruijn: los mosaicos son cortes

En 1981, el matemático holandés Nicolaas Govert de Bruijn mostró (*Indagationes Mathematicae*, 43, 39–66) que los mosaicos de Penrose se pueden obtener de una manera completamente distinta: tomando una red periódica de cinco dimensiones (la red cúbica ℤ⁵), cortándola con un plano bidimensional inclinado de manera irracional y proyectando sobre ese plano los puntos que caen cerca. El mosaico no periódico es la sombra de un cristal periódico en cinco dimensiones.

Ese es el **método de corte y proyección**, que Peter Kramer y Roberto Neri (*Acta Crystallographica A*, 40, 580–587, 1984) y Michel Duneau y André Katz (*Physical Review Letters*, 54, 2688–2691, 1985) generalizaron y llevaron a la cristalografía. Los cuasicristales icosaédricos reales se describen como cortes tridimensionales de redes periódicas de seis dimensiones.

La tarjeta 2 de la herramienta es la versión más simple posible de esa idea: de dos dimensiones a una.

### 14. El corte y proyección, paso a paso

#### 14.1 La construcción

Se toma la red cuadrada ℤ², los puntos (m, n) con m y n enteros. Se traza una recta por el origen con ángulo α, de pendiente tan α. Para cada punto de la red se calcula su coordenada perpendicular a la recta:

$$ u = −m · sen α + n · cos α $$

Se aceptan solo los puntos con u en una franja de ancho

$$ cos α + sen α $$

que es exactamente el ancho de la sombra del cuadrado unidad sobre la dirección perpendicular. Esa elección garantiza que los puntos aceptados formen un camino escalonado: de cada punto aceptado al siguiente (ordenados a lo largo de la recta) el paso es (1, 0) o (0, 1). Proyectado sobre la recta, el paso (1, 0) mide cos α (paso largo, L) y el paso (0, 1) mide sen α (paso corto, S).

Es lo que hace la función `cortarYProyectar`, que devuelve los puntos aceptados y la cadena de pasos.

#### 14.2 Las frecuencias

Como la recta tiene pendiente tan α, por cada unidad que avanza en horizontal sube tan α en vertical. El camino escalonado la sigue de cerca, así que la proporción de pasos verticales a horizontales tiende a tan α:

$$ #S / #L → tan α,   #L / #S → 1 / tan α $$

Para la pendiente 1/φ, #L/#S → φ ≈ 1,618; la herramienta mide 1,614 con 400 pasos. La diferencia es un efecto de borde que se achica al alargar la cadena.

#### 14.3 Racional contra irracional

Si la pendiente es racional, p/q con p y q enteros sin factores comunes, la recta vuelve a pasar exactamente por un punto de la red después de avanzar q en horizontal y p en vertical. A partir de ahí, todo se repite: la cadena es periódica con período p + q (q pasos L y p pasos S). Eso es lo que muestra la tabla del ejemplo: 1/2 → 3, 2/3 → 5, 3/5 → 8.

Si la pendiente es irracional, la recta nunca vuelve a pasar por un punto de la red, y la cadena nunca se repite. Pero no es desordenada: cada tramo que aparece una vez aparece infinitas veces, con frecuencias bien definidas. Ese tipo de orden se llama **cuasiperiódico**. Harald Bohr (hermano de Niels) desarrolló en 1924–1926 la teoría de las funciones casi periódicas (*Acta Mathematica*, 45 y 46), que es el marco analítico de este fenómeno.

#### 14.4 La línea en el toro

Hay otra manera de ver la misma construcción. Si se identifican los lados opuestos del cuadrado unidad, se obtiene un toro (la superficie de una dona). La recta de pendiente tan α, enrollada sobre el toro, es una curva que da vueltas. Si la pendiente es racional, la curva se cierra; si es irracional, nunca se cierra y pasa arbitrariamente cerca de todos los puntos del toro. Hermann Weyl demostró en 1916 (*Mathematische Annalen*, 77, 313–352) que, en ese caso, la curva se **equidistribuye**: pasa la misma fracción de tiempo en cada región de igual área.

Cada vez que la curva cruza un lado del toro, se anota L o S según cuál lado cruzó. La cadena resultante es la misma que la del corte y proyección. Este es el puente con los sistemas dinámicos: un flujo continuo y uniforme sobre un toro (simetría continua) produce, al registrarlo en los cruces, una sucesión discreta cuasiperiódica.

### 15. Fibonacci, φ y las palabras sturmianas

#### 15.1 La sustitución

La pendiente 1/φ, con φ = (1 + √5)/2 ≈ 1,618, el número de oro, tiene una propiedad especial: la cadena se puede generar sin geometría, con una regla de sustitución. Se empieza con L y se aplica repetidamente

$$ L → LS,   S → L $$

L → LS → LSL → LSLLS → LSLLSLSL → … Las longitudes son 1, 2, 3, 5, 8, 13, …: los números de Fibonacci. El límite es la **palabra de Fibonacci**, y uno de los tests de la herramienta verifica que la cadena de corte y proyección con pendiente 1/φ es un tramo de esa palabra (función `palabraFibonacci`).

Los números aparecen en el *Liber Abaci* de Leonardo de Pisa, Fibonacci, en 1202, en el problema de los conejos. Johannes Kepler notó en 1611 que los cocientes de números de Fibonacci consecutivos se acercan a la proporción áurea.

La sustitución tiene una interpretación geométrica: es una **inflación**. Si se reemplaza cada L por LS y cada S por L y se reescala todo por 1/φ, se obtiene la misma cadena. La palabra de Fibonacci es autosimilar, y esa autosimilaridad es la versión unidimensional de la que tienen los mosaicos de Penrose.

#### 15.2 Palabras sturmianas

Las cadenas que salen del corte y proyección con pendiente irracional tienen nombre: **palabras sturmianas**, por Jacques Charles François Sturm, aunque la teoría la desarrollaron Marston Morse y Gustav Hedlund en 1940 (*American Journal of Mathematics*, 62, 1–42). Son las palabras infinitas "más simples" que no son periódicas: tienen exactamente n + 1 subpalabras distintas de longitud n. Una palabra periódica tiene, a partir de cierto n, una cantidad acotada; una palabra aleatoria, 2ⁿ. Las sturmianas están justo en el borde entre el orden periódico y la complejidad.

Otra propiedad, que la herramienta deja ver: son **balanceadas**. En dos tramos cualesquiera de la misma longitud, la cantidad de S difiere a lo sumo en uno. Por eso en la cadena de Fibonacci nunca hay dos S seguidas y entre dos S hay siempre una o dos L. El libro colectivo firmado como M. Lothaire, *Algebraic Combinatorics on Words* (2002), tiene un capítulo dedicado a ellas.

#### 15.3 Por qué 3/5 se parece tanto a 1/φ

La fracción continua de 1/φ es la más simple posible:

$$ 1/φ = 1 / (1 + 1 / (1 + 1 / (1 + …))) $$

Sus aproximaciones racionales sucesivas (las **convergentes**) son 1/1, 1/2, 2/3, 3/5, 5/8, 8/13, …: cocientes de Fibonacci. Cada convergente da una cadena periódica que coincide con la de Fibonacci en un tramo inicial cada vez más largo antes de "repetirse". Por eso la opción 3/5 de la herramienta empieza igual que la de 1/φ y se separa recién después de varios pasos.

Adolf Hurwitz demostró en 1891 que φ es, en un sentido preciso, el número irracional **peor aproximable** por fracciones: sus convergentes se acercan más lentamente que las de cualquier otro número. Eso hace que la cadena de Fibonacci sea la más "lejos de periódica" entre las sturmianas, y explica por qué φ aparece en la disposición de las hojas y semillas de muchas plantas (filotaxis): un ángulo de giro relacionado con φ minimiza las superposiciones entre hojas sucesivas, como estudiaron Stéphane Douady e Yves Couder en 1992 (*Physical Review Letters*, 68, 2098–2101).

#### 15.4 Cuasicristales unidimensionales en el laboratorio

La cadena de Fibonacci no es solo un juguete matemático. En 1985, Roberto Merlin y colaboradores crecieron superredes de semiconductores (capas alternadas de GaAs y AlAs) siguiendo la secuencia de Fibonacci y midieron sus propiedades con rayos X y espectroscopía Raman (*Physical Review Letters*, 55, 1768–1770). Fue la primera realización de un cuasicristal unidimensional artificial. Desde entonces se construyeron cadenas de Fibonacci con fotones, con átomos fríos y con circuitos superconductores, para estudiar cómo se propagan las ondas en un medio ordenado pero no periódico.

### 16. Sistemas dinámicos: lo discreto como sección de lo continuo

#### 16.1 Poincaré

Henri Poincaré, en *Les méthodes nouvelles de la mécanique céleste* (1892–1899), introdujo una técnica que hoy se llama **sección de Poincaré**: en vez de seguir la trayectoria continua de un sistema, se registran solo los puntos donde cruza una superficie fija. El resultado es un mapa discreto: cada cruce da el siguiente. Un flujo continuo en n + 1 dimensiones se convierte en una iteración discreta en n.

Al revés, cualquier mapa discreto se puede "suspender" en un flujo continuo en una dimensión más, agregando una coordenada de tiempo que va de 0 a 1 entre iteraciones y pegando el final con el principio mediante el mapa. Esa construcción, la **suspensión**, es la versión dinámica de la tesis de la herramienta: lo que salta en n dimensiones fluye en n + 1.

#### 16.2 La rotación del círculo

El ejemplo más simple es la rotación del círculo por un ángulo fijo: x → x + a (módulo 1). Si a es racional, cada punto vuelve a su posición después de un número finito de pasos (periódico). Si a es irracional, ningún punto vuelve nunca y las órbitas son densas y equidistribuidas (Weyl, 1916). La rotación del círculo es la sección de Poincaré del flujo lineal en el toro de la sección 14.4, y su codificación simbólica (anotar si x cae en [0, a) o en [a, 1)) es una palabra sturmiana. Las tres miradas (corte y proyección, flujo en el toro, rotación del círculo) son el mismo objeto.

#### 16.3 Muestrear un giro: el efecto de la rueda de carreta

Hay una sombra todavía más cotidiana: la de un giro visto a intervalos. En las películas, las ruedas de las carretas a veces parecen girar despacio o hacia atrás. La cámara toma 24 imágenes por segundo; si entre dos fotogramas la rueda gira casi exactamente lo que separa dos rayos, cada imagen parece la anterior apenas corrida, y el cerebro interpreta un giro lento. Si gira un poco menos, el giro aparente es hacia atrás.

Es la rotación del círculo de la sección anterior, con a igual al giro entre fotogramas medido en unidades de la separación entre rayos. Un giro continuo (simetría continua) registrado en instantes discretos da una sucesión discreta que puede tener un período aparente completamente distinto del real. En procesamiento de señales esto se llama **aliasing**. Harry Nyquist (1928) y Claude Shannon (*Proceedings of the IRE*, 37, 10–21, 1949) establecieron la condición para evitarlo: muestrear al menos al doble de la frecuencia más alta de la señal. Por debajo de ese ritmo, la sombra discreta ya no permite reconstruir el objeto continuo.

La lección es la contracara de la tesis de la herramienta: no toda sombra discreta deja recuperar el objeto continuo. La hélice sí (su sombra conserva toda la información si se sabe que es una hélice), la red cuadrada también (de la cadena sturmiana se recupera la pendiente). Pero un muestreo demasiado lento pierde información de manera irreversible, y lo que se ve "a saltos" puede ser engañoso sobre lo que se mueve "de verdad".

### 17. El reflejo como giro: quiralidad

#### 17.1 Kant y las manos

En 1768, Immanuel Kant publicó un breve ensayo, *Von dem ersten Grunde des Unterschiedes der Gegenden im Raume* ("Sobre el primer fundamento de la distinción de las regiones en el espacio"), donde planteó un acertijo: una mano izquierda y una derecha son iguales en todas sus medidas (largos, ángulos, áreas) y, sin embargo, no se pueden superponer. Kant las llamó **contrapartes incongruentes** y usó el ejemplo para argumentar que el espacio tiene una realidad propia, más allá de las relaciones entre los objetos. La pregunta de cómo se distinguen izquierda y derecha lo acompañó en su obra posterior.

#### 17.2 Möbius: la respuesta en una dimensión más

August Ferdinand Möbius, en *Der barycentrische Calcul* (1827), señaló la respuesta geométrica: dos figuras planas especulares no se pueden superponer moviéndolas en el plano, pero sí girando una por la tercera dimensión. Y, por la misma razón, dos figuras tridimensionales especulares, como las manos, podrían superponerse con un giro en una cuarta dimensión. Möbius notó que esto era una consecuencia geométrica, no una especulación sobre el espacio físico.

Esa es la tarjeta 3 de la herramienta. En términos algebraicos: un reflejo en el plano, (x, y) → (−x, y), tiene determinante −1 y no es un giro del plano. Pero visto en tres dimensiones, (x, y, z) → (−x, y, −z) es un giro de 180° alrededor del eje y, con determinante +1. Para una figura que vive en el plano z = 0, el cambio de signo de z no se nota, y el giro produce exactamente el reflejo. La función `girarPorTerceraDimension` aplica x → x cos θ (con la componente fuera del plano, x sen θ, invisible desde el plano) y, para θ = 180°, da x → −x.

En lenguaje de grupos: el grupo ortogonal O(n), que incluye reflejos, se puede ver dentro del grupo de giros SO(n + 1). Los reflejos de n dimensiones son giros de n + 1. Una simetría discreta (el reflejo, que es "todo o nada": se aplica o no) es la sombra de una continua (el giro, que se puede hacer de a poco, pasando por 90° donde la F se ve de canto).

#### 17.3 Pasteur y las moléculas

En 1848, Louis Pasteur separó a mano, con una lupa y unas pinzas, dos tipos de cristales de una sal del ácido tartárico que eran imágenes especulares uno del otro. Disueltos, desviaban la luz polarizada en sentidos opuestos. Pasteur concluyó que las moléculas mismas debían ser quirales. William Thomson, lord Kelvin, acuñó la palabra **quiralidad** (del griego *kheir*, mano) en sus *Baltimore Lectures* (1904): una figura es quiral si su imagen especular no se puede superponer con ella.

La quiralidad es central en química y biología. Casi todos los aminoácidos de las proteínas son "izquierdos" y los azúcares del ADN "derechos". Las dos versiones especulares de un fármaco pueden tener efectos muy distintos. Ninguna reacción química común convierte una en la otra, porque eso requeriría, en el sentido de Möbius, un giro por una dimensión que no existe.

#### 17.4 La paridad y la física

Durante mucho tiempo se supuso que las leyes de la física son simétricas ante el reflejo: que el mundo en el espejo obedece las mismas leyes. Esa simetría se llama **paridad**. En 1956, Tsung-Dao Lee y Chen-Ning Yang revisaron la evidencia y notaron que nadie la había comprobado para la interacción débil (*Physical Review*, 104, 254–258). Chien-Shiung Wu y colaboradores hicieron el experimento con núcleos de cobalto 60 polarizados a muy baja temperatura y encontraron, en enero de 1957, que los electrones del decaimiento beta salían preferentemente en una dirección: la naturaleza distingue izquierda de derecha (*Physical Review*, 105, 1413–1415). Lee y Yang recibieron el Nobel ese mismo año.

La paridad es una simetría discreta: no hay "medio reflejo". Martin Gardner contó esta historia en *The Ambidextrous Universe* (1964), que sigue siendo una lectura deliciosa sobre izquierda, derecha y simetría en ciencia.

### 18. La pregunta abierta: Kaluza-Klein y Noether

La idea deja planteada una pregunta más ambiciosa: si se sube una dimensión para volver continua una simetría discreta, ¿aparece una cantidad conservada, como pide el teorema de Noether para las simetrías continuas?

Hay un caso histórico en el que la respuesta es sí. En la teoría de Theodor Kaluza (1921) y Oskar Klein (1926), el espacio-tiempo tiene una quinta dimensión enrollada en un círculo diminuto. La geometría es simétrica ante traslaciones a lo largo de ese círculo, una simetría continua. Por Noether, le corresponde una cantidad conservada: el momento en la quinta dimensión. Klein mostró que ese momento se comporta exactamente como la **carga eléctrica**, y que, por estar enrollada la dimensión, es cuantizada: solo toma valores múltiplos de uno básico. La conservación de la carga, una ley de nuestro mundo de cuatro dimensiones, sería la sombra de una simetría continua en cinco.

No toda simetría discreta es la sombra de una continua con una cantidad conservada asociada, y la herramienta no pretende demostrar nada en ese sentido. Pero el ejemplo de Kaluza-Klein muestra que la pregunta no es ingenua: es la que llevó a una de las ideas más fértiles de la física teórica del siglo XX.

### 19. Hacia el paper de síntesis

La idea original proponía un paper de síntesis titulado *Simetrías discretas como sombras de simetrías continuas*. La herramienta cubre las visualizaciones; esta sección propone cómo ordenar el texto, con la estructura académica que pide un trabajo así.

1. **Introducción.** La tesis en una oración y los tres ejemplos de la herramienta como motivación. La pregunta: ¿es una coincidencia que la misma estructura aparezca en campos tan distintos, o hay algo general?
2. **Marco.** Grupos de simetría (Klein), simetrías continuas y discretas, teorema de Noether. Definición precisa de "sombra": proyección, corte o sección.
3. **Caso 1, proyección: Fourier.** Toda función periódica es proyección de un movimiento uniforme en un toro de dimensión igual al número de frecuencias independientes. Ejemplos: la hélice, la difracción de una hélice.
4. **Caso 2, corte: cuasicristales.** Corte y proyección de ℤⁿ a ℝᵈ. Palabras sturmianas, Fibonacci, Penrose, cuasicristales icosaédricos.
5. **Caso 3, sección: dinámica.** Secciones de Poincaré, suspensiones, rotación del círculo, efecto estroboscópico.
6. **Caso 4, inclusión de grupos: reflejos.** O(n) dentro de SO(n + 1), quiralidad, paridad.
7. **Caso 5, Kaluza-Klein.** Una simetría continua en una dimensión compacta y su cantidad conservada.
8. **Discusión.** Cuándo la sombra conserva la información (inyectividad de la proyección en el conjunto relevante) y cuándo la pierde (aliasing). Contraejemplos: simetrías discretas que **no** provienen de continuas de manera natural, como la simetría ante el intercambio de partículas idénticas o la inversión temporal.
9. **Conclusión.** Qué gana un físico o un matemático al buscar la dimensión extra en la que una simetría discreta se vuelve continua: herramientas de cálculo (Fourier), clasificación (cuasicristales), cantidades conservadas (Noether).

El aporte de un paper así no sería un teorema nuevo, sino un mapa: mostrar en un solo lugar que una misma operación conceptual organiza resultados conocidos de cinco áreas. Esa es la limitación honesta que declara el README y, a la vez, el valor de la idea.

### 20. Del modelo al código

| Concepto | Función en `src/simetria.js` | Qué produce en la página |
|---|---|---|
| Hélice (cos θ, sen θ, cθ) | `helice({vueltas, r, c, n})` | La hélice de la tarjeta 1 |
| Sombra lateral cos(θ − α) | `sombraLateral(pts, alfa)` | La onda de la tarjeta 1 |
| Corte y proyección | `cortarYProyectar({pendiente, cantidad, desplazamiento})` | Red, franja, puntos aceptados y cadena |
| Sustitución L → LS, S → L | `palabraFibonacci(largo)` | Referencia para los tests |
| Período mínimo | `periodo(cadena, maxP)` | "¿Se repite?" |
| Giro por la tercera dimensión | `girarPorTerceraDimension(puntos, theta)` | La F que se espeja |

Los tests (`test/simetria.test.js`) verifican que la sombra lateral de la hélice es un coseno, que girar la hélice equivale a moverla a lo largo del eje, que cada paso del corte y proyección es horizontal o vertical, que con pendiente 1/φ sale la cadena de Fibonacci, que con pendiente racional la cadena se repite, que la palabra de Fibonacci empieza como se espera y que girar 180° por la tercera dimensión espeja la figura.

```js
const S = require("./src/simetria.js");
const r = S.cortarYProyectar({ pendiente: 1 / S.PHI, cantidad: 400 });
r.pasos.slice(0, 13);               // "LSLSLLSLLSLSL"
S.periodo(r.pasos, 100);            // null (no se repite)
S.palabraFibonacci(8);              // "LSLLSLSL"
```

### 21. Ejercicios

1. Demostrá que, con pendiente p/q, la cadena de corte y proyección tiene período p + q. (Pista: ¿después de cuántos pasos la recta vuelve a pasar por un punto de la red?)
2. Aplicá la sustitución L → LS, S → L cinco veces empezando en L. Contá L y S en cada paso. ¿A qué tiende el cociente?
3. Para la pendiente √2 − 1, encontrá una sustitución que genere la cadena. (Pista: la fracción continua de √2 − 1 es [0; 2, 2, 2, …].)
4. En la tarjeta 3, ¿qué ángulo de giro hace que la F se vea con la mitad de su ancho? Usá x → x cos θ.
5. Una hélice de ADN tipo B tiene unos 10,5 pares de bases por vuelta y un paso de 3,4 nm. ¿Cuál es el valor de c (avance por radián) en nanómetros?
6. Explicá por qué no hay ningún cristal periódico con simetría de orden 5, usando la restricción cristalográfica: si un giro de 72° lleva la red en sí misma, la traza de su matriz en una base de la red tiene que ser entera.
7. Pensá un ejemplo de tu campo (música, economía, biología) en el que algo que se repite a saltos podría ser la sombra de algo continuo.

### 22. Glosario

- **Simetría:** transformación que deja un objeto igual.
- **Simetría continua / discreta:** según si el conjunto de transformaciones forma un continuo (giros de cualquier ángulo) o un conjunto de elementos aislados (giros de 90°).
- **Simetría de tornillo:** giro combinado con un avance a lo largo del eje.
- **Corte y proyección:** construcción de estructuras cuasiperiódicas cortando una red periódica de mayor dimensión con un subespacio de pendiente irracional y proyectando los puntos cercanos.
- **Cuasicristal:** sólido con orden de largo alcance y difracción nítida, sin periodicidad.
- **Palabra sturmiana:** sucesión infinita de dos letras, no periódica, con exactamente n + 1 subpalabras de longitud n.
- **Convergentes:** aproximaciones racionales sucesivas de un número dadas por su fracción continua.
- **Quiralidad:** propiedad de una figura que no se puede superponer con su imagen especular.
- **Paridad:** simetría ante el reflejo espacial.
- **Sección de Poincaré:** registro de los cruces de una trayectoria continua con una superficie fija.

### 23. Conclusión

Tres ejemplos muy distintos (una onda, una cadena de letras y una F espejada) muestran la misma estructura: una simetría discreta en n dimensiones como sombra de una continua en n + 1. La onda es la sombra de un giro, como sabían Euler y Fourier y como confirmaron Cochran, Crick, Vand y Franklin al leer en una sombra de rayos X la hélice del ADN. La cadena de Fibonacci es un corte de una red cuadrada, el caso más simple del método que de Bruijn usó para explicar los mosaicos de Penrose y que hoy describe los cuasicristales de Shechtman. El reflejo es un giro por una dimensión extra, como señaló Möbius respondiendo al acertijo de las manos de Kant.

La herramienta deja abiertos dos pasos: llevar el corte y proyección de 5D a 2D para dibujar un mosaico de Penrose, y explorar la pregunta de Noether y Kaluza-Klein, la de si toda vez que una simetría se vuelve continua al subir una dimensión aparece algo que se conserva. Ese sería el núcleo del paper de síntesis que la idea proponía: *Simetrías discretas como sombras de simetrías continuas*.

## Referencias

- Bohr, H. (1925). Zur Theorie der fastperiodischen Funktionen I. *Acta Mathematica*, 45, 29–127. https://doi.org/10.1007/BF02395468
- Bravais, A. (1850). Mémoire sur les systèmes formés par des points distribués régulièrement sur un plan ou dans l'espace. *Journal de l'École Polytechnique*, 19, 1–128.
- Cochran, W., Crick, F. H. C., & Vand, V. (1952). The structure of synthetic polypeptides. I. The transform of atoms on a helix. *Acta Crystallographica*, 5(5), 581–586. https://doi.org/10.1107/S0365110X52001635
- de Bruijn, N. G. (1981). Algebraic theory of Penrose's non-periodic tilings of the plane. *Indagationes Mathematicae (Proceedings)*, 84(1), 39–66. https://doi.org/10.1016/1385-7258(81)90016-0
- Douady, S., & Couder, Y. (1992). Phyllotaxis as a physical self-organized growth process. *Physical Review Letters*, 68(13), 2098–2101. https://doi.org/10.1103/PhysRevLett.68.2098
- Duneau, M., & Katz, A. (1985). Quasiperiodic patterns. *Physical Review Letters*, 54(25), 2688–2691. https://doi.org/10.1103/PhysRevLett.54.2688
- Euler, L. (1748). *Introductio in analysin infinitorum*. Lausana: Bousquet.
- Fourier, J. (1822). *Théorie analytique de la chaleur*. París: Firmin Didot.
- Franklin, R. E., & Gosling, R. G. (1953). Molecular configuration in sodium thymonucleate. *Nature*, 171, 740–741. https://doi.org/10.1038/171740a0
- Gardner, M. (1964). *The Ambidextrous Universe*. Basic Books.
- Gardner, M. (1977). Extraordinary nonperiodic tiling that enriches the theory of tiles. *Scientific American*, 236(1), 110–121.
- Hurwitz, A. (1891). Ueber die angenäherte Darstellung der Irrationalzahlen durch rationale Brüche. *Mathematische Annalen*, 39, 279–284. https://doi.org/10.1007/BF01206656
- Kant, I. (1768). Von dem ersten Grunde des Unterschiedes der Gegenden im Raume. *Wöchentliche Königsbergische Frag- und Anzeigungs-Nachrichten*, 6–8.
- Kelvin, Lord (W. Thomson). (1904). *Baltimore Lectures on Molecular Dynamics and the Wave Theory of Light*. Londres: C. J. Clay and Sons.
- Klein, F. (1872). *Vergleichende Betrachtungen über neuere geometrische Forschungen*. Erlangen: A. Deichert.
- Klein, O. (1926). Quantentheorie und fünfdimensionale Relativitätstheorie. *Zeitschrift für Physik*, 37, 895–906. https://doi.org/10.1007/BF01397481
- Kramer, P., & Neri, R. (1984). On periodic and non-periodic space fillings of Eᵐ obtained by projection. *Acta Crystallographica A*, 40(5), 580–587. https://doi.org/10.1107/S0108767384001203
- Lee, T. D., & Yang, C. N. (1956). Question of parity conservation in weak interactions. *Physical Review*, 104(1), 254–258. https://doi.org/10.1103/PhysRev.104.254
- Levine, D., & Steinhardt, P. J. (1984). Quasicrystals: A new class of ordered structures. *Physical Review Letters*, 53(26), 2477–2480. https://doi.org/10.1103/PhysRevLett.53.2477
- Lothaire, M. (2002). *Algebraic Combinatorics on Words*. Cambridge University Press. ISBN 978-0-521-81220-7.
- Merlin, R., Bajema, K., Clarke, R., Juang, F.-Y., & Bhattacharya, P. K. (1985). Quasiperiodic GaAs-AlAs heterostructures. *Physical Review Letters*, 55(17), 1768–1770. https://doi.org/10.1103/PhysRevLett.55.1768
- Morse, M., & Hedlund, G. A. (1940). Symbolic dynamics II. Sturmian trajectories. *American Journal of Mathematics*, 62(1), 1–42. https://doi.org/10.2307/2371431
- Möbius, A. F. (1827). *Der barycentrische Calcul*. Leipzig: J. A. Barth.
- Noether, E. (1918). Invariante Variationsprobleme. *Nachrichten von der Gesellschaft der Wissenschaften zu Göttingen, Mathematisch-Physikalische Klasse*, 235–257.
- Nyquist, H. (1928). Certain topics in telegraph transmission theory. *Transactions of the American Institute of Electrical Engineers*, 47(2), 617–644. https://doi.org/10.1109/T-AIEE.1928.5055024
- Pauling, L., Corey, R. B., & Branson, H. R. (1951). The structure of proteins: Two hydrogen-bonded helical configurations of the polypeptide chain. *Proceedings of the National Academy of Sciences*, 37(4), 205–211. https://doi.org/10.1073/pnas.37.4.205
- Penrose, R. (1974). The role of aesthetics in pure and applied mathematical research. *Bulletin of the Institute of Mathematics and its Applications*, 10, 266–271.
- Poincaré, H. (1892–1899). *Les méthodes nouvelles de la mécanique céleste* (3 vols.). París: Gauthier-Villars.
- Shannon, C. E. (1949). Communication in the presence of noise. *Proceedings of the IRE*, 37(1), 10–21. https://doi.org/10.1109/JRPROC.1949.232969
- Shechtman, D., Blech, I., Gratias, D., & Cahn, J. W. (1984). Metallic phase with long-range orientational order and no translational symmetry. *Physical Review Letters*, 53(20), 1951–1953. https://doi.org/10.1103/PhysRevLett.53.1951
- Steinhardt, P. J. (2019). *The Second Kind of Impossible: The Extraordinary Quest for a New Form of Matter*. Simon & Schuster. ISBN 978-1-4767-2992-2.
- Watson, J. D., & Crick, F. H. C. (1953). Molecular structure of nucleic acids: A structure for deoxyribose nucleic acid. *Nature*, 171, 737–738. https://doi.org/10.1038/171737a0
- Weyl, H. (1916). Über die Gleichverteilung von Zahlen mod. Eins. *Mathematische Annalen*, 77, 313–352. https://doi.org/10.1007/BF01475864
- Weyl, H. (1952). *Symmetry*. Princeton University Press. ISBN 978-0-691-02374-8.
- Wu, C. S., Ambler, E., Hayward, R. W., Hoppes, D. D., & Hudson, R. P. (1957). Experimental test of parity conservation in beta decay. *Physical Review*, 105(4), 1413–1415. https://doi.org/10.1103/PhysRev.105.1413
