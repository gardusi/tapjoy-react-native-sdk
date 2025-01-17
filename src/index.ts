import { NativeModules, Platform } from 'react-native';
import TJPlacement from './TJPlacement';
import TJPrivacyPolicy from './TJPrivacyPolicy';
import TJVersion from './TJVersion';
import TJStatus from './TJStatus';
import TJSegment from './TJSegment';
import TJOfferwallDiscoverView from './TJOfferwallDiscoverView';
import TJConnect from './TJConnect';
import TJPurchase from './TJPurchase';

const LINKING_ERROR =
  `The package 'ngcash-tapjoy-react-native-sdk' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const Tapjoy = NativeModules.TapjoyReactNativeSdk
  ? NativeModules.TapjoyReactNativeSdk
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export {
  Tapjoy,
  TJPlacement,
  TJPrivacyPolicy,
  TJVersion,
  TJStatus,
  TJSegment,
  TJOfferwallDiscoverView,
  TJConnect,
  TJPurchase,
};
export default Tapjoy;
