import { strict as assert } from 'assert';
import { TestRedisServers, itWithClient, TestRedisClusters, itWithCluster } from '../test-utils';
import { transformArguments } from './MEMORY_MALLOC-STATS';

describe('MEMORY MALLOC-STATS', () => {
    it('transformArguments', () => {
        assert.deepEqual(
            transformArguments(),
            ['MEMORY', 'MALLOC-STATS']
        );
    });

    itWithClient(TestRedisServers.OPEN, 'client.memoryMallocStats', async client => {
        assert.equal(
            typeof (await client.memoryDoctor()),
            'string'
        );
    });

    itWithCluster(TestRedisClusters.OPEN, 'cluster.memoryDoctor', async cluster => {
        assert.equal(
            typeof (await cluster.memoryDoctor()),
            'string'
        );
    });
});
