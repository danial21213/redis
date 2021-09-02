import { transformReplyNumber } from './generic-transformers';

export const FIRST_KEY_INDEX = 1;

export function transformArguments(key: string, start: number, stop: number): Array<string> {
    return ['ZREMRANGEBYRANK', key, start.toString(), stop.toString()];
}

export const transformReply = transformReplyNumber;
