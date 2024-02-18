import type PromiseImpl from "../index";
import { awaitCallback } from "../../utils/await";
import PromiseStateLabel from "../../enum/PromiseStateLabel";
import { assertIterable } from "../../assert/assertIterable";

/**
 * Promise#then
 * 
 * @param { Iterable } values
 * @returns { PromiseImpl }
 */
export default function allSettledImpl (this: typeof PromiseImpl<any>, values: any): Promise<PromiseSettledResult<any>[]> {
    return new this((resolve) => {
        {
            /** 先断言是否可迭代 */
            assertIterable(values);
        }

        /** 将可迭代对象转化为数组 */
        const valueArray = [...values];

        /** 快捷短路 */
        if (valueArray.length === 0) {
            resolve([]);
            return;
        }
        /** 确定的数量 */
        let settled = 0;
        /** 已经确定的结果数组 */
        const settledResultaArray: PromiseSettledResult<any>[] = new Array(valueArray.length);
        /** 敲定 */
        const sellted = (result: PromiseSettledResult<any>, index: number) => {
            ++settled;
            settledResultaArray[index] = result;
            if (settled === settledResultaArray.length) {
                resolve(settledResultaArray);
            }
        }
        valueArray.forEach((value, index) => {
            awaitCallback(value, (value: any) => {
                sellted({ status: PromiseStateLabel.FULFILLED, value }, index);
            }, (reason: any) => {
                sellted({ status: PromiseStateLabel.REJECTED, reason }, index);
            });
        });
    });
}