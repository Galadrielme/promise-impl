import PromiseKernel from "../../kernel";
import { assertPromiseExecutor } from "../../assert/assertPromiseExecutor";
import { defineConstant } from "../../utils/define";
import type { NormalizedCustomPromiseOptions } from "../factory";
import type PromiseImpl from "../index";
import type { PromiseImplements } from "../implements";

export default function factory (options: NormalizedCustomPromiseOptions, impls: PromiseImplements) {
    /**
     * Promise#constructor
     * 
     * @param { Function } executor 
     */
    return function constructor (this: PromiseImpl<any>, executor: (resolve: (value: any) => void, reject: (reason?: any) => void) => void | null | undefined) {
        {
            assertPromiseExecutor(executor);
        }
      
        const kernel = new PromiseKernel();
        /** 定义核心私有属性 */
        defineConstant(this, "_", kernel);
    
        try {
            executor((value) => { kernel.resolve(value); }, reason => { kernel.reject(reason); });
        } catch (e) {
            kernel.reject(e);
        }
    }
}