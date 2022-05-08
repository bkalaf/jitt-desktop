import { SearchOp } from './SearchOp';

export function balanceState(state: [SearchOp, string, string][]) {
    const [[op, k, v], ...tail] = state.reverse();
    if (op === 'Append') return state;
    if (op === 'Delete') return state.filter(([a1, a2, a3]) => a2 !== k && a3 !== v);
    if (op === 'Clear') return state.filter(([a1, a2, a3]) => a2 !== k);
    if (op === 'Set') return state.filter(([a1, a2, a3]) => a2 !== k);
    return [];
}
