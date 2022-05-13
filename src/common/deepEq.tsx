    export function deepEq(x1: any, x2: any): boolean {
        if (typeof x1 !== typeof x2) return false;
        if (typeof x1 === 'undefined') return true;
        if (x1 == null && x2 == null) return true;
        if (x1 == null) return false;
        if (Array.isArray(x1) && Array.isArray(x2)) {
            if (x1.length !== x2.length) return false;
            return x1.every((x, ix) => deepEq(x, x2[ix]));
        }
        if (typeof x1 === 'number' || typeof x1 === 'boolean' || typeof x1 === 
        'bigint' || typeof x1 === 'string' || typeof x1 === 'symbol') return x1 === x2;
        if (typeof x1 === 'function') return x1 === x2;
        if (typeof x1 === 'object' && typeof x2 === 'object') {
            if (!(Object.getOwnPropertyNames(x1).length === Object.getOwnPropertyNames(x2).length)) return false;
            return Object.getOwnPropertyNames(x1).every(x => deepEq(x1[x], x2[x]));
        }
        return x1 === x2;
    }

    console.log(deepEq(1, 1));
    console.log(deepEq(1,'1'));
    console.log(deepEq([1], [1,2]))
    console.log(deepEq([1,2], [1,2]))
    console.log(deepEq([1,{ a: 1 }], [1, { a: 2 }]))
    console.log(deepEq([1,{ a: 1 }], [1, { a: 1 }]))
    console.log(deepEq([1,{ a: 1, c: 2 }], [1, { a: 1, b: 3 }]))

