import { isFunction, isObjectLike } from "../utils/types";

/**
 * 断言Promise.withResolvers的this对象
 * 
 * @param { any } ctor
 * @throws { TypeError }
 */
export function assertWithResolvers (ctor: any) {
    if (!isObjectLike(ctor) && !isFunction(ctor)) {
        throw new TypeError("Promise.withResolvers called on non-object");
    }
}