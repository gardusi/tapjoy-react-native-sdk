import { NativeModules } from 'react-native';

const Tapjoy = NativeModules.TapjoyReactNativeSdk;

class TJPrivacyPolicy {
  setBelowConsentAge(isBelowConsentAge: boolean): void {
    Tapjoy.setBelowConsentAge(isBelowConsentAge);
  }

  setSubjectToGDPR(isSubjectToGDPR: boolean): void {
    Tapjoy.setSubjectToGDPR(isSubjectToGDPR);
  }

  setUSPrivacy(usPrivacy: string): void {
    Tapjoy.setUSPrivacy(usPrivacy);
  }

  setUserConsent(userConsent: string): void {
    Tapjoy.setUserConsent(userConsent);
  }
}

export default TJPrivacyPolicy;
