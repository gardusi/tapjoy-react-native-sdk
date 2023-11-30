#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(TJOfferwallDiscoverNativeViewManager, RCTViewManager)
RCT_EXTERN_METHOD(requestContent: (nonnull NSNumber *)tag : NSString)
RCT_EXTERN_METHOD(clearContent: (nonnull NSNumber *)tag)
RCT_EXPORT_VIEW_PROPERTY(onRequestSuccess, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onRequestFailure, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onContentReady, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onContentError, RCTBubblingEventBlock)
@end
