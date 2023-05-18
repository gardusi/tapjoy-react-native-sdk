"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _reactNative = require("react-native");
const Tapjoy = _reactNative.NativeModules.TapjoyReactNativeSdk;
class TJPrivacyPolicy {
  setBelowConsentAge(isBelowConsentAge) {
    Tapjoy.setBelowConsentAge(isBelowConsentAge);
  }
  setSubjectToGDPR(isSubjectToGDPR) {
    Tapjoy.setSubjectToGDPR(isSubjectToGDPR);
  }
  setUSPrivacy(usPrivacy) {
    Tapjoy.setUSPrivacy(usPrivacy);
  }
  setUserConsent(userConsent) {
    Tapjoy.setUserConsent(userConsent);
  }
}
var _default = TJPrivacyPolicy;
exports.default = _default;
//# sourceMappingURL=TJPrivacyPolicy.js.map