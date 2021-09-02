import { transformReplyNumberNull } from './generic-transformers';

export const FIRST_KEY_INDEX = 1;

export const IS_READ_ONLY = true;

export function transformArguments(key: string, element: string): Array<string> {
    return ['LINDEX', key, element];
}

export const transformReply = transformReplyNumberNull;
