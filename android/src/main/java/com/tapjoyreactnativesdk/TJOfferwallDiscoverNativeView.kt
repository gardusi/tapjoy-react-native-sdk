package com.tapjoyreactnativesdk

import android.content.Context
import android.util.AttributeSet
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.UIManagerHelper
import com.tapjoy.TJError
import com.tapjoy.TJOfferwallDiscoverListener
import com.tapjoy.TJOfferwallDiscoverView
import com.facebook.react.uimanager.events.Event

class TJOfferwallDiscoverNativeView : TJOfferwallDiscoverView, TJOfferwallDiscoverListener {

    constructor(context: Context) : super(context)

    constructor(context: Context, attrs: AttributeSet) : super(context, attrs)

    constructor(context: Context, attrs: AttributeSet, defStyleAttr: Int) : super(context, attrs, defStyleAttr)

    /**
     * Request OfferwallDiscover content.
     *
     * @Param placement: Placement name.
     */
    fun requestContent(placement: String) {
        super.setListener(this)
        super.requestContent(context, placement)
    }

    // TJOfferwallDiscoverListener implementation.
    private fun sendEvent(event: Event<*>) {
        val reactContext = context as ReactContext
        UIManagerHelper
            .getEventDispatcherForReactTag(reactContext, id)
            ?.dispatchEvent(event)
    }

    override fun requestSuccess() {
        val data = Arguments.createMap().apply {
            putString("result", "requestSuccess")
        }
        sendEvent(OfferwallDiscoverEvent(UIManagerHelper.getSurfaceId(this), id, "onRequestSuccess", data))
    }

    override fun requestFailure(error: TJError) {
        val data = Arguments.createMap().apply {
            putInt("errorCode", error.code)
            putString("errorMessage", error.message)
        }
        sendEvent(OfferwallDiscoverEvent(UIManagerHelper.getSurfaceId(this), id, "onRequestFailure", data))
    }

    override fun contentReady() {
        val data = Arguments.createMap().apply {
            putString("result", "contentReady")
        }
        sendEvent(OfferwallDiscoverEvent(UIManagerHelper.getSurfaceId(this), id, "onContentReady", data))
    }

    override fun contentError(error: TJError) {
        val data = Arguments.createMap().apply {
            putInt("errorCode", error.code)
            putString("errorMessage", error.message)
        }
        sendEvent(OfferwallDiscoverEvent(UIManagerHelper.getSurfaceId(this), id, "onContentError", data))
    }

    override fun requestLayout() {
        super.requestLayout()
        post(measureAndLayout)
    }

    private val measureAndLayout = Runnable {
        measure(MeasureSpec.makeMeasureSpec(width, MeasureSpec.EXACTLY),
                MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY))
        layout(left, top, right, bottom)
    }
}

class OfferwallDiscoverEvent(surfaceId: Int, viewId: Int, private val eventName: String, private val data: WritableMap) : Event<OfferwallDiscoverEvent>(surfaceId, viewId) {
    override fun getEventName() = eventName

    // All events for a given view can be coalesced.
    override fun getCoalescingKey(): Short = 0

    override fun getEventData(): WritableMap? = data

}