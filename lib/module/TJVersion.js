const REACT_LIBRARY_VERSION = '1.0.0';
const REACT_LIBRARY_VERSION_SUFFIX = 'alpha-rc1';
export class TJVersion {
  // Returns the version of the plugin - eg: 1.0.0-alpha-rc1
  static getPluginVersion() {
    if (REACT_LIBRARY_VERSION_SUFFIX) {
      return REACT_LIBRARY_VERSION + '-' + REACT_LIBRARY_VERSION_SUFFIX;
    } else {
      return REACT_LIBRARY_VERSION;
    }
  }
}
export default TJVersion;
//# sourceMappingURL=TJVersion.js.map