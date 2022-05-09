import { useCallback, useState } from 'react';

export function useForceUpdate() {
    const [_, setRefresh] = useState(0);
    return useCallback(() => setRefresh((prev) => prev + 1), []);
}
