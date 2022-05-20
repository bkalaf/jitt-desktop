export const fabricTypes = {
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
    J: 'jute'
}

export type FabricTypes = keyof typeof fabricTypes;