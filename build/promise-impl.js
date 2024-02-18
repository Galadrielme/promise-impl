"use strict";
var PromiseImpl = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // main.ts
  var main_exports = {};
  __export(main_exports, {
    PromiseKernel: () => kernel_default,
    default: () => main_default
  });

  // src/enum/PromiseState.ts
  var PromiseState = /* @__PURE__ */ ((PromiseState2) => {
    PromiseState2[PromiseState2["PENDING"] = 0] = "PENDING";
    PromiseState2[PromiseState2["FULFILLED"] = 1] = "FULFILLED";
    PromiseState2[PromiseState2["REJECTED"] = 2] = "REJECTED";
    return PromiseState2;
  })(PromiseState || {});
  var PromiseState_default = PromiseState;

  // src/enum/PromiseStateLabel.ts
  var PromiseStateLabel = /* @__PURE__ */ ((PromiseStateLabel2) => {
    PromiseStateLabel2["PENDING"] = "pending";
    PromiseStateLabel2["FULFILLED"] = "fulfilled";
    PromiseStateLabel2["REJECTED"] = "rejected";
    return PromiseStateLabel2;
  })(PromiseStateLabel || {});
  var PromiseStateLabel_default = PromiseStateLabel;

  // src/utils/state.ts
  function formatPromiseState(state) {
    switch (state) {
      case PromiseState_default.PENDING:
        return PromiseStateLabel_default.PENDING;
      case PromiseState_default.FULFILLED:
        return PromiseStateLabel_default.FULFILLED;
      case PromiseState_default.REJECTED:
        return PromiseStateLabel_default.REJECTED;
      default:
        throw `Unexpected PromiseState with ${state}`;
    }
  }

  // src/utils/define.ts
  function defineConstant(source, key, value) {
    Object.defineProperty(source, key, { value, writable: false, enumerable: false, configurable: false });
  }
  function defineConfigurable(source, key, value) {
    Object.defineProperty(source, key, { value, writable: false, enumerable: false, configurable: true });
  }
  function defineUnenumerable(source, key, value) {
    Object.defineProperty(source, key, { value, writable: true, enumerable: false, configurable: true });
  }

  // src/utils/types.ts
  function isFunction(o) {
    return typeof o === "function";
  }
  function isObjectLike(o) {
    return typeof o === "object" && o !== null;
  }
  function isPromiseLike(o) {
    return o ? isFunction(o.then) : false;
  }
  function isNative(o) {
    return isFunction(o) && /native code/.test(o.toString());
  }
  function isIterable(o) {
    return !!(o && isFunction(o[Symbol.iterator]));
  }
  function getWrongType(executor, type) {
    if (type === "object") {
      if (executor === null)
        return "null";
      const type2 = Object.prototype.toString.call(executor);
      const tag = type2.slice(8, -1);
      if (NATIVE_TYPES.has(tag) && isNative(executor.constructor)) {
        return `#<${tag}>`;
      }
      return type2;
    }
    return String(executor);
  }
  var NATIVE_TYPES = /* @__PURE__ */ new Set([
    "Object",
    "Map",
    "Set",
    "Blob",
    "ArrayBuffer",
    "Promise"
  ]);

  // src/utils/bail.ts
  function bail(onfulfilled, onrejected) {
    const bailed = {
      invoked: false,
      onfulfilled: (value) => {
        !bailed.invoked && (bailed.invoked = true, onfulfilled(value));
      },
      onrejected: (reason) => {
        !bailed.invoked && (bailed.invoked = true, onrejected(reason));
      }
    };
    return bailed;
  }

  // src/kernel/utils.ts
  function _resolve(kernel, value) {
    if (isPromiseLike(value)) {
      _asyncFulfilled(kernel, value);
    } else {
      _fulfilled(kernel, value);
    }
  }
  function _asyncFulfilled(kernel, value) {
    const bailed = bail((value2) => {
      _resolve(kernel, value2);
    }, (reason) => {
      _rejected(kernel, reason);
    });
    try {
      value.then(bailed.onfulfilled, bailed.onrejected);
    } catch (error) {
      bailed.onrejected(error);
    }
  }
  function _fulfilled(kernel, value) {
    kernel.state = PromiseState_default.FULFILLED;
    kernel.result = value;
    _emitFinally(kernel);
  }
  function _rejected(kernel, reason) {
    kernel.state = PromiseState_default.REJECTED;
    kernel.result = reason;
    _emitFinally(kernel);
  }
  function _callback(kernel, onfulfilled, onrejected) {
    _onFinally(kernel, () => {
      if (kernel.state === PromiseState_default.FULFILLED) {
        onfulfilled(kernel.result);
      } else if (kernel.state === PromiseState_default.REJECTED) {
        onrejected(kernel.result);
      }
    });
  }
  function _onFinally(kernel, callback) {
    if (kernel.state === PromiseState_default.PENDING) {
      (kernel.callbacks || (kernel.callbacks = [])).push(callback);
    } else {
      callback(kernel);
    }
  }
  function _emitFinally(kernel) {
    if (kernel.callbacks) {
      [...kernel.callbacks].forEach((callback) => callback(kernel));
      kernel.callbacks.length = 0;
      kernel.callbacks = void 0;
    }
  }

  // src/kernel/index.ts
  var PromiseKernel = class {
    /** 内部状态位 */
    state;
    /** 处理后的值 */
    result;
    /** 是否调用过 */
    invoked;
    /** 回调 */
    callbacks;
    constructor() {
      this.state = PromiseState_default.PENDING;
      this.result = void 0;
      this.callbacks = void 0;
      this.invoked = false;
    }
    //#region settled
    /**
     * 是否确定下来了
     */
    get settled() {
      return this.state === PromiseState_default.FULFILLED || this.state === PromiseState_default.REJECTED;
    }
    //#endregion
    //#region resolve / reject
    /**
     * 接收结果
     * 
     * @param { any } value
     */
    resolve(value) {
      if (this.invoked)
        return;
      this.invoked = true;
      _resolve(this, value);
    }
    /**
     * 拒绝
     * 
     * @param { any } reason
     */
    reject(reason) {
      if (this.state !== PromiseState_default.PENDING)
        return;
      this.invoked = true;
      _rejected(this, reason);
    }
    //#endregion
    //#region callback
    /**
     * 执行回调
     * 
     * @param { Function } fulfilled 
     * @param { Function } rejected 
     */
    callback(fulfilled, rejected) {
      _callback(this, fulfilled, rejected);
    }
    //#endregion
  };
  var kernel_default = PromiseKernel;

  // src/assert/assertPromiseExecutor.ts
  function assertPromiseExecutor(executor) {
    const type = typeof executor;
    if (type === "function")
      return;
    throw new TypeError(`Promise resolver ${getWrongType(executor, type)} is not a function`);
  }

  // src/promise/implements/constructor.ts
  function constructorImpl(executor) {
    {
      assertPromiseExecutor(executor);
    }
    const kernel = new kernel_default();
    defineConstant(this, "_", kernel);
    try {
      executor((value) => {
        kernel.resolve(value);
      }, (reason) => {
        kernel.reject(reason);
      });
    } catch (e) {
      kernel.reject(e);
    }
  }

  // src/utils/await.ts
  function awaitCallback(value, onfulfilled, onrejected) {
    if (isPromiseLike(value)) {
      const bailed = bail((value2) => {
        awaitCallback(value2, onfulfilled, onrejected);
      }, onrejected);
      try {
        value.then(bailed.onfulfilled, bailed.onrejected);
      } catch (e) {
        bailed.onrejected(e);
      }
    } else {
      onfulfilled(value);
    }
  }

  // src/utils/execute.ts
  function executePromiseValue(value, execute, onfulfilled, onrejected) {
    try {
      const result = execute(value);
      awaitCallback(result, onfulfilled, onrejected);
    } catch (e) {
      onrejected(e);
    }
  }

  // src/utils/microTask.ts
  var callbacks = [];
  var run = () => {
    if (typeof MutationObserver !== "undefined" && (isNative(MutationObserver) || // PhantomJS and iOS 7.x
    MutationObserver.toString() === "[object MutationObserverConstructor]")) {
      let counter = 1;
      const observer = new MutationObserver(flushCallbacks);
      const textNode = document.createTextNode(String(counter));
      observer.observe(textNode, {
        characterData: true
      });
      run = function() {
        counter = (counter + 1) % 2;
        textNode.data = String(counter);
      };
    } else {
      run = function() {
        setTimeout(flushCallbacks, 0);
      };
    }
    run();
  };
  function flushCallbacks() {
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }
  function microTask(callback) {
    callbacks.push(callback);
    run();
  }
  microTask.flush = flushCallbacks;

  // src/assert/assertResolveAndRejectCallable.ts
  function assertResolveAndRejectCallable(resolve2, reject2) {
    if (!isFunction(resolve2) && !isFunction(reject2)) {
      throw new TypeError(`Promise resolve or reject function is not callable`);
    }
  }

  // src/assert/assertWithResolvers.ts
  function assertWithResolvers(ctor) {
    if (!isObjectLike(ctor) && !isFunction(ctor)) {
      throw new TypeError("Promise.withResolvers called on non-object");
    }
  }

  // src/promise/implements/Promise.withResolvers.ts
  function withResolvers() {
    {
      assertWithResolvers(this);
    }
    let invoked = false;
    let resolve2;
    let reject2;
    const promise = new this((_resolve2, _reject) => {
      if (invoked) {
        throw new TypeError(`Promise executor has already been invoked with non-undefined arguments`);
      }
      invoked = true;
      resolve2 = _resolve2;
      reject2 = _reject;
    });
    {
      assertResolveAndRejectCallable(resolve2, reject2);
    }
    return {
      promise,
      resolve: resolve2,
      reject: reject2
    };
  }

  // src/assert/assertConstructorSpecies.ts
  function assertConstructorSpecies(species) {
    if (typeof species !== "function") {
      throw new TypeError(`object.constructor[Symbol.species] is not a constructor`);
    }
  }

  // src/utils/species.ts
  function getPromiseSpecies(ctor) {
    let species = ctor[Symbol.species];
    if (species != null) {
      {
        assertConstructorSpecies(species);
      }
      return species;
    }
    return ctor;
  }

  // src/promise/implements/Promise#then.ts
  function thenImpl(onfulfilled, onrejected) {
    const { promise, resolve: resolve2, reject: reject2 } = withResolvers.call(getPromiseSpecies(this.constructor));
    {
      this._.callback((value) => {
        if (typeof onfulfilled === "function") {
          microTask(() => {
            executePromiseValue(value, onfulfilled, resolve2, reject2);
          });
        } else {
          resolve2(value);
        }
      }, (reason) => {
        if (typeof onrejected === "function") {
          microTask(() => {
            executePromiseValue(reason, onrejected, resolve2, reject2);
          });
        } else {
          reject2(reason);
        }
      });
    }
    return promise;
  }

  // src/promise/implements/Promise#catch.ts
  function catchImpl(onrejected) {
    return this.then(void 0, onrejected);
  }

  // src/promise/implements/Promise#finally.ts
  function finallyImpl(onfinally) {
    if (typeof onfinally !== "function")
      return this.then();
    const { promise, resolve: resolve2, reject: reject2 } = withResolvers.call(getPromiseSpecies(this.constructor));
    {
      this._.callback((value) => {
        microTask(() => {
          executePromiseValue(void 0, onfinally, () => resolve2(value), reject2);
        });
      }, (reason) => {
        microTask(() => {
          executePromiseValue(void 0, onfinally, () => reject2(reason), reject2);
        });
      });
    }
    return promise;
  }

  // src/promise/implements/Promise.resolve.ts
  function resolve(value) {
    return new this((resolve2) => {
      resolve2(value);
    });
  }

  // src/promise/implements/Promise.reject.ts
  function reject(reason) {
    return new this((_, reject2) => {
      reject2(reason);
    });
  }

  // src/assert/assertIterable.ts
  function assertIterable(iterable) {
    if (isIterable(iterable))
      return;
    throw new TypeError(`${getWrongIterableType(iterable)} is not iterable (cannot read property Symbol(Symbol.iterator))`);
  }
  function getWrongIterableType(iterable) {
    if (iterable === null)
      return "object null";
    const type = typeof iterable;
    if (type === "number" || type === "boolean") {
      return `${type} ${String(iterable)}`;
    }
    return type;
  }

  // src/promise/implements/Promise.allSettled.ts
  function allSettledImpl(values) {
    return new this((resolve2) => {
      {
        assertIterable(values);
      }
      const valueArray = [...values];
      if (valueArray.length === 0) {
        resolve2([]);
        return;
      }
      let settled = 0;
      const settledResultaArray = new Array(valueArray.length);
      const sellted = (result, index) => {
        ++settled;
        settledResultaArray[index] = result;
        if (settled === settledResultaArray.length) {
          resolve2(settledResultaArray);
        }
      };
      valueArray.forEach((value, index) => {
        awaitCallback(value, (value2) => {
          sellted({ status: PromiseStateLabel_default.FULFILLED, value: value2 }, index);
        }, (reason) => {
          sellted({ status: PromiseStateLabel_default.REJECTED, reason }, index);
        });
      });
    });
  }

  // src/promise/implements/Promise.all.ts
  function allImpl(values) {
    return allSettledImpl.call(this, values).then((results) => {
      return results.map((result) => {
        if (result.status === PromiseStateLabel_default.FULFILLED) {
          return result.value;
        }
        throw result.reason;
      });
    });
  }

  // src/promise/implements/Promise.race.ts
  function raceImpl(values) {
    return new this((resolve2, reject2) => {
      {
        assertIterable(values);
      }
      const valueArray = [...values];
      if (valueArray.length === 0) {
        return;
      }
      let settled = 0;
      const sellted = (result, index) => {
        if (settled > 0)
          return;
        ++settled;
        if (result.status === PromiseStateLabel_default.FULFILLED) {
          resolve2(result.value);
        } else {
          reject2(result.reason);
        }
      };
      valueArray.forEach((value, index) => {
        awaitCallback(value, (value2) => {
          sellted({ status: PromiseStateLabel_default.FULFILLED, value: value2 }, index);
        }, (reason) => {
          sellted({ status: PromiseStateLabel_default.REJECTED, reason }, index);
        });
      });
    });
  }

  // src/promise/implements.ts
  var implements_default = {
    constructor: constructorImpl,
    then: thenImpl,
    catch: catchImpl,
    finally: finallyImpl,
    resolve,
    reject,
    all: allImpl,
    allSettled: allSettledImpl,
    race: raceImpl,
    withResolvers
  };

  // src/promise/index.ts
  var PromiseImpl = class {
    _;
    constructor(executor) {
      implements_default.constructor.call(this, executor);
    }
    //#region #PromiseState / #PromiseResult
    /** 模拟Promise在Console下查看状态[[PromiseState]] */
    get #PromiseState() {
      return formatPromiseState(this._.state);
    }
    /** 模拟Promise在Console下查看值[[PromiseResult]] */
    get #PromiseResult() {
      return this._.result;
    }
    //#endregion
    static get [Symbol.species]() {
      return this;
    }
    //#region [lib.es2015.promise.d.ts] static reject
    /**
     * Creates a new rejected promise for the provided reason.
     * @param reason The reason the promise was rejected.
     * @returns A new rejected Promise.
     */
    static reject(reason) {
      throw new Error("Method not implemented.");
    }
    /**
     * Creates a new resolved promise for the provided value.
     * @param value A promise.
     * @returns A promise whose internal state matches the provided promise.
     */
    static resolve(value) {
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
    static all(values) {
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
    static race(values) {
      throw new Error("Method not implemented.");
    }
    /**
     * Creates a Promise that is resolved with an array of results when all
     * of the provided Promises resolve or reject.
     * @param values An array of Promises.
     * @returns A new Promise.
     */
    allSettled(values) {
      throw new Error("Method not implemented.");
    }
    /**
     * The any function returns a promise that is fulfilled by the first given promise to be fulfilled, or rejected with an AggregateError containing an array of rejection reasons if all of the given promises are rejected. It resolves all elements of the passed iterable to promises as it runs this algorithm.
     * @param values An array or iterable of Promises.
     * @returns A new Promise.
     */
    any(values) {
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
    withResolvers() {
      throw new Error("Method not implemented.");
    }
    //#endregion
  };
  {
    defineConfigurable(PromiseImpl.prototype, Symbol.toStringTag, "Promise");
    defineUnenumerable(PromiseImpl.prototype, "then", implements_default.then);
    defineUnenumerable(PromiseImpl.prototype, "catch", implements_default.catch);
    defineUnenumerable(PromiseImpl.prototype, "finally", implements_default.finally);
    defineUnenumerable(PromiseImpl, "resolve", implements_default.resolve);
    defineUnenumerable(PromiseImpl, "reject", implements_default.reject);
    defineUnenumerable(PromiseImpl, "all", implements_default.all);
    defineUnenumerable(PromiseImpl, "allSettled", implements_default.allSettled);
    defineUnenumerable(PromiseImpl, "race", implements_default.race);
    defineUnenumerable(PromiseImpl, "withResolvers", implements_default.withResolvers);
  }

  // main.ts
  var main_default = PromiseImpl;
  return __toCommonJS(main_exports);
})();
//# sourceMappingURL=promise-impl.js.map
