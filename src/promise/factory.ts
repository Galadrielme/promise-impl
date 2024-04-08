import { microTask } from "../utils/microTask";
import { isFunction, isObjectLike, isString } from "../utils/types";
import { defineConfigurable, defineUnenumerable } from "../utils/define";
import PromiseKernel from "../kernel";
import implementsFactory, { PartialPromiseImplements, PromiseImplements } from "./implements";
import PromiseImpl from ".";
import type { PromiseImplConstructor } from ".";
import PromiseStateLabel from "../enum/PromiseStateLabel";
import { formatPromiseState } from "../utils/state";
import { handledRejectionEvent } from "../utils/unhandledrejection";

/**
 * 创建自定义的Promise类
 */
export default function createCustomPromise (options: CustomPromiseOptions = {}): PromiseImplConstructor {
    /** 格式化入参 */
    const normalized = narmalizeOptions(options);
    /** 创建实现函数 */
    const impls = implementsFactory(normalized);

    return create (normalized, impls);
}

export function create (options: NormalizedCustomPromiseOptions, impls: PromiseImplements): PromiseImplConstructor {
    const { toStringTag, species, onCreated, mockUnhandledRejectionEvent, mockConsoleErrorRejection } = options;
    const protoImpls = impls.prototype;
    const staticImpls = impls.static;

    class PromiseImpl<T> {
        declare protected readonly _: PromiseKernel;
    
        constructor(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void) {
            impls.construct.call(this, executor);
            onCreated && onCreated(this as any, this._);
            /** @since 1.0.0 */
            if (mockUnhandledRejectionEvent || mockConsoleErrorRejection) {
                handledRejectionEvent.call(this as any, void 0, mockUnhandledRejectionEvent, mockConsoleErrorRejection);
            }
        }

        //#region #PromiseState / #PromiseResult
        /** 模拟Promise在Console下查看状态[[PromiseState]] */
        // get #PromiseState (): PromiseStateLabel {
        //     return formatPromiseState(this._.state);
        // }

        /** 模拟Promise在Console下查看值[[PromiseResult]] */
        // get #PromiseResult (): any {
        //     return this._.result;
        // }
        //#endregion
        
        //#region then / catch / finally
        then () { return protoImpls.then.apply(this, arguments); }
        catch () { return protoImpls.catch.apply(this, arguments); }
        finally () { return protoImpls.finally.apply(this, arguments); }
        //#endregion

        //#region [static] [Symbol.species]
        static get [Symbol.species] () { return species || this; }
        //#endregion

        //#region [static] resolve / reject / all / allSettled / race / withResolvers
        static resolve () { return staticImpls.resolve.apply(this, arguments); }
        static reject () { return staticImpls.reject.apply(this, arguments); }
        static all () { return staticImpls.all.apply(this, arguments); }
        static allSettled () { return staticImpls.allSettled.apply(this, arguments); }
        static race () { return staticImpls.race.apply(this, arguments); }
        static withResolvers () { return staticImpls.withResolvers.apply(this, arguments); }
        //#endregion
    }

    {
        defineConfigurable(PromiseImpl.prototype, Symbol.toStringTag, toStringTag);
    }
    return PromiseImpl as any;
}

/**
 * 格式化自定义的Promise类的选项
 * 
 * @param { CustomPromiseOptions } options 
 * @returns { NormalizedCustomPromiseOptions }
 */
function narmalizeOptions (options: CustomPromiseOptions): NormalizedCustomPromiseOptions {
    const {
        tick,
        toStringTag,
        implements: _implements,
        hookImplements,
        onCreated,
        mockUnhandledRejectionEvent,
        mockConsoleErrorRejection
    } = options;

    const normalizedTick: (callback: VoidFunction) => void = isFunction(tick) ? tick : (
        tick === "macro" ? 
            ((callback: VoidFunction) => { setTimeout(callback) }) : (
                tick === "immediate" ?
                    (callback: VoidFunction) => callback() :
                    microTask
            )
    );
    return {
        tick: normalizedTick,
        toStringTag: isString(toStringTag) ? toStringTag : "Promise",
        implements: isObjectLike(_implements) ? _implements : {},
        hookImplements: isFunction(hookImplements) ? hookImplements : void 0,
        onCreated: isFunction(onCreated) ? onCreated : void 0,
        mockUnhandledRejectionEvent: !!mockUnhandledRejectionEvent,
        mockConsoleErrorRejection: !!mockConsoleErrorRejection
    } as any
}

export interface NormalizedCustomPromiseOptions {
    tick: (callback: VoidFunction) => void;
    toStringTag: string;
    species: PromiseConstructor | void;
    implements: PartialPromiseImplements;
    hookImplements?: (impls: PromiseImplements) => PartialPromiseImplements;
    onCreated?: (instance: PromiseImpl<any>, kernel: PromiseKernel) => void;
    mockUnhandledRejectionEvent: boolean;
    mockConsoleErrorRejection: boolean;

}

export interface CustomPromiseOptions {
    /**
     * 自定义Promise回调的触发时机
     * 
     * @since 1.0.0
     * @enum { macro, micro }
     * @default "micro" - 默认优先微任务(和Promise保持一致)
     * @type { "macro" | "micro" | "immediate" | Function }
     */
    tick?: "macro" | "micro" | "immediate" | ((callback: VoidFunction) => void);
    /**
     * Symbol.toStringTag
     * 
     * @since 1.0.0
     * @type { string }
     * @default "Promise"
     */
    toStringTag?: string;
    /**
     * Symbol.species
     * 
     * @since 1.0.0
     * @type { PromiseConstructor }
     */
    species?: PromiseConstructor;
    /**
     * 自定义基于Promise的实现(生成前)
     * 
     * @since 1.0.0
     * @type { PartialPromiseImplements }
     */
    implements?: PartialPromiseImplements;
    /**
     * 劫持生成后的Implements, 并可自行替换部分实现
     * 
     * @since 1.0.0
     * @type { Function }
     */
    hookImplements?: ((impls: PromiseImplements) => PartialPromiseImplements);
    /**
     * PromiseImpl被创建事件
     * 
     * @since 1.0.0
     * @param { Function }
     */
    onCreated?: (instance: PromiseImpl<any>, kernel: PromiseKernel) => void;
    /**
     * 是否模拟unhandledrejection事件
     * 
     * @since 1.0.0
     * @type { boolean }
     * @default false
     */
    mockUnhandledRejectionEvent?: boolean;
    /**
     * 是否模拟在console.error上输出异常
     * (这个暂时无法模拟出和浏览器完全一致的Console行为, 慎用!)
     * 
     * @since 1.0.0
     * @type { boolean }
     * @default false
     */
    mockConsoleErrorRejection?: boolean;
}