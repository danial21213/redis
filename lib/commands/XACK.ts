import { pushVerdictArguments, transformReplyNumber } from './generic-transformers';

export const FIRST_KEY_INDEX = 1;

export function transformArguments(key: string, group: string, id: string | Array<string>): Array<string> {
    return pushVerdictArguments(['XACK', key, group], id);
}

export const transformReply = transformReplyNumber;
