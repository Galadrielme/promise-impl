export function isFunction (o: any): o is Function {
    return typeof o === "function";
}

export function isObjectLike (o: any): o is PromiseLike<any> {
    return typeof o === "object" && o !== null;
}

export function isPromiseLike (o: any): o is PromiseLike<any> {
    return o ? isFunction(o.then) : false;
}

export function isNative (o: any): boolean {
    return isFunction(o) && /native code/.test(o.toString());
}

export function isIterable (o: any): boolean {
    return !!(o && isFunction(o[Symbol.iterator]));
}

  
/**
 * 获取错误的执行器类型输出
 * 
 * @param { any } executor 
 * @param { string } type
 */
export function getWrongType (executor: any, type: string) {
    if (type === "object") {
        if (executor === null) return "null";
        const type = Object.prototype.toString.call(executor);
        const tag = type.slice(8, -1);
        if (NATIVE_TYPES.has(tag) && isNative(executor.constructor)) {
            return `#<${ tag }>`;
        }
        return type
    }
    return String(executor);
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