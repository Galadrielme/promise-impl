import constructorImpl from "./implements/constructor";
import thenImpl from "./implements/Promise#then";
import catchImpl from "./implements/Promise#catch";
import finallyImpl from "./implements/Promise#finally";
import resolveImpl from "./implements/Promise.resolve";
import rejectImpl from "./implements/Promise.reject";
import allImpl from "./implements/Promise.all";
import allSettledImpl from "./implements/Promise.allSettled";
import raceImpl from "./implements/Promise.race";
import withResolversImpl from "./implements/Promise.withResolvers";

export default {
    constructor: constructorImpl,
    then: thenImpl,
    catch: catchImpl,
    finally: finallyImpl,
    resolve: resolveImpl,
    reject: rejectImpl,
    all: allImpl,
    allSettled: allSettledImpl,
    race: raceImpl,
    withResolvers: withResolversImpl
}