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
            if let error = notifyObj.userInfo?[TJC_CONNECT_USER_INFO_ERROR] as? NSError {
                var message = error.localizedDescription
                if let underlyingError = error.userInfo[NSUnderlyingErrorKey] as? NSError {
                    message.append("\nUnderlying Error: \(underlyingError.code) - \(underlyingError.localizedDescription)")
                }
                storedReject(String(error.code), message, error)
            }else{
                storedReject("Connect Error" ,"Tapjoy Connect Failed", nil)
            }
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

    /**
    * Sets the segment of the user
    *
    * @param userSegment TJSegment enum 0 (non-payer), 1 (payer), 2 (VIP), -1 (unknown)
    */
    @objc func setUserSegment(_ userSegment: NSNumber) {
        let segmentMap: [Int: TJSegment] = [
            0: .nonPayer,
            1: .payer,
            2: .VIP
        ]
        let segment = segmentMap[Int(userSegment)] ?? .unknown
        Tapjoy.setUserSegment(segment)
    }

    /**
    * Gets the segment of the user
    *
    * @return TJSegment enum 0 (non-payer), 1 (payer), 2 (VIP), -1 (unknown).
    */
    @objc func getUserSegment(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        do {
            let segment = Tapjoy.getUserSegment()
            resolve(segment.rawValue)
        } catch let error {
            reject("getUserSegment failed", "Failed to get user segment", error)
        }
    }
    
    /**
     Sets the maximum level of the user.
     - Parameter maxLevel: the maximum level
     */
    @objc func setMaxLevel(_ maxLevel: Int32) {
        Tapjoy.setMaxLevel(maxLevel)
    }
    
    // MARK: - Placements

    /**
     Create content for a given placement.
     - Parameter name: Case-sensitive placement name string. Must not be empty or null.
     */
    @objc func createPlacement(_ name: String) -> TJPlacement? {
        if let placement = TJPlacement(name: name, delegate: self) {
           placements[name] = placement
           return placement
        }
        return nil
    }

    /**
     Request content for a given placement.
     - Parameter name: Case-sensitive placement name string. Must not be empty or null.
     */
    @objc func requestPlacement(_ name: String) {
        guard let placement = placements[name] as? TJPlacement else {
            return
        }
        placement.requestContent()
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

    /**
     Set entry point.
     - Parameter name: Case-sensitive placement name string. Must not be empty or null.
     - Parameter entryPoint: entry point parameter. Please check out detail from ``TJEntryPoint.h``
     */
    @objc func setEntryPoint(_ name: String, entryPoint: NSNumber) {
        guard let placement = placements[name] as? TJPlacement else {
            return
        }

        if let entryPointEnum = TJEntryPoint(rawValue:  UInt(entryPoint.intValue)) {
            placement.entryPoint = entryPointEnum
        }
    }

    /**
     Get entry point.
     - Parameter name: Case-sensitive placement name string. Must not be empty or null.
     - Returns: Entry point parameter. Please check out detail from ``TJEntryPoint.h``
     */
    @objc func getEntryPoint(_ name: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let placement = placements[name] as? TJPlacement else {
            reject("Placement not found", "Placement does not exist.", nil)
            return
        }
        resolve(placement.entryPoint.rawValue)
    }

    /**
     Set currency balance.
     - Parameter name: Case-sensitive placement name string. Must not be empty or null.
     - Parameter currencyId : Currency ID for target self-managed currency.
     - Parameter amount : Amount of for the currency.
     */
    @objc func setCurrencyBalance(_ amount: Int32, currencyId: String, placementName: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let placement = placements[placementName] as? TJPlacement else {
            reject("Placement not found", "Placement does not exist.", nil)
            return
        }

        placement.setBalance(Int(amount), forCurrencyId: currencyId, withCompletion: { error in
            if let error = error as? NSError {
                reject(String(error.code), error.localizedDescription, error)
            } else {
                resolve(nil)
            }
        })
    }

    /**
     Get currency balance.
     - Parameter name: Case-sensitive placement name string. Must not be empty or null.
     - Parameter currencyId : Currency ID for target self-managed currency.
     - Returns : Currency amount.
     */
    @objc func getPlacementCurrencyBalance(_ currencyId: String, placementName: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let placement = placements[placementName] as? TJPlacement else {
            reject("Placement not found", "Placement does not exist.", nil)
            return
        }
        resolve(placement.getBalanceForCurrencyId(currencyId))
    }
    
    /**
    Sets the currency amount required
    - Parameter requiredAmount The amount of currency the user needs. Must be greater than 0.
    - Parameter currencyId The identifier of the currency.
    - Parameter placementName Case-sensitive placement name string. Must not be empty or null.
    */
    @objc func setRequiredAmount(_ requiredAmount: Int, currencyId: String, placementName: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let placement = placements[placementName] as? TJPlacement else {
            reject("Placement not found", "Placement does not exist.", nil)
            return
        }
        
        placement.setRequiredAmount(requiredAmount, forCurrencyId: currencyId) { error in
            if let error = error as? NSError {
                reject(String(error.code), error.localizedDescription, error)
            } else {
                resolve(nil)
            }
        }
    }

    /**
    Gets the currency amount required.
    - Parameter currencyId: The identifier of the currency.
    - Parameter placementName: Case-sensitive placement name string. Must not be empty or null.
    - Returns: The amount of currency the user needs. -1 if not available.
    */
    @objc func getRequiredAmount(_ currencyId: String, placementName: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let placement = placements[placementName] as? TJPlacement else {
            resolve(-1)
            return
        }
        resolve(placement.getRequiredAmount(forCurrencyId: currencyId))
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
    @available(*, deprecated, message: "Use `setSubjectToGDPRStatus(_:)` instead.")
    @objc func setSubjectToGDPR(_ isSubjectToGDPR: Bool) {
        Tapjoy.getPrivacyPolicy().setSubjectToGDPR(isSubjectToGDPR)
    }

    /**
     * This can be used by the integrating App to indicate if the user falls in any of the GDPR applicable countries
     * (European Economic Area). The value should be set to YES when User (Subject) is applicable to GDPR regulations
     * and NO when User is not applicable to GDPR regulations. In the absence of this call, Tapjoy server makes the
     * determination of GDPR applicability.
     *
     * subjectToGDPR = YES if the user is affected by GDPR, NO if they are not.
     */
    @objc func setSubjectToGDPRStatus(_ isSubjectToGDPRStatus: NSNumber) {
        let subjectToGDPRStatus = convertValueToStatus(value: Int(isSubjectToGDPRStatus))
        TJPrivacyPolicy.sharedInstance().subjectToGDPRStatus = subjectToGDPRStatus
    }

    /**
     This method will set ad_tracking_enabled to false for Tapjoy which only shows the user contextual ads. No ad tracking will be done on this user.
     - Parameter isBelowConsentAge: true if the user is affected by COPPA, false if they are not.
    */
    @available(*, deprecated, message: "Use `setBelowConsentAgeStatus(_:)` instead.")
    @objc func setBelowConsentAge(_ isBelowConsentAge: Bool) {
        Tapjoy.getPrivacyPolicy().setBelowConsentAge(isBelowConsentAge)
    }
    /**
     * In the US, the Children’s Online Privacy Protection Act (COPPA) imposes certain requirements on operators of online services that (a)
     * have actual knowledge that the connected user is a child under 13 years of age, or (b) operate services (including apps) that are
     * directed to children under 13.
     *
     * Similarly, the GDPR imposes certain requirements in connection with data subjects who are below the applicable local minimum age for
     * online consent (ranging from 13 to 16, as established by each member state).
     *
     * For applications that are not directed towards children under 13 years of age, but still have a minority share of users known to be
     * under the applicable minimum age, utilize this method to access Tapjoy’s monetization capability. This method will set
     * ad_tracking_enabled to false for Tapjoy which only shows the user contextual ads. No ad tracking will be done on this user.
     *
     * belowConsentAge = YES if the user is affected by COPPA, NO if they are not.
     */
    @objc func setBelowConsentAgeStatus(_ isBelowConsentAgeStatus: NSNumber) {
        let belowConsentAgeStatus = convertValueToStatus(value: Int(isBelowConsentAgeStatus))
        TJPrivacyPolicy.sharedInstance().belowConsentAgeStatus = belowConsentAgeStatus
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
    @available(*, deprecated, message: "Use `setUserConsentStatus(_:)` instead.")
    @objc func setUserConsent(_ userConsent: String) {
        Tapjoy.getPrivacyPolicy().setUserConsent(userConsent)
    }
    /**
     * This is used for sending User's consent to behavioral advertising such as in the context of GDPR
     * The consent value can be "0" (User has not provided consent), "1" (User has provided consent) or
     * a daisybit string as suggested in IAB's Transparency and Consent Framework
     *
     * userConsent = "0" (User has not provided consent), "1" (User has provided consent) or a daisybit string as suggested in IAB's Transparency and Consent Framework
     */
    @objc func setUserConsentStatus(_ userConsentStatus: NSNumber) {
        let userConsent = convertValueToStatus(value: Int(userConsentStatus))
        TJPrivacyPolicy.sharedInstance().userConsentStatus = userConsent
    }

    /**
     * Returns the consent age (COPPA) flag applied to the user.
     *
     * @return TJStatus.TRUE (1) if below consent age (COPPA) applies to this user, TJStatus.FALSE (0) otherwise
     */
    @objc func getBelowConsentAge(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        do {
            let privacyPolicy = Tapjoy.getPrivacyPolicy()
            resolve(privacyPolicy.belowConsentAgeStatus.rawValue)
        } catch let error {
            reject("getPrivacyPolicy_failed", "Failed to get below consent age status privacy policy", error)
        }
    }

    /**
     * Returns configured GDPR value.
     * The value should be returned to TRUE when User (Subject) is applicable to GDPR regulations
     * and FALSE when User is not applicable to GDPR regulations.
     *
     * @return TJStatus.TRUE (1) if GDPR applies to this user, TJStatus.FALSE (0) otherwise
     */
    @objc func getSubjectToGDPR(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        do {
            let privacyPolicy = Tapjoy.getPrivacyPolicy()
            resolve(privacyPolicy.subjectToGDPRStatus.rawValue)
        } catch let error {
            reject("getPrivacyPolicy_failed", "Failed to get GDPR Status privacy policy", error)
        }
    }

    /**
     * Returns user's consent to behavioral advertising such as in the context of GDPR
     * The consent value can be TJStatus.FALSE (0) (User has not provided consent), TJStatus.TRUE(1) (User has provided consent).
     *
     * @return The user consent value
     */
    @objc func getUserConsent(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        do {
            let privacyPolicy = Tapjoy.getPrivacyPolicy()
            resolve(privacyPolicy.userConsentStatus.rawValue)
        } catch let error {
            reject("getPrivacyPolicy_failed", "Failed to get user consent status privacy policy", error)
        }
    }

    /**
     * Returns US Privacy value to behavioral advertising such as in the context of CCPA
     *
     * @return The us privacy value string
     */
    @objc func getUSPrivacy(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        do {
            let privacyPolicy = Tapjoy.getPrivacyPolicy()
            resolve(privacyPolicy.usPrivacy ?? "")
        } catch let error {
            reject("getPrivacyPolicy_failed", "Failed to get privacy policy", error)
        }
    }

    func convertValueToStatus(value: Int) -> TJStatus {
        switch (value) {
            case 0:
                return TJStatus.false
            case 1:
                return TJStatus.true
            default:
                return TJStatus.unknown
        }
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
