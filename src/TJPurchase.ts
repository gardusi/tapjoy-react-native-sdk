import { NativeModules } from 'react-native';

const Tapjoy = NativeModules.TapjoyReactNativeSdk;

class TJPurchase {
  trackPurchase(currencyCode: string, price: number): void {
    Tapjoy.trackPurchase(currencyCode, price);
  }
}

export default TJPurchase;
