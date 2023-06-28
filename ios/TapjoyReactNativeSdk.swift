import Foundation

@objc(TapjoyReactNativeSdk)
class TapjoyReactNativeSdk: RCTEventEmitter {
    
    fileprivate var placements: [ String: TJPlacement? ]
    fileprivate var listeners = 0
    
    var storedResolve: RCTPromiseResolveBlock?
    var storedReject: RCTPromiseRejectBlock?
    
    override init() {
        self.placements = [:]
        super.init()
    }
    
    // MARK: - Events
    @objc override func supportedEvents() -> [String] {
        return ["TapjoyPlacement"];
    }
    
    @objc override func startObserving() {
        listeners += 1
    }

    @objc override func stopObserving() {
        listeners -= 1
    }
    
    func attemptSendEvent(withName name: String, body: [AnyHashable : Any?]?) {
        if (listeners > 0) {
            sendEvent(withName: name, body: body)
        }
    }
    
    // MARK: - SDK
    /**
     Connect to Tapjoy.
     - Parameter sdkKey: SDK key the app.
     - Parameter connectFlags:Dictionary for the connection flag values.
     - Returns true to javascript if it is succeeded otherwise throws error
     */
    @objc func connect(_ sdkKey: String, connectFlags: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        if storedResolve == nil {
            NotificationCenter.default.addObserver(self, selector: #selector(tjcConnectSuccess(_:)), name: NSNotification.Name(TJC_CONNECT_SUCCESS), object: nil)
            NotificationCenter.default.addObserver(self, selector: #selector(tjcConnectFail(_:)), name: NSNotification.Name(TJC_CONNECT_FAILED), object: nil)
        }

        storedResolve = resolve
        storedReject = reject

        Tapjoy.sharedTapjoyConnect().plugin = "ReactNative"

        Tapjoy.connect(sdkKey, options: connectFlags as? [AnyHashable: Any])
    }
    
    @objc func tjcConnectSuccess(_ notifyObj: Notification) {
        if let storedResolve = storedResolve {
            storedResolve(true)
        }
        storedResolve = nil
        storedReject = nil
        NotificationCenter.default.removeObserver(self, name: NSNotification.Name(TJC_CONNECT_SUCCESS), object: nil)
        NotificationCenter.default.removeObserver(self, name: NSNotification.Name(TJC_CONNECT_FAILED), object: nil)
    }

    @objc func tjcConnectFail(_ notifyObj: Notification) {
        if let storedReject = storedReject {
            storedReject("Connect Error", "Connect Call Failed", nil)
        }
        storedResolve = nil;
        storedReject = nil
        NotificationCenter.default.removeObserver(self, name: NSNotification.Name(TJC_CONNECT_SUCCESS), object: nil)
        NotificationCenter.default.removeObserver(self, name: NSNotification.Name(TJC_CONNECT_FAILED), object: nil)
    }    
    
    /**
     Enables debug log
     - Parameter enabled: true for enabling and false for disabling
    */
    @objc func setDebugEnabled(_ enabled: Bool) {
        Tapjoy.setDebugEnabled(enabled)
    }
    
    @objc func isConnected() -> NSNumber {
        return NSNumber(value:Tapjoy.isConnected())
    }

    @objc func setUserId(_ userId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        Tapjoy.setUserIDWithCompletion(userId) { success, error in
            if (success) {
                resolve(userId)
            } else {
                reject(nil, nil, error)
            }
        }
    }
    
    // MARK: - Placements
    
    /**
     Request content for a given placement.
     - Parameter name: Case-sensitive placement name string. Must not be empty or null.
     */
    @objc func requestPlacement(_ name: String) {
        if let placement = TJPlacement(name: name, delegate: self) {
            placements[name] = placement
            placement.requestContent()
        }
    }
    
    /**
     Show content for a given placement.
     - Parameter name: Case-sensitive placement name string. Must not be empty or null.
     */
    @objc func showPlacement(_ name: String) {
        guard let placement = placements[name] as? TJPlacement else {
            return
        }
        placement.showContent(with: nil);
    }
    
    /**
     Check if content has been downloaded and ready to show for a given placement.
     - Parameter name: Case-sensitive placement name string. Must not be empty or null.
     */
    @objc func isContentReady(_ name: String) -> NSNumber? {
        guard let placement = placements[name] as? TJPlacement else {
            return NSNumber(value: false)
        }
        return NSNumber(value:placement.isContentReady)
    }

    /**
     Check if content is available to cache or stream for a given placement.
     - Parameter name: Case-sensitive placement name string. Must not be empty or null.
     */
    @objc func isContentAvailable(_ name: String) -> NSNumber? {
        guard let placement = placements[name] as? TJPlacement else {
            return NSNumber(value: false)
        }
        return NSNumber(value:placement.isContentAvailable)
    }
    
    // MARK: - Currency
    @objc func getCurrencyBalance(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        Tapjoy.getCurrencyBalance(completion: { parameters, error in
            if let error = error {
                reject(nil, nil, error)
            } else {
                resolve(parameters)
            }
        })
    }

    @objc func spendCurrency(_ amount: Int32, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        Tapjoy.spendCurrency(amount, completion: { parameters, error in 
            if let error = error {
                reject(nil, nil, error)
            } else {
                resolve(parameters)
            }
        })
    }

    @objc func awardCurrency(_ amount: Int32, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        Tapjoy.awardCurrency(amount, completion: { parameters, error in 
            if let error = error {
                reject(nil, nil, error)
            } else {
                resolve(parameters)
            }
        })
    }
    
    // MARK: - Privacy
    /**
      Indicate if the user falls in any of the GDPR applicable countries.
     - Parameter isSubjectToGDPR: true for enabling and false for disabling.
    */
    @objc func setSubjectToGDPR(_ isSubjectToGDPR: Bool) {
        Tapjoy.getPrivacyPolicy().setSubjectToGDPR(isSubjectToGDPR)
    }

    /**
     This method will set ad_tracking_enabled to false for Tapjoy which only shows the user contextual ads. No ad tracking will be done on this user.
     - Parameter isBelowConsentAge: true if the user is affected by COPPA, false if they are not.
    */
    @objc func setBelowConsentAge(_ isBelowConsentAge: Bool) {
        Tapjoy.getPrivacyPolicy().setBelowConsentAge(isBelowConsentAge)
    }

    /**
      This is used for sending US Privacy value to behavioral advertising such as in the context of GDPR.
     - Parameter privacyValue: The privacy value string. eg. "1YNN" where 1 is char in string for the version, Y = YES, N = No, - = Not Applicable
    */
    @objc func setUSPrivacy(_ privacyValue: String) {
        Tapjoy.getPrivacyPolicy().usPrivacy = privacyValue
    }

    /**
    * This is used for sending User's consent to behavioral advertising such as in the context of GDPR
    * - Parameter userConsent: The value can be "0" (User has not provided consent), "1" (User has provided consent) or a daisybit string as suggested in IAB's Transparency and Consent Framework
    */
    @objc func setUserConsent(_ userConsent: String) {
        Tapjoy.getPrivacyPolicy().setUserConsent(userConsent)
    }
}

extension TapjoyReactNativeSdk: TJPlacementDelegate {
    func requestDidSucceed(_ placement: TJPlacement) {
        attemptSendEvent(withName:"TapjoyPlacement", body: [ "name" : "requestDidSucceed", "placement": placement.placementName ])
    }

    func requestDidFail(_ placement: TJPlacement, error: Error?) {
        placements[placement.placementName] = nil
        attemptSendEvent(withName:"TapjoyPlacement", body: [ "name" : "requestDidFail", "placement": placement.placementName, "error" : error?.localizedDescription ])
    }

    func contentIsReady(_ placement: TJPlacement) {
        attemptSendEvent(withName:"TapjoyPlacement", body: [ "name" : "contentIsReady", "placement": placement.placementName ])
    }

    func contentDidAppear(_ placement: TJPlacement) {
        attemptSendEvent(withName:"TapjoyPlacement", body: [ "name" : "contentDidAppear", "placement": placement.placementName ])
    }

    func contentDidDisappear(_ placement: TJPlacement) {
        placements[placement.placementName] = nil
        attemptSendEvent(withName:"TapjoyPlacement", body: [ "name" : "contentDidDisappear", "placement": placement.placementName ])
    }
}
