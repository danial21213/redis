import { transformReplyStreamsMessages } from './generic-transformers';

export interface XReadGroupStream {
    key: string;
    id: string;
}

export interface XReadGroupOptions {
    COUNT?: number;
    BLOCK?: number;
    NOACK?: true;
}

export const FIRST_KEY_INDEX = (
    _group: string,
    _consumer: string,
    streams: Array<XReadGroupStream> | XReadGroupStream
): string => {
    return Array.isArray(streams) ? streams[0].key : streams.key;
};

export const IS_READ_ONLY = true;

export function transformArguments(
    group: string,
    consumer: string,
    streams: Array<XReadGroupStream> | XReadGroupStream,
    options?: XReadGroupOptions
): Array<string> {
    const args = ['XREADGROUP', 'GROUP', group, consumer];

    if (options?.COUNT) {
        args.push('COUNT', options.COUNT.toString());
    }

    if (typeof options?.BLOCK === 'number') {
        args.push('BLOCK', options.BLOCK.toString());
    }

    if (options?.NOACK) {
        args.push('NOACK');
    }

    args.push('STREAMS');

    const streamsArray = Array.isArray(streams) ? streams : [streams],
        argsLength = args.length;
    for (let i = 0; i < streamsArray.length; i++) {
        const stream = streamsArray[i];
        args[argsLength + i] = stream.key;
        args[argsLength + streamsArray.length + i] = stream.id;
    }

    return args;
}

export const transformReply = transformReplyStreamsMessages;
