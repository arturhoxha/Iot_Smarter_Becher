const { app } = require('@azure/functions');

let latestData = {
    getrunken: 0,      // Gesamtmenge
    differenz: 0,      // Zuletzt getrunkene Menge
    timestamp: null,   // Zeitstempel
};

app.http('liveStatus', {
    methods: ['PATCH'],
    authLevel: 'anonymous',
    route: 'sensor/liveStatus',
    handler: async (request, context) => {
        context.log(`HTTP PATCH function processed request for url "${request.url}"`);
        try {
            const body = await request.json();
            const { getrunken, differenz, timestamp } = body;

            if (getrunken === undefined || differenz === undefined || !timestamp) {
                context.log('Fehler: fehlende Werte');
                return {
                    status: 400,
                    jsonBody: { error: 'Fehler: getrunken, differenz und timestamp sind erforderlich.' },
                };
            }

            latestData = {
                getrunken,
                differenz,
                timestamp
            };

            context.log('Neuesten Daten aktualisiert:', latestData);
            return {
                status: 200,
                jsonBody: {
                    message: 'Daten erfolgreich aktualisiert.',
                    latestData: latestData,
                },
            };
        } catch (error) {
            context.log('Fehler in der PATCH-API:', error.message);
            return {
                status: 500,
                jsonBody: { error: 'Fehler beim Verarbeiten der Anfrage.' },
            };
        }
    },
});

app.http('sensor-data-fetch', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'liveStatus',
    handler: async (request, context) => {
        context.log(`HTTP GET function processed request for url "${request.url}"`);
        try {
            if (!latestData.timestamp) {
                return {
                    status: 404,
                    jsonBody: { error: 'Keine Daten verfügbar.' },
                };
            }

            return {
                status: 200,
                jsonBody: {
                    latestData: latestData,
                },
            };
        } catch (error) {
            context.log('Fehler in der GET-API:', error.message);
            return {
                status: 500,
                jsonBody: { error: 'Fehler beim Abrufen der Daten.' },
            };
        }
    },
});