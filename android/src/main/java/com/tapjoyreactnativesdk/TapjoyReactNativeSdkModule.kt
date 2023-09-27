package com.tapjoyreactnativesdk

import com.facebook.react.bridge.*
import com.tapjoy.TJConnectListener
import com.tapjoy.TJGetCurrencyBalanceListener
import com.tapjoy.TJSpendCurrencyListener
import com.tapjoy.TJAwardCurrencyListener
import com.tapjoy.TJSetUserIDListener
import com.tapjoy.Tapjoy
import com.tapjoy.TapjoyConnectCore
import com.tapjoy.TJError;
import com.tapjoy.TJPlacement;
import com.tapjoy.TJActionRequest;
import com.tapjoy.TJPlacementListener;
import com.tapjoy.TJSetCurrencyBalanceListener;
import com.tapjoy.TJSetCurrencyAmountRequiredListener;
import com.tapjoy.TJStatus;
import com.tapjoy.TJPrivacyPolicy;
import com.tapjoy.TJSegment;
import com.tapjoy.TJEntryPoint
import java.util.Hashtable
import kotlin.collections.HashMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.lang.Exception

class TapjoyReactNativeSdkModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  val messageConnectionFailed = "connection failed"
  var placements = HashMap<String, TJPlacement>()

  companion object {
    const val NAME = "TapjoyReactNativeSdk"
  }

  override fun getName(): String {
    return NAME
  }

  override fun getConstants(): Map<String, kotlin.Any> {
    return HashMap();
  }

  private var listenerCount = 0

  private fun sendEvent(eventName: String, params: WritableMap?) {
    if (listenerCount > 0) {
        reactApplicationContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit(eventName, params)
    }
  }

  @ReactMethod
  fun addListener(eventName: String) {
    listenerCount += 1
  }

  @ReactMethod
  fun removeListeners(count: Int) {
    listenerCount -= count
  }

  /**
   * Connect to Tapjoy.This class has no useful logic; it's just a documentation example.
   *
   * @Param sdkKey:   SDK key the app.
   * @Param connectFlags: Dictionary for the connection flag values.@param T the type of a member in this group.
   * @return true to javascript if it is succeeded otherwise throws error
   */
  @ReactMethod
  fun connect(sdkKey: String, connectFlags: ReadableMap, promise: Promise) {
    TapjoyConnectCore.setPlugin("ReactNative");

    Tapjoy.connect(this.currentActivity?.applicationContext, sdkKey, connectFlags.toHashtable(), object : TJConnectListener() {
      override fun onConnectSuccess() {
        Tapjoy.setActivity(currentActivity)
        promise.resolve(true)
      }

      override fun onConnectFailure(code: Int, message: String) {
        promise.reject(code.toString(), message, Exception(message))
      }
    })
  }

  @ReactMethod
  fun getCurrencyBalance(promise: Promise) {
    Tapjoy.getCurrencyBalance(object : TJGetCurrencyBalanceListener {

      override fun onGetCurrencyBalanceResponse(currencyName: String, balance: Int) {
        val currencyObj = Arguments.createMap().apply {
          putString("currencyName", currencyName)
          putInt("amount", balance)
        }
        promise.resolve(currencyObj)
      }

      override fun onGetCurrencyBalanceResponseFailure(error: String) {
        promise.reject(error)
      }
    })
  }

  @ReactMethod
  fun spendCurrency(amount: Int, promise: Promise) {
    Tapjoy.spendCurrency(amount, object : TJSpendCurrencyListener {

      override fun onSpendCurrencyResponse(currencyName: String, balance: Int) {
        val currencyObj = Arguments.createMap().apply {
          putString("currencyName", currencyName)
          putInt("amount", balance)
        }
        promise.resolve(currencyObj)
      }

      override fun onSpendCurrencyResponseFailure(error: String) {
        promise.reject(error)
      }
    })
  }

  @ReactMethod
  fun awardCurrency(amount: Int, promise: Promise) {
    Tapjoy.awardCurrency(amount, object : TJAwardCurrencyListener {

      override fun onAwardCurrencyResponse(currencyName: String, balance: Int) {
        val currencyObj = Arguments.createMap().apply {
          putString("currencyName", currencyName)
          putInt("amount", balance)
        }
        promise.resolve(currencyObj)
      }

      override fun onAwardCurrencyResponseFailure(error: String) {
        promise.reject(error)
      }
    })
  }

  @ReactMethod
  fun setUserId(userId: String, promise: Promise) {
    Tapjoy.setUserID(userId, object: TJSetUserIDListener {
      override fun onSetUserIDSuccess() {
        promise.resolve(userId)
      }

      override fun onSetUserIDFailure(error: String?) {
        promise.reject("Set User ID Error", Exception(error))
      }
    })
  }

  /**
   * Sets the segment of the user
   *
   * @Param userSegment: NON_PAYER (0), PAYER (1), VIP (2)
   *
   */
  @ReactMethod
  fun setUserSegment(userSegment: Int) {
    if (userSegment == -1){
      Tapjoy.setUserSegment(TJSegment.UNKNOWN)
    } else {
      Tapjoy.setUserSegment(TJSegment.values()[userSegment])
    }
  }

  /**
   * Sets the segment of the user
   *
   * @return userSegment NON_PAYER (0), PAYER (1), VIP (2)
   *
   */
  @ReactMethod
  fun getUserSegment(promise: Promise) {
    val segment = Tapjoy.getUserSegment()
    promise.resolve(segment?.getValue() ?: TJSegment.UNKNOWN.getValue())
  }

  /** Sets the maximum level of the user.
   *
   * @Param maxLevel: the maximum level
   */
  @ReactMethod
  fun setMaxLevel(maxLevel: Int) {
    Tapjoy.setMaxLevel(maxLevel);
  }

  @ReactMethod
  fun setDebugEnabled(enabled: Boolean) {
    Tapjoy.setDebugEnabled(enabled)
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  fun isConnected(): Boolean {
    return Tapjoy.isConnected()
  }

  /**
   * Creates a new placement with the specified name.
   *
   * @param placementName Case-sensitive placement name string. Must not be empty or null.
   */
  @ReactMethod
  fun createPlacement(placementName: String) {
    val listener = object : TJPlacementListener {
      override fun onRequestSuccess(placement: TJPlacement) {
        val parameters = Arguments.createMap().apply {
          putString("name", "requestDidSucceed")
          putString("placement", placement.name)
        }
        sendEvent("TapjoyPlacement", parameters)
      }

      override fun onRequestFailure(placement: TJPlacement, error: TJError) {
        val parameters = Arguments.createMap().apply {
          putString("name", "requestDidFail")
          putString("placement", placement.name)
          putString("error", error.message)
        }
        sendEvent("TapjoyPlacement", parameters)
        placements.remove(placement.name)
      }

      override fun onContentReady(placement: TJPlacement) {
        val parameters = Arguments.createMap().apply {
          putString("name", "contentIsReady")
          putString("placement", placement.name)
        }
        sendEvent("TapjoyPlacement", parameters)
      }

      override fun onContentShow(placement: TJPlacement) {
        val parameters = Arguments.createMap().apply {
          putString("name", "contentDidAppear")
          putString("placement", placement.name)
        }
        sendEvent("TapjoyPlacement", parameters)
      }

      override fun onContentDismiss(placement: TJPlacement) {
        val parameters = Arguments.createMap().apply {
          putString("name", "contentDidDisappear")
          putString("placement", placement.name)
        }
        sendEvent("TapjoyPlacement", parameters)
        placements.remove(placement.name)
      }

      override fun onPurchaseRequest(placement: TJPlacement, actionRequest: TJActionRequest, name: String) {

      }

      override fun onRewardRequest(placement: TJPlacement, actionRequest: TJActionRequest, currencyName: String, value: Int) {

      }

      override fun onClick(placement: TJPlacement) {

      }
    }
    val placement = Tapjoy.getPlacement(placementName, listener)
    placements[placementName] = placement
  }

  /**
   * Request content for a given placement.
   *
   * @param placementName Case-sensitive placement name string. Must not be empty or null.
   */
  @ReactMethod
  fun requestPlacement(placementName: String) {
    val placement = placements[placementName]
    placement?.requestContent()
  }

  /**
   * Show content for a given placement.
   *
   * @param placementName Case-sensitive placement name string. Must not be empty or null.
   */
  @ReactMethod
  fun showPlacement(placementName: String) {
    placements[placementName]?.showContent()
  }

  /**
   * Check if content has been downloaded and ready to show for a given placement.
   *
   * @param placementName Case-sensitive placement name string. Must not be empty or null.
   *
   * @return true if content has been cached and ready to show.
   */
  @ReactMethod(isBlockingSynchronousMethod = true)
  fun isContentReady(placementName: String): Boolean {
    return placements[placementName]?.isContentReady ?: false
  }

  /**
   * Check if content is available to cache or stream for a given placement.
   *
   * @param placementName Case-sensitive placement name string. Must not be empty or null.
   *
   * @return true if content is available to cache or stream.
   */
  @ReactMethod(isBlockingSynchronousMethod = true)
  fun isContentAvailable(placementName: String): Boolean {
    return placements[placementName]?.isContentAvailable ?: false
  }

  /**
   * Sets the currency balance for a specific placement and currency.
   *
   * @param {Int} currencyAmount - The amount of the currency to set.
   * @param {String} currencyId - The identifier of the currency.
   * @param {String} placementName - The name of the placement.
   * @param {Promise} promise - The promise to fulfill after setting the balance.
   */
  @ReactMethod
  fun setCurrencyBalance(currencyAmount: Int, currencyId: String, placementName: String, promise: Promise) {
    placements[placementName]?.setCurrencyBalance(currencyId, currencyAmount, object : TJSetCurrencyBalanceListener {
      override fun onSetCurrencyBalanceSuccess() {
        promise.resolve(true)
      }

      override fun onSetCurrencyBalanceFailure(code: Int, message: String) {
        promise.reject(code.toString(), message, Exception(message))
      }
    })
  }

  /**
   * Gets the currency balance for a specific placement and currency.
   *
   * @param {String} currencyId - The identifier of the currency.
   * @param {String} placementName - The name of the placement.
   * @return {Promise} amount - The promise to fulfill after getting the balance.
   */
  @ReactMethod
  fun getPlacementCurrencyBalance(currencyId: String, placementName: String, promise: Promise) {
    promise.resolve(placements[placementName]?.getCurrencyBalance(currencyId))
  }

  /**
   * Sets the currency amount required
   *
   * @param currencyAmount The amount of the currency the use needs. Must be greater than 0.
   * @param currencyId The identifier of the currency.
   * @param placementName The name of the placement.
   * @return The promise to fulfill after getting the balance.
   */
  @ReactMethod
  fun setRequiredAmount(currencyAmount: Int, currencyId: String, placementName: String,  promise: Promise) {
    val placement = placements[placementName]
    if (placement == null) {
      promise.reject("Placement not found", "Placement does not exist.", Exception("Placement not found"))
      return
    }
    placement?.setCurrencyAmountRequired(currencyId, currencyAmount, object : TJSetCurrencyAmountRequiredListener {
      override fun onSetCurrencyAmountRequiredSuccess() {
        promise.resolve(true)
      }

      override fun onSetCurrencyAmountRequiredFailure(code: Int, message: String) {
        promise.reject(code.toString(), message, Exception(message))
      }
    })
  }

  /**
   * Gets the currency amount required
   *
   * @param currencyId The identifier of the currency.
   * @return The amount of the required currency, -1 if not available.
   */
  @ReactMethod
  fun getRequiredAmount(currencyId: String, placementName: String,  promise: Promise) {
    val placement = placements[placementName]
    if (placement == null) {
      promise.resolve(-1)
      return
    }
    promise.resolve(placements[placementName]?.getCurrencyAmountRequired(currencyId))
  }

  /**
   * Sets the entry point for given placement name.
   *
   * @param {Int} entryPoint The entry point ordinal to set.
   * @see TJEntryPoint
   */
  @ReactMethod
  fun setEntryPoint(placementName: String, entryPoint: Int) {
    placements[placementName]?.setEntryPoint(TJEntryPoint.fromOrdinal(entryPoint))
  }

  /**
   * Gets the entry point for given placement name.
   *
   * @return {Int} entryPoint The entry point ordinal to set.
   * @see TJEntryPoint
   */
  @ReactMethod
  fun getEntryPoint(placementName: String, promise: Promise) {
    promise.resolve(placements[placementName]?.getEntryPoint()?.ordinal)
  }

   /**
   * Indicate if the user falls in any of the GDPR applicable countries
   *
   * @param gdprApplicable true if GDPR applies to this user, false otherwise
   */
  @Deprecated("Use setSubjectToGDPRStatus instead", ReplaceWith("setSubjectToGDPR(gdprApplicable)"))
  @ReactMethod
  fun setSubjectToGDPR(gdprApplicable: Boolean){
    Tapjoy.getPrivacyPolicy().setSubjectToGDPR(gdprApplicable)
  }

   /**
   * Indicate if the user falls in any of the GDPR applicable countries
   *
   * @param gdprApplicable true (1) if GDPR applies to this user, false (0) otherwise
   */
  @ReactMethod
  fun setSubjectToGDPRStatus(gdprApplicableStatus: Int) {
    val status = TJStatus.values()[gdprApplicableStatus]
    Tapjoy.getPrivacyPolicy().setSubjectToGDPR(status)
  }

  /**
   * Returns the consent age (COPPA) flag applied to the user.
   *
   * @return TJStatus.TRUE (1) if below consent age (COPPA) applies to this user, TJStatus.FALSE (0) otherwise
   */
  @ReactMethod
  fun getBelowConsentAge(promise: Promise) {
    val getPrivacyPolicy = Tapjoy.getPrivacyPolicy()
    if (getPrivacyPolicy == null) {
        promise.reject("Get Below Consent Age Error", Exception("error"))
        return
    }
    val belowConsentAge = getPrivacyPolicy.getBelowConsentAge()?.getValue() ?: TJStatus.UNKNOWN.getValue()
    promise.resolve(belowConsentAge)
  }

  /**
   * Returns configured GDPR value.
   * The value should be returned to TRUE when User (Subject) is applicable to GDPR regulations
   * and FALSE when User is not applicable to GDPR regulations.
   *
   * @return TJStatus.TRUE (1) if GDPR applies to this user, TJStatus.FALSE (0) otherwise
   */
  @ReactMethod
  fun getSubjectToGDPR(promise: Promise) {
    val getPrivacyPolicy = Tapjoy.getPrivacyPolicy()
    if (getPrivacyPolicy == null) {
        promise.reject("Get Subject To GDPR Error", Exception("error"))
        return
    }
    val isSubjectToGDPR = getPrivacyPolicy.getSubjectToGDPR()?.getValue() ?: TJStatus.UNKNOWN.getValue()
    promise.resolve(isSubjectToGDPR)
  }

  /**
   * Returns user's consent to behavioral advertising such as in the context of GDPR
   * The consent value can be TJStatus.FALSE (0) (User has not provided consent), TJStatus.TRUE(1) (User has provided consent).
   *
   * @return The user consent value
   */
  @ReactMethod
  fun getUserConsent(promise: Promise) {
    val getPrivacyPolicy = Tapjoy.getPrivacyPolicy()
    if (getPrivacyPolicy == null) {
        promise.reject("Get User Consent Error", Exception("error"))
        return
    }
    val userConsent = getPrivacyPolicy.getUserConsent()?.getValue() ?: TJStatus.UNKNOWN.getValue()
    promise.resolve(userConsent)
  }

  /**
   * Returns US Privacy value to behavioral advertising such as in the context of CCPA
   *
   * @return The us privacy value string
   */
  @ReactMethod
  fun getUSPrivacy(promise: Promise) {
    val privacyPolicy = Tapjoy.getPrivacyPolicy()
    if (privacyPolicy != null) {
      promise.resolve(privacyPolicy.getUSPrivacy() ?: "")
    } else {
      promise.reject("Get US Privacy Error", Exception("error"))
    }
  }

  /**
   * This method will set ad_tracking_enabled to false for Tapjoy which only shows the user contextual ads. No ad tracking will be done on this user.
   *
   * @param isBelowConsentAge true if below consent age (COPPA) applies to this user, false otherwise
   */
  @Deprecated("Use setBelowConsentAgeStatus instead", ReplaceWith("setBelowConsentAgeStatus(isBelowConsentAgeStatus)"))
  @ReactMethod
  fun setBelowConsentAge(isBelowConsentAge: Boolean){
    Tapjoy.getPrivacyPolicy().setBelowConsentAge(isBelowConsentAge)
  }

  /**
   * This method will set ad_tracking_enabled to false for Tapjoy which only shows the user contextual ads. No ad tracking will be done on this user.
   *
   * @param isBelowConsentAge true (1) if below consent age (COPPA) applies to this user, false (0) otherwise
   */
  @ReactMethod
  fun setBelowConsentAgeStatus(isBelowConsentAgeStatus: Int) {
    val status = TJStatus.values()[isBelowConsentAgeStatus]
    Tapjoy.getPrivacyPolicy().setBelowConsentAge(status)
  }
  /**
   * This is used for sending US Privacy value to behavioral advertising such as in the context of GDPR
   *
   * @param privacyValue The privacy value string eg. "1YNN" where 1 is char in string for the version, Y = YES, N = No, - = Not Applicable
   */
  @ReactMethod
  fun setUSPrivacy(isUsPrivacy: String){
    Tapjoy.getPrivacyPolicy().setUSPrivacy(isUsPrivacy)
  }

   /**
   * This is used for sending User's consent to behavioral advertising such as in the context of GDPR
   *
   * @param userConsent The value can be "0" (User has not provided consent), "1" (User has provided consent) or a daisybit string as suggested in IAB's Transparency and Consent Framework
   */
  @Deprecated("Use setUserConsentStatus instead", ReplaceWith("setUserConsentStatus(userConsentStatus)"))
  @ReactMethod
  fun setUserConsent(userConsent: String){
    Tapjoy.getPrivacyPolicy().setUserConsent(userConsent)
  }
   /**
   * This is used for sending User's consent to behavioral advertising such as in the context of GDPR
   *
   * @param userConsent The value can be "0" (User has not provided consent), "1" (User has provided consent) or a daisybit string as suggested in IAB's Transparency and Consent Framework
   */
  @ReactMethod
  fun setUserConsentStatus(userConsentStatus: Int) {
    val status = TJStatus.values()[userConsentStatus]
    Tapjoy.getPrivacyPolicy().setUserConsent(status)
  }

  @ReactMethod
  fun optOutAdvertisingID(optOut: Boolean) {
    Tapjoy.optOutAdvertisingID(this.currentActivity?.applicationContext, optOut)
  }

  private fun ReadableMap.toHashtable(): Hashtable<String, Any> {
    val hashtable = Hashtable<String, Any>()
    val iterator = this.keySetIterator()
    while (iterator.hasNextKey()) {
      val key = iterator.nextKey()
      val value = this.getString(key)
      hashtable[key] = value?: continue
    }
    return hashtable
  }
}
