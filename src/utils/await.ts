import { assertIterable } from "../assert/assertIterable"
import PromiseStateLabel from "../enum/PromiseStateLabel"
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



/**
 * 可竞速的执行所有Promise
 * 
 * @param { Iterable } values
 * @param { Function } predicate - 每一次settled之后的校验如果返回true则终止
 */
export function awaitRaceable (
    values: any,
    predicate: (result: PromiseSettledResult<any>, index: number, array: any[]) => boolean
): any[] {
    {
        /** 先断言是否可迭代 */
        assertIterable(values);
    }

    /** 将可迭代对象转化为数组 */
    const valueArray = [...values];

    /** 快捷短路 */
    if (valueArray.length > 0) {
        /** 是否终止 */
        let abort = false;
        /** 敲定 */
        const settled = (result: PromiseSettledResult<any>, index: number) => {
            if (abort) return;
            /** 判断是否要返回 */
            if (predicate(result, index, valueArray) === true) {
                abort = true;
            }
        }
        valueArray.forEach((value, index) => {
            awaitCallback(value, (value: any) => {
                settled({ status: PromiseStateLabel.FULFILLED, value }, index);
            }, (reason: any) => {
                settled({ status: PromiseStateLabel.REJECTED, reason }, index);
            });
        });
    }
    return valueArray;
}

/**
 * 判断是不是被拒绝了
 * 
 * @param { PromiseSettledResult } result 
 * @returns { boolean }
 */
export function isRejectedResult (result: PromiseSettledResult<any>): result is PromiseRejectedResult {
    return result.status === PromiseStateLabel.REJECTED;
}