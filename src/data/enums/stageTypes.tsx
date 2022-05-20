import { invertObject } from './mimeTypes';

export const stageTypesByName = {
    original: '0',
    compressed: '1',
    editted: '2',
    backgroundRemoved: '3'
};
export const stageTypes = {
    0: 'original',
    1: 'compressed',
    2: 'editted',
    3: 'backgroundRemoved'
}
export type StageTypes = keyof typeof stageTypes;