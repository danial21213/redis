import { GeoCoordinates, transformReplyNumber } from './generic-transformers';

interface GeoMember extends GeoCoordinates {
    member: string;
}

interface NX {
    NX?: true;
}

interface XX {
    XX?: true;
}

type SetGuards = NX | XX;

interface GeoAddCommonOptions {
    CH?: true;
}

type GeoAddOptions = SetGuards & GeoAddCommonOptions;

export const FIRST_KEY_INDEX = 1;

export function transformArguments(key: string, toAdd: GeoMember | Array<GeoMember>, options?: GeoAddOptions): Array<string> {
    const args = ['GEOADD', key];

    if ((options as NX)?.NX) {
        args.push('NX');
    } else if ((options as XX)?.XX) {
        args.push('XX');
    }

    if (options?.CH) {
        args.push('CH');
    }

    for (const { longitude, latitude, member } of (Array.isArray(toAdd) ? toAdd : [toAdd])) {
        args.push(
            longitude.toString(),
            latitude.toString(),
            member
        );
    }

    return args;
}

export const transformReply = transformReplyNumber;
