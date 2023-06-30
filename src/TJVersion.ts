const REACT_LIBRARY_VERSION = "13.1.1"
const REACT_LIBRARY_VERSION_SUFFIX = ""

export class TJVersion {
  // Returns the version of the plugin - eg: 1.0.0-alpha-rc1
  static getPluginVersion(): string {
    if (REACT_LIBRARY_VERSION_SUFFIX) {
      return REACT_LIBRARY_VERSION + '-' + REACT_LIBRARY_VERSION_SUFFIX;
    } else {
      return REACT_LIBRARY_VERSION;
    }
  }
}

export default TJVersion;
