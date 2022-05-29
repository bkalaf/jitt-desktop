
export function handleDescriptor(outputName: string, desc: PropertyDescriptor) {
    const funcText = desc?.get?.toString();
    return () => eval(`${outputName}.value = (${funcText?.replace('get ', 'function ')}).bind(new FormData())()`);
}
