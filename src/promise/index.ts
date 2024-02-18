import { formatPromiseState } from "../utils/state";
import PromiseStateLabel from "../enum/PromiseStateLabel";
import PromiseKernel from "../kernel";
import { defineConfigurable, defineUnenumerable } from "../utils/define";
import impl from "./implements";

export default class PromiseImpl<T> implements Promise<T> {
    protected readonly _!: PromiseKernel;
  
    constructor(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void) {
        impl.constructor.call(this, executor);
    }

    declare readonly [Symbol.toStringTag]: string;

    //#region #PromiseState / #PromiseResult
    /** 模拟Promise在Console下查看状态[[PromiseState]] */
    get #PromiseState (): PromiseStateLabel {
        return formatPromiseState(this._.state);
    }

    /** 模拟Promise在Console下查看值[[PromiseResult]] */
    get #PromiseResult (): any {
        return this._.result;
    }
    //#endregion

    //#region [lib.es5.d.ts] then / catch
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    declare then: <TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined) => Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    declare catch: <TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null | undefined) => Promise<T | TResult>;
    //#endregion

    //#region [lib.es2018.promise.d.ts] finally
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    declare finally: (onfinally?: (() => void) | null | undefined) => Promise<T>;
    //#endregion
  
    static get [Symbol.species] () { return this; }

    //#region [lib.es2015.promise.d.ts] static reject
    /**
     * Creates a new rejected promise for the provided reason.
     * @param reason The reason the promise was rejected.
     * @returns A new rejected Promise.
     */
    static reject<T = never>(reason?: any): Promise<T> {
        throw new Error("Method not implemented.");
    }
    //#endregion
  
    //#region [lib.es2015.promise.d.ts] static resolve
    /**
     * Creates a new resolved promise.
     * @returns A resolved promise.
     */
    static resolve(): Promise<void>;
    /**
     * Creates a new resolved promise for the provided value.
     * @param value A promise.
     * @returns A promise whose internal state matches the provided promise.
     */
    static resolve<T>(value: T): Promise<Awaited<T>>;
    /**
     * Creates a new resolved promise for the provided value.
     * @param value A promise.
     * @returns A promise whose internal state matches the provided promise.
     */
    static resolve<T>(value?: T | PromiseLike<T>): Promise<Awaited<T>> {
        throw new Error("Method not implemented.");
    }
    //#endregion
  
    //#region [lib.es2015.promise.d.ts / lib.es2018.iterable.d.ts] static all
    /**
     * Creates a Promise that is resolved with an array of results when all of the provided Promises
     * resolve, or rejected when any Promise is rejected.
     * @param values An array of Promises.
     * @returns A new Promise.
     */
    static all<T extends readonly unknown[] | []>(values: T): Promise<{ -readonly [P in keyof T]: Awaited<T[P]>; }> {
      throw new Error("Method not implemented.");
    }
    //#endregion
  
    //#region [lib.es2015.promise.d.ts / lib.es2018.iterable.d.ts] static race
    /**
     * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
     * or rejected.
     * @param values An array of Promises.
     * @returns A new Promise.
     */
    static race<T extends readonly unknown[] | []>(values: T): Promise<Awaited<T[number]>> {
        throw new Error("Method not implemented.");
    }
    //#endregion

    //#region [lib.es2020.promise.d.ts] static allSettled
    /**
     * Creates a Promise that is resolved with an array of results when all
     * of the provided Promises resolve or reject.
     * @param values An array of Promises.
     * @returns A new Promise.
     */
    allSettled<T extends readonly unknown[] | []>(values: T): Promise<{ -readonly [P in keyof T]: PromiseSettledResult<Awaited<T[P]>>; }>;

    /**
     * Creates a Promise that is resolved with an array of results when all
     * of the provided Promises resolve or reject.
     * @param values An array of Promises.
     * @returns A new Promise.
     */
    allSettled<T>(values: Iterable<T | PromiseLike<T>>): Promise<PromiseSettledResult<Awaited<T>>[]>;

    /**
     * Creates a Promise that is resolved with an array of results when all
     * of the provided Promises resolve or reject.
     * @param values An array of Promises.
     * @returns A new Promise.
     */
    allSettled(values: any): Promise<PromiseSettledResult<any>[]> {
        throw new Error("Method not implemented.");
    }
    //#endregion
  
    //#region [lib.es2021.promise.d.ts] static any
    /**
     * The any function returns a promise that is fulfilled by the first given promise to be fulfilled, or rejected with an AggregateError containing an array of rejection reasons if all of the given promises are rejected. It resolves all elements of the passed iterable to promises as it runs this algorithm.
     * @param values An array or iterable of Promises.
     * @returns A new Promise.
     */
    any<T extends readonly unknown[] | []>(values: T): Promise<Awaited<T[number]>>;

    /**
     * The any function returns a promise that is fulfilled by the first given promise to be fulfilled, or rejected with an AggregateError containing an array of rejection reasons if all of the given promises are rejected. It resolves all elements of the passed iterable to promises as it runs this algorithm.
     * @param values An array or iterable of Promises.
     * @returns A new Promise.
     */
    any(values: any): Promise<Awaited<T>>;

    /**
     * The any function returns a promise that is fulfilled by the first given promise to be fulfilled, or rejected with an AggregateError containing an array of rejection reasons if all of the given promises are rejected. It resolves all elements of the passed iterable to promises as it runs this algorithm.
     * @param values An array or iterable of Promises.
     * @returns A new Promise.
     */
    any<T>(values?: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    //#endregion

    //#region [lib.esnext.promise.d.ts] static withResolvers
    /**
     * Creates a new Promise and returns it in an object, along with its resolve and reject functions.
     * @returns An object with the properties `promise`, `resolve`, and `reject`.
     *
     * ```ts
     * const { promise, resolve, reject } = Promise.withResolvers<T>();
     * ```
     */
    withResolvers<T>(): PromiseWithResolvers<T> {
        throw new Error("Method not implemented.");
    }
    //#endregion
}

{
    defineConfigurable(PromiseImpl.prototype, Symbol.toStringTag, "Promise");
    defineUnenumerable(PromiseImpl.prototype, "then", impl.then);
    defineUnenumerable(PromiseImpl.prototype, "catch", impl.catch);
    defineUnenumerable(PromiseImpl.prototype, "finally", impl.finally);
    defineUnenumerable(PromiseImpl, "resolve", impl.resolve);
    defineUnenumerable(PromiseImpl, "reject", impl.reject);
    defineUnenumerable(PromiseImpl, "all", impl.all);
    defineUnenumerable(PromiseImpl, "allSettled", impl.allSettled);
    defineUnenumerable(PromiseImpl, "race", impl.race);
    defineUnenumerable(PromiseImpl, "withResolvers", impl.withResolvers);
}