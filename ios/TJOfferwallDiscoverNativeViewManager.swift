@objc (TJOfferwallDiscoverNativeViewManager)
class TJOfferwallDiscoverNativeViewManager: RCTViewManager, TJOfferwallDiscoverDelegate {

    var owdView:TapjoyOfferwallDiscoverNativeView!
    @objc var onRequestSuccess: RCTBubblingEventBlock?
    @objc var onRequestFailure: RCTBubblingEventBlock?
    @objc var onContentReady: RCTBubblingEventBlock?
    @objc var onContentError: RCTBubblingEventBlock?
    
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
   
    override func view() -> UIView! {
        owdView = TapjoyOfferwallDiscoverNativeView()
        owdView.delegate = self
        return owdView
    }
    
    /**
     Show the OfferwallDiscover content.
     */
    @objc func requestContent(_ tag: NSNumber, _ placement: String) {
        DispatchQueue.main.async {
            self.owdView.requestContent(placement)
        }
    }
    
    /**
     Show current content.
     */
    @objc func clearContent(_ tag: NSNumber) {
        DispatchQueue.main.async {
            self.owdView.clearContent()
        }
    }
    
    // MARK: - TJOfferwallDiscoverDelegate : The delegates method will call javascript event handlers.
    func requestDidSucceed(for view: TJOfferwallDiscoverView) {
        NSLog("requestDidSucceed")
        
        guard let onRequestSuccess = self.owdView.onRequestSuccess else { return }
        DispatchQueue.main.async {
            let params: [String : Any] = ["result":"requestSuccess"]
            onRequestSuccess(params)
        }
    }
    
    func requestDidFail(for view: TJOfferwallDiscoverView, error: Error?) {
        guard let error = error else { return }
        NSLog("requestDidFail -  \(error.localizedDescription) ")
        
        guard let onRequestFailure = self.owdView.onRequestFailure else { return }
        DispatchQueue.main.async {
            let errorCode = (error as NSError).code
            let params: [String : Any] = ["errorCode": errorCode, "errorMessage": error.localizedDescription]
            onRequestFailure(params)
        }
    }
    
    func contentIsReady(for view: TJOfferwallDiscoverView) {
        NSLog("contentIsReady")
        guard let onContentReady = self.owdView.onContentReady else { return }
        DispatchQueue.main.async {
            let params: [String : Any] = ["result":"contentReady"]
            onContentReady(params)
        }
    }
    
    func contentError(for view: TJOfferwallDiscoverView, error: Error?) {
        guard let error = error else { return }
        NSLog("contentError \(error.localizedDescription)")

        guard let onContentError = self.owdView.onContentError else { return }
        DispatchQueue.main.async {
            let errorCode = (error as NSError).code
            let params: [String : Any] = ["errorCode": errorCode, "errorMessage": error.localizedDescription]
            onContentError(params)
        }
    }
}
