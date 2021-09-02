import { transformReplyNumber } from './generic-transformers';

export const FIRST_KEY_INDEX = 1;

export function transformArguments(key: string): Array<string> {
    return ['SCARD', key];
}

export const transformReply = transformReplyNumber;
