export function defineConstant (source: any, key: PropertyKey, value: any) {
    Object.defineProperty(source, key, { value, writable: false, enumerable: false, configurable: false });
}
export function defineConfigurable (source: any, key: PropertyKey, value: any) {
    Object.defineProperty(source, key, { value, writable: false, enumerable: false, configurable: true });
}
export function defineUnenumerable (source: any, key: PropertyKey, value: any) {
    Object.defineProperty(source, key, { value, writable: true, enumerable: false, configurable: true });
}