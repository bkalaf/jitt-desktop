export const ages = {
    I: 'infant',
    T: 'toddler',
    K: 'kids',
    YA: 'young adult',
    A: 'adult'
};

export type Age = keyof typeof ages;