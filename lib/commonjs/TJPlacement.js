"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _reactNative = require("react-native");
var _eventemitter = require("eventemitter3");
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
  }
  requestContent() {
    var subscription = TapjoyEmitter.addListener(TapjoyEventType, event => {
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
  showContent() {
    var subscription = TapjoyEmitter.addListener(TapjoyEventType, event => {
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
  isContentReady() {
    return Tapjoy.isContentReady(this.name);
  }
  isContentAvailable() {
    return Tapjoy.isContentAvailable(this.name);
  }
}
var _default = TJPlacement;
exports.default = _default;
//# sourceMappingURL=TJPlacement.js.map