# promise-impl

手写实现Promise的功能
使用jest测试, 目标是与原生Promise的功能完全一致
使用esbuild编译

## 示例
### 基础使用
```typescript
import Promise from "@galadrielme/promise-impl";
/** 和正常的Promise使用方式完全一致 */
await Promise.allSettled([
    Promise.resolve(1).then(() => Promise.resolve(2)),
    Promise.reject(3).catch(() => 4).finally(() => 5),
    new Promise((resolve, reject) => { resolve(6) })
]);
```

### 创建自定义的Promise实现
```typescript
import { createCustomPromise } from "@galadrielme/promise-impl";
var ImmediatePromise = createCustomPromise({ tick: "immediate" });
var MicroTaskPromise = createCustomPromise({ tick: "micro" });
var MacroTaskPromise = createCustomPromise({ tick: "macro" });

var immediate = ImmediatePromise.resolve(1); // 回调立即执行
var micro = MicroTaskPromise.resolve(2); // 回调在微任务中执行
var macro = MacroTaskPromise.resolve(3); // 回调在宏任务中执行

macro.then(console.log);
micro.then(console.log);
immediate.then(console.log);
console.log(4);
// 1 4 2 3

var CustomImplPromise = createCustomPromise({
    /** 自定义实现的Promise */
    implements: {
        prototype: {
            then: function (onfulfilled, onrejected) { 
                console.log("custom then", this._.result, this._.state);
                if (this._.state === 1) return String(onfulfilled && onfulfilled(this._.result));
                if (this._.state === 2) return Number(onrejected && onrejected(this._.result));
            }
        },
        static: {
            all: function (promises: Promise<any>[]) { console.log("custom all", promises); return this.reject("custom reject"); }
        }
    },
    /** 劫持并重新自定义实现 */
    hookImplements: (impls) => {
        return {
            prototype: {
                catch: function (onrejected) { console.log("custom catch", this._.result); return impls.prototype.then.call(this, void 0, onrejected); }
            }
        }
    }
});
CustomImplPromise.all([
    CustomImplPromise.resolve(1),
    CustomImplPromise.reject(2).catch(),
]);
// custom catch 2
// custom then 2 2
// custom all (2) [Promise{}, NaN]

var PromiseImpl = createCustomPromise({
    /**
     * 自定义Promise回调的触发时机
     * 
     * @since 1.0.0
     * @enum { macro, micro }
     * @default "micro" - 默认优先微任务(和Promise保持一致)
     * @type { "macro" | "micro" | "immediate" | Function }
     */
    tick: "micro" as "macro" | "micro" | "immediate" | ((callback: VoidFunction) => void);
    /**
     * Symbol.toStringTag
     * 
     * @since 1.0.0
     * @type { string }
     * @default "Promise"
     */
    toStringTag: "Promise" as string;
    /**
     * Symbol.species
     * 
     * @since 1.0.0
     * @type { PromiseConstructor }
     */
    species: void 0 as PromiseConstructor | void;
    /**
     * 自定义基于Promise的实现(生成前)
     * 
     * @since 1.0.0
     * @type { PartialPromiseImplements }
     */
    implements: {} as PartialPromiseImplements;
    /**
     * 劫持生成后的Implements, 并可自行替换部分实现
     * 
     * @since 1.0.0
     * @type { Function }
     */
    hookImplements: (() => {}) as ((impls: PromiseImplements) => PartialPromiseImplements);
    /**
     * PromiseImpl被创建事件
     * 
     * @since 1.0.0
     * @param { Function }
     */
    onCreated: (() => {}) as (instance: PromiseImpl<any>) => void;
    /**
     * 是否模拟unhandledrejection事件
     * 
     * @since 1.0.0
     * @type { boolean }
     * @default false
     */
    mockUnhandledRejectionEvent: false as boolean;
    /**
     * 是否模拟在console.error上输出异常
     * (这个暂时无法模拟出和浏览器完全一致的Console行为, 慎用!)
     * 
     * @since 1.0.0
     * @type { boolean }
     * @default false
     */
    mockConsoleErrorRejection: false as boolean;
});
```

## 更新日志
### 2024-03-15 
@1.0.0
- 支持生成自定义的Promise实现
- 支持自定义Promise的回调时机(微任务/宏任务/同步)
- 支持模拟unhandledrejection事件
- 支持模拟浏览器 devtool > Console 中将异常打印为error的行为