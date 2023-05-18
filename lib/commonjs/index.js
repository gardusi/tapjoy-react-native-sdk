"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "TJPlacement", {
  enumerable: true,
  get: function () {
    return _TJPlacement.default;
  }
});
Object.defineProperty(exports, "TJPrivacyPolicy", {
  enumerable: true,
  get: function () {
    return _TJPrivacyPolicy.default;
  }
});
Object.defineProperty(exports, "TJVersion", {
  enumerable: true,
  get: function () {
    return _TJVersion.default;
  }
});
exports.default = exports.Tapjoy = void 0;
var _reactNative = require("react-native");
var _TJPlacement = _interopRequireDefault(require("./TJPlacement"));
var _TJPrivacyPolicy = _interopRequireDefault(require("./TJPrivacyPolicy"));
var _TJVersion = _interopRequireDefault(require("./TJVersion"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const LINKING_ERROR = `The package 'tapjoy-react-native-sdk' doesn't seem to be linked. Make sure: \n\n` + _reactNative.Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';
const Tapjoy = _reactNative.NativeModules.TapjoyReactNativeSdk ? _reactNative.NativeModules.TapjoyReactNativeSdk : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});
exports.Tapjoy = Tapjoy;
var _default = Tapjoy;
exports.default = _default;
//# sourceMappingURL=index.js.map