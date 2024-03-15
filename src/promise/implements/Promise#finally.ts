import { executePromiseValue } from "../../utils/execute";
import { getPromiseSpecies } from "../../utils/species";
import type PromiseImpl from "../index";
import type { NormalizedCustomPromiseOptions } from "../factory";
import type { PromiseImplements } from "../implements";

export default function factory (options: NormalizedCustomPromiseOptions, impls: PromiseImplements) {
    const { tick } = options;
    const staticImpls = impls.static;
    /**
     * Promise#finally
     * 
     * @param { Function } onfinally 
     * @returns { PromiseImpl }
     */
    return function finally_ <TResult = any> (this: PromiseImpl<TResult>, onfinally?: (() => any) | null | undefined): Promise<TResult> {
        if (typeof onfinally !== "function") return this.then();
        const { promise, resolve, reject } = staticImpls.withResolvers.call(getPromiseSpecies((this as any).constructor));
        {
            this._.callback((value: any) => {
                tick(() => {
                    executePromiseValue(void 0, onfinally, () => resolve(value), reject);
                });
            }, (reason: any) => {
                tick(() => {
                    executePromiseValue(void 0, onfinally, () => reject(reason), reject);
                });
            });
        }
        return promise as Promise<TResult>;
    }
}