import PromiseState from "../enum/PromiseState";
import PromiseStateLabel from "../enum/PromiseStateLabel";

/**
 * 格式化Promise的状态
 * 
 * @param { PromiseState } state 
 * @returns { PromiseStateLabel }
 */
export function formatPromiseState (state: PromiseState): PromiseStateLabel {
    switch (state) {
        case PromiseState.PENDING: return PromiseStateLabel.PENDING;
        case PromiseState.FULFILLED: return PromiseStateLabel.FULFILLED;
        case PromiseState.REJECTED: return PromiseStateLabel.REJECTED;
        default: throw `Unexpected PromiseState with ${ state }`;
    }
}