import { RedisCommandArgument, RedisCommandArguments } from '.';

export const FIRST_KEY_INDEX = 1;

export function transformArguments(
    key: RedisCommandArgument,
    seconds: number,
    value: string
): RedisCommandArguments {
    return [
        'SETEX',
        key,
        seconds.toString(),
        value
    ];
}

export declare function transformReply(): string;
