"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.TJVersion = void 0;
const REACT_LIBRARY_VERSION = "13.1.2";
const REACT_LIBRARY_VERSION_SUFFIX = "";
class TJVersion {
  // Returns the version of the plugin - eg: 1.0.0-alpha-rc1
  static getPluginVersion() {
    if (REACT_LIBRARY_VERSION_SUFFIX) {
      return REACT_LIBRARY_VERSION + '-' + REACT_LIBRARY_VERSION_SUFFIX;
    } else {
      return REACT_LIBRARY_VERSION;
    }
  }
}
exports.TJVersion = TJVersion;
var _default = TJVersion;
exports.default = _default;
//# sourceMappingURL=TJVersion.js.map