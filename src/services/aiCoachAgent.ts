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
  chatHistory?: ChatMessage[];
}

const STORAGE_KEY_GEMINI = 'overload_ai_gemini_api_key';

export const aiCoachAgent = {
  getApiKey(): string {
    return localStorage.getItem(STORAGE_KEY_GEMINI) || '';
  },

  setApiKey(key: string): void {
    if (key.trim()) {
      localStorage.setItem(STORAGE_KEY_GEMINI, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_GEMINI);
    }
  },

  /**
   * Llama a la API de Gemini si hay una API Key configurada
   */
  async callGeminiAPI(userMessage: string, context: CoachContext, apiKey: string): Promise<string | null> {
    try {
      const { profileName, activeWorkout, routines, stats } = context;

      const systemPrompt = `Eres Coach Antigauch, un entrenador personal de élite, experto en sobrecarga progresiva, biomecánica hipertrófica y preparación para atletas híbridos (fuerza + 21K running).
Estás chateando en tiempo real con ${profileName} a través de su aplicación móvil Overload AI.
Háblale de forma cercana, motivadora, natural, en español (colombiano respetuoso pero con confianza de gimnasio: parce/campeón/máquina si encaja, pero conciso).
Contexto del usuario:
- Perfil: ${profileName}
- Racha actual: ${stats.streakDays} días
- Rutina activa ahora mismo: ${activeWorkout ? activeWorkout.routineName + ' (' + activeWorkout.exercises.length + ' ejercicios registrados)' : 'Ninguna activa en este momento'}
- Rutinas en su app: Pecho y Espalda (18 series), Brazo y Hombro (21 series), Pierna Gimnasio Completo (19 series), Pierna Solo Mancuernas (16 series).

Directrices:
1. Si solo te saluda ("hola", "cómo vas", "qué más"), respóndele de forma natural, cálida y directa, preguntándole cómo va la jornada o si ya está en el gimnasio.
2. Si te pide un reemplazo porque una máquina está ocupada, dale 2 alternativas biomecánicas exactas con mancuernas o poleas y un tip técnico clave.
3. Si te pregunta por fatiga, sobrecarga o pesos, sé breve, práctico y con base científica (RIR, volumen, doble progresión).
4. No des discursos gigantes a menos que te pida una explicación detallada. Sé directo y útil.`;

      const contents = [
        {
          role: 'user',
          parts: [{ text: systemPrompt + "\n\nPregunta del usuario: " + userMessage }]
        }
      ];

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      });

      if (!res.ok) {
        console.warn('Gemini API returned status:', res.status);
        return null;
      }

      const data = await res.json();
      const generated = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return generated || null;
    } catch (e) {
      console.error('Error calling Gemini API:', e);
      return null;
    }
  },

  /**
   * Generador conversacional inteligente (motor local avanzado + soporte Gemini)
   */
  async getResponse(userMessage: string, context: CoachContext): Promise<string> {
    const rawText = userMessage.trim();
    const text = rawText.toLowerCase();
    const { profileName, activeWorkout, exercises, routines } = context;

    // 1. Intentar llamar a Gemini si el usuario configuró su key
    const apiKey = this.getApiKey();
    if (apiKey) {
      const geminiResponse = await this.callGeminiAPI(userMessage, context, apiKey);
      if (geminiResponse) return geminiResponse;
    }

    // 2. Motor Conversacional Natural
    await new Promise(r => setTimeout(r, 350));

    // A. Saludos informales y casuales ("cómo vas", "qué más", "cómo estás", "todo bien")
    if (
      text.includes('como vas') || text.includes('cómo vas') ||
      text.includes('que mas') || text.includes('qué más') ||
      text.includes('como estas') || text.includes('cómo estás') ||
      text.includes('como te va') || text.includes('cómo te va') ||
      text.includes('todo bien') || text.includes('q mas') ||
      text.includes('q tal') || text.includes('que tal') || text.includes('qué tal')
    ) {
      if (activeWorkout) {
        return "¡Qué más, " + profileName + "! Todo excelente por acá. Veo que estás dándole a **" + activeWorkout.routineName + "**. ¿Cómo se siente esa sesión? ¿Alguna máquina ocupada o necesitas ajustar pesos?";
      }
      return "¡Qué más, " + profileName + "! Todo bien por acá, 100% listo para entrenar. ¿Cómo vas tú? ¿Ya estás en el gym o qué rutina tienes programada para hoy?";
    }

    // B. Saludos simples ("hola", "buenas", "hey", etc.)
    if (/^(hola|buenas|hey|buenas tardes|buenos dias|buenos días|buenas noches|epale|hi|hello)/i.test(text) || text === 'hola') {
      return "¡Hola, " + profileName + "! 💪 ¿Qué más? ¿Todo listo para darle duro al entreno hoy? Cuéntame si necesitas un reemplazo, consejos de series o dudas con la sobrecarga.";
    }

    // C. Respuestas a "bien", "todo bien", "cansado", "con toda"
    if (text === 'bien' || text === 'bien y tu' || text === 'bien y tú' || text === 'todo bien' || text === 'aca entrenando' || text === 'acá entrenando') {
      return "¡Esa es la actitud, " + profileName + "! 🔥 Con toda la energía en cada serie. Si alguna máquina está copada o quieres saber cuánto subir en tu próxima serie, me avisas y lo cuadramos de una.";
    }

    // D. Despedidas / Agradecimientos
    if (text.includes('gracias') || text === 'listo' || text === 'vale' || text === 'dale' || text === 'ok' || text.includes('chao') || text.includes('de una')) {
      return "¡De una, " + profileName + "! Métale candela a ese entreno y cuide esa técnica. ¡A romperla! 💥";
    }

    // E. Reemplazo de ejercicio / Máquina ocupada
    if (
      text.includes('ocupad') || text.includes('reemplaz') || text.includes('cambi') || 
      text.includes('otra opcion') || text.includes('otra opción') || text.includes('alternativa')
    ) {
      if (text.includes('peck deck') || text.includes('apertura')) {
        return "Si el **Peck Deck** está lleno, vete de una a **Cruces en Polea Alta** o **Aperturas con Mancuernas en banco plano** (3 series de 12-15 reps con 1s de pausa apretando al centro). Te da exactamente la misma tensión en el pectoral medio.";
      }
      if (text.includes('hack') || text.includes('prensa')) {
        return "Si la **Hack o Prensa** está copada, haz **Sentadilla Búlgara con Mancuernas** o **Sentadilla Goblet con talones sobre discos**. Ambas aíslan los cuádriceps brutalmente sin meterle carga a tu columna lumbar.";
      }
      if (text.includes('jalon') || text.includes('jalón') || text.includes('espalda')) {
        return "Para el **Jalón al Pecho**, tus dos mejores opciones son **Dominadas Pronadas** o **Remo en Polea Baja (Gironda)** con agarre abierto para ensanchar el dorsal.";
      }
      if (text.includes('militar') || text.includes('hombro')) {
        return "Si la jaula o la barra de press militar está ocupada, mete **Press de Hombros Sentado con Mancuernas** (6-8 reps pesadas) o **Elevaciones Laterales en Polea**.";
      }
      if (text.includes('bayesian') || text.includes('curl') || text.includes('biceps') || text.includes('bíceps')) {
        return "Si la polea para el **Bayesian Curl** está ocupada, monta el banco a 45° y haz **Curl en Banco Inclinado con Mancuernas**. El hombro extendido hacia atrás da el mismo estiramiento de la cabeza larga.";
      }
      if (text.includes('triceps') || text.includes('tríceps') || text.includes('fondos')) {
        return "Si no hay máquina de fondos, haz **Press Francés con Mancuernas** o **Extensiones de Tríceps en Polea con Cuerda** bien abiertas al final.";
      }

      if (activeWorkout && activeWorkout.exercises.length > 0) {
        const lastEx = activeWorkout.exercises[activeWorkout.exercises.length - 1];
        const exDetail = exercises.find(e => e.id === lastEx?.exerciseId);
        const cat = exDetail?.category || 'Pecho';
        const alts = exercises.filter(e => e.category === cat && e.id !== lastEx?.exerciseId).slice(0, 3);
        if (alts.length > 0) {
          return "Si tienes ocupado **" + (exDetail?.name || 'tu ejercicio actual') + "**, aquí tienes las mejores variantes para **" + cat + "**:\n\n" +
            alts.map((a, i) => (i + 1) + ". **" + a.name + "** (" + a.equipment + "): " + a.tips).join('\n\n');
        }
      }

      return "Dime qué ejercicio o máquina tienes ocupada exactamente y te digo en segundos con qué mancuerna o polea sustituirla.";
    }

    // F. Fatiga / Sueño / Falta de energía
    if (text.includes('fatig') || text.includes('cansad') || text.includes('dormi') || text.includes('energia') || text.includes('energía') || text.includes('agotad') || text.includes('pereza')) {
      return "Para días con el sistema nervioso fatigado, " + profileName + ":\n\n1. **Aplica RIR 2-3:** No busques el fallo muscular hoy. Quédate a 2 reps de fallar.\n2. **Baja 1 serie por ejercicio:** Si tocan 3, haz solo 2 de altísima calidad.\n3. **Suma +30s de descanso:** Deja que el pulso y la respiración se normalicen bien.\n\nLo importante hoy es estimular sin fatigar para no arruinar tu recuperación ni tus entrenos de running.";
    }

    // G. Sobrecarga / Pesos
    if (text.includes('peso') || text.includes('sobrecarga') || text.includes('subir') || text.includes('cuanto') || text.includes('cuánto') || text.includes('kilos')) {
      return "La regla de oro de la app es la **Doble Progresión**:\n\n1. Si tu rango es de 8 a 10 reps, **primero llega a 10 reps** en tus series con buena técnica.\n2. Cuando saques 10 reps, la próxima sesión le metes **+2 a 2.5 kg** y vuelves a empezar en 8 reps.\n\nSi hoy sientes que la barra o mancuerna 'vuela' y te sobran más de 3 reps, súbele 2 kg de una en la siguiente serie.";
    }

    // H. Running / 21K / Pierna
    if (text.includes('correr') || text.includes('running') || text.includes('21k') || text.includes('carrera') || text.includes('maraton')) {
      return "Para coordinar tus 21K con el gym, " + profileName + ":\n\n• **Espacia los días duros:** Nunca hagas sentadillas pesadas el día antes de un fondo largo o series de velocidad.\n• **No descuides el sóleo y gemelo:** Las elevaciones de talones son tu seguro contra fascitis plantar y periostitis.\n• **RDL suave:** El peso muerto rumano fortalece la cadena posterior para tener zancada potente sin sobrecargar lumbares.";
    }

    // I. Molestias articulares
    if (text.includes('dolor') || text.includes('molest') || text.includes('hombro') || text.includes('rodilla') || text.includes('codo') || text.includes('espalda')) {
      return "⚠️ **Cuidado con las articulaciones**, " + profileName + ":\n\n• **Hombro:** Usa agarre neutro (palmas enfrentadas) con mancuernas a 30° en vez de barra recta.\n• **Rodilla:** Cambia zancadas frontales por **Zancadas hacia atrás** para quitar tensión de la rótula.\n• **Codo:** Pásate de barra a polea con cuerda suave.\n\nSi la molestia es punzante, detén ese ejercicio hoy.";
    }

    // J. Respuesta conversacional general (fluida, sin plantillas rígidas)
    return "¡Te sigo, " + profileName + "! Cuéntame qué necesitas ajustar: ¿te recomiendo pesos para hoy, una variante de ejercicio o algún tip biomecánico para tu rutina?";
  }
};
