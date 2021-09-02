import { strict as assert } from 'assert';
import { TestRedisServers, itWithClient } from '../test-utils';
import { transformArguments } from './SET';

describe('SET', () => {
    describe('transformArguments', () => {
        it('simple', () => {
            assert.deepEqual(
                transformArguments('key', 'value'),
                ['SET', 'key', 'value']
            );
        });

        describe('TTL', () => {
            it('with EX', () => {
                assert.deepEqual(
                    transformArguments('key', 'value', {
                        EX: 1
                    }),
                    ['SET', 'key', 'value', 'EX', '1']
                );
            });

            it('with PX', () => {
                assert.deepEqual(
                    transformArguments('key', 'value', {
                        PX: 1
                    }),
                    ['SET', 'key', 'value', 'PX', '1']
                );
            });

            it('with EXAT', () => {
                assert.deepEqual(
                    transformArguments('key', 'value', {
                        EXAT: 1
                    }),
                    ['SET', 'key', 'value', 'EXAT', '1']
                );
            });

            it('with PXAT', () => {
                assert.deepEqual(
                    transformArguments('key', 'value', {
                        PXAT: 1
                    }),
                    ['SET', 'key', 'value', 'PXAT', '1']
                );
            });

            it('with KEEPTTL', () => {
                assert.deepEqual(
                    transformArguments('key', 'value', {
                        KEEPTTL: true
                    }),
                    ['SET', 'key', 'value', 'KEEPTTL']
                );
            });
        });

        describe('Guards', () => {
            it('with NX', () => {
                assert.deepEqual(
                    transformArguments('key', 'value', {
                        NX: true
                    }),
                    ['SET', 'key', 'value', 'NX']
                );
            });

            it('with XX', () => {
                assert.deepEqual(
                    transformArguments('key', 'value', {
                        XX: true
                    }),
                    ['SET', 'key', 'value', 'XX']
                );
            });
        });

        it('with GET', () => {
            assert.deepEqual(
                transformArguments('key', 'value', {
                    GET: true
                }),
                ['SET', 'key', 'value', 'GET']
            );
        });

        it('with EX, NX, GET', () => {
            assert.deepEqual(
                transformArguments('key', 'value', {
                    EX: 1,
                    NX: true,
                    GET: true
                }),
                ['SET', 'key', 'value', 'EX', '1', 'NX', 'GET']
            );
        });
    });

    describe('client.set', () => {
        itWithClient(TestRedisServers.OPEN, 'simple', async client => {
            assert.equal(
                await client.set('key', 'value'),
                'OK'
            );
        });

        itWithClient(TestRedisServers.OPEN, 'with GET on empty key', async client => {
            assert.equal(
                await client.set('key', 'value', {
                    GET: true
                }),
                null
            );
        }, {
            minimumRedisVersion: [6, 2]
        });
    });
});
