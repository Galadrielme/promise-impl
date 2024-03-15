import constructorFactory from './implements/constructor';
import thenFactory from "./implements/Promise#then";
import catchFactory from "./implements/Promise#catch";
import finallyFactory from "./implements/Promise#finally";
import resolveFactory from "./implements/Promise.resolve";
import rejectFactory from "./implements/Promise.reject";
import allFactory from "./implements/Promise.all";
import allSettledFactory from "./implements/Promise.allSettled";
import raceFactory from "./implements/Promise.race";
import withResolversFactory, { PromiseWithResolvers } from "./implements/Promise.withResolvers";
import type PromiseImpl from ".";
import type { PromiseImplConstructor } from ".";
import { NormalizedCustomPromiseOptions } from "./factory";
import { isFunction, isObjectLike } from '../utils/types';
import { defineConstant } from '../utils/define';

export const PROMISE_PROTOTYPE_METHODS = Object.freeze(["then", "catch", "finally"]);
export const PROMISE_STATIC_METHODS = Object.freeze(["resolve", "reject", "all", "allSettled", "race", "withResolvers"]);

/**
 * 动态创建实现
 * 
 * @param { NormalizedCustomPromiseOptions } options 
 * @returns { PromiseImplements }
 */
export default function factory (options: NormalizedCustomPromiseOptions): PromiseImplements {
    const protoImpls: PromiseImplements["prototype"] = Object.create(null);
    const staticImpls: PromiseImplements["static"] = Object.create(null);
    const impls: PromiseImplements = Object.create(null);
    defineConstant(impls, "prototype", protoImpls);
    defineConstant(impls, "static", staticImpls);

    if (options.implements) {
        mergeImplements(impls, options.implements);
    }
    {
        impls.construct ??= constructorFactory(options, impls);
        protoImpls.then ??= thenFactory(options, impls);
        protoImpls.catch ??= catchFactory(options, impls);
        protoImpls.finally ??= finallyFactory(options, impls);
        staticImpls.all ??= allFactory(options, impls);
        staticImpls.allSettled ??= allSettledFactory(options, impls);
        staticImpls.race ??= raceFactory(options, impls);
        staticImpls.reject ??= rejectFactory(options, impls);
        staticImpls.resolve ??= resolveFactory(options, impls);
        staticImpls.withResolvers ??= withResolversFactory(options, impls);
    }
    if (isFunction(options.hookImplements)) {
        const patch = options.hookImplements(impls);
        patch && mergeImplements(impls, patch);
    }

    return impls;
}

/**
 * 合并实现
 * 
 * @param { PromiseImplements } impls 
 * @param { PartialPromiseImplements } patch 
 */
export function mergeImplements (impls: PromiseImplements, patch: PartialPromiseImplements) {
    if (!isObjectLike(patch)) return;
    if (isFunction(patch.construct)) {
        impls.construct = patch.construct;
    }
    if (isObjectLike(patch.prototype)) {
        const _ = patch.prototype;
        PROMISE_PROTOTYPE_METHODS.forEach(method => {
            if (isFunction(_[method])) {
                impls.prototype[method] = _[method];
            }
        });
    }
    if (isObjectLike(patch.static)) {
        const _ = patch.static;
        PROMISE_STATIC_METHODS.forEach(method => {
            if (isFunction(_[method])) {
                impls.static[method] = _[method];
            }
        });
    }
}

export interface PromiseImplements {
    /**
     * Promise#constructor
     * 
     * @param { Function } executor 
     */
    construct (this: PromiseImpl<any>, executor: (resolve: (value: any) => void, reject: (reason?: any) => void) => void | null | undefined): void;
    /**
     * 自定义的原型
     */
    prototype: {
        /**
         * Promise#catch
         * 
         * @param { Function } onrejected 
         * @returns { PromiseImpl }
         */
        catch <TResult = never> (this: PromiseImpl<any>, onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null | undefined): Promise<any | TResult>;
        /**
         * Promise#then
         * 
         * @param { Function } onfinally 
         * @returns { PromiseImpl }
         */
        finally <TResult = any> (this: PromiseImpl<TResult>, onfinally?: (() => any) | null | undefined): Promise<TResult>;
        /**
         * Promise#then
         * 
         * @param { Function } onfulfilled 
         * @param { Function } onrejected 
         * @returns { PromiseImpl }
         */
        then <TResult1 = any, TResult2 = never>(this: PromiseImpl<any>, onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): Promise<TResult1 | TResult2>;
    }
    /**
     * 自定义的静态函数
     */
    static: {
        /**
         * Promise.all
         * 
         * @param { Iterable } values
         * @returns { PromiseImpl }
         */
        all (this: PromiseImplConstructor, values: any): Promise<any[]>;
        /**
         * Promise.allSettled
         * 
         * @param { Iterable } values
         * @returns { PromiseImpl }
         */
        allSettled (this: PromiseImplConstructor, values: any): Promise<PromiseSettledResult<any>[]>;
        /**
         * Promise.race
         * 
         * @param { Iterable } values
         * @returns { PromiseImpl }
         */
        race (this: PromiseImplConstructor, values: any): Promise<PromiseSettledResult<any>[]>;
        /**
         * Promise.reject
         * 
         * @param { any } reason 
         * @returns { Promise }
         */
        reject (this: PromiseImplConstructor, reason?: any): Promise<any>;
        /**
         * Promise.resolve
         * 
         * @param { any } value 
         * @returns { Promise }
         */
        resolve<T> (this: PromiseImplConstructor, value?: T | PromiseLike<T>): Promise<Awaited<T>>;
        /**
         * Promise.withResolvers
         * 
         * @returns { PromiseWithResolvers<T> }
         */
        withResolvers<T>(this: PromiseImplConstructor): PromiseWithResolvers<T>;
    }
}

export interface PartialPromiseImplements {
    construct?: PromiseImplements["construct"] | void;
    prototype?: Partial<PromiseImplements["prototype"]> | void;
    static?: Partial<PromiseImplements["static"]> | void;
}