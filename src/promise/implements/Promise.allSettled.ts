import { awaitCallback, awaitRaceable } from "../../utils/await";
import PromiseStateLabel from "../../enum/PromiseStateLabel";
import { assertIterable } from "../../assert/assertIterable";
import type { PromiseImplConstructor } from "../index";
import type { NormalizedCustomPromiseOptions } from "../factory";
import type { PromiseImplements } from "../implements";
import { truly } from "../../utils/execute"

export default function factory (options: NormalizedCustomPromiseOptions, impls: PromiseImplements) {
    /**
     * Promise.allSettled
     * 
     * @param { Iterable } values
     * @returns { PromiseImpl }
     */
    return function allSettled (this: PromiseImplConstructor, values: any): Promise<PromiseSettledResult<any>[]> {
        return new this((resolve) => {
            /** 确定的数量 */
            let settled = 0;
            /** 已经确定的结果数组 */
            const settledResultaArray: PromiseSettledResult<any>[] = Array.isArray(values) ? new Array(values.length) : [];
            const valueArray = awaitRaceable(values, (result, index, valueArray) => {
                ++settled;
                settledResultaArray[index] = result;
                if (settled === valueArray.length) {
                    resolve(settledResultaArray);
                    return true;
                }
                return false;
            });
            if (valueArray.length === 0) {
                resolve([]);
            }
        });
    }
}