import {PoPApplication} from './application';
import {ApplicationConfig} from '@loopback/core';
import {REST_CONFIG} from './constants';

export {PoPApplication};

export async function main(options: ApplicationConfig = {}) {
    const app = new PoPApplication({
        rest: REST_CONFIG
    });
    await app.boot();
    await app.start();

    const url = app.restServer.url;
    console.log(`Server is running at ${url}`);
    console.log(`Try ${url}/ping`);

    return app;
}
