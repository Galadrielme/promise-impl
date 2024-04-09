const objectToString = Object.prototype.toString;

export function isFunction (o: any): o is Function {
    return typeof o === "function";
}

export function isObjectLike (o: any): o is Record<PropertyKey, any> {
    return typeof o === "object" && o !== null;
}

export function isString (o: any): o is string {
    return typeof o === "string";
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
 * 获取对象的类型输出
 * 
 * @param { any } target 
 * @param { string } type
 */
export function getTypeDisplay (target: any, type: string) {
    if (type === "object") {
        if (target === null) return "null";
        const type = Object.prototype.toString.call(target);
        /** 存在自定义的toString */
        if (target.toString === objectToString) {
            const tag = type.slice(8, -1);
            return `#<${ tag }>`;
        }
        return type;
    }
    return String(target);
}