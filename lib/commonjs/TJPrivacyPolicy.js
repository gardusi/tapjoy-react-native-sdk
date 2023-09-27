"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _reactNative = require("react-native");
const Tapjoy = _reactNative.NativeModules.TapjoyReactNativeSdk;
class TJPrivacyPolicy {
  async getBelowConsentAge() {
    try {
      let isBelowConsentAge = await Tapjoy.getBelowConsentAge();
      return isBelowConsentAge;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  setBelowConsentAge(isBelowConsentAge) {
    Tapjoy.setBelowConsentAge(isBelowConsentAge);
  }
  setSubjectToGDPR(isSubjectToGDPR) {
    Tapjoy.setSubjectToGDPR(isSubjectToGDPR);
  }
  async getSubjectToGDPR() {
    try {
      let isSubjectToGDPR = await Tapjoy.getSubjectToGDPR();
      return isSubjectToGDPR;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  setUSPrivacy(usPrivacy) {
    Tapjoy.setUSPrivacy(usPrivacy);
  }
  async getUSPrivacy() {
    try {
      let usPrivacy = await Tapjoy.getUSPrivacy();
      return usPrivacy;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  setUserConsent(userConsent) {
    Tapjoy.setUserConsent(userConsent);
  }
  async getUserConsent() {
    try {
      let userConsent = await Tapjoy.getUserConsent();
      return userConsent;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  setBelowConsentAgeStatus(isBelowConsentAgeStatus) {
    Tapjoy.setBelowConsentAgeStatus(isBelowConsentAgeStatus);
  }
  setSubjectToGDPRStatus(isSubjectToGDPRStatus) {
    Tapjoy.setSubjectToGDPRStatus(isSubjectToGDPRStatus);
  }
  setUserConsentStatus(userConsentStatus) {
    Tapjoy.setUserConsentStatus(userConsentStatus);
  }
  optOutAdvertisingID(optOut) {
    if (_reactNative.Platform.OS === 'android') {
      Tapjoy.optOutAdvertisingID(optOut);
    } else {
      console.warn('optOutAdvertisingID is only supported on Android.');
    }
  }
}
var _default = TJPrivacyPolicy;
exports.default = _default;
//# sourceMappingURL=TJPrivacyPolicy.js.map