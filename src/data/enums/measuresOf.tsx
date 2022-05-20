export const measuresOf = {
    L: 'length',
    W: 'width',
    H: 'height',
    M: 'weight',
    T: 'time',
    C: 'capacity',
    V: 'volume',
    S: 'speed',
    D: 'diameter',
    G: 'voltage',
    A: 'amperage'
}
export type MeasuresOf = keyof typeof measuresOf;