import type { NormalizedCustomPromiseOptions } from "../factory";
import type { PromiseImplements } from "../implements";
import type { PromiseImplConstructor } from "../index";

export default function factory (options: NormalizedCustomPromiseOptions, impls: PromiseImplements) {
    /**
     * Promise.resolve
     * 
     * @param { any } value 
     * @returns { Promise }
     */
    return function resolve<T>(this: PromiseImplConstructor, value?: T | PromiseLike<T>): Promise<Awaited<T>> {
        return new this(resolve => { resolve(value as any) });
    }
}