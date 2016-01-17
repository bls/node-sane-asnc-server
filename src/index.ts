'use strict';

import * as events from 'events';
import promisify = require('es6-promisify');

export interface ServerOptions { // Not in DefinitelyTyped yet
    port?: number;
    host?: string;
    backlog?: number;
    path?: string;
    exclusive?: boolean;
}

export interface IServer extends events.EventEmitter {
    close: any;
    listen: any;
}

export interface HasAsyncListen {
    listenAsync(path: string): Promise<void>;
    listenAsync(handle: number): Promise<void>;
    listenAsync(options: ServerOptions): Promise<void>;
    listenAsync(port: number, hostname?: string, backlog?: number): Promise<void>;
    closeAsync(): Promise<void>;
}

// Most of the usual errors from listen() will result in the 'error' event being emitted
// from the server. We need to capture those errors and convert them to promise failure,
// hence the following shim:

function withErrorHandler(ee: events.EventEmitter, ppf: Function): Function {
    return function(): Promise<any> {
        var fnargs = Array.prototype.slice.call(arguments);  // Breaks optimization; don't care...
        return new Promise(function (resolve, reject) {
            function catcher(err: any) {
                reject(err);
            }
            ee.once('error', catcher);
            ppf.apply(ee, fnargs).then(function (result: any) {
                ee.removeListener('error', catcher);
                resolve(result);
            }).catch(function (err: any) {
                ee.removeListener('error', catcher);
                reject(err);
            });
        });
    };
}

export function promisifyListen<T extends IServer>(server: T): T & HasAsyncListen {
    var s: any = server;
    s['listenAsync'] = withErrorHandler(server, promisify(server.listen));
    s['closeAsync'] = withErrorHandler(server, promisify(server.close));
    return <T & HasAsyncListen> server; // Trust me!
}
