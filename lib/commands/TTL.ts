import { transformReplyNumber } from './generic-transformers';

export const FIRST_KEY_INDEX = 1;

export const IS_READ_ONLY = true;

export function transformArguments(key: string): Array<string> {
    return ['TTL', key];
}

export const transformReply = transformReplyNumber; 
