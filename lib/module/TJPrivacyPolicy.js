import { NativeModules } from 'react-native';
const Tapjoy = NativeModules.TapjoyReactNativeSdk;
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
export default TJPrivacyPolicy;
//# sourceMappingURL=TJPrivacyPolicy.js.map