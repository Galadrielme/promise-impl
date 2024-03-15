import type PromiseImpl from "../index";
import type { NormalizedCustomPromiseOptions } from "../factory";
import type { PromiseImplements } from "../implements";

export default function factory (options: NormalizedCustomPromiseOptions, impls: PromiseImplements) {
    /**
     * Promise#catch
     * 
     * @param { Function } onrejected 
     * @returns { PromiseImpl }
     */
    return function catch_<TResult = never> (this: PromiseImpl<any>, onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null | undefined): Promise<any | TResult> {
        return this.then(void 0, onrejected);
    }
}