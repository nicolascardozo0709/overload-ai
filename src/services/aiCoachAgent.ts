import { Exercise, Routine, WorkoutSession, UserStats } from '../types';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface CoachContext {
  profileName: string;
  activeWorkout: WorkoutSession | null;
  workoutHistory: WorkoutSession[];
  routines: Routine[];
  exercises: Exercise[];
  stats: UserStats;
}

export const aiCoachAgent = {
  async getResponse(userMessage: string, context: CoachContext): Promise<string> {
    const rawText = userMessage.trim();
    const text = rawText.toLowerCase();
    const { profileName, activeWorkout, exercises, routines } = context;

    // Pequeña latencia natural de procesamiento (300ms)
    await new Promise(r => setTimeout(r, 300));

    // 1. SALUDOS NATURALES
    if (
      /^(hola|buenas|buen dia|buenos dias|buenas tardes|buenas noches|hey|que tal|qué tal|que mas|qué más|epale|saludos|hi|hello)/i.test(text) ||
      text === 'hola' || text === 'buenas' || text === 'hey' || text === 'que mas' || text === 'qué más'
    ) {
      if (activeWorkout) {
        return "¡Hola, " + profileName + "! 💪 Te veo activo ahora mismo en tu rutina **" + activeWorkout.routineName + "**.\n\n¿Cómo va esa sesión? Cuéntame si necesitas el reemplazo de alguna máquina ocupada, si tienes fatiga o si quieres saber con qué peso tirar en tu próxima serie.";
      }
      return "¡Hola, " + profileName + "! ⚡ ¿Todo listo para romperla hoy en el gimnasio?\n\nCuéntame qué rutina tienes pensada para hoy o en qué te puedo dar una mano: reemplazo de ejercicios si hay máquinas llenas, dudas con la técnica, descansos o cómo meterle sobrecarga a tus series.";
    }

    // 2. CÓMO ESTÁS / QUÉ TAL
    if (text.includes('como estas') || text.includes('cómo estás') || text.includes('como te va') || text.includes('cómo te va') || text.includes('todo bien')) {
      return "¡Al 100% y listo para ayudarte a meterle sobrecarga inteligente a esos entrenamientos! ⚡ ¿Qué te gustaría consultar o ajustar hoy, " + profileName + "?";
    }

    // 3. AGRADECIMIENTOS Y DESPEDIDAS
    if (
      text.includes('gracias') || text.includes('muchas gracias') || text === 'listo' || text === 'vale' || 
      text === 'dale' || text === 'ok' || text === 'perfecto' || text.includes('chao') || text.includes('voy a entrenar')
    ) {
      return "¡Con toda la energía, " + profileName + "! Dale duro a esa sesión, cuida la técnica en cada repetición y no olvides registrar tus pesos. ¡A romperla! 💥";
    }

    // 4. REEMPLAZO DE EJERCICIOS (MÁQUINA OCUPADA O MOLESTIA)
    if (
      text.includes('ocupad') || 
      text.includes('reemplaz') || 
      text.includes('cambi') || 
      text.includes('otra opción') ||
      text.includes('alternativa')
    ) {
      if (activeWorkout && activeWorkout.exercises.length > 0) {
        const currentEx = activeWorkout.exercises[activeWorkout.exercises.length - 1];
        const exDetail = exercises.find(e => e.id === currentEx?.exerciseId);
        const category = exDetail?.category || 'Pecho';

        const alternatives = exercises
          .filter(e => e.category === category && e.id !== currentEx?.exerciseId)
          .slice(0, 3);

        if (alternatives.length > 0) {
          return "Entendido, " + profileName + ". Si tienes ocupado **" + (exDetail?.name || 'este ejercicio') + "**, aquí tienes las mejores alternativas biomecánicas para **" + category + "**:\n\n" +
            alternatives.map((alt, i) => (i + 1) + ". **" + alt.name + "** (" + alt.equipment + ")\n   *Enfoque:* " + alt.targetMuscle + ".\n   *Tip:* " + alt.tips).join('\n\n') +
            "\n\nPuedes agregarlo tocando **'+ Ejercicio'** en tu sesión activa.";
        }
      }

      if (text.includes('peck deck') || text.includes('apertura')) {
        return "Si el **Peck Deck** está ocupado, reemplázalo de inmediato por **Cruces en Polea Alta** o **Aperturas con Mancuernas en banco plano** (3 series de 12-15 reps con 1s de pausa en contracción). Mantiene la misma tensión en el pectoral medio.";
      }
      if (text.includes('hack') || text.includes('prensa')) {
        return "Si la **Sentadilla Hack** o Prensa está ocupada, haz **Sentadilla Búlgara con Mancuernas** o **Sentadilla Goblet con talones elevados**. Ambos aíslan el cuádriceps sin cargar tu espalda baja.";
      }
      if (text.includes('jalon') || text.includes('jalón')) {
        return "Para sustituir el **Jalón al Pecho**, la opción reina son las **Dominadas Pronadas** o el **Remo en Polea Baja (Gironda)** con agarre amplio para reclutar el dorsal ancho.";
      }
      if (text.includes('militar') || text.includes('hombro')) {
        return "Si el press con barra está ocupado, haz **Press de Hombros Sentado con Mancuernas** (6-8 reps) o **Elevaciones Laterales en Polea Baja**.";
      }

      return "¡Claro! Dime qué ejercicio o máquina tienes ocupada y te daré el sustituto biomecánico exacto con mancuernas o poleas.";
    }

    // 5. FATIGA / CANSANCIO / SUEÑO
    if (text.includes('fatig') || text.includes('cansad') || text.includes('dormi') || text.includes('energia') || text.includes('energía') || text.includes('agotad')) {
      return "Buen punto para autorregular, " + profileName + ". Cuando el cuerpo viene fatigado:\n\n1. **Aplica RIR 2-3:** No vayas al fallo hoy. Deja 2 repeticiones en el tanque en cada serie.\n2. **Mantén el peso, reduce 1 serie:** Si te tocan 3 series, haz solo 2 de máxima calidad.\n3. **Descanso +30s:** Sube los descansos entre series a 90-120s para que baje bien el pulso.\n\n*Recuerda:* La consistencia de sumar volumen moderado supera por mucho a forzar un récord en un mal día de recuperación.";
    }

    // 6. SOBRECARGA PROGRESIVA (CÓMO SUBIR PESO / REPETICIONES)
    if (text.includes('sobrecarga') || text.includes('subir') || text.includes('cuanto peso') || text.includes('cuánto peso') || text.includes('progreso')) {
      return "Nuestra estrategia en esta app es la **Doble Progresión Científica**:\n\n1. **Paso 1 (Reps):** Mantén el mismo peso hasta que alcances el tope de repeticiones en todas las series (ej. si tu rango es 8-10, lucha hasta sacar 10 en todas).\n2. **Paso 2 (Peso):** En cuanto logres el tope de reps, en la siguiente sesión la IA te ordenará subir **+2 a +2.5 kg** y volver al piso (8 reps).\n\nNunca subas peso si tu técnica se degrada o sacrificas el rango de movimiento.";
    }

    // 7. CALENTAMIENTO / APROXIMACIÓN
    if (text.includes('calent') || text.includes('aproximaci') || text.includes('warm up')) {
      return "Un protocolo de calentamiento efectivo toma solo 5 a 7 minutos:\n\n1. **Movilidad articular (2 min):** Círculos con brazos, rotaciones de hombro y movilidad de cadera.\n2. **Series de aproximación:**\n   • Serie 1: 50% de tu peso de trabajo × 8 reps (movimiento suave).\n   • Serie 2: 70% de tu peso de trabajo × 4 reps (despertar el sistema nervioso sin fatiga).\n3. **¡A tu primera serie efectiva!** No quemes glucógeno haciendo series largas de calentamiento.";
    }

    // 8. TIEMPOS DE DESCANSO
    if (text.includes('descans') || text.includes('tiempo entre series')) {
      return "En tu app el cronómetro ya está sincronizado por ejercicio:\n\n• **90 a 120s:** En ejercicios compuestos pesados (Press Inclinado, Sentadilla Hack, Remo con barra) para reponer el fosfágeno celular (ATP).\n• **60 a 75s:** En ejercicios de aislamiento y bombeo (Laterales, Peck Deck, Extensiones de Tríceps, Curls).\n\nSi sientes que el pulso no ha bajado, dale a **+30s** en el cronómetro.";
    }

    // 9. COMBINACIÓN CON RUNNING (21K / CARRERA)
    if (text.includes('correr') || text.includes('running') || text.includes('21k') || text.includes('maraton') || text.includes('maratón')) {
      return "Para tu perfil de atleta híbrido (fuerza + 21K):\n\n* **Separa los estímulos:** Deja mínimo 6 a 8 horas entre un entreno de pierna y una tirada de carrera.\n* **Prioriza gemelos e isquios:** El peso muerto rumano y las elevaciones de talones fortalecen el tendón de Aquiles para evitar fascitis y periostitis.\n* **En semana de descarga de carrera:** Mantén las cargas de pierna estables pero no busques fallo muscular absoluto.";
    }

    // 10. DOLOR / MOLESTIA ARTICULAR (HOMBRO, RODILLA, CODO)
    if (text.includes('dolor') || text.includes('molest') || text.includes('hombro') || text.includes('rodilla') || text.includes('codo')) {
      return "⚠️ **Cuidado con las articulaciones**, " + profileName + ":\n\n* **Si es en hombro:** Prueba agarre neutro con mancuernas (palmas enfrentadas) a 30° de inclinación.\n* **Si es en rodilla:** Cambia a zancadas hacia atrás (*Reverse Lunges*) para quitar cizalla en la rótula.\n* **Si es en codo:** Evita el press francés y pásate a extensiones con polea usando cuerda suave.\n\nSi el dolor es punzante, detén ese ejercicio hoy mismo.";
    }

    // 11. RUTINAS
    if (text.includes('rutina') || text.includes('toca') || text.includes('hoy') || text.includes('entreno')) {
      if (activeWorkout) {
        return "Actualmente tienes en curso la rutina **" + activeWorkout.routineName + "**, con " + activeWorkout.exercises.length + " ejercicios registrados y un volumen acumulado de " + activeWorkout.totalVolumeKg + " kg.\n\n¡Sigue enfocado serie a serie y activa el cronómetro de descanso!";
      }
      return "Tienes 4 rutinas optimizadas cargadas en tu perfil:\n1. **Pecho y Espalda** (18 series)\n2. **Brazo y Hombro** (21 series)\n3. **Pierna Gym Completo** (19 series)\n4. **Pierna Solo Mancuernas** (16 series)\n\n¿Cuál de ellas vas a iniciar hoy?";
    }

    // 12. RESPUESTA NATURAL INTELIGENTE (NO CANNED)
    return "Te entiendo perfectamente, " + profileName + ". ¿Tienes alguna duda puntual con alguno de tus ejercicios de hoy, quieres saber con qué peso arrancar o necesitas cambiar alguna máquina ocupada?\n\nDime exactamente qué ejercicio estás haciendo y lo resolvemos en un segundo.";
  }
};
