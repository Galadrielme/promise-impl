const _global: typeof globalThis = typeof globalThis !== "undefined" ?
    globalThis :
    typeof global !== "undefined" ?
        global :
        typeof this !== "undefined" ?
            this : 
            typeof window !== "undefined" ?
                window : {} as any;

export default _global;