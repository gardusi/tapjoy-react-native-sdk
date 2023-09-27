import { NativeModules, Platform } from 'react-native';
import type TJStatus from './TJStatus';

const Tapjoy = NativeModules.TapjoyReactNativeSdk;

class TJPrivacyPolicy {
  async getBelowConsentAge(): Promise<TJStatus> {
    try {
      let isBelowConsentAge: TJStatus = await Tapjoy.getBelowConsentAge();
      return isBelowConsentAge;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  setBelowConsentAge(isBelowConsentAge: boolean): void {
    Tapjoy.setBelowConsentAge(isBelowConsentAge);
  }

  setSubjectToGDPR(isSubjectToGDPR: boolean): void {
    Tapjoy.setSubjectToGDPR(isSubjectToGDPR);
  }

  async getSubjectToGDPR(): Promise<TJStatus> {
    try {
      let isSubjectToGDPR: TJStatus = await Tapjoy.getSubjectToGDPR();
      return isSubjectToGDPR;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  setUSPrivacy(usPrivacy: string): void {
    Tapjoy.setUSPrivacy(usPrivacy);
  }

  async getUSPrivacy(): Promise<string> {
    try {
      let usPrivacy: string = await Tapjoy.getUSPrivacy();
      return usPrivacy;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  setUserConsent(userConsent: string): void {
    Tapjoy.setUserConsent(userConsent);
  }

  async getUserConsent(): Promise<TJStatus> {
    try {
      let userConsent: TJStatus = await Tapjoy.getUserConsent();
      return userConsent;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  setBelowConsentAgeStatus(isBelowConsentAgeStatus: TJStatus): void {
    Tapjoy.setBelowConsentAgeStatus(isBelowConsentAgeStatus);
  }

  setSubjectToGDPRStatus(isSubjectToGDPRStatus: TJStatus): void {
    Tapjoy.setSubjectToGDPRStatus(isSubjectToGDPRStatus);
  }

  setUserConsentStatus(userConsentStatus: TJStatus): void {
    Tapjoy.setUserConsentStatus(userConsentStatus);
  }

  optOutAdvertisingID(optOut: boolean): void {
    if (Platform.OS === 'android') {
      Tapjoy.optOutAdvertisingID(optOut);
    } else {
      console.warn('optOutAdvertisingID is only supported on Android.');
    }
  }
}

export default TJPrivacyPolicy;
