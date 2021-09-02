import { createHash } from 'crypto';
import { RedisCommand } from './commands';

export interface RedisLuaScriptConfig extends RedisCommand {
    SCRIPT: string;
    NUMBER_OF_KEYS: number;
}

export interface SHA1 {
    SHA1: string;
}

export type RedisLuaScript = RedisLuaScriptConfig & SHA1;

export interface RedisLuaScripts {
    [key: string]: RedisLuaScript;
}

export function defineScript<S extends RedisLuaScriptConfig>(script: S): S & SHA1 {
    return {
        ...script,
        SHA1: scriptSha1(script.SCRIPT)
    };
}

export function scriptSha1(script: string): string {
    return createHash('sha1').update(script).digest('hex');
}
