import { NativeEventEmitter, NativeModules } from 'react-native';
import { EventEmitter } from 'eventemitter3';
import TJEntryPoint from './TJEntryPoint';

const Tapjoy = NativeModules.TapjoyReactNativeSdk;
const TapjoyEmitter = new NativeEventEmitter(Tapjoy);

const TapjoyEventType = 'TapjoyPlacement';

interface TapjoyPlacementEvent {
  name: string;
  error: string;
  placement: string;
}

class TJPlacement extends EventEmitter {
  static readonly REQUEST_DID_SUCCEED = 'requestDidSucceed';
  static readonly REQUEST_DID_FAIL = 'requestDidFail';
  static readonly CONTENT_IS_READY = 'contentIsReady';
  static readonly CONTENT_DID_APPEAR = 'contentDidAppear';
  static readonly CONTENT_DID_DISAPPEAR = 'contentDidDisappear';

  public name: string;
  public error: string | undefined;

  public constructor(name: string) {
    super();
    this.name = name;
    this.error = undefined;
    Tapjoy.createPlacement(this.name);
  }

  /**
   * Request placement content.
   */
  requestContent(): void {
    const subscription = TapjoyEmitter.addListener(
      TapjoyEventType,
      (event: TapjoyPlacementEvent) => {
        if (event.name === TJPlacement.REQUEST_DID_SUCCEED) {
          // Remove listener if there is no content available.
          if (!this.isContentAvailable()) {
            subscription.remove();
          }
          this.emit(TJPlacement.REQUEST_DID_SUCCEED, this);
        } else if (event.name === TJPlacement.REQUEST_DID_FAIL) {
          // No more events expected, remove listener.
          subscription.remove();
          this.error = event.error;
          this.emit(TJPlacement.REQUEST_DID_FAIL, this);
        } else if (event.name === TJPlacement.CONTENT_IS_READY) {
          // No more events expected, remove listener.
          subscription.remove();
          this.emit(TJPlacement.CONTENT_IS_READY, this);
        }
      }
    );
    Tapjoy.requestPlacement(this.name);
  }

  /**
   * Displays the content associated with the placement.
   */
  showContent(): void {
    const subscription = TapjoyEmitter.addListener(
      TapjoyEventType,
      (event: TapjoyPlacementEvent) => {
        if (event.name === TJPlacement.CONTENT_DID_APPEAR) {
          this.emit(TJPlacement.CONTENT_DID_APPEAR, this);
        } else if (event.name === TJPlacement.CONTENT_DID_DISAPPEAR) {
          // No more events expected, remove listener.
          subscription.remove();
          this.emit(TJPlacement.CONTENT_DID_DISAPPEAR, this);
        }
      }
    );
    Tapjoy.showPlacement(this.name);
  }

  /**
   * Checks whether the content is ready for use.
   *
   * @returns {boolean} True if the content is ready; otherwise, false.
   */
  isContentReady(): boolean {
    return Tapjoy.isContentReady(this.name);
  }

  /**
   * Checks whether the content is available for use.
   *
   * @returns {boolean} True if the content is available; otherwise, false.
   */
  isContentAvailable(): boolean {
    return Tapjoy.isContentAvailable(this.name);
  }

  /**
   * Sets the currency balance for given currency id.
   *
   * @param {String} currencyId - The identifier of the currency.
   * @param {Number} currencyBalance - The amount of the currency to set.
   */
  async setCurrencyBalance(
    currencyId: String,
    currencyBalance: Number
  ): Promise<void> {
    await Tapjoy.setCurrencyBalance(currencyBalance, currencyId, this.name);
  }

  /**
   * Gets the currency balance for given currency id.
   *
   * @param {String} currencyId - The identifier of the currency.
   * @return {Number} currencyBalance - The amount of the currency.
   */
  async getCurrencyBalance(currencyId: String): Promise<Number> {
    return await Tapjoy.getPlacementCurrencyBalance(currencyId, this.name);
  }

  /**
   * Sets the currency amount required
   *
   * @param {Number} amount The amount of currency the user needs. Must be greater than 0.
   * @param {String} currencyId The identifier of the currency.
   */
  async setRequiredAmount(amount: Number, currencyId: String): Promise<void> {
    await Tapjoy.setRequiredAmount(amount, currencyId, this.name);
  }

  /**
   * Gets the currency amount required.
   *
   * @param {String} currencyId The identifier of the currency.
   * @return {Number} The amount of currency the user needs. -1 if not available.
   */
  async getRequiredAmount(currencyId: String): Promise<Number> {
    return await Tapjoy.getRequiredAmount(currencyId, this.name);
  }

  /**
   * Sets entry point.
   *
   * @param {TJEntryPoint} entryPoint - Entry point.
   * @see TJEntryPoint
   */
  setEntryPoint(entryPoint: TJEntryPoint): void {
    Tapjoy.setEntryPoint(this.name, Object.values(TJEntryPoint).indexOf(entryPoint));
  }

  /**
   * Gets entry point.
   *
   * @returns Entry point.
   * @see TJEntryPoint
   */
  async getEntryPoint(): Promise<TJEntryPoint | undefined> {
    const entryPointValue: TJEntryPoint | undefined =
      Object.values(TJEntryPoint)[await Tapjoy.getEntryPoint(this.name)];
    return entryPointValue;
  }
}

export default TJPlacement;
