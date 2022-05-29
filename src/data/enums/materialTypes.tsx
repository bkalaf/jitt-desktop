export const materialTypes = {
    OC: 'organic cotton',
    C: 'cotton',
    L: 'leather',
    N: 'nylon',
    P: 'polyester',
    S: 'silk',
    W: 'wool',
    H: 'leather',
    A: 'acrylic',
    Y: 'lycra',
    R: 'rayon',
    I: 'linen',
    X: 'spandex',
    T: 'acetate',
    J: 'jute',
    AG: 'gold',
    AU: 'silver',
    PT: 'platinum'
};

export type MaterialTypes = keyof typeof materialTypes;