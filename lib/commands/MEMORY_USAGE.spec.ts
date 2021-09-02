import { strict as assert } from 'assert';
import { TestRedisServers, itWithClient, TestRedisClusters, itWithCluster } from '../test-utils';
import { transformArguments } from './MEMORY_USAGE';

describe('MEMORY USAGE', () => {
    describe('transformArguments', () => {
        it('simple', () => {
            assert.deepEqual(
                transformArguments('key'),
                ['MEMORY', 'USAGE', 'key']
            );
        });

        it('with SAMPLES', () => {
            assert.deepEqual(
                transformArguments('key', {
                    SAMPLES: 1
                }),
                ['MEMORY', 'USAGE', 'key', 'SAMPLES', '1']
            );
        });
    });

    itWithClient(TestRedisServers.OPEN, 'client.memoryUsage', async client => {
        assert.equal(
            await client.memoryUsage('key'),
            null
        );
    });

    itWithCluster(TestRedisClusters.OPEN, 'cluster.memoryUsage', async cluster => {
        assert.equal(
            await cluster.memoryUsage('key'),
            null
        );
    });
});
