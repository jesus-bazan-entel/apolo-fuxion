export const PRODUCTS = [
    // --- Limpieza ---
    {
        id: 'prunex1',
        name: 'Prunex 1',
        line: 'Limpieza',
        type: 'Tea',
        description: 'Té herbal para la limpieza del colon.',
        usage: 'Tomar la mitad o 1 sobre en agua caliente antes de dormir.',
        imageColor: '4A148C', // Purple
        warning: 'Efecto laxante. No usar en embarazo/lactancia ni niños.',
        emoji: '🚽'
    },
    {
        id: 'floraliv',
        name: 'Flora Liv',
        line: 'Limpieza',
        type: 'Refresco',
        description: 'Bacterias probióticas para regenerar la flora intestinal.',
        usage: 'Tomar 1 sobre en ayunas con agua fría.',
        imageColor: 'E1BEE7', // Light Purple
        emoji: '🦠'
    },
    {
        id: 'liquidfibra',
        name: 'Liquid Fibra',
        line: 'Limpieza',
        type: 'Refresco',
        description: 'Fibra prebiótica y vitaminas para regular el tránsito.',
        usage: 'Tomar 1 sobre en cualquier momento del día.',
        imageColor: '8E24AA',
        emoji: '🌾'
    },
    {
        id: 'berrybalance',
        name: 'Berry Balance',
        line: 'Limpieza',
        type: 'Refresco',
        description: 'Protección de vías urinarias.',
        usage: 'Tomar a media mañana o media tarde.',
        imageColor: 'D81B60',
        emoji: '🍒'
    },
    {
        id: 'alphabalance',
        name: 'Alpha Balance',
        line: 'Limpieza',
        type: 'Refresco',
        description: 'Vegetales verdes para alcalinizar la sangre.',
        usage: 'Tomar en ayunas o con jugos verdes.',
        imageColor: '2E7D32', // Green
        emoji: '🥬'
    },

    // --- Nutrición Base ---
    {
        id: 'bioprofit',
        name: 'Biopro+ Fit',
        line: 'Control de Peso',
        type: 'Batido',
        description: 'Proteína que acelera el metabolismo y quema grasa.',
        usage: 'Reemplaza media tarde o media mañana. Agitar bien.',
        imageColor: 'D32F2F', // Red
        emoji: '🥤'
    },
    {
        id: 'bioprosport',
        name: 'Biopro+ Sport',
        line: 'Deporte',
        type: 'Batido',
        description: 'Proteína para la generación de masa muscular magra.',
        usage: 'Tomar inmediatamente después de entrenar.',
        imageColor: '212121', // Dark
        emoji: '🏋️'
    },
    {
        id: 'bioprotect',
        name: 'Biopro+ Tect',
        line: 'Inmunidad',
        type: 'Batido',
        description: 'Proteína con bioferrin para elevar defensas.',
        usage: 'Tomar como complemento en desayunos o cenas.',
        imageColor: 'E65100', // Orange
        emoji: '🛡️'
    },

    // --- Potenciación ---
    {
        id: 'termot3',
        name: 'Termo T3',
        line: 'Control de Peso',
        type: 'Tea',
        description: 'Té quemador de grasa.',
        usage: 'Tomar 15 min antes de entrenar o después de comidas.',
        imageColor: 'D32F2F',
        warning: 'Contiene cafeína natural. Cuidado con hipertensión.',
        emoji: '🔥'
    },
    {
        id: 'nocarbt',
        name: 'Nocarb-T',
        line: 'Control de Peso',
        type: 'Tea',
        description: 'Inhibidor de carbohidratos y azúcar.',
        usage: 'Tomar durante o inmediatamente después de comidas con harinas.',
        imageColor: 'D32F2F',
        emoji: '🥐'
    },
    {
        id: 'vitaxtra',
        name: 'Vita Xtra T+',
        line: 'Energía',
        type: 'Refresco',
        description: 'Energizante multivitamínico de maíz morado.',
        usage: 'Tomar al despertar para full energía.',
        imageColor: 'FBC02D', // Yellow/Gold
        warning: 'No recomendado para hipertensos o ansiosos.',
        emoji: '⚡'
    },
    {
        id: 'nutradey',
        name: 'Nutradey',
        line: 'Niños',
        type: 'Refresco',
        description: 'Multivitamínico completo para la familia.',
        usage: 'Acompañar los almuerzos.',
        imageColor: 'FFEB3B',
        emoji: '🌞'
    },
    {
        id: 'off',
        name: 'OFF',
        line: 'Vigor Mental',
        type: 'Refresco',
        description: 'Aminoácidos para relajación y manejo del estrés.',
        usage: 'Tomar antes de situaciones de estrés o al dormir.',
        imageColor: '5C6BC0', // Indigo
        emoji: '😴'
    },
    {
        id: 'on',
        name: 'ON',
        line: 'Vigor Mental',
        type: 'Refresco',
        description: 'Activador mental y concentración.',
        usage: 'Tomar cuando necesites enfoque.',
        imageColor: '5C6BC0',
        warning: 'Contiene teína.',
        emoji: '💡'
    },
    {
        id: 'passion',
        name: 'Passion',
        line: 'Vigor',
        type: 'Refresco',
        description: 'Vigorizante y vasodilatador.',
        usage: 'Tomar antes de la intimidad o para circulación.',
        imageColor: 'C2185B', // Pink/Red
        emoji: '❤️'
    },
    {
        id: 'probal',
        name: 'Probal',
        line: 'Hormonal',
        type: 'Tea',
        description: 'Equilibrio hormonal femenino (menopausia/cólicos).',
        usage: 'Tomar caliente por las noches.',
        imageColor: 'F48FB1',
        emoji: '🌸'
    },
    {
        id: 'youth',
        name: 'Youth Elixir',
        line: 'Anti-edad',
        type: 'Refresco',
        description: 'Antioxidantes y estimulador de hormona de crecimiento.',
        usage: 'Tomar antes de dormir.',
        imageColor: '7B1FA2',
        emoji: '🍇'
    },
    {
        id: 'beauty',
        name: 'Beauty-In',
        line: 'Anti-edad',
        type: 'Refresco',
        description: 'Colágeno hidrolizado para piel y cabello.',
        usage: 'Tomar a cualquier hora.',
        imageColor: 'BA68C8',
        emoji: '💅'
    },
    {
        id: 'goldenflx',
        name: 'Golden FLX',
        line: 'Articulaciones',
        type: 'Tea',
        description: 'Leche dorada con cúrcuma para articulaciones.',
        usage: 'Tomar caliente cuando haya dolor.',
        imageColor: 'FF8F00',
        emoji: '🦴'
    }
];
