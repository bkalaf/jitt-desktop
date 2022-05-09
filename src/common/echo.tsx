// const insertColumns = dal.columns.filter((x) => !linkingObjectsOnType(collection).includes(x));

export function echo(x: any) {
    console.log('echo', x);
    return x;
}
