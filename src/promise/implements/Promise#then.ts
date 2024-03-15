import { executePromiseValue } from "../../utils/execute";
import { getPromiseSpecies } from "../../utils/species";
import type PromiseImpl from "../index";
import type { NormalizedCustomPromiseOptions } from "../factory";
import type { PromiseImplements } from "../implements";

export default function factory (options: NormalizedCustomPromiseOptions, impls: PromiseImplements) {
    const { tick } = options;
    const staticImpls = impls.static;
    /**
     * Promise#then
     * 
     * @param { Function } onfulfilled 
     * @param { Function } onrejected 
     * @returns { PromiseImpl }
     */
    return function then<TResult1 = any, TResult2 = never>(this: PromiseImpl<any>, onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): Promise<TResult1 | TResult2> {
        const { promise, resolve, reject } = staticImpls.withResolvers.call(getPromiseSpecies((this as any).constructor));
        {
            this._.callback((value: any) => {
                if (typeof onfulfilled === "function") {
                tick(() => { 
                    executePromiseValue(value, onfulfilled, resolve, reject);
                });
                } else { resolve(value); }
            }, (reason: any) => {
                if (typeof onrejected === "function") {
                tick(() => {
                    executePromiseValue(reason, onrejected, resolve, reject);
                })
                } else { reject(reason); }
            });
        }
        return promise as Promise<TResult1 | TResult2>;
    }
}