import { PRODUCTS } from '../data/products';

export function runLogic(profile) {
    const recommendations = [];
    const tips = [];

    // Support multiple goals
    const { goals, goal, gender, age, conditions } = profile;
    const allGoals = goals && goals.length > 0 ? goals : [goal];

    // Helper to find product
    const getProd = (id) => PRODUCTS.find(p => p.id === id);

    // Helper to add product if not already added
    const addProd = (id) => {
        const prod = getProd(id);
        if (prod && !recommendations.find(r => r?.id === id)) {
            recommendations.push(prod);
        }
    };

    // --- FASE 1: LIMPIEZA (Always applies) ---
    addProd('floraliv'); // Mandatorio

    // Decisión de Limpieza de Colon
    const hasGastritis = conditions.includes('Gastritis');
    const isPregnant = conditions.includes('Embarazo');
    const isLactating = conditions.includes('Lactancia');
    const isChild = age < 12;
    const sensitiveGut = hasGastritis || isPregnant || isLactating || isChild;

    if (sensitiveGut) {
        addProd('liquidfibra');
        if (hasGastritis) tips.push("Dado que tienes gastritis, evitamos Prunex. La fibra líquida te ayudará suavemente.");
        if (isPregnant) tips.push("En tu estado, Prunex es muy fuerte. Usamos Liquid Fibra que es seguro.");
    } else {
        addProd('prunex1');
    }

    // --- FASE 2 & 3: Procesar CADA objetivo seleccionado ---
    const hasHypertension = conditions.includes('Hipertensión');

    allGoals.forEach(currentGoal => {
        // NUTRICIÓN BASE según objetivo
        switch (currentGoal) {
            case 'Bajar de Peso':
                addProd('bioprofit');
                break;
            case 'Deporte':
                addProd('bioprosport');
                break;
            case 'Inmunidad':
                addProd('bioprotect');
                break;
            default:
                // Para otros objetivos, usar Tect como base si no hay ya una proteína
                if (!recommendations.find(r => r?.id?.includes('biopro'))) {
                    addProd('bioprotect');
                }
                break;
        }

        // POTENCIACIÓN según objetivo
        switch (currentGoal) {
            case 'Bajar de Peso':
                if (hasHypertension) {
                    addProd('nocarbt');
                    if (!tips.find(t => t.includes('hipertensión'))) {
                        tips.push("Por la hipertensión, reemplazamos el Termo T3 por Nocarb-T para controlar carbohidratos sin acelerarte.");
                    }
                } else {
                    addProd('termot3');
                    addProd('nocarbt');
                }
                break;

            case 'Energía':
                if (hasHypertension) {
                    addProd('nutradey');
                    if (!tips.find(t => t.includes('energía segura'))) {
                        tips.push("Para energía segura sin afectar tu presión, Nutradey es la mejor opción.");
                    }
                } else {
                    addProd('vitaxtra');
                }
                break;

            case 'Inmunidad':
                // Bioprotect ya añadido arriba
                break;

            case 'Articulaciones':
                addProd('goldenflx');
                addProd('alphabalance');
                if (!tips.find(t => t.includes('articular'))) {
                    tips.push("El dolor articular suele venir con acidez. Alpha Balance ayuda a alcalinizar tu cuerpo.");
                }
                break;

            case 'Vigor Mental':
                if (hasHypertension) {
                    addProd('off');
                    tips.push("Para enfoque sin estrés, OFF te ayuda a relajarte.");
                } else {
                    addProd('on');
                }
                break;

            case 'Hormonal':
                if (gender === 'Mujer') {
                    addProd('probal');
                } else {
                    if (!tips.find(t => t.includes('Probal'))) {
                        tips.push("Probal está diseñado principalmente para el balance hormonal femenino.");
                    }
                }
                break;

            case 'Detox':
                addProd('alphabalance');
                break;

            case 'Deporte':
                // Biopro+ Sport ya añadido arriba
                // Podemos agregar energía si no es hipertenso
                if (!hasHypertension) {
                    addProd('vitaxtra');
                }
                break;
        }
    });

    // Filter out any undefined products
    const validRecs = recommendations.filter(r => r !== undefined && r !== null);

    return { products: validRecs, tips };
}
