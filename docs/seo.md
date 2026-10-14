# SEO: estrategia, matriz de búsquedas y puesta en marcha en Google

Estado: **el dominio de producción no está confirmado** (`SITE_URL` en `src/config/site.ts` está vacío a propósito). Ninguna cifra de este documento es de volumen de búsqueda, dificultad ni posición: no hay acceso a Search Console ni a Keyword Planner. Las frases son **hipótesis** que se validan después de publicar.

## 1. Cómo funciona la implementación

| Pieza | Archivo | Función |
|---|---|---|
| Texto por ruta (título, descripción) | `src/content/pages.ts` | Única fuente. |
| Modelo del `<head>` | `src/lib/seoModel.ts` | Calcula título, meta, canonical, Open Graph, Twitter y JSON-LD. Lo usan las dos capas siguientes. |
| Navegador | `src/lib/seo.ts` + `usePageMeta` | Aplica el modelo al navegar (actualiza las etiquetas existentes, no las duplica). |
| HTML estático | `build/seoPlugin.ts` | Escribe el mismo modelo en `dist/<ruta>/index.html`, más `sitemap.xml` y `robots.txt` cuando hay dominio. |

- Sin `SITE_URL`: no hay canonical, `og:url`, `og:image`, sitemap ni robots (requieren URL absoluta). El JSON-LD sólo incluye `Person` (con la `Organization` de BMQ anidada).
- Con `SITE_URL`: se agregan canonical, `og:url`, `og:image` absoluta (1200×630, `/og-image.jpg`), `WebSite` y `WebPage`/`ProfilePage` con `@id` estables `https://<dominio>/#...`, sitemap y robots.
- La 404 sale con `noindex, follow`, sin canonical, sin JSON-LD y fuera del sitemap.
- Todo está cubierto por pruebas: `src/lib/seoModel.test.ts`, `src/lib/seo.test.ts`, `build/seoPlugin.test.ts`.

## 2. Matriz de búsquedas objetivo (hipótesis)

Una intención principal por ruta; las demás frases aparecen sólo como variación natural del texto, no repetidas.

| Intención | Frase hipótesis | Ruta principal | Dónde aparece hoy |
|---|---|---|---|
| Marca personal | Lina María Ochoa Figueroa | `/` | Título, h1, JSON-LD `Person` |
| Marca personal | Lina Ochoa abogada / Lina Ochoa derecho médico | `/` | Descripción, hero, `alternateName` |
| Marca personal | Abogada especialista en derecho médico (en Colombia) | `/` y `/derecho-medico` | Título/descripción |
| Marca personal + BMQ | Lina Ochoa Blindaje Médico Quirúrgico / Lina Ochoa BMQ / CEO de Blindaje Médico Quirúrgico | `/blindaje-medico-quirurgico` | Título, descripción, h1 |
| Marca corporativa | Blindaje Médico Quirúrgico / BMQ Blindaje Médico Quirúrgico | web oficial de BMQ (no este sitio) | Esta web solo enlaza y describe el vínculo |
| Autoridad temática | Derecho médico en Colombia; responsabilidad médica y profesional | `/derecho-medico` | Título, descripción, contenido |
| Autoridad temática | Consultoría jurídica / gestión jurídica de instituciones de salud | `/consultoria-en-salud` | Título, descripción, contenido |
| Autoridad temática | Historia clínica; protección del ejercicio médico | `/derecho-medico`, `/perfil-profesional`, videos | Contenido y `knowsAbout` |
| Trayectoria | Trayectoria, formación y experiencia de Lina Ochoa | `/perfil-profesional` | Título, descripción, contenido |

Para validar con datos reales (cuando exista acceso): exportar consultas de Search Console y priorizar por impresiones, CTR y posición media; usar Keyword Planner sólo como referencia de demanda. No crear páginas nuevas por variante de palabra clave.

## 3. Lo que el sitio NO afirma (y por qué)

No se publican direcciones, teléfonos de oficina, premios, asociaciones, publicaciones, reseñas ni calificaciones, ni se usan tipos `LegalService`/`Attorney`/`FAQPage`. El cargo de CEO de BMQ no lleva fecha. `sameAs` contiene sólo los perfiles oficiales ya configurados en `src/config/site.ts`.

## 4. Al confirmar el dominio

1. Poner el dominio (con `https`, sin barra final) en `SITE_URL` en `src/config/site.ts`.
2. `npm run build` y revisar `dist/`: canonical, `og:url`, `og:image`, `sitemap.xml`, `robots.txt` y JSON-LD con `@id` del dominio.
3. Desplegar con soporte de rutas (cada ruta tiene su `index.html`; los enlaces profundos no deben dar 404 HTTP) y el `404.html` como página de error.
4. Confirmar que `https://<dominio>/og-image.jpg` responde 200 públicamente (probar con el depurador de Facebook/LinkedIn).
5. Validar `https://<dominio>/` en la [Prueba de resultados enriquecidos](https://search.google.com/test/rich-results) y en el [validador de Schema.org](https://validator.schema.org/).

## 5. Procedimiento en Google Search Console

Requiere acceso al dominio (DNS o archivo HTML) y a la cuenta de Google de la clienta; **no se ha hecho ni se puede afirmar que Google haya indexado el sitio**.

1. **Verificar el dominio**: Search Console → Añadir propiedad → *Dominio* → registro TXT en el DNS (cubre `www` y sin `www`, http y https).
2. **Enviar el sitemap**: Indexación → Sitemaps → `https://<dominio>/sitemap.xml`. Debe listar 5 URLs.
3. **Inspeccionar URLs**: pegar `https://<dominio>/` y `https://<dominio>/perfil-profesional` en la barra superior; comprobar "La URL está en Google" o los motivos si no.
4. **Solicitar indexación**: sólo si la inspección indica que no está indexada y la página está lista; hacerlo para la portada y el perfil; el resto se descubre por sitemap y enlaces internos.
5. **Revisar indexación**: Indexación → Páginas. Esperadas: 5 indexadas; la 404 excluida por `noindex`. Revisar "Rastreada, actualmente sin indexar", duplicadas y errores 404/5xx.
6. **Medir**: Rendimiento → Resultados de búsqueda; revisar impresiones, clics, CTR y posición por consulta y por página, a 28 días y a 3 meses.
7. **Comparar marcas**: crear dos filtros de consulta (regex) y comparar impresiones/clics/CTR:
   - Marca personal: `lina.*ochoa`
   - BMQ: `bmq|blindaje m[eé]dico`
   - Mixtas (Lina + BMQ): `(lina|ochoa).*(bmq|blindaje)`
   Observar a qué página llega cada grupo (la mixta debería llegar a `/blindaje-medico-quirurgico`; la personal a `/` y `/perfil-profesional`).

## 6. Pendientes que dependen de la clienta

- Dominio de producción.
- Confirmar que Instagram/Facebook configurados son perfiles oficiales (se usan en `sameAs`).
- Si se desea, una fotografía autorizada y de buena resolución para la imagen de compartir.
