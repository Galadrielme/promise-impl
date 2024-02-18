import { executePromiseValue } from "../../utils/execute";
import { microTask } from "../../utils/microTask";
import withResolversImpl from "./Promise.withResolvers";
import type PromiseImpl from "../index";
import { getPromiseSpecies } from "../../utils/species";
import constructorImpl from './constructor';

/**
 * Promise#then
 * 
 * @param { Function } onfulfilled 
 * @param { Function } onrejected 
 * @returns { PromiseImpl }
 */
export default function thenImpl<TResult1 = any, TResult2 = never>(this: PromiseImpl<any>, onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): Promise<TResult1 | TResult2> {
    const { promise, resolve, reject } = withResolversImpl.call(getPromiseSpecies((this as any).constructor));
    {
        this._.callback((value: any) => {
            if (typeof onfulfilled === "function") {
            microTask(() => { 
                executePromiseValue(value, onfulfilled, resolve, reject);
            });
            } else { resolve(value); }
        }, (reason: any) => {
            if (typeof onrejected === "function") {
            microTask(() => {
                executePromiseValue(reason, onrejected, resolve, reject);
            })
            } else { reject(reason); }
        });
    }
    return promise as Promise<TResult1 | TResult2>;
}