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
import java.util.Hashtable
import kotlin.collections.HashMap
import com.facebook.react.modules.core.DeviceEventManagerModule

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
    
    Tapjoy.connect(this.currentActivity?.applicationContext, sdkKey, connectFlags.toHashtable(), object : TJConnectListener {
      override fun onConnectSuccess() {
        Tapjoy.setActivity(currentActivity)
        promise.resolve(true)
      }

      override fun onConnectFailure() {
        promise.reject(messageConnectionFailed, Exception(messageConnectionFailed))
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

  @ReactMethod
  fun setDebugEnabled(enabled: Boolean) {
    Tapjoy.setDebugEnabled(enabled)
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  fun isConnected(): Boolean {
    return Tapjoy.isConnected()
  }

  /**
   * Request content for a given placement.
   *
   * @param placementName Case-sensitive placement name string. Must not be empty or null.
   */
  @ReactMethod
  fun requestPlacement(placementName: String) {
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
    placements[placement.name] = placement
    placement.requestContent()
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
   * Indicate if the user falls in any of the GDPR applicable countries
   *
   * @param gdprApplicable true if GDPR applies to this user, false otherwise
   */
  @ReactMethod
  fun setSubjectToGDPR(gdprApplicable: Boolean){
    Tapjoy.getPrivacyPolicy().setSubjectToGDPR(gdprApplicable)
  }
  /**
   * This method will set ad_tracking_enabled to false for Tapjoy which only shows the user contextual ads. No ad tracking will be done on this user.
   *
   * @param isBelowConsentAge true if below consent age (COPPA) applies to this user, false otherwise
   */
  @ReactMethod
  fun setBelowConsentAge(isBelowConsentAge: Boolean){
    Tapjoy.getPrivacyPolicy().setBelowConsentAge(isBelowConsentAge)
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
  @ReactMethod
  fun setUserConsent(userConsent: String){
    Tapjoy.getPrivacyPolicy().setUserConsent(userConsent)
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
