const { app } = require('@azure/functions');

app.http('liveStatus', {
    methods: ['GET'],
    authLevel: 'anonymous', // Optional: Für Authentifizierung anpassen
    handler: async (request, context) => {
        context.log('API: /liveStatus aufgerufen.');

        // Beispiel-Daten (kann später dynamisch sein)
        return {
            jsonBody: {
                nowconsumed: 500, // Aktuelles Gewicht des Glases
                consumed: 1200, // Bereits getrunken (in ml)
                reminder: false, // Erinnerung notwendig
            }
        };
    }
});
