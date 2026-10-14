/**
 * Rutas y encuadres de las fotografías, centralizados para sustituirlos fácilmente.
 *
 * Los archivos publicados (WebP, con variante de 360 px para móvil) viven en /public/images.
 * Los originales en PNG están en /originales (fuera de public/, no se publican): para cambiar una
 * foto, parte de ese original y vuelve a generar el WebP. Los originales miden 520–680 px de
 * ancho: conviene reemplazarlos por versiones de mayor resolución.
 *
 * Nota: imagen_2 (armchair) lleva el logo de BMQ integrado en la fotografía: uso institucional.
 */
export interface PhotoSource {
  src: string
  /** Variantes de ancho para srcset (el navegador elige la más adecuada) */
  srcSet?: string
  alt: string
  width: number
  height: number
  /** object-position CSS para controlar el encuadre */
  position: string
}

export const photos = {
  /**
   * Medio rostro a color con fondo transparente (escena de identidad del hero). El hero lo muestra
   * en escala de grises y recupera el color al pasar el cursor.
   * Derivada de public/images/lina_principal.png (original de 1,5 MB, se conserva como fuente):
   * recortada a su área útil (676 px de ancho) y convertida a WebP con transparencia.
   */
  halfFace: {
    src: '/images/lina_principal-hero.webp',
    srcSet: '/images/lina_principal-hero-340.webp 340w, /images/lina_principal-hero.webp 676w',
    alt: 'Retrato de Lina María Ochoa Figueroa, recortado a la mitad del rostro.',
    width: 676,
    height: 1389,
    position: '100% 0%',
  },
  /** Vestido rojo, mirada a cámara, fondo claro. Sin marca integrada; la de mayor resolución (670 px). */
  portrait: {
    src: '/images/imagen_8.webp',
    srcSet: '/images/imagen_8-360.webp 360w, /images/imagen_8.webp 670w',
    alt: 'Retrato de Lina María Ochoa Figueroa con vestido rojo, mirando a la cámara, en un espacio claro con una puerta gris y una planta al fondo.',
    width: 670,
    height: 670,
    position: '50% 20%',
  },
  /**
   * Blazer azul, brazos cruzados, ventanal. Sin marca integrada. Entrada propia de la página de
   * consultoría: mantenerla separada de `hallway` evita que cambiar una foto afecte al home.
   */
  consulting: {
    src: '/images/imagen_3.webp',
    srcSet: '/images/imagen_3-360.webp 360w, /images/imagen_3.webp 538w',
    alt: 'Lina María Ochoa Figueroa de pie, con los brazos cruzados y un blazer azul, frente a un ventanal luminoso.',
    width: 538,
    height: 668,
    position: '50% 15%',
  },
  /** Pasillo moderno, vestuario gris verdoso. Sin marca integrada. */
  /**
   * Transitorio: foto usada por las páginas anteriores a la migración de imágenes. Se retira (junto con
   * public/images/imagen_4.png) en el mismo commit que actualiza esas páginas.
   */
  desk: {
    src: '/images/imagen_4.png',
    alt: 'Lina María Ochoa Figueroa sentada en su escritorio, apoyando el rostro sobre la mano.',
    width: 543,
    height: 675,
    position: '50% 100%',
  },
  hallway: {
    src: '/images/imagen_1.webp',
    srcSet: '/images/imagen_1-360.webp 360w, /images/imagen_1.webp 543w',
    alt: 'Lina María Ochoa Figueroa en un pasillo moderno con paredes de madera y mármol oscuro.',
    width: 543,
    height: 583,
    position: '50% 8%',
  },
  /** Sillón vino, blusa turquesa. Contiene el logo de BMQ: uso institucional. */
  armchair: {
    src: '/images/imagen_2.webp',
    srcSet: '/images/imagen_2-360.webp 360w, /images/imagen_2.webp 533w',
    alt: 'Retrato de Lina María Ochoa Figueroa sentada en un sillón, con una escultura de la justicia al fondo.',
    width: 544,
    height: 667,
    position: '50% 30%',
  },
  /**
   * Sonriendo, con una libreta, blusa azul oscuro. El logo de BMQ está abajo a la izquierda:
   * se encuadra en horizontal desde arriba (5/4, position 50% 0%) para dejarlo fuera de cuadro.
   */
  conversation: {
    src: '/images/imagen_6.webp',
    srcSet: '/images/imagen_6-360.webp 360w, /images/imagen_6.webp 667w',
    alt: 'Lina María Ochoa Figueroa sonriendo mientras conversa, con la mano en la barbilla y una libreta en la mesa.',
    width: 667,
    height: 670,
    position: '50% 0%',
  },
  /**
   * Foto de la sección BMQ del home. Es la misma imagen_1 que `hallway` (pasillo moderno): el texto
   * alternativo y las medidas corresponden a esa fotografía. PENDIENTE: valorar otra foto para no
   * repetir la del hero en la portada.
   */
  dark: {
    src: '/images/imagen_1.webp',
    srcSet: '/images/imagen_1-360.webp 360w, /images/imagen_1.webp 543w',
    alt: 'Lina María Ochoa Figueroa en un pasillo moderno con paredes de madera y mármol oscuro.',
    width: 543,
    height: 583,
    position: '50% 20%',
  },
} satisfies Record<string, PhotoSource>

/**
 * Logotipos. `footer` se genera a partir de public/images/logo_.png (original dorado sobre negro
 * opaco, 1536×1024): el negro pasa a transparencia para que se funda con el fondo oscuro del footer.
 */
export const logos = {
  footer: {
    src: '/images/logo_-footer.webp',
    alt: 'Logotipo de Lina María Ochoa Figueroa, Derecho médico',
    width: 420,
    height: 293,
  },
} as const
