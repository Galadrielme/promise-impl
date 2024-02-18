import { isFunction } from "../utils/types";

/**
 * 校验是否执行
 * 
 * @param { boolean } resolve 
 * @param { boolean } reject 
 * @throws { TypeError }
 */
export function assertResolveAndRejectCallable (resolve: any, reject: any) {
    if (!isFunction(resolve) && !isFunction(reject)) {
        throw new TypeError(`Promise resolve or reject function is not callable`);
    }
}