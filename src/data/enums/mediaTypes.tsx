export const mediaTypes = {
    cd: 'CD',
    vhs: 'VHS',
    dvd: 'DVD',
    blu: 'Blu-Ray',
    ld: 'Laserdisc',
    book: 'Book',
    game: 'Video Game'
};

export type MediaType = keyof typeof mediaTypes;

export const mediaTypeToItemType: Record<string, string> = {
    cd: 'Media - Music',
    vhs: 'Media - Video',
    dvd: 'Media - Video',
    blu: 'Media - Video',
    ld: 'Media - Video',
    book: 'Media - Book',
    game: 'Media - Game'
}