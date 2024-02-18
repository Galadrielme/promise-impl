
/**
 * 校验Promise[Symbol.species]
 * 
 * @param { any } species 
 * @throws { TypeError }
 */
export function assertConstructorSpecies (species: any) {
    if (typeof species !== "function") {
        throw new TypeError(`object.constructor[Symbol.species] is not a constructor`);
    }
}