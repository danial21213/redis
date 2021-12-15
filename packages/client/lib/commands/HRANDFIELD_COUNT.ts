import { transformArguments as transformHRandFieldArguments } from './HRANDFIELD';

export { FIRST_KEY_INDEX, IS_READ_ONLY } from './HRANDFIELD';

export function transformArguments(key: string, count: number): Array<string> {
    return [
        ...transformHRandFieldArguments(key),
        count.toString()
    ];
}

export declare function transformReply(): Array<string>;
