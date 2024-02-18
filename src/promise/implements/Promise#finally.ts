import { executePromiseValue } from "../../utils/execute";
import { microTask } from "../../utils/microTask";
import withResolversImpl from "./Promise.withResolvers";
import type PromiseImpl from "../index";
import { getPromiseSpecies } from "../../utils/species";

/**
 * Promise#then
 * 
 * @param { Function } onfinally 
 * @returns { PromiseImpl }
 */
export default function finallyImpl <TResult = any> (this: PromiseImpl<TResult>, onfinally?: (() => any) | null | undefined): Promise<TResult> {
    if (typeof onfinally !== "function") return this.then();
    const { promise, resolve, reject } = withResolversImpl.call(getPromiseSpecies((this as any).constructor));
    {
        this._.callback((value: any) => {
            microTask(() => {
                executePromiseValue(void 0, onfinally, () => resolve(value), reject);
            });
        }, (reason: any) => {
            microTask(() => {
                executePromiseValue(void 0, onfinally, () => reject(reason), reject);
            });
        });
    }
    return promise as Promise<TResult>;
}