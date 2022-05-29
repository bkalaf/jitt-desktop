export const activityScopes = {
    brands: 'brands',
    categories: 'categories',
    taxonomy: 'taxonomy',
    restore: 'restore'
};

export type ActivityScopes = keyof typeof activityScopes;
