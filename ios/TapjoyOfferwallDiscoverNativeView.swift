class TapjoyOfferwallDiscoverNativeView: TJOfferwallDiscoverView {
    
    // Event handlers
    @objc var onRequestSuccess: RCTBubblingEventBlock?
    @objc var onRequestFailure: RCTBubblingEventBlock?
    @objc var onContentReady: RCTBubblingEventBlock?
    @objc var onContentError: RCTBubblingEventBlock?
    
    /**
     Request content of placement.
     - Parameter placement: Placement name.
     */
    func requestContent(_ placement: String) {
        request(placement)
    }

    /**
     Clear displayed content.
     */
    func clearContent() {
        clear()
    }
}
