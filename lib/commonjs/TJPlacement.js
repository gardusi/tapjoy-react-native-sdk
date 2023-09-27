"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _reactNative = require("react-native");
var _eventemitter = require("eventemitter3");
var _TJEntryPoint = _interopRequireDefault(require("./TJEntryPoint"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Tapjoy = _reactNative.NativeModules.TapjoyReactNativeSdk;
const TapjoyEmitter = new _reactNative.NativeEventEmitter(Tapjoy);
const TapjoyEventType = 'TapjoyPlacement';
class TJPlacement extends _eventemitter.EventEmitter {
  static REQUEST_DID_SUCCEED = 'requestDidSucceed';
  static REQUEST_DID_FAIL = 'requestDidFail';
  static CONTENT_IS_READY = 'contentIsReady';
  static CONTENT_DID_APPEAR = 'contentDidAppear';
  static CONTENT_DID_DISAPPEAR = 'contentDidDisappear';
  constructor(name) {
    super();
    this.name = name;
    this.error = undefined;
    Tapjoy.createPlacement(this.name);
  }

  /**
   * Request placement content.
   */
  requestContent() {
    const subscription = TapjoyEmitter.addListener(TapjoyEventType, event => {
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
    });
    Tapjoy.requestPlacement(this.name);
  }

  /**
   * Displays the content associated with the placement.
   */
  showContent() {
    const subscription = TapjoyEmitter.addListener(TapjoyEventType, event => {
      if (event.name === TJPlacement.CONTENT_DID_APPEAR) {
        this.emit(TJPlacement.CONTENT_DID_APPEAR, this);
      } else if (event.name === TJPlacement.CONTENT_DID_DISAPPEAR) {
        // No more events expected, remove listener.
        subscription.remove();
        this.emit(TJPlacement.CONTENT_DID_DISAPPEAR, this);
      }
    });
    Tapjoy.showPlacement(this.name);
  }

  /**
   * Checks whether the content is ready for use.
   *
   * @returns {boolean} True if the content is ready; otherwise, false.
   */
  isContentReady() {
    return Tapjoy.isContentReady(this.name);
  }

  /**
   * Checks whether the content is available for use.
   *
   * @returns {boolean} True if the content is available; otherwise, false.
   */
  isContentAvailable() {
    return Tapjoy.isContentAvailable(this.name);
  }

  /**
   * Sets the currency balance for given currency id.
   *
   * @param {String} currencyId - The identifier of the currency.
   * @param {Number} currencyBalance - The amount of the currency to set.
   */
  async setCurrencyBalance(currencyId, currencyBalance) {
    await Tapjoy.setCurrencyBalance(currencyBalance, currencyId, this.name);
  }

  /**
   * Gets the currency balance for given currency id.
   *
   * @param {String} currencyId - The identifier of the currency.
   * @return {Number} currencyBalance - The amount of the currency.
   */
  async getCurrencyBalance(currencyId) {
    return await Tapjoy.getPlacementCurrencyBalance(currencyId, this.name);
  }

  /**
   * Sets the currency amount required
   *
   * @param {Number} amount The amount of currency the user needs. Must be greater than 0.
   * @param {String} currencyId The identifier of the currency.
   */
  async setRequiredAmount(amount, currencyId) {
    await Tapjoy.setRequiredAmount(amount, currencyId, this.name);
  }

  /**
   * Gets the currency amount required.
   *
   * @param {String} currencyId The identifier of the currency.
   * @return {Number} The amount of currency the user needs. -1 if not available.
   */
  async getRequiredAmount(currencyId) {
    return await Tapjoy.getRequiredAmount(currencyId, this.name);
  }

  /**
   * Sets entry point.
   *
   * @param {TJEntryPoint} entryPoint - Entry point.
   * @see TJEntryPoint
   */
  setEntryPoint(entryPoint) {
    Tapjoy.setEntryPoint(this.name, Object.values(_TJEntryPoint.default).indexOf(entryPoint));
  }

  /**
   * Gets entry point.
   *
   * @returns Entry point.
   * @see TJEntryPoint
   */
  async getEntryPoint() {
    const entryPointValue = Object.values(_TJEntryPoint.default)[await Tapjoy.getEntryPoint(this.name)];
    return entryPointValue;
  }
}
var _default = TJPlacement;
exports.default = _default;
//# sourceMappingURL=TJPlacement.js.map