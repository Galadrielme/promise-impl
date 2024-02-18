import { isIterable } from "../utils/types";

/**
 * 校验 new Promise 入参
 * 
 * @param { any } iterable 
 * @throws { TypeError } 
 */
export function assertIterable (iterable: any)  {
    if (isIterable(iterable)) return;
    throw new TypeError(`${ getWrongIterableType(iterable) } is not iterable (cannot read property Symbol(Symbol.iterator))`);
}
  
/**
 * 获取错误的执行器类型输出
 * 
 * @param { any } iterable
 * @returns { string }
 */
export function getWrongIterableType (iterable: any): string {
    if (iterable === null) return "object null";
    const type = typeof iterable;
    if (type === "number" || type === "boolean") {
        return `${ type } ${ String(iterable) }`;
    }
    return type
}

/** 一些需要显示为 `#<${ type }>` 的类型枚举 */
export const NATIVE_TYPES = new Set([
    "Object",
    "Map",
    "Set",
    "Blob",
    "ArrayBuffer",
    "Promise"
]);