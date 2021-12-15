export const FIRST_KEY_INDEX = 1;

export const IS_READ_ONLY = true;

export function transformArguments(key: string): Array<string> {
    return ['HRANDFIELD', key];
}

export declare function transformReply(): string | null;
