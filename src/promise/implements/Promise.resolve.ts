/**
 * 实现Promise.resolve
 * 
 * @param { any } value 
 * @returns { Promise }
 */
export default function resolve<T>(this: PromiseConstructor, value?: T | PromiseLike<T>): Promise<Awaited<T>> {
    return new this(resolve => { resolve(value as any) });
}