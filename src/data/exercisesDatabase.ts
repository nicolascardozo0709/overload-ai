import { Exercise, Routine } from '../types';

export const INITIAL_EXERCISES: Exercise[] = [
  // ===================== PECHO =====================
  {
    id: 'ex-pecho-01',
    name: 'Press banca con mancuernas',
    category: 'Pecho',
    equipment: 'Mancuerna',
    targetMuscle: 'Pectoral mayor (medio e inferior)',
    secondaryMuscles: ['Tríceps', 'Deltoides anterior'],
    tips: 'Retrae las escápulas, mantén los codos a unos 45-60 grados del torso y siente el estiramiento profundo abajo.',
    defaultRepsMin: 6,
    defaultRepsMax: 10
  },
  {
    id: 'ex-pecho-02',
    name: 'Press de banca plano con barra',
    category: 'Pecho',
    equipment: 'Barra',
    targetMuscle: 'Pectoral mayor',
    secondaryMuscles: ['Tríceps', 'Deltoides anterior'],
    tips: 'Apoya los pies firmes en el suelo, crea un arco lumbar natural y toca suavemente el esternón antes de empujar.',
    defaultRepsMin: 5,
    defaultRepsMax: 8
  },
  {
    id: 'ex-pecho-03',
    name: 'Press inclinado con mancuernas',
    category: 'Pecho',
    equipment: 'Mancuerna',
    targetMuscle: 'Pectoral clavicular (superior)',
    secondaryMuscles: ['Deltoides anterior', 'Tríceps'],
    tips: 'Ajusta el banco a 30 grados (máximo 45). Controla la bajada en 2 segundos.',
    defaultRepsMin: 8,
    defaultRepsMax: 12
  },
  {
    id: 'ex-pecho-04',
    name: 'Press inclinado con barra',
    category: 'Pecho',
    equipment: 'Barra',
    targetMuscle: 'Pectoral superior',
    secondaryMuscles: ['Deltoides anterior', 'Tríceps'],
    tips: 'Baja la barra hacia la parte alta del pecho, clavículas, sin rebotar.',
    defaultRepsMin: 6,
    defaultRepsMax: 10
  },
  {
    id: 'ex-pecho-05',
    name: 'Aperturas con mancuernas en banco plano',
    category: 'Pecho',
    equipment: 'Mancuerna',
    targetMuscle: 'Pectoral mayor',
    secondaryMuscles: ['Bíceps (estabilizador)'],
    tips: 'Mantén una ligera flexión fija en los codos como abrazando un árbol gigante.',
    defaultRepsMin: 10,
    defaultRepsMax: 15
  },
  {
    id: 'ex-pecho-06',
    name: 'Cruces en polea alta',
    category: 'Pecho',
    equipment: 'Polea',
    targetMuscle: 'Pectoral inferior y esternal',
    secondaryMuscles: ['Deltoides anterior'],
    tips: 'Da un paso al frente, junta las manos abajo apretando el pecho un segundo.',
    defaultRepsMin: 12,
    defaultRepsMax: 15
  },
  {
    id: 'ex-pecho-07',
    name: 'Fondos en paralelas para pecho (Dips)',
    category: 'Pecho',
    equipment: 'Peso Corporal',
    targetMuscle: 'Pectoral inferior',
    secondaryMuscles: ['Tríceps', 'Deltoides anterior'],
    tips: 'Inclina el torso ligeramente hacia adelante y separa los codos moderadamente.',
    defaultRepsMin: 6,
    defaultRepsMax: 12
  },
  {
    id: 'ex-pecho-08',
    name: 'Press en máquina convergente de pecho',
    category: 'Pecho',
    equipment: 'Máquina',
    targetMuscle: 'Pectoral mayor',
    secondaryMuscles: ['Tríceps'],
    tips: 'Excelente para llevar las series al fallo muscular de forma segura sin spotter.',
    defaultRepsMin: 8,
    defaultRepsMax: 12
  },
  {
    id: 'ex-pecho-09',
    name: 'Peck Deck (Aperturas en máquina)',
    category: 'Pecho',
    equipment: 'Máquina',
    targetMuscle: 'Pectoral mayor (aislamiento y congestión)',
    secondaryMuscles: ['Deltoides anterior'],
    tips: 'Codos ligeramente flexionados, aprieta 1 segundo en el centro y controla el estiramiento.',
    defaultRepsMin: 12,
    defaultRepsMax: 15
  },

  // ===================== ESPALDA =====================
  {
    id: 'ex-esp-01',
    name: 'Dominadas pronadas',
    category: 'Espalda',
    equipment: 'Peso Corporal',
    targetMuscle: 'Dorsal ancho',
    secondaryMuscles: ['Bíceps', 'Trapecio medio/inferior'],
    tips: 'Agarre un poco más ancho que los hombros. Lleva el pecho a la barra, no solo el mentón.',
    defaultRepsMin: 6,
    defaultRepsMax: 10
  },
  {
    id: 'ex-esp-02',
    name: 'Jalón al pecho en polea',
    category: 'Espalda',
    equipment: 'Polea',
    targetMuscle: 'Dorsal ancho',
    secondaryMuscles: ['Bíceps', 'Braquial'],
    tips: 'Tira con los codos hacia abajo y atrás, sin balancear excesivamente el torso.',
    defaultRepsMin: 8,
    defaultRepsMax: 12
  },
  {
    id: 'ex-esp-03',
    name: 'Peso muerto convencional con barra',
    category: 'Espalda',
    equipment: 'Barra',
    targetMuscle: 'Erectores espinales, Dorsales, Glúteos',
    secondaryMuscles: ['Isquiosurales', 'Trapecios', 'Antebrazos'],
    tips: 'Barra pegada a las espinillas, espalda neutra, empuja el suelo con los talones.',
    defaultRepsMin: 4,
    defaultRepsMax: 6
  },
  {
    id: 'ex-esp-04',
    name: 'Remo con barra (inclinación 45°)',
    category: 'Espalda',
    equipment: 'Barra',
    targetMuscle: 'Dorsal ancho, Romboides',
    secondaryMuscles: ['Bíceps', 'Deltoides posterior'],
    tips: 'Tira la barra hacia la zona del ombligo manteniendo las lumbares bloqueadas.',
    defaultRepsMin: 6,
    defaultRepsMax: 10
  },
  {
    id: 'ex-esp-05',
    name: 'Remo con mancuerna a una mano (serrucho)',
    category: 'Espalda',
    equipment: 'Mancuerna',
    targetMuscle: 'Dorsal ancho unilateral',
    secondaryMuscles: ['Bíceps', 'Romboides'],
    tips: 'Lleva la mancuerna hacia la cadera, estirando completamente el dorsal al descender.',
    defaultRepsMin: 8,
    defaultRepsMax: 12
  },
  {
    id: 'ex-esp-06',
    name: 'Remo en polea baja (Remo Gironda)',
    category: 'Espalda',
    equipment: 'Polea',
    targetMuscle: 'Espalda media y grosor dorsal',
    secondaryMuscles: ['Bíceps'],
    tips: 'Pecho erguido al halar, pausa 1 segundo apretando las escápulas.',
    defaultRepsMin: 10,
    defaultRepsMax: 12
  },
  {
    id: 'ex-esp-07',
    name: 'Pullover en polea alta con cuerda',
    category: 'Espalda',
    equipment: 'Polea',
    targetMuscle: 'Aislamiento de dorsal ancho',
    secondaryMuscles: ['Tríceps (cabeza larga)'],
    tips: 'Brazos casi rectos, lleva la cuerda a los muslos contrayendo los dorsales.',
    defaultRepsMin: 12,
    defaultRepsMax: 15
  },

  // ===================== PIERNAS (CUÁDRICEPS / ISQUIOS / GLÚTEO) =====================
  {
    id: 'ex-pier-01',
    name: 'Sentadilla libre con barra trasera',
    category: 'Cuádriceps',
    equipment: 'Barra',
    targetMuscle: 'Cuádriceps, Glúteo mayor',
    secondaryMuscles: ['Isquiosurales', 'Core', 'Erectores'],
    tips: 'Pies a la anchura de hombros, rompe el paralelo con control y empuja desde el medio pie.',
    defaultRepsMin: 6,
    defaultRepsMax: 8
  },
  {
    id: 'ex-pier-02',
    name: 'Prensa de piernas 45°',
    category: 'Cuádriceps',
    equipment: 'Máquina',
    targetMuscle: 'Cuádriceps',
    secondaryMuscles: ['Glúteos'],
    tips: 'Baja profundo sin despegar el glúteo del respaldo. No bloquees las rodillas arriba.',
    defaultRepsMin: 8,
    defaultRepsMax: 12
  },
  {
    id: 'ex-pier-03',
    name: 'Sentadilla búlgara con mancuernas',
    category: 'Cuádriceps',
    equipment: 'Mancuerna',
    targetMuscle: 'Cuádriceps y Glúteo',
    secondaryMuscles: ['Aductores'],
    tips: 'Pie trasero apoyado en banco, mantén la espinilla delantera casi vertical y baja lento.',
    defaultRepsMin: 8,
    defaultRepsMax: 12
  },
  {
    id: 'ex-pier-04',
    name: 'Extensión de cuádriceps en máquina',
    category: 'Cuádriceps',
    equipment: 'Máquina',
    targetMuscle: 'Aislamiento de cuádriceps',
    secondaryMuscles: [],
    tips: 'Aguanta 1 segundo arriba en máxima contracción, baja en 3 segundos.',
    defaultRepsMin: 12,
    defaultRepsMax: 15
  },
  {
    id: 'ex-pier-05',
    name: 'Peso muerto rumano con mancuernas',
    category: 'Isquios y Glúteo',
    equipment: 'Mancuerna',
    targetMuscle: 'Isquiosurales y Glúteo mayor',
    secondaryMuscles: ['Erectores espinales'],
    tips: 'Empuja la cadera hacia atrás como tocando la pared, rodillas casi fijas.',
    defaultRepsMin: 8,
    defaultRepsMax: 12
  },
  {
    id: 'ex-pier-06',
    name: 'Curl femoral tumbado en máquina',
    category: 'Isquios y Glúteo',
    equipment: 'Máquina',
    targetMuscle: 'Isquiosurales (bíceps femoral)',
    secondaryMuscles: [],
    tips: 'Pega la pelvis a la almohadilla, no des tirones con la espalda baja.',
    defaultRepsMin: 10,
    defaultRepsMax: 12
  },
  {
    id: 'ex-pier-07',
    name: 'Hip Thrust con barra para glúteo',
    category: 'Isquios y Glúteo',
    equipment: 'Barra',
    targetMuscle: 'Glúteo mayor',
    secondaryMuscles: ['Isquiosurales'],
    tips: 'Espinillas a 90° arriba, mirada al frente y aprieta glúteos 2 segundos en el tope.',
    defaultRepsMin: 8,
    defaultRepsMax: 12
  },
  {
    id: 'ex-pier-08',
    name: 'Elevación de talones en máquina (Gemelos)',
    category: 'Isquios y Glúteo',
    equipment: 'Máquina',
    targetMuscle: 'Gastrocnemio (gemelos)',
    secondaryMuscles: ['Sóleo'],
    tips: 'Pausa de 2 segundos en el estiramiento completo abajo antes de subir.',
    defaultRepsMin: 12,
    defaultRepsMax: 20
  },
  {
    id: 'ex-pier-09',
    name: 'Sentadilla Hack (o Prensa Inclinada 45°)',
    category: 'Cuádriceps',
    equipment: 'Máquina',
    targetMuscle: 'Cuádriceps',
    secondaryMuscles: ['Glúteos'],
    tips: 'Pies al ancho de hombros en plataforma media-baja. Baja profundo controlando 3s.',
    defaultRepsMin: 8,
    defaultRepsMax: 10
  },
  {
    id: 'ex-pier-10',
    name: 'Zancadas Caminando o en Multipower',
    category: 'Cuádriceps',
    equipment: 'Barra',
    targetMuscle: 'Cuádriceps y Glúteo medio (unilateral)',
    secondaryMuscles: ['Isquiotibiales', 'Core'],
    tips: 'Paso firme y controlado, rodilla trasera rozando el suelo, estabilidad pélvica.',
    defaultRepsMin: 10,
    defaultRepsMax: 10
  },
  {
    id: 'ex-pier-11',
    name: 'Sentadilla Goblet (talones elevados)',
    category: 'Cuádriceps',
    equipment: 'Mancuerna',
    targetMuscle: 'Cuádriceps',
    secondaryMuscles: ['Glúteos', 'Core'],
    tips: 'Mancuerna vertical al pecho, talones elevados 1-2 cm para máxima profundidad y aislar cuádriceps.',
    defaultRepsMin: 10,
    defaultRepsMax: 12
  },
  {
    id: 'ex-pier-12',
    name: 'Zancadas Hacia Atrás (Reverse Lunges)',
    category: 'Cuádriceps',
    equipment: 'Mancuerna',
    targetMuscle: 'Cuádriceps y Glúteo',
    secondaryMuscles: ['Isquiosurales'],
    tips: 'Paso atrás controlado para proteger la rótula y mantener la cadera perfectamente alineada.',
    defaultRepsMin: 10,
    defaultRepsMax: 10
  },
  {
    id: 'ex-pier-13',
    name: 'Elevación de Talones Unilateral (Gemelos)',
    category: 'Isquios y Glúteo',
    equipment: 'Mancuerna',
    targetMuscle: 'Gastrocnemio y tendón de Aquiles',
    secondaryMuscles: ['Sóleo'],
    tips: 'Punta en escalón o disco, mancuerna en la misma mano, 2s de pausa abajo y sube explosivo.',
    defaultRepsMin: 12,
    defaultRepsMax: 15
  },

  // ===================== HOMBROS =====================
  {
    id: 'ex-hom-01',
    name: 'Press militar con barra de pie (OHP)',
    category: 'Hombros',
    equipment: 'Barra',
    targetMuscle: 'Deltoides anterior y lateral',
    secondaryMuscles: ['Tríceps', 'Core'],
    tips: 'Glúteos y abdomen apretados, barra pasa rozando la nariz hasta bloquear arriba.',
    defaultRepsMin: 5,
    defaultRepsMax: 8
  },
  {
    id: 'ex-hom-02',
    name: 'Press de hombros sentado con mancuernas',
    category: 'Hombros',
    equipment: 'Mancuerna',
    targetMuscle: 'Deltoides anterior y lateral',
    secondaryMuscles: ['Tríceps'],
    tips: 'Respaldo a 75-80°, no abras los codos en 180° completos, mantenlos a 60°.',
    defaultRepsMin: 8,
    defaultRepsMax: 12
  },
  {
    id: 'ex-hom-03',
    name: 'Elevaciones laterales con mancuernas',
    category: 'Hombros',
    equipment: 'Mancuerna',
    targetMuscle: 'Deltoides lateral (cabeza media)',
    secondaryMuscles: ['Trapecio'],
    tips: 'Levanta dirigiendo con los codos en el plano escapular (30° al frente), no uses balanceo.',
    defaultRepsMin: 12,
    defaultRepsMax: 15
  },
  {
    id: 'ex-hom-04',
    name: 'Elevaciones laterales en polea baja',
    category: 'Hombros',
    equipment: 'Polea',
    targetMuscle: 'Deltoides lateral',
    secondaryMuscles: [],
    tips: 'Tensión continua en todo el rango de movimiento, ideal para hipertrofia pura.',
    defaultRepsMin: 12,
    defaultRepsMax: 15
  },
  {
    id: 'ex-hom-05',
    name: 'Face Pull en polea con cuerda',
    category: 'Hombros',
    equipment: 'Polea',
    targetMuscle: 'Deltoides posterior y manguito rotador',
    secondaryMuscles: ['Trapecio medio', 'Romboides'],
    tips: 'Hala hacia los ojos/frente separando las manos y rotando externamente los hombros.',
    defaultRepsMin: 12,
    defaultRepsMax: 15
  },
  {
    id: 'ex-hom-06',
    name: 'Pájaros con mancuernas (deltoides posterior)',
    category: 'Hombros',
    equipment: 'Mancuerna',
    targetMuscle: 'Deltoides posterior',
    secondaryMuscles: ['Romboides'],
    tips: 'Torso paralelo al suelo, codos ligeramente flexionados, enfócate en abrir con los hombros.',
    defaultRepsMin: 12,
    defaultRepsMax: 15
  },

  // ===================== BÍCEPS =====================
  {
    id: 'ex-bic-01',
    name: 'Curl de bíceps con barra Z',
    category: 'Bíceps',
    equipment: 'Barra',
    targetMuscle: 'Bíceps braquial',
    secondaryMuscles: ['Braquiorradial'],
    tips: 'Codos pegados a los costados, no balancees el cuerpo al subir.',
    defaultRepsMin: 8,
    defaultRepsMax: 12
  },
  {
    id: 'ex-bic-02',
    name: 'Curl en banco inclinado con mancuernas',
    category: 'Bíceps',
    equipment: 'Mancuerna',
    targetMuscle: 'Bíceps braquial (cabeza larga en estiramiento)',
    secondaryMuscles: [],
    tips: 'Banco a 45-60°, deja caer los brazos estirados para máximo rango hipertrófico.',
    defaultRepsMin: 8,
    defaultRepsMax: 12
  },
  {
    id: 'ex-bic-03',
    name: 'Curl martillo con mancuernas',
    category: 'Bíceps',
    equipment: 'Mancuerna',
    targetMuscle: 'Braquial anterior y Braquiorradial',
    secondaryMuscles: ['Bíceps'],
    tips: 'Palmas enfrentadas (agarre neutro), ideal para ganar grosor en el brazo.',
    defaultRepsMin: 10,
    defaultRepsMax: 12
  },
  {
    id: 'ex-bic-04',
    name: 'Curl predicador en banco Scott',
    category: 'Bíceps',
    equipment: 'Barra',
    targetMuscle: 'Bíceps braquial (cabeza corta)',
    secondaryMuscles: [],
    tips: 'Aislamiento total, evita despegar los codos del soporte.',
    defaultRepsMin: 10,
    defaultRepsMax: 12
  },
  {
    id: 'ex-bic-05',
    name: 'Bayesian Curl en Polea',
    category: 'Bíceps',
    equipment: 'Polea',
    targetMuscle: 'Bíceps braquial (cabeza larga en estiramiento)',
    secondaryMuscles: ['Braquial'],
    tips: 'De espaldas a la polea, brazo retrasado, siente el estiramiento extremo del bíceps.',
    defaultRepsMin: 10,
    defaultRepsMax: 12
  },

  // ===================== TRÍCEPS =====================
  {
    id: 'ex-tri-01',
    name: 'Extensión de tríceps en polea con cuerda',
    category: 'Tríceps',
    equipment: 'Polea',
    targetMuscle: 'Tríceps (cabeza lateral y medial)',
    secondaryMuscles: [],
    tips: 'Separa la cuerda abajo al terminar el movimiento para contracción máxima.',
    defaultRepsMin: 10,
    defaultRepsMax: 15
  },
  {
    id: 'ex-tri-02',
    name: 'Press francés con barra Z',
    category: 'Tríceps',
    equipment: 'Barra',
    targetMuscle: 'Tríceps (cabeza larga)',
    secondaryMuscles: [],
    tips: 'Baja la barra hacia la coronilla o detrás de la cabeza sin abrir los codos.',
    defaultRepsMin: 8,
    defaultRepsMax: 12
  },
  {
    id: 'ex-tri-03',
    name: 'Extensión sobre la cabeza con mancuerna (Copa)',
    category: 'Tríceps',
    equipment: 'Mancuerna',
    targetMuscle: 'Tríceps (cabeza larga en estiramiento)',
    secondaryMuscles: [],
    tips: 'Sostén la mancuerna con ambas manos, baja profundo manteniendo codos cerrados.',
    defaultRepsMin: 10,
    defaultRepsMax: 12
  },
  {
    id: 'ex-tri-04',
    name: 'Press de banca con agarre cerrado',
    category: 'Tríceps',
    equipment: 'Barra',
    targetMuscle: 'Tríceps',
    secondaryMuscles: ['Pectoral interior', 'Deltoides'],
    tips: 'Manos a la anchura de hombros (no demasiado juntas para cuidar las muñecas).',
    defaultRepsMin: 6,
    defaultRepsMax: 10
  },
  {
    id: 'ex-tri-05',
    name: 'Fondos en Máquina (Dips)',
    category: 'Tríceps',
    equipment: 'Máquina',
    targetMuscle: 'Tríceps y Deltoides anterior',
    secondaryMuscles: ['Pectoral'],
    tips: 'Torso erguido para enfatizar tríceps, empuja firme hacia abajo.',
    defaultRepsMin: 8,
    defaultRepsMax: 10
  },
  {
    id: 'ex-tri-06',
    name: 'Extensión de Tríceps Overhead en Polea',
    category: 'Tríceps',
    equipment: 'Polea',
    targetMuscle: 'Tríceps (cabeza larga en estiramiento overhead)',
    secondaryMuscles: [],
    tips: 'De espaldas a la polea con cuerda sobre la cabeza, extiende hacia el frente.',
    defaultRepsMin: 10,
    defaultRepsMax: 12
  },

  // ===================== CORE Y ABDOMEN =====================
  {
    id: 'ex-core-01',
    name: 'Rueda abdominal (Ab Roller)',
    category: 'Core y Abdomen',
    equipment: 'Peso Corporal',
    targetMuscle: 'Recto abdominal completo y Core anti-extensión',
    secondaryMuscles: ['Dorsales', 'Hombros'],
    tips: 'Aprieta glúteos y abdomen, rueda hacia el frente sin arquear las lumbares.',
    defaultRepsMin: 8,
    defaultRepsMax: 12
  },
  {
    id: 'ex-core-02',
    name: 'Elevación de piernas colgado en barra',
    category: 'Core y Abdomen',
    equipment: 'Peso Corporal',
    targetMuscle: 'Abdomen inferior y flexores de cadera',
    secondaryMuscles: ['Antebrazos (agarre)'],
    tips: 'Enrolla la pelvis hacia el pecho, no te limites a balancear las piernas.',
    defaultRepsMin: 10,
    defaultRepsMax: 15
  },
  {
    id: 'ex-core-03',
    name: 'Crunch en polea alta con cuerda',
    category: 'Core y Abdomen',
    equipment: 'Polea',
    targetMuscle: 'Recto abdominal',
    secondaryMuscles: [],
    tips: 'De rodillas, fija la cadera y dobla la columna contrayendo el abdomen.',
    defaultRepsMin: 12,
    defaultRepsMax: 15
  },
  {
    id: 'ex-core-04',
    name: 'Plancha abdominal isométrica (Plank)',
    category: 'Core y Abdomen',
    equipment: 'Peso Corporal',
    targetMuscle: 'Transverso abdominal y Core',
    secondaryMuscles: ['Glúteos', 'Hombros'],
    tips: 'Cuerpo como una tabla rígida, activa glúteos y empuja el suelo con los codos.',
    defaultRepsMin: 30,
    defaultRepsMax: 60
  }
];

export const INITIAL_ROUTINES: Routine[] = [
  {
    id: 'routine-pecho-espalda',
    name: 'Pecho y Espalda',
    description: 'Empuje y Tracción torácica • 18 series',
    iconName: 'Flame',
    color: '#00F0FF',
    createdAt: '2026-09-14T12:00:00.000Z',
    exercises: [
      { exerciseId: 'ex-pecho-03', targetSets: 3, targetRepsMin: 8, targetRepsMax: 10, restSeconds: 90 },
      { exerciseId: 'ex-pecho-02', targetSets: 3, targetRepsMin: 8, targetRepsMax: 10, restSeconds: 90 },
      { exerciseId: 'ex-pecho-09', targetSets: 3, targetRepsMin: 12, targetRepsMax: 15, restSeconds: 60 },
      { exerciseId: 'ex-esp-04', targetSets: 3, targetRepsMin: 8, targetRepsMax: 10, restSeconds: 90 },
      { exerciseId: 'ex-esp-02', targetSets: 3, targetRepsMin: 10, targetRepsMax: 12, restSeconds: 75 },
      { exerciseId: 'ex-esp-07', targetSets: 3, targetRepsMin: 12, targetRepsMax: 15, restSeconds: 60 }
    ]
  },
  {
    id: 'routine-brazo-hombro',
    name: 'Brazo y Hombro',
    description: 'Deltoides, Bíceps y Tríceps • 21 series',
    iconName: 'Dumbbell',
    color: '#AF52DE',
    createdAt: '2026-09-14T12:00:00.000Z',
    exercises: [
      { exerciseId: 'ex-hom-03', targetSets: 5, targetRepsMin: 12, targetRepsMax: 15, restSeconds: 60 },
      { exerciseId: 'ex-hom-01', targetSets: 2, targetRepsMin: 6, targetRepsMax: 8, restSeconds: 90 },
      { exerciseId: 'ex-hom-05', targetSets: 2, targetRepsMin: 12, targetRepsMax: 15, restSeconds: 60 },
      { exerciseId: 'ex-tri-05', targetSets: 2, targetRepsMin: 8, targetRepsMax: 10, restSeconds: 75 },
      { exerciseId: 'ex-bic-05', targetSets: 2, targetRepsMin: 10, targetRepsMax: 12, restSeconds: 60 },
      { exerciseId: 'ex-tri-06', targetSets: 2, targetRepsMin: 10, targetRepsMax: 12, restSeconds: 60 },
      { exerciseId: 'ex-bic-04', targetSets: 2, targetRepsMin: 8, targetRepsMax: 10, restSeconds: 60 },
      { exerciseId: 'ex-tri-01', targetSets: 2, targetRepsMin: 12, targetRepsMax: 15, restSeconds: 60 },
      { exerciseId: 'ex-bic-03', targetSets: 2, targetRepsMin: 10, targetRepsMax: 12, restSeconds: 60 }
    ]
  },
  {
    id: 'routine-pierna-gym',
    name: 'Pierna (Gimnasio Completo)',
    description: 'Enfoque Atleta Híbrido & 21K • 19 series',
    iconName: 'TrendingUp',
    color: '#FF9500',
    createdAt: '2026-09-14T12:00:00.000Z',
    exercises: [
      { exerciseId: 'ex-pier-09', targetSets: 3, targetRepsMin: 8, targetRepsMax: 10, restSeconds: 90 },
      { exerciseId: 'ex-pier-05', targetSets: 3, targetRepsMin: 8, targetRepsMax: 10, restSeconds: 90 },
      { exerciseId: 'ex-pier-04', targetSets: 3, targetRepsMin: 12, targetRepsMax: 15, restSeconds: 60 },
      { exerciseId: 'ex-pier-06', targetSets: 3, targetRepsMin: 10, targetRepsMax: 12, restSeconds: 75 },
      { exerciseId: 'ex-pier-10', targetSets: 3, targetRepsMin: 10, targetRepsMax: 10, restSeconds: 75 },
      { exerciseId: 'ex-pier-08', targetSets: 4, targetRepsMin: 12, targetRepsMax: 15, restSeconds: 60 }
    ]
  },
  {
    id: 'routine-pierna-mancuernas',
    name: 'Pierna (Solo Mancuernas)',
    description: 'Minimalista en casa o viaje • 16 series',
    iconName: 'Zap',
    color: '#30D158',
    createdAt: '2026-09-14T12:00:00.000Z',
    exercises: [
      { exerciseId: 'ex-pier-03', targetSets: 3, targetRepsMin: 8, targetRepsMax: 10, restSeconds: 75 },
      { exerciseId: 'ex-pier-05', targetSets: 3, targetRepsMin: 10, targetRepsMax: 12, restSeconds: 75 },
      { exerciseId: 'ex-pier-11', targetSets: 3, targetRepsMin: 10, targetRepsMax: 12, restSeconds: 75 },
      { exerciseId: 'ex-pier-12', targetSets: 3, targetRepsMin: 10, targetRepsMax: 10, restSeconds: 60 },
      { exerciseId: 'ex-pier-13', targetSets: 4, targetRepsMin: 12, targetRepsMax: 15, restSeconds: 60 }
    ]
  }
];
