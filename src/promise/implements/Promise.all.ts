import type PromiseImpl from "../index";
import PromiseStateLabel from "../../enum/PromiseStateLabel";
import allSettledImpl from "./Promise.allSettled";

/**
 * Promise#then
 * 
 * @param { Iterable } value
 * @returns { PromiseImpl }
 */
export default function allImpl (this: typeof PromiseImpl<any>, values: any): Promise<any[]> {
    return allSettledImpl.call(this, values).then(results => {
        return results.map(result => {
            if (result.status === PromiseStateLabel.FULFILLED) {
                return result.value;
            }
            throw result.reason;
        });
    });
}