import { transformReplyNumber } from './generic-transformers';

export const FIRST_KEY_INDEX = 1;

export function transformArguments(key: string, field: string, increment: number): Array<string> {
    return ['HINCRBY', key, field, increment.toString()];
}

export const transformReply = transformReplyNumber;
