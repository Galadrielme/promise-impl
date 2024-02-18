import { assertConstructorSpecies } from "../assert/assertConstructorSpecies";

/**
 * 获取
 * 
 * @param {  } ctor 
 * @returns { PromiseConstructor }
 * @throws { TypeError }
 */
export function getPromiseSpecies (ctor: PromiseConstructor): PromiseConstructor {
    let species = ctor[Symbol.species];
    if (species != null) {
        {
          assertConstructorSpecies(species);
        }
        return species;
    }
    return ctor
}