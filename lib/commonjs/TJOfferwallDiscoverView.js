"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _reactNative = require("react-native");
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var Command = /*#__PURE__*/function (Command) {
  Command["REQUEST_CONTENT"] = "requestContent";
  Command["CLEAR_CONTENT"] = "clearContent";
  return Command;
}(Command || {});
const TJOfferwallDiscoverNativeView = (0, _reactNative.requireNativeComponent)('TJOfferwallDiscoverNativeView');
class TJOfferwallDiscoverView extends _react.default.Component {
  nativeCompHandle = null;
  constructor(props) {
    super(props);
  }
  render() {
    return /*#__PURE__*/_react.default.createElement(TJOfferwallDiscoverNativeView, _extends({}, this.props, {
      ref: ref => {
        this.nativeCompHandle = (0, _reactNative.findNodeHandle)(ref);
      }
    }));
  }
  requestContent(placement) {
    _reactNative.UIManager.dispatchViewManagerCommand(this.nativeCompHandle, Command.REQUEST_CONTENT, [placement]);
  }
  clearContent() {
    _reactNative.UIManager.dispatchViewManagerCommand(this.nativeCompHandle, Command.CLEAR_CONTENT);
  }
}
exports.default = TJOfferwallDiscoverView;
//# sourceMappingURL=TJOfferwallDiscoverView.js.map