"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
class TJUtil {
  static isValidDimensionValue(value) {
    if (typeof value !== 'number' && /[0-9]+%|auto/.test(value)) {
      return true;
    } else if (typeof value === 'number' && !isNaN(value)) {
      return true;
    }
    return false;
  }
  static isValidNumber(value) {
    return typeof value === 'number' && !isNaN(value);
  }
}
exports.default = TJUtil;
//# sourceMappingURL=TJUtil.js.map