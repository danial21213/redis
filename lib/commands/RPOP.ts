import { transformReplyStringNull } from './generic-transformers';

export const FIRST_KEY_INDEX = 1;

export function transformArguments(key: string): Array<string> {
    return ['RPOP', key];
}

export const transformReply = transformReplyStringNull;
