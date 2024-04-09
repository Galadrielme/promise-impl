import type { PromiseImplConstructor } from "../index";
import type { NormalizedCustomPromiseOptions } from "../factory";
import type { PromiseImplements } from "../implements";
import { awaitRaceable, isRejectedResult } from "../../utils/await"

export default function factory (options: NormalizedCustomPromiseOptions, impls: PromiseImplements) {
    /**
     * Promise.all
     * 
     * @param { Iterable } values
     * @returns { PromiseImpl }
     */
    return function all (this: PromiseImplConstructor, values: any): Promise<any[]> {
        return new this((resolve, reject) => {
            /** 确定的数量 */
            let settled = 0;
            /** 已经确定的结果数组 */
            const settledResultaArray: PromiseSettledResult<any>[] = Array.isArray(values) ? new Array(values.length) : [];
            const valueArray = awaitRaceable(values, (result, index, valueArray) => {
                if (isRejectedResult(result)) {
                    reject(result.reason);
                    return true;
                }
                ++settled;
                settledResultaArray[index] = result.value;
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