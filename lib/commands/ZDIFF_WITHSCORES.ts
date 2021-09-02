import { transformReplySortedSetWithScores } from './generic-transformers';
import { transformArguments as transformZDiffArguments } from './ZDIFF';

export { FIRST_KEY_INDEX, IS_READ_ONLY } from './ZDIFF';

export function transformArguments(...args: Parameters<typeof transformZDiffArguments>): Array<string> {
    return [
        ...transformZDiffArguments(...args),
        'WITHSCORES'
    ];
}

export const transformReply = transformReplySortedSetWithScores;
