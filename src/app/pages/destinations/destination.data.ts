/**
 * PlaceHopp destination template data.
 * Content per destination; the page component renders any of them.
 */
export interface DestinationHighlight {
  icon: string;
  title: string;
  text: string;
}

export interface Destination {
  slug: string;
  name: string;
  hoppName: string; // e.g. "MALTAhopp"
  accent: string; // brand accent color
  accentSoft: string; // soft tint for backgrounds
  tagline: string;
  intro: string;
  heroImage: string; // illustration set (webp)
  photos: { src: string; alt: string }[];
  stats: { label: string; value: string }[];
  highlights: DestinationHighlight[];
  animatedScene?: boolean; // Barcelona: layered scene with moving cable car
}

export const DESTINATIONS: Destination[] = [
  {
    slug: 'malta',
    name: 'Malta',
    hoppName: 'MALTAhopp',
    accent: '#F5A623',
    accentSoft: 'rgba(245, 166, 35, 0.12)',
    tagline: 'Estudia inglés en el corazón del Mediterráneo',
    intro:
      'Isla, sol y inglés todos los días. Malta combina academias acreditadas, ambiente internacional y un coste de vida amable. Tu hopp empieza con una maleta ligera.',
    heroImage: 'img/dest/malta-set.webp',
    photos: [
      { src: 'img/malta.webp', alt: 'Vista de Malta' },
      { src: 'img/city-1868530_1280.webp', alt: 'Rinconcito mediterráneo' },
    ],
    stats: [
      { label: 'Desde', value: '1.900 €' },
      { label: 'Duración', value: '2 – 24 semanas' },
      { label: 'Inglés', value: 'A2 → C1' },
      { label: 'Trabajo', value: 'Con permiso de estudiante' },
    ],
    highlights: [
      { icon: '🎓', title: 'Academias acreditadas', text: 'Escuelas en La Valeta, Sliema y St. Julian’s con clases reducidas y profesores nativos.' },
      { icon: '🏖️', title: 'Isla y playa', text: 'Mediterráneo turquesa, vida de pueblo pesquero y fiestas en la marina después de clase.' },
      { icon: '🛂', title: 'Sin visado complicado', text: 'Miembro de la UE y zona Schengen: trámite simple para estudiantes europeos.' },
    ],
  },
  {
    slug: 'irlanda',
    name: 'Irlanda',
    hoppName: 'IRELANDhopp',
    accent: '#1BBA99',
    accentSoft: 'rgba(27, 186, 153, 0.12)',
    tagline: 'Inglés de verdad, verdes de verdad',
    intro:
      'Dublín, Cork o Galway: estudia en la isla del literatura viva, consigue un trabajo a tiempo parcial y llénate de acentos. El year abroad que cambia un CV.',
    heroImage: 'img/dest/irlanda-set.webp',
    photos: [
      { src: 'img/irlanda.webp', alt: 'Paisaje de Irlanda' },
      { src: 'img/decide.webp', alt: 'Ruta costera irlandesa' },
    ],
    stats: [
      { label: 'Desde', value: '2.400 €' },
      { label: 'Duración', value: '4 – 25 semanas' },
      { label: 'Inglés', value: 'B1 → C2' },
      { label: 'Trabajo', value: '20 h/semana incluidas' },
    ],
    highlights: [
      { icon: '💼', title: 'Trabaja mientras estudias', text: 'El visado de estudiante irlandés permite trabajar 20 horas semanales desde el primer día.' },
      { icon: '🍻', title: 'Ambiente universitario', text: 'Ciudades jóvenes, música en directo y la comunidad de estudiantes internacional más activa.' },
      { icon: '🍀', title: 'Naturaleza brutal', text: 'Acantilados, anillos costeros y excursiones cada fin de semana con la escuela.' },
    ],
  },
  {
    slug: 'nueva-zelanda',
    name: 'Nueva Zelanda',
    hoppName: 'KIWIhopp',
    accent: '#1684F5',
    accentSoft: 'rgba(22, 132, 245, 0.12)',
    tagline: 'El hopp al otro lado del mundo',
    intro:
      'Auckland o Queenstown: inglés de nivel, aventuras que no existen en ningún otro sitio y la posibilidad de trabajar legalmente mientras estudias. El salto más grande, el que más engancha.',
    heroImage: 'img/dest/nz-set.webp',
    photos: [
      { src: 'img/nz.webp', alt: 'Paisaje de Nueva Zelanda' },
      { src: 'img/city-1868530_1280.webp', alt: 'Skyline al atardecer' },
    ],
    stats: [
      { label: 'Desde', value: '4.200 €' },
      { label: 'Duración', value: '12 – 52 semanas' },
      { label: 'Inglés', value: 'A2 → C1' },
      { label: 'Trabajo', value: '20 h/semana incluidas' },
    ],
    highlights: [
      { icon: '🪂', title: 'Aventura extrema', text: 'Bungee, skydive, tramping: Nueva Zelanda es el parque de aventuras más grande del planeta.' },
      { icon: '🇳🇿', title: 'Working holiday vibes', text: 'Visado de estudiante con permiso de trabajo y opción de extensión sin salir del país.' },
      { icon: '🌏', title: 'Otra vida', text: 'El destino favorito de quienes quieren romper totalmente con su zona de confort.' },
    ],
  },
  {
    slug: 'barcelona',
    name: 'Barcelona',
    hoppName: 'BARCELONAhopp',
    accent: '#CA3D4E',
    accentSoft: 'rgba(202, 61, 78, 0.12)',
    tagline: 'El hopp urbano: estudia inglés sin salir de casa',
    intro:
      '¿Y si el salto no necesitara visado? Barcelona concentra academias top, ambiente internacional y mar a la vez. El teleférico que sube a Montjuïc es tu nuevo trayecto a clase.',
    heroImage: 'img/dest/bcn-set.webp',
    photos: [
      { src: 'img/bcn.webp', alt: 'Barcelona' },
      { src: 'img/city-1868530_1280.webp', alt: 'La ciudad condal' },
    ],
    stats: [
      { label: 'Desde', value: '1.400 €' },
      { label: 'Duración', value: '2 – 40 semanas' },
      { label: 'Inglés', value: 'A1 → C2' },
      { label: 'Alojamiento', value: 'Residencia o familia' },
    ],
    highlights: [
      { icon: '🗼', title: 'Ciudad global', text: 'Gaudí, playa, montaña y la mayor oferta de academias del Mediterráneo en una sola ciudad.' },
      { icon: '🚡', title: 'Teleférico a clase', text: 'Sube a Montjuïc con la vista puesta en el mar: el trayecto más bonito para ir a estudiar.' },
      { icon: '🏠', title: 'Cerca de casa', text: 'Sin visados ni vuelos largos: el primer hopp perfecto si es tu primera vez fuera.' },
    ],
    animatedScene: true,
  },
];

export function getDestination(slug: string): Destination | undefined {
  return DESTINATIONS.find(d => d.slug === slug);
}
