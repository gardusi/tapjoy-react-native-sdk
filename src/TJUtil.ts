export default class TJUtil {
  static isValidDimensionValue(value: any): boolean {
    if (typeof value !== 'number' && /[0-9]+%|auto/.test(value)) {
      return true;
    } else if (typeof value === 'number' && !isNaN(value)) {
      return true;
    }
    return false;
  }

  static isValidNumber(value: any): boolean {
    return typeof value === 'number' && !isNaN(value);
  }
}
