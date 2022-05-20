export interface LinkingObject<T> extends Array<T> {
    length: 1;
    0: T;
}
export interface EmptyLink<T> extends Array<T> {
    length: 0;
}
export type LinkedObject<T> = LinkingObject<T> | EmptyLink<T>;
export type LinkingObjects<T> = Array<T>;
