export const weightUOMS = {
    oz: ['ounce', 'ounces', 16],
    lb: ['pound', 'pounds'],
    g: ['gram', 'grams', 1000],
    kg: ['kilogram', 'kilograms']
};
export type WeightUOMS = keyof typeof weightUOMS;