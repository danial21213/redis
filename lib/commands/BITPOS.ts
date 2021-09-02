import { BitValue, transformReplyNumber } from './generic-transformers';

export const FIRST_KEY_INDEX = 1;

export const IS_READ_ONLY = true;

export function transformArguments(key: string, bit: BitValue, start?: number, end?: number): Array<string> {
    const args = ['BITPOS', key, bit.toString()];

    if (typeof start === 'number') {
        args.push(start.toString());
    }

    if (typeof end === 'number') {
        args.push(end.toString());
    }

    return args;
}

export const transformReply = transformReplyNumber;