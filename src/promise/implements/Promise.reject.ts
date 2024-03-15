import type { NormalizedCustomPromiseOptions } from "../factory";
import type { PromiseImplements } from "../implements";
import type { PromiseImplConstructor } from "../index";

export default function factory (options: NormalizedCustomPromiseOptions, impls: PromiseImplements) {
    /**
     * Promise.reject
     * 
     * @param { any } reason 
     * @returns { Promise }
     */
    return function reject (this: PromiseImplConstructor, reason?: any): Promise<any> {
        return new this((_, reject) => { reject(reason as any) });
    }
}