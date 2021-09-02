import { strict as assert } from 'assert';
import { TestRedisServers, itWithClient } from '../test-utils';
import { transformArguments } from './PEXPIREAT';

describe('PEXPIREAT', () => {
    describe('transformArguments', () => {
        it('number', () => {
            assert.deepEqual(
                transformArguments('key', 1),
                ['PEXPIREAT', 'key', '1']
            );
        });
    
        it('date', () => {
            const d = new Date();
            assert.deepEqual(
                transformArguments('key', d),
                ['PEXPIREAT', 'key', d.getTime().toString()]
            );
        });
    });

    itWithClient(TestRedisServers.OPEN, 'client.pExpireAt', async client => {
        assert.equal(
            await client.pExpireAt('key', 1),
            false
        );
    });
});
