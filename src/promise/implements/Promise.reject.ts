/**
 * 实现Promise.resolve
 * 
 * @param { any } reason 
 * @returns { Promise }
 */
export default function reject(this: PromiseConstructor, reason?: any): Promise<any> {
    return new this((_, reject) => { reject(reason as any) });
}