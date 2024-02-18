import { getWrongType } from "../utils/types";

/**
 * 校验 new Promise 入参
 * 
 * @param { any } executor 
 * @throws { TypeError } 
 */
export function assertPromiseExecutor (executor: any)  {
    const type = typeof executor;
    if (type === "function") return;
    throw new TypeError(`Promise resolver ${ getWrongType(executor, type) } is not a function`);
}