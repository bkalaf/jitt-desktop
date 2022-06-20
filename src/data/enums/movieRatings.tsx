export const movieRatings = {
    G: 'G',
    PG: 'PG',
    PG13: 'PG-13',
    R: 'R',
    NC17: 'NC-17',
    X: 'X',
    UR: 'Unrated',
    NR: 'Not Rated'
};

export type MovieRatings = keyof typeof movieRatings;

export const gameRatings = {
    E: 'Everybody',
    E10: 'Everybody 10+',
    T: 'Teen',
    M17: 'Mature 17+',
    AO: 'Adults Only',
    RP: 'Rating Pending',
    RPLM: 'Rating Pending, Likely Mature'
};

export type VideoGameRatings = keyof typeof gameRatings;