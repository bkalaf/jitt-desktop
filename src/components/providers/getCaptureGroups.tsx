
export function getCaptureGroups(regex: RegExp, beginCapture: number, endCapture: number) {
    return function (value: string) {
        return regex.exec(value)?.slice(beginCapture, endCapture) ?? [];
    };
}
