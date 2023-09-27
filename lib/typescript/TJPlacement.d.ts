import { EventEmitter } from 'eventemitter3';
import TJEntryPoint from './TJEntryPoint';
declare class TJPlacement extends EventEmitter {
    static readonly REQUEST_DID_SUCCEED = "requestDidSucceed";
    static readonly REQUEST_DID_FAIL = "requestDidFail";
    static readonly CONTENT_IS_READY = "contentIsReady";
    static readonly CONTENT_DID_APPEAR = "contentDidAppear";
    static readonly CONTENT_DID_DISAPPEAR = "contentDidDisappear";
    name: string;
    error: string | undefined;
    constructor(name: string);
    /**
     * Request placement content.
     */
    requestContent(): void;
    /**
     * Displays the content associated with the placement.
     */
    showContent(): void;
    /**
     * Checks whether the content is ready for use.
     *
     * @returns {boolean} True if the content is ready; otherwise, false.
     */
    isContentReady(): boolean;
    /**
     * Checks whether the content is available for use.
     *
     * @returns {boolean} True if the content is available; otherwise, false.
     */
    isContentAvailable(): boolean;
    /**
     * Sets the currency balance for given currency id.
     *
     * @param {String} currencyId - The identifier of the currency.
     * @param {Number} currencyBalance - The amount of the currency to set.
     */
    setCurrencyBalance(currencyId: String, currencyBalance: Number): Promise<void>;
    /**
     * Gets the currency balance for given currency id.
     *
     * @param {String} currencyId - The identifier of the currency.
     * @return {Number} currencyBalance - The amount of the currency.
     */
    getCurrencyBalance(currencyId: String): Promise<Number>;
    /**
     * Sets the currency amount required
     *
     * @param {Number} amount The amount of currency the user needs. Must be greater than 0.
     * @param {String} currencyId The identifier of the currency.
     */
    setRequiredAmount(amount: Number, currencyId: String): Promise<void>;
    /**
     * Gets the currency amount required.
     *
     * @param {String} currencyId The identifier of the currency.
     * @return {Number} The amount of currency the user needs. -1 if not available.
     */
    getRequiredAmount(currencyId: String): Promise<Number>;
    /**
     * Sets entry point.
     *
     * @param {TJEntryPoint} entryPoint - Entry point.
     * @see TJEntryPoint
     */
    setEntryPoint(entryPoint: TJEntryPoint): void;
    /**
     * Gets entry point.
     *
     * @returns Entry point.
     * @see TJEntryPoint
     */
    getEntryPoint(): Promise<TJEntryPoint | undefined>;
}
export default TJPlacement;
//# sourceMappingURL=TJPlacement.d.ts.map