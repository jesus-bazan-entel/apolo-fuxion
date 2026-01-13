import { PRODUCTS } from '../data/products';

export function runLogic(profile) {
    const recommendations = [];
    const tips = [];

    const { goal, gender, age, conditions } = profile;

    // Helper to find product
    const getProd = (id) => PRODUCTS.find(p => p.id === id);

    // --- FASE 1: LIMPIEZA ---
    // Mandatorio: Flora Liv
    recommendations.push(getProd('floraliv'));

    // Decisión de Limpieza de Colon
    const hasGastritis = conditions.includes('Gastritis');
    const isPregnant = conditions.includes('Embarazo');
    const isLactating = conditions.includes('Lactancia');
    const isChild = age < 12;
    const sensitiveGut = hasGastritis || isPregnant || isLactating || isChild;

    if (sensitiveGut) {
        recommendations.push(getProd('liquidfibra'));
        if (hasGastritis) tips.push("Dado que tienes gastritis, evitamos Prunex. La fibra líquida te ayudará suavemente.");
        if (isPregnant) tips.push("En tu estado, Prunex es muy fuerte. Usamos Liquid Fibra que es seguro.");
    } else {
        recommendations.push(getProd('prunex1'));
    }

    // --- FASE 2: NUTRICIÓN BASE ---
    switch (goal) {
        case 'Bajar de Peso':
            recommendations.push(getProd('bioprofit'));
            break;
        case 'Deporte':
            recommendations.push(getProd('bioprosport'));
            break;
        default:
            recommendations.push(getProd('bioprotect'));
            break;
    }

    // --- FASE 3: POTENCIACIÓN ---
    const hasHypertension = conditions.includes('Hipertensión');

    switch (goal) {
        case 'Bajar de Peso':
            if (hasHypertension) {
                recommendations.push(getProd('nocarbt')); // Reemplaza T3
                tips.push("Por la hipertensión, reemplazamos el Termo T3 por Nocarb-T para controlar carbohidratos sin acelerarte.");
            } else {
                recommendations.push(getProd('termot3'));
                recommendations.push(getProd('nocarbt'));
            }
            break;

        case 'Energía':
            if (hasHypertension) {
                recommendations.push(getProd('nutradey')); // Alternativa segura
                tips.push("Para energía segura sin afectar tu presión, Nutradey es la mejor opción.");
            } else {
                recommendations.push(getProd('vitaxtra'));
            }
            break;

        case 'Inmunidad':
            // Ya tiene Bioprotect. Añadimos algo mas?
            recommendations.push(getProd('floraliv')); // Ya está, pero reforzamos idea
            // Verra + Ganomas (No en lista basica, usaremos genericos si faltan)
            break;

        case 'Articulaciones':
            recommendations.push(getProd('goldenflx'));
            recommendations.push(getProd('alphabalance')); // Alcalinizar
            tips.push("El dolor articular suele venir con acidez. Alpha Balance ayuda a alcalinizar tu cuerpo.");
            break;

        case 'Vigor Mental':
            if (hasHypertension) {
                recommendations.push(getProd('off'));
                tips.push("Para enfoque sin estrés.");
            } else {
                recommendations.push(getProd('on'));
            }
            break;

        case 'Hormonal':
            if (gender === 'Mujer') {
                recommendations.push(getProd('probal'));
            } else {
                tips.push("Probal está diseñado principalmente para el balance hormonal femenino.");
            }
            break;

        case 'Detox':
            recommendations.push(getProd('alphabalance'));
            recommendations.push(getProd('berrybalance'));
            break;
    }

    // Dedupe
    const uniqueRecs = [...new Set(recommendations)];

    return { products: uniqueRecs, tips };
}
