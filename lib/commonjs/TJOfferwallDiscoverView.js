import { findNodeHandle, requireNativeComponent, UIManager, } from 'react-native';
import React from 'react';
var Command;
(function (Command) {
    Command["REQUEST_CONTENT"] = "requestContent";
    Command["CLEAR_CONTENT"] = "clearContent";
})(Command || (Command = {}));
const TJOfferwallDiscoverNativeView = requireNativeComponent('TJOfferwallDiscoverNativeView');
export default class TJOfferwallDiscoverView extends React.Component {
    nativeCompHandle = null;
    constructor(props) {
        super(props);
    }
    render() {
        return (<TJOfferwallDiscoverNativeView {...this.props} ref={(ref) => {
                this.nativeCompHandle = findNodeHandle(ref);
            }}/>);
    }
    requestContent(placement) {
        UIManager.dispatchViewManagerCommand(this.nativeCompHandle, Command.REQUEST_CONTENT, [placement]);
    }
    clearContent() {
        UIManager.dispatchViewManagerCommand(this.nativeCompHandle, Command.CLEAR_CONTENT);
    }
}
