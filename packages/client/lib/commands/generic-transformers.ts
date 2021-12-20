import { RedisCommandArgument, RedisCommandArguments } from '.';

export function transformBooleanReply(reply: number): boolean {
    return reply === 1;
}

export function transformBooleanArrayReply(reply: Array<number>): Array<boolean> {
    return reply.map(transformBooleanReply);
}

export type BitValue = 0 | 1;

export interface ScanOptions {
    MATCH?: string;
    COUNT?: number;
}

export function pushScanArguments(
    args: RedisCommandArguments,
    cursor: number,
    options?: ScanOptions
): RedisCommandArguments {
    args.push(cursor.toString());

    if (options?.MATCH) {
        args.push('MATCH', options.MATCH);
    }

    if (options?.COUNT) {
        args.push('COUNT', options.COUNT.toString());
    }

    return args;
}

export function transformNumberInfinityReply(reply: RedisCommandArgument): number {
    switch (reply.toString()) {
        case '+inf':
            return Infinity;

        case '-inf':
            return -Infinity;

        default:
            return Number(reply);
    }
}

export function transformNumberInfinityNullReply(reply: RedisCommandArgument | null): number | null {
    if (reply === null) return null;

    return transformNumberInfinityReply(reply);
}

export function transformNumberInfinityNullArrayReply(reply: Array<RedisCommandArgument | null>): Array<number | null> {
    return reply.map(transformNumberInfinityNullReply);
}

export function transformNumberInfinityArgument(num: number): string {
    switch (num) {
        case Infinity:
            return '+inf';

        case -Infinity:
            return '-inf';

        default:
            return num.toString();
    }
}

export function transformStringNumberInfinityArgument(num: RedisCommandArgument | number): RedisCommandArgument {
    if (typeof num !== 'number') return num;

    return transformNumberInfinityArgument(num);
}

export function transformTuplesReply(
    reply: Array<RedisCommandArgument>
): Record<string, RedisCommandArgument> {
    const message = Object.create(null);

    for (let i = 0; i < reply.length; i += 2) {
        message[reply[i].toString()] = reply[i + 1];
    }

    return message;
}

export interface StreamMessageReply {
    id: RedisCommandArgument;
    message: Record<string, RedisCommandArgument>;
}

export type StreamMessagesReply = Array<StreamMessageReply>;

export function transformStreamMessagesReply(reply: Array<any>): StreamMessagesReply {
    const messages = [];

    for (const [id, message] of reply) {
        messages.push({
            id,
            message: transformTuplesReply(message)
        });
    }

    return messages;
}

export type StreamsMessagesReply = Array<{
    name: RedisCommandArgument;
    messages: StreamMessagesReply;
}> | null;

export function transformStreamsMessagesReply(reply: Array<any> | null): StreamsMessagesReply | null {
    if (reply === null) return null;

    return reply.map(([name, rawMessages]) => ({
        name,
        messages: transformStreamMessagesReply(rawMessages)
    }));
}

export interface ZMember {
    score: number;
    value: RedisCommandArgument;
}

export function transformSortedSetMemberNullReply(
    reply: [RedisCommandArgument, RedisCommandArgument] | []
): ZMember | null {
    if (!reply.length) return null;

    return {
        value: reply[0],
        score: transformNumberInfinityReply(reply[1])
    };
}

export function transformSortedSetWithScoresReply(reply: Array<RedisCommandArgument>): Array<ZMember> {
    const members = [];

    for (let i = 0; i < reply.length; i += 2) {
        members.push({
            value: reply[i],
            score: transformNumberInfinityReply(reply[i + 1])
        });
    }

    return members;
}

type GeoCountArgument = number | {
    value: number;
    ANY?: true
};

export function pushGeoCountArgument(
    args: RedisCommandArguments,
    count: GeoCountArgument | undefined
): RedisCommandArguments {
    if (typeof count === 'number') {
        args.push('COUNT', count.toString());
    } else if (count) {
        args.push('COUNT', count.value.toString());

        if (count.ANY) {
            args.push('ANY');
        }
    }

    return args;
}

export type GeoUnits = 'm' | 'km' | 'mi' | 'ft';

export interface GeoCoordinates {
    longitude: string | number;
    latitude: string | number;
}

type GeoSearchFromMember = string;

export type GeoSearchFrom = GeoSearchFromMember | GeoCoordinates;

interface GeoSearchByRadius {
    radius: number;
    unit: GeoUnits;
}

interface GeoSearchByBox {
    width: number;
    height: number;
    unit: GeoUnits;
}

export type GeoSearchBy = GeoSearchByRadius | GeoSearchByBox;

export interface GeoSearchOptions {
    SORT?: 'ASC' | 'DESC';
    COUNT?: GeoCountArgument;
}

export function pushGeoSearchArguments(
    args: RedisCommandArguments,
    key: RedisCommandArgument,
    from: GeoSearchFrom,
    by: GeoSearchBy,
    options?: GeoSearchOptions
): RedisCommandArguments {
    args.push(key);

    if (typeof from === 'string') {
        args.push('FROMMEMBER', from);
    } else {
        args.push('FROMLONLAT', from.longitude.toString(), from.latitude.toString());
    }

    if ('radius' in by) {
        args.push('BYRADIUS', by.radius.toString());
    } else {
        args.push('BYBOX', by.width.toString(), by.height.toString());
    }

    args.push(by.unit);

    if (options?.SORT) {
        args.push(options.SORT);
    }

    pushGeoCountArgument(args, options?.COUNT);

    return args;
}

export enum GeoReplyWith {
    DISTANCE = 'WITHDIST',
    HASH = 'WITHHASH',
    COORDINATES = 'WITHCOORD'
}

export interface GeoReplyWithMember {
    member: string;
    distance?: number;
    hash?: string;
    coordinates?: {
        longitude: string;
        latitude: string;
    };
}

export function transformGeoMembersWithReply(reply: Array<Array<any>>, replyWith: Array<GeoReplyWith>): Array<GeoReplyWithMember> {
    const replyWithSet = new Set(replyWith);

    let index = 0;
    const distanceIndex = replyWithSet.has(GeoReplyWith.DISTANCE) && ++index,
        hashIndex = replyWithSet.has(GeoReplyWith.HASH) && ++index,
        coordinatesIndex = replyWithSet.has(GeoReplyWith.COORDINATES) && ++index;

    return reply.map(member => {
        const transformedMember: GeoReplyWithMember = {
            member: member[0]
        };

        if (distanceIndex) {
            transformedMember.distance = member[distanceIndex];
        }

        if (hashIndex) {
            transformedMember.hash = member[hashIndex];
        }

        if (coordinatesIndex) {
            const [longitude, latitude] = member[coordinatesIndex];
            transformedMember.coordinates = {
                longitude,
                latitude
            };
        }

        return transformedMember;
    });
}

export function transformEXAT(EXAT: number | Date): string {
    return (typeof EXAT === 'number' ? EXAT : Math.floor(EXAT.getTime() / 1000)).toString();
}

export function transformPXAT(PXAT: number | Date): string {
    return (typeof PXAT === 'number' ? PXAT : PXAT.getTime()).toString();
}

export interface EvalOptions {
    keys?: Array<string>;
    arguments?: Array<string>;
}

export function pushEvalArguments(args: Array<string>, options?: EvalOptions): Array<string> {
    if (options?.keys) {
        args.push(
            options.keys.length.toString(),
            ...options.keys
        );
    } else {
        args.push('0');
    }

    if (options?.arguments) {
        args.push(...options.arguments);
    }

    return args;
}

export function pushVerdictArguments(args: RedisCommandArguments, value: RedisCommandArgument | Array<RedisCommandArgument>): RedisCommandArguments  {
    if (Array.isArray(value)) {
        args.push(...value);
    } else {
        args.push(value);
    }

    return args;
}

export function pushVerdictArgument(
    args: RedisCommandArguments,
    value: RedisCommandArgument | Array<RedisCommandArgument>
): RedisCommandArguments {
    if (Array.isArray(value)) {
        args.push(value.length.toString(), ...value);
    } else {
        args.push('1', value);
    }

    return args;
}

export function pushOptionalVerdictArgument(
    args: RedisCommandArguments,
    name: RedisCommandArgument,
    value: undefined | RedisCommandArgument | Array<RedisCommandArgument>
): RedisCommandArguments {
    if (value === undefined) return args;

    args.push(name);

    return pushVerdictArgument(args, value);
}

export enum CommandFlags {
    WRITE = 'write', // command may result in modifications
    READONLY = 'readonly', // command will never modify keys
    DENYOOM = 'denyoom', // reject command if currently out of memory
    ADMIN = 'admin', // server admin command
    PUBSUB = 'pubsub', // pubsub-related command
    NOSCRIPT = 'noscript', // deny this command from scripts
    RANDOM = 'random', // command has random results, dangerous for scripts
    SORT_FOR_SCRIPT = 'sort_for_script', // if called from script, sort output
    LOADING = 'loading', // allow command while database is loading
    STALE = 'stale', // allow command while replica has stale data
    SKIP_MONITOR = 'skip_monitor', // do not show this command in MONITOR
    ASKING = 'asking', // cluster related - accept even if importing
    FAST = 'fast', // command operates in constant or log(N) time. Used for latency monitoring.
    MOVABLEKEYS = 'movablekeys' // keys have no pre-determined position. You must discover keys yourself.
}

export enum CommandCategories {
    KEYSPACE = '@keyspace',
    READ = '@read',
    WRITE = '@write',
    SET = '@set',
    SORTEDSET = '@sortedset',
    LIST = '@list',
    HASH = '@hash',
    STRING = '@string',
    BITMAP = '@bitmap',
    HYPERLOGLOG = '@hyperloglog',
    GEO = '@geo',
    STREAM = '@stream',
    PUBSUB = '@pubsub',
    ADMIN = '@admin',
    FAST = '@fast',
    SLOW = '@slow',
    BLOCKING = '@blocking',
    DANGEROUS = '@dangerous',
    CONNECTION = '@connection',
    TRANSACTION = '@transaction',
    SCRIPTING = '@scripting'
}

export type CommandRawReply = [
    name: string,
    arity: number,
    flags: Array<CommandFlags>,
    firstKeyIndex: number,
    lastKeyIndex: number,
    step: number,
    categories: Array<CommandCategories>
];

export type CommandReply = {
    name: string,
    arity: number,
    flags: Set<CommandFlags>,
    firstKeyIndex: number,
    lastKeyIndex: number,
    step: number,
    categories: Set<CommandCategories>
};

export function transformCommandReply(
    this: void,
    [name, arity, flags, firstKeyIndex, lastKeyIndex, step, categories]: CommandRawReply
): CommandReply {
    return {
        name,
        arity,
        flags: new Set(flags),
        firstKeyIndex,
        lastKeyIndex,
        step,
        categories: new Set(categories)
    };
}
