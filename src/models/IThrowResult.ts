import type IDice from "./IDice";

export default interface IThrowResult {
    dices: IDice[],
    throwId?: string,
    resultId?: string,
    score?: number,
}