package com.tapjoyreactnativesdk

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext

enum class Command(private val value:String) {
    REQUEST_CONTENT("requestContent"),
    CLEAR_CONTENT("clearContent");

    fun getValue(): String {
        return value
    }
}

class TJOfferwallDiscoverNativeViewManager(
        private val callerContext: ReactApplicationContext
) : SimpleViewManager<TJOfferwallDiscoverNativeView>() {

    var view: TJOfferwallDiscoverNativeView? = null;
    override fun getName() = REACT_CLASS

    companion object {
        const val REACT_CLASS = "TJOfferwallDiscoverNativeView"
    }

    override fun createViewInstance(context: ThemedReactContext): TJOfferwallDiscoverNativeView {
        return TJOfferwallDiscoverNativeView(context)
    }

    override fun receiveCommand(view: TJOfferwallDiscoverNativeView, commandId: String, args: ReadableArray?) {
        super.receiveCommand(view, commandId, args)
        if (commandId == Command.REQUEST_CONTENT.getValue()) {
            view.requestContent(args!!.getString(0))
        } else if (commandId == Command.CLEAR_CONTENT.getValue()) {
            view.clearContent()
        }
    }

    override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any?>? {
        return MapBuilder.of<String, Any?>(
            "onRequestSuccess", MapBuilder.of("registrationName", "onRequestSuccess"),
            "onRequestFailure", MapBuilder.of("registrationName", "onRequestFailure"),
            "onContentReady", MapBuilder.of("registrationName", "onContentReady"),
            "onContentError", MapBuilder.of("registrationName", "onContentError")
        )
    }
}