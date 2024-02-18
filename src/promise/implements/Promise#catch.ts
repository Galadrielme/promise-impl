import type PromiseImpl from "../index";

/**
 * Promise#catch
 * 
 * @param { Function } onrejected 
 * @returns { PromiseImpl }
 */
export default function catchImpl<TResult = never>(this: PromiseImpl<any>, onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null | undefined): Promise<any | TResult> {
    return this.then(void 0, onrejected);
}