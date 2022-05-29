export class UninitializedContextError extends Error {
    constructor(contextName?: string) {
        super(`Context [${contextName}] was not properly initalized: is null/undefined.`);
    }
}
