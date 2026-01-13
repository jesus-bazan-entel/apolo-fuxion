const API_URL = '/api/generate';

export async function generateAIRecommendation(profile) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ profile }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error en la generación de IA');
        }

        return await response.json();
    } catch (error) {
        console.error('AI Service Error:', error);
        throw error;
    }
}

// Convert AI response to app format
export function convertAIResponseToResults(aiResponse, productsDb) {
    const products = [];

    if (aiResponse.productos && Array.isArray(aiResponse.productos)) {
        aiResponse.productos.forEach(prod => {
            // Try to find the product in our database for full details
            const dbProduct = productsDb.find(p =>
                p.id === prod.id ||
                p.name.toLowerCase() === prod.nombre?.toLowerCase()
            );

            if (dbProduct) {
                // Merge AI reasoning with DB product details
                products.push({
                    ...dbProduct,
                    aiReason: prod.razon,
                    aiHowToTake: prod.comoTomar,
                    aiWarning: prod.advertencia,
                    fase: prod.fase
                });
            } else {
                // Use AI-provided info if product not in DB
                products.push({
                    id: prod.id || prod.nombre?.toLowerCase().replace(/\s+/g, ''),
                    name: prod.nombre,
                    emoji: prod.emoji || '💊',
                    line: prod.fase || 'General',
                    description: prod.razon,
                    usage: prod.comoTomar,
                    warning: prod.advertencia,
                    aiReason: prod.razon
                });
            }
        });
    }

    const tips = [];
    if (aiResponse.saludo) tips.push(aiResponse.saludo);
    if (aiResponse.consejoFinal) tips.push(aiResponse.consejoFinal);
    if (aiResponse.advertencias) {
        aiResponse.advertencias.forEach(adv => tips.push(`⚠️ ${adv}`));
    }

    return {
        products,
        tips,
        aiGenerated: true,
        saludo: aiResponse.saludo,
        consejoFinal: aiResponse.consejoFinal
    };
}
