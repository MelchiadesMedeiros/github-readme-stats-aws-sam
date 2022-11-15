import { default as stats } from './api/index.js';
import { default as pin } from './api/pin.js';
import { default as topLangs } from './api/top-langs.js';
import { default as wakatime } from './api/wakatime.js';

export async function handler(event) {
    try {
        const query = event.queryStringParameters;
        const path = event.rawPath || '/';
        switch (path) {
            case '/api':
                return stats(query);
            case '/api/pin':
                return pin(query);
            case '/api/top-langs':
                return topLangs(query);
            case '/api/wakatime':
                return wakatime(query);
            default:
                return {
                    statusCode: 404,
                    body: 'Not Found',
                };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
    
}