function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import { findNodeHandle, requireNativeComponent, UIManager } from 'react-native';
import React from 'react';
var Command = /*#__PURE__*/function (Command) {
  Command["REQUEST_CONTENT"] = "requestContent";
  Command["CLEAR_CONTENT"] = "clearContent";
  return Command;
}(Command || {});
const TJOfferwallDiscoverNativeView = requireNativeComponent('TJOfferwallDiscoverNativeView');
export default class TJOfferwallDiscoverView extends React.Component {
  nativeCompHandle = null;
  constructor(props) {
    super(props);
  }
  render() {
    return /*#__PURE__*/React.createElement(TJOfferwallDiscoverNativeView, _extends({}, this.props, {
      ref: ref => {
        this.nativeCompHandle = findNodeHandle(ref);
      }
    }));
  }
  requestContent(placement) {
    UIManager.dispatchViewManagerCommand(this.nativeCompHandle, Command.REQUEST_CONTENT, [placement]);
  }
  clearContent() {
    UIManager.dispatchViewManagerCommand(this.nativeCompHandle, Command.CLEAR_CONTENT);
  }
}
//# sourceMappingURL=TJOfferwallDiscoverView.js.map