export default class TJUtil {
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
//# sourceMappingURL=TJUtil.js.map