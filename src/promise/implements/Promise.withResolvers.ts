import { assertResolveAndRejectCallable } from "../../assert/assertResolveAndRejectCallable";
import { assertWithResolvers } from "../../assert/assertWithResolvers";

export default function withResolvers<T>(this: any): PromiseWithResolvers<T> {
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