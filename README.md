# Entrega académica: filtro de vacantes remotas para Colombia

Autor: Andrés Daniel Medina Erazo  
Institución: Universidad del Cauca  
Lugar y fecha de captura de la muestra: Popayán, 24 de noviembre de 2026

## Entregables

- `latex/poster.tex` y `latex/poster.pdf`: póster A0 vertical, listo para impresión.
- `latex/articulo.tex` y `latex/articulo.pdf`: artículo corto en plantilla IEEE.
- `data/vacantes.csv`: 16 registros públicos etiquetados y sus fuentes.
- `data/resultados.csv` y `data/metricas.json`: clasificación reproducible.
- `n8n/prototipo_comparacion.json`: flujo de prueba sin credenciales externas.
- `n8n/alerta_linkedin_mejorado.json`: adaptación del flujo que compartiste, con filtro geográfico explícito.
- `codigo/analizar.js`: recalcula resultados y métricas desde el CSV con Node.js, sin dependencias externas.

## Pregunta y alcance

¿Qué cambia al exigir evidencia de elegibilidad geográfica, en vez de aceptar cualquier anuncio cuya ubicación diga “Remote” o “Remoto”?

La muestra es un benchmark pequeño, dirigido y equilibrado de anuncios que Remotavia mostraba como remotos y abiertos o no a personas en Colombia. Se copiaron el título, empleador y etiqueta de elegibilidad, junto con el enlace del anuncio. No se conservaron descripciones completas. Las etiquetas son la referencia de verdad usada en esta prueba. El origen es Remotavia, no una extracción de LinkedIn. La búsqueda de LinkedIn de la guía se conserva en el flujo operativo, pero su ejecución exige una cuenta y un token propio de Apify.

La muestra no estima la proporción de vacantes del mercado. Sirve para mostrar un error concreto de la regla geográfica de la guía y para reproducir su comparación con una regla que requiere una etiqueta explícita de elegibilidad. En anuncios de LinkedIn sin esa etiqueta, el flujo mejorado intenta reconocer frases explícitas en la ubicación y la descripción, y deja los casos ambiguos para revisión manual.

## Reproducción local

Desde esta carpeta, ejecuta:

```powershell
node codigo\analizar.js
```

El script reescribe `data/resultados.csv` y `data/metricas.json`. Para compilar en Overleaf, sube el proyecto conservando las carpetas `latex/` y `figuras/`, y selecciona `latex/poster.tex` o `latex/articulo.tex` como documento principal. Los PDF incluidos fueron compilados con Tectonic.

## Importación en n8n

Importa cualquiera de los dos JSON desde **Workflows → Import from File**. El prototipo de comparación usa un disparador manual y ejecuta la misma muestra del CSV. La adaptación operativa requiere configurar un token de Apify propio en el nodo HTTP Request y credenciales de Gmail en n8n. El JSON no contiene credenciales reales.

El filtro mejorado devuelve tres estados: `COLOMBIA`, `NO_COLOMBIA` y `REVISAR`. Solo las ofertas `COLOMBIA` pasan a la alerta. Una ubicación que diga únicamente “Remote” queda en revisión y aparece en la salida del nodo `Registrar casos para revisión manual`. Revisa la política de datos de Apify y de LinkedIn antes de ejecutar el raspador con tu cuenta.

## Fuentes y atribuciones

- Los enlaces de origen de cada observación están en `data/vacantes.csv`. La búsqueda de vacantes colombianas se consultó en <https://remotavia.com/remote-jobs-colombia> y el índice general en <https://remotavia.com/remote-jobs> el 24 de noviembre de 2026.
- Paleta institucional tomada del Manual de Identidad Visual de la Universidad del Cauca, versión 2024: azul RGB 0, 18, 130 y rojo RGB 173, 0, 0. <https://www.unicauca.edu.co/wp-content/uploads/2024/08/Manual-de-Identidad-Visual_Unicauca_V2024-1.pdf>
- Escudo descargado de Wikimedia Commons, archivo “Escudo Universidad del Cauca.png”, atribuido a Universidad del Cauca, licencia CC BY-SA 4.0. <https://commons.wikimedia.org/wiki/File:Escudo_Universidad_del_Cauca.png>

El escudo conserva su forma original y aparece con atribución. El artículo y el póster identifican las fuentes de los datos y las limitaciones de la muestra.

Repositorio público del proyecto: <https://github.com/DANIELMEDINA0408/filtro-elegibilidad-vacantes-colombia>
