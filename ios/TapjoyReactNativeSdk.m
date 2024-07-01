#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(TapjoyReactNativeSdk, NSObject)

#pragma mark - SDK
RCT_EXTERN_METHOD(connect:(NSString *)sdkKey connectFlags:(NSDictionary *)connectFlags resolve:(RCTPromiseResolveBlock *)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(setDebugEnabled:(BOOL)enabled)
RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(isConnected)
RCT_EXTERN_METHOD(setUserId:(NSString *)userId resolve:(RCTPromiseResolveBlock *)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getUserId:(RCTPromiseResolveBlock *)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(setUserSegment:(nonnull NSNumber *)userSegment)
RCT_EXTERN_METHOD(getUserSegment: (RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(setMaxLevel:(int)maxLevel)
RCT_EXTERN_METHOD(setUserLevel:(int)userLevel)
RCT_EXTERN_METHOD(getUserLevel: (RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getUserTags: (RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(setUserTags:(NSArray *)tags)
RCT_EXTERN_METHOD(clearUserTags)
RCT_EXTERN_METHOD(addUserTag:(NSString *)tag)
RCT_EXTERN_METHOD(removeUserTag:(NSString *)tag)

#pragma mark - Placements
RCT_EXTERN_METHOD(createPlacement:(NSString *)name)
RCT_EXTERN_METHOD(requestPlacement:(NSString *)name)
RCT_EXTERN_METHOD(showPlacement:(NSString *)name)
RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(isContentReady:(NSString *)name)
RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(isContentAvailable:(NSString *)name)
RCT_EXTERN_METHOD(setEntryPoint:(NSString *)name entryPoint:(nonnull NSNumber *)entryPoint)
RCT_EXTERN_METHOD(getEntryPoint:(NSString *)name resolve:(RCTPromiseResolveBlock *)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(setCurrencyBalance:(NSInteger)amount currencyId:(NSString *)currencyId placementName:(NSString *)placementName resolve:(RCTPromiseResolveBlock *)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getPlacementCurrencyBalance:(NSString *)currencyId placementName:(NSString *)placementName resolve:(RCTPromiseResolveBlock *)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(setRequiredAmount:(NSInteger)requiredAmount currencyId:(NSString *)currencyId placementName:(NSString *)placementName resolve:(RCTPromiseResolveBlock *)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getRequiredAmount:(NSString *)currencyId placementName:(NSString *)placementName resolve:(RCTPromiseResolveBlock *)resolve reject:(RCTPromiseRejectBlock)reject)

#pragma mark - Currency
RCT_EXTERN_METHOD(getCurrencyBalance:(RCTPromiseResolveBlock *)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(spendCurrency:(int)amount resolve:(RCTPromiseResolveBlock *)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(awardCurrency:(int)amount resolve:(RCTPromiseResolveBlock *)resolve reject:(RCTPromiseRejectBlock)reject)

#pragma mark - Privacy
RCT_EXTERN_METHOD(setUSPrivacy:(NSString *)privacyValue)
RCT_EXTERN_METHOD(setBelowConsentAgeStatus:(nonnull NSNumber *)isBelowConsentAgeStatus)
RCT_EXTERN_METHOD(setSubjectToGDPRStatus:(nonnull NSNumber *)isSubjectToGDPRStatus)
RCT_EXTERN_METHOD(setUserConsentStatus:(nonnull NSNumber *)userConsentStatus)
RCT_EXTERN_METHOD(getBelowConsentAge: (RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getSubjectToGDPR: (RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getUserConsent: (RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getUSPrivacy: (RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

#pragma mark - Purchase
RCT_EXTERN_METHOD(trackPurchase:(NSString *)currencyCode price:(nonnull NSNumber *)price);

@end
