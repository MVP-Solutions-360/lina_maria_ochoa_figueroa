/**
 * Rutas y encuadres de las fotografías, centralizados para sustituirlos fácilmente.
 * Los archivos viven en /public/images. Las originales actuales miden ~540 px de ancho:
 * conviene reemplazarlas por versiones de mayor resolución (mismo nombre o actualizando aquí).
 *
 * Nota: imagen_2, imagen_3 e imagen_4 tienen el logo de BMQ integrado en la fotografía,
 * por eso imagen_1 (sin marca) es la imagen de la marca personal y las otras se usan
 * en contextos de BMQ o recortadas para dejar el logo fuera de cuadro.
 */
export interface PhotoSource {
  src: string
  alt: string
  width: number
  height: number
  /** object-position CSS para controlar el encuadre */
  position: string
}

export const photos = {
  /**
   * Medio rostro en blanco y negro con fondo transparente (escena de identidad del hero).
   * Derivada de public/images/imagen_principal.jpeg (original a color, se conserva como fuente).
   */
  halfFace: {
    src: '/images/lina-medio-rostro-bn.png',
    alt: 'Retrato en blanco y negro de Lina María Ochoa Figueroa, recortado a la mitad del rostro.',
    width: 372,
    height: 869,
    position: '100% 0%',
  },
  /** Pasillo moderno, vestuario gris verdoso. Sin marca integrada. */
  hallway: {
    src: '/images/imagen_1.png',
    alt: 'Lina María Ochoa Figueroa en un pasillo moderno con paredes de madera y mármol oscuro.',
    width: 543,
    height: 583,
    position: '50% 8%',
  },
  /** Escritorio, blusa marfil. Se recorta hacia abajo para dejar fuera el logo de BMQ. */
  desk: {
    src: '/images/imagen_4.png',
    alt: 'Lina María Ochoa Figueroa sentada en su escritorio, apoyando el rostro sobre la mano.',
    width: 543,
    height: 675,
    position: '50% 100%',
  },
  /** Sillón vino, blusa turquesa. Contiene el logo de BMQ: uso institucional. */
  armchair: {
    src: '/images/imagen_2.png',
    alt: 'Retrato de Lina María Ochoa Figueroa sentada en un sillón, con una escultura de la justicia al fondo.',
    width: 544,
    height: 667,
    position: '50% 30%',
  },
  /** Vestuario oscuro. Contiene el logo de BMQ: uso institucional. */
  dark: {
    src: '/images/imagen_3.png',
    alt: 'Retrato de Lina María Ochoa Figueroa de pie, con blusa negra, en un espacio moderno.',
    width: 540,
    height: 677,
    position: '50% 20%',
  },
} satisfies Record<string, PhotoSource>
