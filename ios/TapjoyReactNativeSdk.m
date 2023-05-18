#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(TapjoyReactNativeSdk, NSObject)

#pragma mark - SDK
RCT_EXTERN_METHOD(connect:(NSString *)sdkKey connectFlags:(NSDictionary *)connectFlags resolve:(RCTPromiseResolveBlock *)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(setDebugEnabled:(BOOL)enabled)
RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(isConnected)
RCT_EXTERN_METHOD(setUserId:(NSString *)userId resolve:(RCTPromiseResolveBlock *)resolve reject:(RCTPromiseRejectBlock)reject)

#pragma mark - Placements
RCT_EXTERN_METHOD(requestPlacement:(NSString *)name)
RCT_EXTERN_METHOD(showPlacement:(NSString *)name)
RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(isContentReady:(NSString *)name)
RCT_EXTERN__BLOCKING_SYNCHRONOUS_METHOD(isContentAvailable:(NSString *)name)

#pragma mark - Currency
RCT_EXTERN_METHOD(getCurrencyBalance:(RCTPromiseResolveBlock *)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(spendCurrency:(int)amount resolve:(RCTPromiseResolveBlock *)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(awardCurrency:(int)amount resolve:(RCTPromiseResolveBlock *)resolve reject:(RCTPromiseRejectBlock)reject)

#pragma mark - Privacy
RCT_EXTERN_METHOD(setSubjectToGDPR:(BOOL)isSubjectToGDPR)
RCT_EXTERN_METHOD(setBelowConsentAge:(BOOL)isBelowConsentAge)
RCT_EXTERN_METHOD(setUSPrivacy:(NSString *)privacyValue)
RCT_EXTERN_METHOD(setUserConsent:(NSString *)userConsent)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
