import PromiseKernel from "../../kernel";
import { assertPromiseExecutor } from "../../assert/assertPromiseExecutor";
import { defineConstant } from "../../utils/define";
import type PromiseImpl from "../index";

/**
 * Promise#constructor
 * 
 * @param { Function } executor 
 * @returns { PromiseImpl }
 */
export default function constructorImpl (this: PromiseImpl<any>, executor: (resolve: (value: any) => void, reject: (reason?: any) => void) => void | null | undefined) {
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