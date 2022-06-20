export const mediaTypes = {
    CD: 'cd',
    VHS: 'vhs',
    DVD: 'dvd',
    BLU: 'blu-ray',
    LD: 'laserdisc'
};

export type MediaType = keyof typeof mediaTypes;