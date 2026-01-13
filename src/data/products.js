export const PRODUCTS = [
    // --- Limpieza ---
    {
        id: 'prunex1',
        name: 'Prunex 1',
        line: 'Limpieza',
        type: 'Tea',
        emoji: '🚽',
        imageColor: '4A148C',
        tagline: 'Limpia tu colon. Libera tu cuerpo.',
        description: 'Té herbal para la limpieza profunda del colon.',
        benefits: [
            'Elimina toxinas acumuladas en el intestino',
            'Mejora la absorción de nutrientes',
            'Reduce la hinchazón abdominal',
            'Promueve movimientos intestinales regulares'
        ],
        importantNotes: [
            '❌ No usar en embarazo o lactancia',
            '❌ No recomendado para niños',
            '⚠️ Puede causar efecto laxante fuerte las primeras veces'
        ],
        howToTake: [
            '🕐 Tomar 1 sobre en agua caliente antes de dormir',
            '💡 Empezar con medio sobre si es primera vez',
            '💧 Beber abundante agua durante el día'
        ],
        usage: 'Tomar la mitad o 1 sobre en agua caliente antes de dormir.',
        warning: 'Efecto laxante. No usar en embarazo/lactancia ni niños.'
    },
    {
        id: 'floraliv',
        name: 'Flora Liv',
        line: 'Limpieza',
        type: 'Refresco',
        emoji: '🦠',
        imageColor: 'E1BEE7',
        tagline: 'Regenera tu flora. Fortalece tu digestión.',
        description: 'Probióticos vivos para regenerar la flora intestinal.',
        benefits: [
            'Restaura el equilibrio de bacterias buenas',
            'Mejora la digestión y absorción',
            'Fortalece el sistema inmunológico',
            'Reduce gases e hinchazón'
        ],
        importantNotes: [
            '✅ Seguro para toda la familia',
            '✅ Puede tomarse durante embarazo',
            '💡 Usar DESPUÉS de Prunex para mejores resultados'
        ],
        howToTake: [
            '🕐 Tomar 1 sobre en ayunas con agua fría',
            '❄️ No usar agua caliente (mata las bacterias)',
            '📅 Uso diario recomendado'
        ],
        usage: 'Tomar 1 sobre en ayunas con agua fría.'
    },
    {
        id: 'liquidfibra',
        name: 'Liquid Fibra',
        line: 'Limpieza',
        type: 'Refresco',
        emoji: '🌾',
        imageColor: '8E24AA',
        tagline: 'Fibra suave. Limpieza segura.',
        description: 'Fibra prebiótica ideal para personas sensibles.',
        benefits: [
            'Limpieza suave sin efecto laxante agresivo',
            'Alimenta las bacterias buenas del intestino',
            'Seguro para embarazadas y niños',
            'Regula el tránsito intestinal naturalmente'
        ],
        importantNotes: [
            '✅ Alternativa suave a Prunex',
            '✅ Ideal para gastritis, embarazo, lactancia',
            '✅ Apto para niños mayores de 4 años'
        ],
        howToTake: [
            '🕐 Tomar 1 sobre a cualquier hora del día',
            '💧 Mezclar con agua o jugo',
            '📅 Puede usarse diariamente'
        ],
        usage: 'Tomar 1 sobre en cualquier momento del día.'
    },
    {
        id: 'alphabalance',
        name: 'Alpha Balance',
        line: 'Limpieza',
        type: 'Refresco',
        emoji: '🥬',
        imageColor: '2E7D32',
        tagline: 'Alcaliniza tu cuerpo. Neutraliza la acidez.',
        description: 'Concentrado de vegetales verdes para alcalinizar la sangre.',
        benefits: [
            'Reduce la acidez del cuerpo',
            'Aporta clorofila y antioxidantes',
            'Mejora la oxigenación celular',
            'Ayuda a reducir inflamación'
        ],
        importantNotes: [
            '💡 "Si hay dolor, hay acidez" - Dr. Columbus',
            '✅ Complemento ideal para problemas articulares',
            '🍃 Equivale a una ensalada completa'
        ],
        howToTake: [
            '🕐 Tomar en ayunas o con jugos verdes',
            '💚 Puede mezclarse con otros productos',
            '📅 Ideal uso diario'
        ],
        usage: 'Tomar en ayunas o con jugos verdes.'
    },

    // --- Nutrición Base ---
    {
        id: 'bioprofit',
        name: 'Biopro+ Fit',
        line: 'Control de Peso',
        type: 'Batido',
        emoji: '🥤',
        imageColor: 'D32F2F',
        tagline: 'Quema grasa. Conserva músculo.',
        description: 'Proteína funcional diseñada para acelerar el metabolismo y quemar grasa.',
        benefits: [
            'Acelera el metabolismo naturalmente',
            'Ayuda a quemar grasa corporal',
            'Preserva y tonifica la masa muscular',
            'Controla el apetito y la ansiedad'
        ],
        importantNotes: [
            '❌ No es un sustituto de comidas completo',
            '💪 Combinar con actividad física',
            '⚠️ No recomendado para hipertensos severos'
        ],
        howToTake: [
            '🕐 Reemplazar media mañana o media tarde',
            '🥛 Mezclar con agua o leche vegetal',
            '🔄 Agitar bien antes de consumir'
        ],
        usage: 'Reemplaza media tarde o media mañana. Agitar bien.'
    },
    {
        id: 'bioprosport',
        name: 'Biopro+ Sport',
        line: 'Deporte',
        type: 'Batido',
        emoji: '🏋️',
        imageColor: '212121',
        tagline: 'Entrenar rompe el músculo. La proteína lo construye.',
        description: 'Proteína funcional para construcción de masa muscular magra.',
        benefits: [
            'Aporta proteína de alto valor biológico',
            'Ayuda a la recuperación muscular post-entrenamiento',
            'Favorece la regeneración del tejido muscular',
            'Es ligera, fácil de digerir'
        ],
        importantNotes: [
            '❌ No es esteroide',
            '❌ No es hormona',
            '❌ No es medicamento',
            '✅ Es nutrición inteligente para deportistas'
        ],
        howToTake: [
            '🕐 1 sobre después de entrenar',
            '📅 En días sin entrenamiento, como complemento nutricional',
            '💡 Si entrenas y no consumes suficiente proteína, estás perdiendo resultados'
        ],
        usage: 'Tomar inmediatamente después de entrenar.'
    },
    {
        id: 'bioprotect',
        name: 'Biopro+ Tect',
        line: 'Inmunidad',
        type: 'Batido',
        emoji: '🛡️',
        imageColor: 'E65100',
        tagline: 'Fortalece tus defensas desde adentro.',
        description: 'Proteína con bioferrin para elevar el sistema inmunológico.',
        benefits: [
            'Eleva las defensas naturales del cuerpo',
            'Contiene Bioferrin (proteína inmunológica)',
            'Aporta nutrientes esenciales',
            'Ideal para épocas de gripe o estrés'
        ],
        importantNotes: [
            '✅ Seguro para toda la familia',
            '💡 Usar preventivamente, no solo cuando estés enfermo',
            '🔄 Combinar con Flora Liv para mayor efecto'
        ],
        howToTake: [
            '🕐 Tomar como complemento en desayunos o cenas',
            '🥛 Mezclar con agua, leche o en smoothies',
            '📅 Uso diario recomendado en temporadas de riesgo'
        ],
        usage: 'Tomar como complemento en desayunos o cenas.'
    },

    // --- Potenciación ---
    {
        id: 'termot3',
        name: 'Termo T3',
        line: 'Control de Peso',
        type: 'Tea',
        emoji: '🔥',
        imageColor: 'D32F2F',
        tagline: 'Enciende tu metabolismo. Quema más calorías.',
        description: 'Té termogénico quemador de grasa.',
        benefits: [
            'Activa la termogénesis (quema de grasa)',
            'Aumenta el gasto calórico',
            'Proporciona energía natural',
            'Reduce la acumulación de grasa'
        ],
        importantNotes: [
            '⚠️ Contiene cafeína natural',
            '❌ No recomendado para hipertensos',
            '❌ Evitar en la noche (puede causar insomnio)'
        ],
        howToTake: [
            '🕐 Tomar 15 min antes de entrenar',
            '🍽️ O después de comidas pesadas',
            '⏰ Evitar después de las 4pm'
        ],
        usage: 'Tomar 15 min antes de entrenar o después de comidas.',
        warning: 'Contiene cafeína natural. Cuidado con hipertensión.'
    },
    {
        id: 'nocarbt',
        name: 'Nocarb-T',
        line: 'Control de Peso',
        type: 'Tea',
        emoji: '🥐',
        imageColor: 'D32F2F',
        tagline: 'Come pan sin culpa. Bloquea los carbohidratos.',
        description: 'Inhibidor natural de carbohidratos y azúcares.',
        benefits: [
            'Bloquea la absorción de carbohidratos',
            'Reduce el impacto de harinas y azúcares',
            'Ayuda a mantener el peso',
            'Ideal para ocasiones especiales'
        ],
        importantNotes: [
            '✅ Seguro para hipertensos',
            '💡 No es licencia para comer de más',
            '🍕 Usar estratégicamente en comidas pesadas'
        ],
        howToTake: [
            '🕐 Tomar DURANTE o inmediatamente después de comer',
            '🍝 Ideal con pastas, pan, arroz, postres',
            '⏰ No funciona si se toma mucho después'
        ],
        usage: 'Tomar durante o inmediatamente después de comidas con harinas.'
    },
    {
        id: 'vitaxtra',
        name: 'Vita Xtra T+',
        line: 'Energía',
        type: 'Refresco',
        emoji: '⚡',
        imageColor: 'FBC02D',
        tagline: 'Energía natural. Sin bajones.',
        description: 'Energizante multivitamínico de maíz morado.',
        benefits: [
            'Proporciona energía sostenida',
            'Rico en antioxidantes',
            'Mejora la concentración',
            'Sin azúcar añadida'
        ],
        importantNotes: [
            '⚠️ Contiene teína natural',
            '❌ No recomendado para hipertensos o ansiosos',
            '💡 Mejor opción que bebidas energéticas comerciales'
        ],
        howToTake: [
            '🕐 Tomar al despertar para full energía',
            '📚 Ideal antes de estudiar o trabajar',
            '⏰ Evitar en la noche'
        ],
        usage: 'Tomar al despertar para full energía.',
        warning: 'No recomendado para hipertensos o ansiosos.'
    },
    {
        id: 'nutradey',
        name: 'Nutradey',
        line: 'Niños',
        type: 'Refresco',
        emoji: '🌞',
        imageColor: 'FFEB3B',
        tagline: 'Vitaminas para toda la familia.',
        description: 'Multivitamínico completo y delicioso.',
        benefits: [
            'Aporta vitaminas y minerales esenciales',
            'Sabor agradable para niños',
            'Fortalece huesos y defensas',
            'Sin cafeína ni estimulantes'
        ],
        importantNotes: [
            '✅ Seguro para niños y adultos mayores',
            '✅ Alternativa a Vita Xtra para hipertensos',
            '👨‍👩‍👧‍👦 Ideal para toda la familia'
        ],
        howToTake: [
            '🕐 Acompañar los almuerzos',
            '🍽️ Puede mezclarse con jugos',
            '📅 Uso diario recomendado'
        ],
        usage: 'Acompañar los almuerzos.'
    },
    {
        id: 'goldenflx',
        name: 'Golden FLX',
        line: 'Articulaciones',
        type: 'Tea',
        emoji: '🦴',
        imageColor: 'FF8F00',
        tagline: 'Alivia el dolor. Recupera tu movilidad.',
        description: 'Leche dorada con cúrcuma para articulaciones.',
        benefits: [
            'Reduce la inflamación articular',
            'Alivia el dolor de rodillas, manos, espalda',
            'Regenera el cartílago',
            'Propiedades antiinflamatorias naturales'
        ],
        importantNotes: [
            '💡 "Si hay dolor, hay acidez" - Dr. Columbus',
            '🔄 Combinar con Alpha Balance para mejores resultados',
            '✅ Seguro para uso prolongado'
        ],
        howToTake: [
            '🕐 Tomar caliente cuando haya dolor',
            '☕ Preparar como leche dorada tradicional',
            '📅 Puede usarse diariamente como prevención'
        ],
        usage: 'Tomar caliente cuando haya dolor.'
    },
    {
        id: 'probal',
        name: 'Probal',
        line: 'Hormonal',
        type: 'Tea',
        emoji: '🌸',
        imageColor: 'F48FB1',
        tagline: 'Equilibrio hormonal femenino.',
        description: 'Té para balance hormonal con aguaje.',
        benefits: [
            'Alivia síntomas de menopausia',
            'Reduce cólicos menstruales',
            'Equilibra hormonas naturalmente',
            'Contiene fitoestrógenos del aguaje'
        ],
        importantNotes: [
            '👩 Diseñado principalmente para mujeres',
            '🌺 El aguaje es un regulador hormonal natural',
            '✅ Seguro para uso prolongado'
        ],
        howToTake: [
            '🕐 Tomar caliente por las noches',
            '📅 Uso continuo para mejores resultados',
            '🩺 Consultar si tienes condiciones hormonales severas'
        ],
        usage: 'Tomar caliente por las noches.'
    },
    {
        id: 'off',
        name: 'OFF',
        line: 'Vigor Mental',
        type: 'Refresco',
        emoji: '😴',
        imageColor: '5C6BC0',
        tagline: 'Relájate. Duerme mejor.',
        description: 'Aminoácidos para relajación y manejo del estrés.',
        benefits: [
            'Reduce el estrés y la ansiedad',
            'Mejora la calidad del sueño',
            'Relaja sin causar somnolencia excesiva',
            'Ayuda a "desconectar" al final del día'
        ],
        importantNotes: [
            '✅ Seguro para hipertensos',
            '✅ No causa dependencia',
            '💡 Alternativa natural a pastillas para dormir'
        ],
        howToTake: [
            '🕐 Tomar antes de situaciones de estrés',
            '🌙 O 30 min antes de dormir',
            '💆 Ideal después de días muy agitados'
        ],
        usage: 'Tomar antes de situaciones de estrés o al dormir.'
    },
    {
        id: 'on',
        name: 'ON',
        line: 'Vigor Mental',
        type: 'Refresco',
        emoji: '💡',
        imageColor: '5C6BC0',
        tagline: 'Enfócate. Rinde al máximo.',
        description: 'Activador mental para concentración y enfoque.',
        benefits: [
            'Mejora la concentración y memoria',
            'Aumenta la claridad mental',
            'Proporciona energía cognitiva',
            'Ideal para trabajo o estudio intenso'
        ],
        importantNotes: [
            '⚠️ Contiene teína',
            '❌ No recomendado para hipertensos',
            '💡 Usar con OFF para equilibrar (ON de día, OFF de noche)'
        ],
        howToTake: [
            '🕐 Tomar cuando necesites enfoque',
            '📚 Ideal antes de exámenes o reuniones',
            '⏰ Evitar en la noche'
        ],
        usage: 'Tomar cuando necesites enfoque.',
        warning: 'Contiene teína.'
    }
];
