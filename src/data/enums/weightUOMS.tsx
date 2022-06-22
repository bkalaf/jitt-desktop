export const weightUOMS = {
    oz: ['ounce', 'ounces', 16],
    lb: ['pound', 'pounds'],
    g: ['gram', 'grams', 1000],
    kg: ['kilogram', 'kilograms']
};

export const weightUOMSSelect: Record<string, string> = {
    oz: weightUOMS.oz[1].toString(),
    lb: weightUOMS.lb[1],
    g: weightUOMS.g[1].toString(),
    kg: weightUOMS.kg[1],
}
export type WeightUOMS = keyof typeof weightUOMS;