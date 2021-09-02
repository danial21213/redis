import { pushVerdictArguments, transformReplyString } from './generic-transformers';

export const FIRST_KEY_INDEX = 1;

export function transformArguments(destination: string, source: string | Array<string>): Array<string> {
    return pushVerdictArguments(['PFMERGE', destination], source);
}

export const transformReply = transformReplyString;
