import { awaitCallback, awaitRaceable, isRejectedResult } from "../../utils/await";
import PromiseStateLabel from "../../enum/PromiseStateLabel";
import { assertIterable } from "../../assert/assertIterable";
import type { PromiseImplConstructor } from "../index";
import type { NormalizedCustomPromiseOptions } from "../factory";
import type { PromiseImplements } from "../implements";
import { falsy } from "../../utils/execute"


export default function factory (options: NormalizedCustomPromiseOptions, impls: PromiseImplements) {
    /**
     * Promise.race
     * 
     * @param { Iterable } values
     * @returns { PromiseImpl }
     */
    return function race (this: PromiseImplConstructor, values: any): Promise<PromiseSettledResult<any>[]> {
        return new this((resolve, reject) => {
            awaitRaceable(values, (result) => {
                if (isRejectedResult(result)) {
                    reject(result.reason);
                } else {
                    resolve(result.value);
                }
                return true;
            });
        });
    }
}