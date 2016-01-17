'use strict';

import { promisifyListen } from './index';
import * as http from 'http';
import * as assert from 'assert';

describe('promisifyListen', function() {
    it('should work for an HTTP server', function(done) {
        var s = promisifyListen(http.createServer());
        s.listenAsync(31337).then(function () {
            return s.closeAsync();
        }).then(function () {
            done();
        }).catch(done);
    });
    it('should handle errors properly', function(done) {
        var s = promisifyListen(http.createServer());
        s.listenAsync(22).then(function() {
            done(new Error('DOH: unexpected success ><'));
        }).catch(function (e: any) {
            assert.equal(e.code, 'EACCES');
            done();
        });
    });
});
