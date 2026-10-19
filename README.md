# AulaRúbrica

Aplicación web estática, gratuita y sin backend para gestionar grupos, rúbricas, calificaciones por criterios y exportaciones. Compatible con GitHub Pages.

## Publicación en GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo, `aularubrica`).
2. Sube a la **raíz** del repositorio estos archivos: `index.html`, `styles.css`, `app.js` y `.nojekyll`.
3. Abre **Settings → Pages**. En **Build and deployment → Source** selecciona **Deploy from a branch**.
4. Selecciona la rama **main** y la carpeta **/(root)**. Pulsa **Save**.
5. Entra en `https://TU-USUARIO.github.io/aularubrica/` cuando termine la publicación.

No requiere npm, API keys, instalación ni servidor. Para probar en local, abre `index.html` en el navegador (se recomienda usar un servidor estático simple para pruebas).

## Funciones

- Alta/edición/borrado de grupos y alumnos (pegado de nombres por línea).
- Rúbricas de varios niveles con puntuación de 0 a 10, criterios y pesos individuales.
- Importación sencilla de tablas Markdown / TSV para rúbricas.
- Evaluación por alumno y criterio, con guardado automático.
- Resumen con media ponderada de criterios **evaluados** y desglose por criterios.
- Exportación de resultados en CSV (separador `;`, UTF-8 con BOM), hoja HTML `.xls` compatible con Excel y PDF mediante impresión del navegador.
- Copia de seguridad y restauración JSON.

## Avisos importantes

- **Privacidad**: la aplicación no envía datos a ninguna API. Guarda datos en `localStorage` del navegador. Si se limpia el navegador o se usa otro equipo, los datos no estarán allí. Realiza copias JSON frecuentes y almacénalas de forma segura.
- **RGPD**: en caso de usar nombres reales de menores, usa dispositivos autorizados por tu centro y cumple la política de protección de datos aplicable. No subas archivos JSON/CSV con datos personales a repositorios públicos.
- **Evaluación**: la media ponderada es una ayuda de trabajo, no un sustituto del registro o cálculo oficial de los criterios de evaluación en Séneca.
- **Edición de rúbricas**: para evitar asociar incorrectamente evaluaciones a versiones con distintos niveles, editar una rúbrica elimina las evaluaciones que estuvieran vinculadas a esa rúbrica. Exporta antes una copia.
- **Formato Excel**: `.xls` es una tabla HTML compatible con Excel; algunas versiones de Excel pueden avisar de que la extensión no coincide con el formato. Para una importación sencilla, se recomienda CSV. No se genera un `.xlsx` binario real.
- **Importación**: es básica, no interpreta ficheros binarios `.xlsx` ni todas las variedades de CSV entrecomillado.

## Tecnología

HTML5, CSS3, JavaScript sin dependencias. Se puede adaptar y ampliar libremente.
