# promise-impl

The npm package developed provides a comprehensive implementation of all the functionalities of native Promises in JavaScript. This package offers support for asynchronous execution, error handling, and chaining of asynchronous operations, allowing developers to leverage the full capabilities of Promises in their projects. By integrating this package, users can enhance the efficiency and readability of their asynchronous code, leading to improved performance and maintainability of their applications.

提供了 JavaScript 中原生 Promises 所有功能的全面实现。 该包提供对异步执行、错误处理和异步操作链接的支持，允许开发人员在其项目中利用 Promise 的全部功能。 通过集成该包，用户可以提高异步代码的效率和可读性，从而提高应用程序的性能和可维护性。

## Example
### Basic usage
```typescript
import Promise from "@galadrielme/promise-impl";
/** Works exactly the same way as normal Promise usage */
/** 和正常的Promise使用方式完全一致 */
await Promise.allSettled([
    Promise.resolve(1).then(() => Promise.resolve(2)),
    Promise.reject(3).catch(() => 4).finally(() => 5),
    new Promise((resolve, reject) => { resolve(6) })
]);
```

### Advanced Usage
```typescript
/** Create a custom Promise implementation */
import { createCustomPromise } from "@galadrielme/promise-impl";
var ImmediatePromise = createCustomPromise({ tick: "immediate" });
var MicroTaskPromise = createCustomPromise({ tick: "micro" });
var MacroTaskPromise = createCustomPromise({ tick: "macro" });

var immediate = ImmediatePromise.resolve(1); // The callback is executed immediately // 回调立即执行
var micro = MicroTaskPromise.resolve(2); // The callback is executed in the microtask // 回调在微任务中执行
var macro = MacroTaskPromise.resolve(3); // The callback is executed in the macrotask // 回调在宏任务中执行

macro.then(console.log);
micro.then(console.log);
immediate.then(console.log);
console.log(4);
// 1 4 2 3

var CustomImplPromise = createCustomPromise({
    /** Custom implemented Promise */
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
    /** Hijack and re-customize the implementation */
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
     * Customize the triggering time of Promise callback
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
     * Custom Promise-based implementation (before generation)
     * 自定义基于Promise的实现(生成前)
     * 
     * @since 1.0.0
     * @type { PartialPromiseImplements }
     */
    implements: {} as PartialPromiseImplements;
    /**
     * Hijack the generated Implements and replace part of the implementation by yourself
     * 劫持生成后的Implements, 并可自行替换部分实现
     * 
     * @since 1.0.0
     * @type { Function }
     */
    hookImplements: (() => {}) as ((impls: PromiseImplements) => PartialPromiseImplements);
    /**
     * PromiseImpl created callback
     * PromiseImpl被创建事件回调
     * 
     * @since 1.0.0
     * @param { Function }
     */
    onCreated: (() => {}) as (instance: PromiseImpl<any>) => void;
    /**
     * Whether to simulate the unhandledrejection event
     * 是否模拟unhandledrejection事件
     * 
     * @since 1.0.0
     * @type { boolean }
     * @default false
     */
    mockUnhandledRejectionEvent: false as boolean;
    /**
     * Whether to simulate outputting exceptions on console.error
     * (This currently cannot simulate the Console behavior that is completely consistent with the browser, so use with caution!)
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

## Change log
### 2024-03-15 
@1.0.0
- Support for generating custom Promise implementations
- Support for customizing the timing of Promise callbacks (microtasks/macrotasks/synchronous).
- Support for simulating unhandledrejection events
- Support for simulating the behavior of printing an exception as error in the browser devtool > Console.

### 2024-04-07
#### @1.0.1
- English markdown

### 2024-04-08
#### @1.0.3
- Remove irrelevant information
#### @1.0.4
- Switch Ts target/module to ES6
#### @1.0.5
- Fix some bug (Promise.all)