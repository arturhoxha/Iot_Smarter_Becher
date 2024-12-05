
const { app } = require('@azure/functions');

// Variablen zum Speichern der neuesten Werte
let latestData = {
    getrunken: null,
    timestamp: null,
};

// PATCH-API: Daten aktualisieren
app.http('liveStatus', {
    methods: ['PATCH'],
    authLevel: 'anonymous',
    route: 'sensor/liveStatus',
    handler: async (request, context) => {
        context.log(`HTTP PATCH function processed request for url "${request.url}"`);

        try {
            // JSON aus dem Request lesen
            const body = await request.json();

            // Body-Parameter auslesen
            const { getrunken, timestamp } = body;

            // Validierung
            if (getrunken === undefined || !timestamp) {
                context.log('Fehler: fehlende Werte');
                return {
                    status: 400,
                    jsonBody: { error: 'Fehler: getrunken und timestamp sind erforderlich.' },
                };
            }

            // Werte im Backend speichern
            latestData.getrunken = getrunken;
            latestData.timestamp = timestamp;

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

// GET-API: Daten abrufen
app.http('sensor-data-fetch', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'liveStatus',
    handler: async (request, context) => {
        context.log(`HTTP GET function processed request for url "${request.url}"`);

        try {
            // Überprüfen, ob Daten vorhanden sind
            if (latestData.getrunken === null || latestData.timestamp === null) {
                return {
                    status: 404,
                    jsonBody: { error: 'Keine Daten verfügbar.' },
                };
            }

            // Daten zurückgeben
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
