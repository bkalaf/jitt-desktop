
export const activityActions = {
    import: 'import',
    scrape: 'scrape',
    'back-up': 'back-up-and-restore'
};
export type ActivityActions = keyof typeof activityActions;