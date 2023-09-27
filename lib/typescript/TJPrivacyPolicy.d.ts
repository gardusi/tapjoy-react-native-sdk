import type TJStatus from './TJStatus';
declare class TJPrivacyPolicy {
    getBelowConsentAge(): Promise<TJStatus>;
    setBelowConsentAge(isBelowConsentAge: boolean): void;
    setSubjectToGDPR(isSubjectToGDPR: boolean): void;
    getSubjectToGDPR(): Promise<TJStatus>;
    setUSPrivacy(usPrivacy: string): void;
    getUSPrivacy(): Promise<string>;
    setUserConsent(userConsent: string): void;
    getUserConsent(): Promise<TJStatus>;
    setBelowConsentAgeStatus(isBelowConsentAgeStatus: TJStatus): void;
    setSubjectToGDPRStatus(isSubjectToGDPRStatus: TJStatus): void;
    setUserConsentStatus(userConsentStatus: TJStatus): void;
    optOutAdvertisingID(optOut: boolean): void;
}
export default TJPrivacyPolicy;
//# sourceMappingURL=TJPrivacyPolicy.d.ts.map