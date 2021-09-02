import { pushVerdictArguments } from './generic-transformers';

export const FIRST_KEY_INDEX = 1;

export function transformArguments(keys: string | Array<string>, timeout: number): Array<string> {
    const args = pushVerdictArguments(['BLPOP'], keys);

    args.push(timeout.toString());

    return args;
}

type BLPOPReply = null | {
    key: string;
    element: string;
};

export function transformReply(reply: null | [string, string]): BLPOPReply {
    if (reply === null) return null;

    return {
        key: reply[0],
        element: reply[1]
    };
}
