import PromiseStateLabel from "../../enum/PromiseStateLabel";
import type { PromiseImplConstructor } from "../index";
import type { NormalizedCustomPromiseOptions } from "../factory";
import type { PromiseImplements } from "../implements";

export default function factory (options: NormalizedCustomPromiseOptions, impls: PromiseImplements) {
    /**
     * Promise.all
     * 
     * @param { Iterable } values
     * @returns { PromiseImpl }
     */
    return function all (this: PromiseImplConstructor, values: any): Promise<any[]> {
        return impls.static.allSettled.call(this, values).then(results => {
            return results.map(result => {
                if (result.status === PromiseStateLabel.FULFILLED) {
                    return result.value;
                }
                throw result.reason;
            });
        });
    }
}