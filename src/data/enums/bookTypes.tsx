export const bookTypes = {
    PB: 'paperback',
    HB: 'hardback',
    BB: 'boardbook',
    TB: 'textbook'
};

export type BookType = keyof typeof bookTypes;
