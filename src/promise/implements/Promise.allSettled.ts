import { awaitCallback } from "../../utils/await";
import PromiseStateLabel from "../../enum/PromiseStateLabel";
import { assertIterable } from "../../assert/assertIterable";
import type { PromiseImplConstructor } from "../index";
import type { NormalizedCustomPromiseOptions } from "../factory";
import type { PromiseImplements } from "../implements";

export default function factory (options: NormalizedCustomPromiseOptions, impls: PromiseImplements) {
    /**
     * Promise#then
     * 
     * @param { Iterable } values
     * @returns { PromiseImpl }
     */
    return function allSettled (this: PromiseImplConstructor, values: any): Promise<PromiseSettledResult<any>[]> {
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
}