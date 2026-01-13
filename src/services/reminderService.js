// Reminder Service for Client Follow-ups
export const REMINDER_INTERVALS = [
    { id: '3days', label: '3 días', days: 3 },
    { id: '1week', label: '1 semana', days: 7 },
    { id: '2weeks', label: '2 semanas', days: 14 },
    { id: '1month', label: '1 mes', days: 30 }
];

export const REMINDER_TEMPLATES = {
    '3days': `¡Hola {name}! 👋\n\n¿Cómo te va con los productos? Espero que estés notando cambios positivos.\n\nRecuerda:\n{tips}\n\n¿Tienes alguna duda? Estoy aquí para ayudarte.`,
    '1week': `¡Hola {name}! 🌟\n\nYa pasó una semana desde que empezamos tu programa. ¿Cómo te sientes?\n\n{tips}\n\nSi necesitas ajustar algo, avísame.`,
    '2weeks': `¡Hola {name}! 💪\n\nQuiero saber cómo va tu progreso. ¿Estás viendo resultados?\n\n{tips}\n\n¡Sigue así!`,
    '1month': `¡Hola {name}! 🎉\n\n¡Ya cumplimos un mes! Es momento de evaluar tu progreso.\n\n{tips}\n\n¿Te gustaría programar una consulta de seguimiento?`
};

export function generateReminderMessage(consultation, intervalId) {
    const template = REMINDER_TEMPLATES[intervalId];
    if (!template) return '';

    const { profile, results } = consultation;
    const tips = results?.tips?.slice(0, 2).join('\n') || 'Continúa con tu rutina diaria.';

    return template
        .replace('{name}', profile.name || 'Cliente')
        .replace('{tips}', tips);
}

export function scheduleReminder(consultation, intervalId) {
    const interval = REMINDER_INTERVALS.find(i => i.id === intervalId);
    if (!interval) return null;

    const reminderDate = new Date();
    reminderDate.setDate(reminderDate.getDate() + interval.days);

    const reminder = {
        id: `rem_${Date.now()}`,
        consultationId: consultation.id,
        clientName: consultation.profile.name,
        clientPhone: consultation.profile.phone,
        intervalId,
        scheduledDate: reminderDate.toISOString(),
        message: generateReminderMessage(consultation, intervalId),
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    return reminder;
}

export function getPendingReminders(reminders) {
    const now = new Date();
    return reminders.filter(r =>
        r.status === 'pending' && new Date(r.scheduledDate) <= now
    );
}

export function markReminderAsSent(reminderId, reminders) {
    return reminders.map(r =>
        r.id === reminderId
            ? { ...r, status: 'sent', sentAt: new Date().toISOString() }
            : r
    );
}

export function cancelReminder(reminderId, reminders) {
    return reminders.map(r =>
        r.id === reminderId
            ? { ...r, status: 'cancelled', cancelledAt: new Date().toISOString() }
            : r
    );
}