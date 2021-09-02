import { transformReplyNumber } from './generic-transformers';

export const FIRST_KEY_INDEX = 1;

export function transformArguments(key: string, increment: number): Array<string> {
    return ['INCRBY', key, increment.toString()];
}

export const transformReply = transformReplyNumber;
