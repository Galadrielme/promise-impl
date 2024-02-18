/**
 * 确保 onfulfilled / onrejected 只会调用一个
 * 
 * @param { Function } onfulfilled 
 * @param { Function } onrejected 
 */
export function bail (onfulfilled: (value: any) => void, onrejected: (reason: any) => void) {
    const bailed = {
        invoked: false,
        onfulfilled: (value: any) => {
            !bailed.invoked && (bailed.invoked = true, onfulfilled(value));
        },
        onrejected: (reason: any) => {
            !bailed.invoked && (bailed.invoked = true, onrejected(reason));
        }
    }
    return bailed;
}