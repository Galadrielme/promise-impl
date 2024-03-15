import { assertResolveAndRejectCallable } from "../../assert/assertResolveAndRejectCallable";
import { assertWithResolvers } from "../../assert/assertWithResolvers";
import type { NormalizedCustomPromiseOptions } from "../factory";
import type { PromiseImplements } from "../implements";
import type { PromiseImplConstructor } from "../index";

export default function factory (options: NormalizedCustomPromiseOptions, impls: PromiseImplements) {
    /**
     * Promise#constructor
     * 
     * @returns { PromiseWithResolvers<T> }
     */
    return function withResolvers<T>(this: PromiseImplConstructor): PromiseWithResolvers<T> {
        {
            assertWithResolvers(this);
        }
    
        let invoked = false;
        let resolve!: PromiseWithResolvers<T>["resolve"];
        let reject!: PromiseWithResolvers<T>["reject"];
    
        const promise: any = new this((_resolve, _reject) => {
            if (invoked) {
                throw new TypeError(`Promise executor has already been invoked with non-undefined arguments`);
            }
            invoked = true;
            resolve = _resolve;
            reject = _reject;
        });
    
        {
            assertResolveAndRejectCallable(resolve, reject);
        }
    
        return {
            promise,
            resolve,
            reject
        }
    }
}

export interface PromiseWithResolvers<T> {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
}