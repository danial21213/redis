import { strict as assert } from 'assert';
import { TestRedisServers, itWithClient } from '../test-utils';
import { transformArguments } from './BITFIELD';

describe('BITFIELD', () => {
    it('transformArguments', () => {
        assert.deepEqual(
            transformArguments('key', [{
                operation: 'OVERFLOW',
                behavior: 'WRAP'
            }, {
                operation: 'GET',
                type: 'i8',
                offset: 0
            }, {
                operation: 'OVERFLOW',
                behavior: 'SAT'
            }, {
                operation: 'SET',
                type: 'i16',
                offset: 1,
                value: 0
            }, {
                operation: 'OVERFLOW',
                behavior: 'FAIL'
            }, {
                operation: 'INCRBY',
                type: 'i32',
                offset: 2,
                increment: 1
            }]),
            ['BITFIELD', 'key', 'OVERFLOW', 'WRAP', 'GET', 'i8', '0', 'OVERFLOW', 'SAT', 'SET', 'i16', '1', '0', 'OVERFLOW', 'FAIL', 'INCRBY', 'i32', '2', '1']
        );
    });

    itWithClient(TestRedisServers.OPEN, 'client.bitField', async client => {
        assert.deepEqual(
            await client.bitField('key', []),
            []
        );
    });
});
