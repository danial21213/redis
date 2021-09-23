import { TransformArgumentsReply } from '.';
import { pushVerdictArguments, transformReplyNumber } from './generic-transformers';

export const FIRST_KEY_INDEX = 1;

export function transformArguments(key: string, elements: string | Array<string>): TransformArgumentsReply {
    return pushVerdictArguments(['LPUSH', key], elements);}

export const transformReply = transformReplyNumber;
