import { bail } from "./bail";
import { isPromiseLike } from "./types";

/**
 * 处理异步回调
 * 
 * @param { any } value 
 * @param { Function } onfulfilled 
 * @param { Function } onrejected 
 */
export function awaitCallback (value: any, onfulfilled: (value: any) => void, onrejected: (reason: any) => void) {
    if (isPromiseLike(value)) {
      const bailed = bail((value) => { awaitCallback(value, onfulfilled, onrejected); }, onrejected);
      try {
        value.then(bailed.onfulfilled, bailed.onrejected);
      } catch (e) {
        bailed.onrejected(e);
      }
    } else {
      onfulfilled(value);
    }
}