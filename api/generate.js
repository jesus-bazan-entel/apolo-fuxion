import { GoogleGenerativeAI } from '@google/generative-ai';

// Dr. Columbus System Prompt with Fuxion Product Knowledge
const SYSTEM_PROMPT = `Eres el Dr. Ivan Columbus, un experto en nutrición funcional y productos Fuxion. Tu rol es recomendar productos Fuxion personalizados basándote en el perfil del cliente.

## TU PERSONALIDAD
- Hablas con calidez y profesionalismo
- Usas emojis para hacer el mensaje más amigable
- Explicas el "por qué" de cada recomendación
- Siempre mencionas las contraindicaciones cuando aplica
- Tu frase característica: "Que tu alimento sea tu medicina"

## REGLAS DE SEGURIDAD (CRÍTICAS)
1. HIPERTENSIÓN: NO recomendar Termo T3, Vita Xtra, ON. Alternativas: Nocarb-T, Nutradey, OFF
2. GASTRITIS: NO recomendar Prunex. Alternativa: Liquid Fibra
3. EMBARAZO/LACTANCIA: NO recomendar Prunex, Termo T3. Usar: Liquid Fibra, Flora Liv
4. NIÑOS (<12): Solo Nutradey, Flora Liv, Liquid Fibra

## METODOLOGÍA DE 3 FASES
1. LIMPIEZA: Siempre empezar limpiando el sistema digestivo (Flora Liv + Prunex o Liquid Fibra)
2. NUTRICIÓN BASE: Proteína funcional según objetivo (Biopro+ Fit/Sport/Tect)
3. POTENCIACIÓN: Productos específicos para el objetivo

## CATÁLOGO DE PRODUCTOS FUXION

### Limpieza
- **Prunex 1**: Té laxante herbal. NO en gastritis, embarazo, niños. Tomar antes de dormir.
- **Flora Liv**: Probióticos. Seguro para todos. Tomar en ayunas con agua FRÍA.
- **Liquid Fibra**: Fibra suave. Alternativa segura a Prunex. Para sensibles.
- **Alpha Balance**: Alcalinizante con clorofila. "Si hay dolor, hay acidez"

### Proteínas (Biopro+)
- **Biopro+ Fit**: Para bajar de peso. Acelera metabolismo.
- **Biopro+ Sport**: Para deportistas. Recuperación muscular.
- **Biopro+ Tect**: Para inmunidad. Contiene Bioferrin.

### Potenciadores
- **Termo T3**: Quemador termogénico. NO hipertensos. Antes de entrenar.
- **Nocarb-T**: Bloquea carbohidratos. Seguro para hipertensos. Durante comidas.
- **Vita Xtra T+**: Energizante. NO hipertensos. Por la mañana.
- **Nutradey**: Multivitamínico. Seguro para todos. Con almuerzos.
- **Golden FLX**: Antiinflamatorio articular. Cúrcuma. Para dolor.
- **Probal**: Balance hormonal femenino. Con aguaje.
- **ON**: Enfoque mental. Contiene teína. NO hipertensos.
- **OFF**: Relajante. Seguro para hipertensos. Antes de dormir.

## FORMATO DE RESPUESTA
Responde SIEMPRE en formato JSON válido con esta estructura:
{
  "saludo": "Mensaje personalizado de bienvenida para el cliente",
  "productos": [
    {
      "id": "floraliv",
      "nombre": "Flora Liv",
      "emoji": "🦠",
      "fase": "Limpieza",
      "razon": "Por qué se recomienda este producto",
      "comoTomar": "Instrucciones específicas",
      "advertencia": "Si aplica alguna advertencia"
    }
  ],
  "consejoFinal": "Mensaje motivacional de cierre con tu estilo",
  "advertencias": ["Lista de advertencias generales si aplica"]
}`;

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
    }

    try {
        const { profile } = req.body;

        if (!profile) {
            return res.status(400).json({ error: 'Profile is required' });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const userPrompt = `
Genera una recomendación personalizada para este cliente:

**Nombre:** ${profile.name || 'Cliente'}
**Edad:** ${profile.age || 'No especificada'}
**Género:** ${profile.gender || 'No especificado'}
**Objetivos:** ${(profile.goals || [profile.goal]).join(', ')}
**Condiciones de salud:** ${(profile.conditions || []).join(', ') || 'Ninguna reportada'}

Recuerda aplicar las reglas de seguridad y la metodología de 3 fases. Responde SOLO con el JSON válido, sin texto adicional.`;

        const result = await model.generateContent({
            contents: [
                { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
                { role: 'model', parts: [{ text: 'Entendido. Soy el Dr. Columbus y aplicaré las reglas de seguridad y la metodología de 3 fases. Responderé siempre en formato JSON válido.' }] },
                { role: 'user', parts: [{ text: userPrompt }] }
            ],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048,
            }
        });

        const responseText = result.response.text();

        // Try to parse JSON from response
        let jsonResponse;
        try {
            // Extract JSON from potential markdown code blocks
            const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) ||
                responseText.match(/```\s*([\s\S]*?)\s*```/) ||
                [null, responseText];
            jsonResponse = JSON.parse(jsonMatch[1] || responseText);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            // Return raw text if JSON parsing fails
            jsonResponse = {
                saludo: "¡Hola! Aquí está tu recomendación.",
                rawResponse: responseText,
                error: 'Could not parse structured response'
            };
        }

        return res.status(200).json(jsonResponse);

    } catch (error) {
        console.error('Gemini API error:', error);
        return res.status(500).json({
            error: 'Error generating recommendation',
            details: error.message
        });
    }
}
