import { awaitCallback } from "./await";

/**
 * 执行
 * 
 * @param { any } value 
 * @param { Function } execute 
 * @param { Function } onfulfilled 
 * @param { Function } onrejected 
 */
export function executePromiseValue (value: any, execute: (value: any) => any, onfulfilled: (value: any) => void, onrejected: (reason: any) => void) {
    try {
      const result = execute(value);
      awaitCallback(result, onfulfilled, onrejected);
    } catch (e) {
      onrejected(e);
    }
  }