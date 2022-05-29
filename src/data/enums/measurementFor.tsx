export const measurementFor = {
    H: 'head',
    S: 'shoulders',
    B: 'bust',
    V: 'sleeve',
    N: 'neck',
    D: 'body',
    M: 'hem',
    W: 'waist',
    I: 'inseam',
    L: 'leg',
    F: 'foot',
    C: 'chest'
};

export type MeasurementFor = keyof typeof measurementFor;