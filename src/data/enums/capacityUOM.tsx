export const capacity = {
    bytes: 'bytes',
    kb: 'kiobytes',
    mb: 'megabytes',
    gb: 'gigabytes',
    tb: 'terabytes'
};

export type CapacityUOM = keyof typeof capacity;
