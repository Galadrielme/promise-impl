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
export default function raceImpl (this: typeof PromiseImpl<any>, values: any): Promise<PromiseSettledResult<any>[]> {
    return new this((resolve, reject) => {
        {
            /** 先断言是否可迭代 */
            assertIterable(values);
        }

        /** 将可迭代对象转化为数组 */
        const valueArray = [...values];

        /** 快捷短路(始终是pending状态) */
        if (valueArray.length === 0) {
            return;
        }
        /** 确定的数量 */
        let settled = 0;
        /** 敲定 */
        const sellted = (result: PromiseSettledResult<any>, index: number) => {
            if (settled > 0) return;
            ++settled;
            if (result.status === PromiseStateLabel.FULFILLED) {
                resolve(result.value);
            } else {
                reject(result.reason);
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