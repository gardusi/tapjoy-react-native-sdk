import type TJStatus from './TJStatus';
declare class TJPrivacyPolicy {
    getBelowConsentAge(): Promise<TJStatus>;
    getSubjectToGDPR(): Promise<TJStatus>;
    setUSPrivacy(usPrivacy: string): void;
    getUSPrivacy(): Promise<string>;
    getUserConsent(): Promise<TJStatus>;
    setBelowConsentAgeStatus(isBelowConsentAgeStatus: TJStatus): void;
    setSubjectToGDPRStatus(isSubjectToGDPRStatus: TJStatus): void;
    setUserConsentStatus(userConsentStatus: TJStatus): void;
    optOutAdvertisingID(optOut: boolean): void;
}
export default TJPrivacyPolicy;
