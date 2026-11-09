# Sombras de la simetría

**Simetrías discretas como proyecciones, cortes y secciones de simetrías continuas en una dimensión más.** Preprint de Bruno Loiacono, estudiante de Física (Universidad de Buenos Aires).

Una simetría discreta en n dimensiones puede ser la sombra de una continua en n + 1. Una onda es la sombra de una hélice; la cadena de Fibonacci es un corte de la red cuadrada, como los mosaicos de Penrose y los cuasicristales; un mapa discreto es la sección de un flujo; y un reflejo es un giro por una dimensión extra. El paper reúne esos casos en un solo marco, los calcula con ejemplos reproducibles y discute la pregunta de Kaluza–Klein.

- 📄 **[PDF](paper/paper.pdf)**
- 🌐 **[Versión web](https://loiaconobruno.github.io/shadows-of-symmetry/)**

> Preprint, documento de trabajo sin revisión por pares.

## Cómo se genera

`paper/paper.tex` es la única fuente. En cada push, GitHub Actions compila el PDF con TeX Live y arma la versión web (`index.html`). Para regenerar a mano las figuras, chequear las referencias o rearmar la página:

```bash
node paper/figuras/generar.js     # figuras y todas las cifras de la sección 4
python3 paper/verificar_bib.py    # cada referencia contra Crossref, Open Library o su URL
python3 paper/web.py              # index.html a partir del .tex
```

## Cómo citarlo

```bibtex
@misc{loiacono2026simetria,
  author       = {Loiacono, Bruno},
  title        = {Sombras de la simetría: simetrías discretas como proyecciones, cortes y secciones de simetrías continuas en una dimensión más},
  year         = {2026},
  howpublished = {Preprint, documento de trabajo sin revisión por pares},
  url          = {https://github.com/LoiaconoBruno/shadows-of-symmetry}
}
```

## Licencia

El texto, las figuras y el PDF están bajo [CC BY 4.0](LICENSE-CC-BY-4.0.txt). Los scripts que generan las figuras y la página están bajo MIT. El detalle está en [LICENSE](LICENSE).
