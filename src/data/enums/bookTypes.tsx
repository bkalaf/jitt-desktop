export const bookTypes = {
    PB: 'Paperback',
    HB: 'Hardback',
    BB: 'Board-Book',
    TB: 'Textbook'
};

export type BookType = keyof typeof bookTypes;
