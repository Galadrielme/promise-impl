import Promise, { createCustomPromise } from "./promise";
import PromiseKernel from "./kernel";
import version from "./version";

export default Promise;
export {
    PromiseKernel,
    createCustomPromise,
    version
};