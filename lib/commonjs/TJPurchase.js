import { NativeModules } from 'react-native';
const Tapjoy = NativeModules.TapjoyReactNativeSdk;
class TJPurchase {
    trackPurchase(currencyCode, price) {
        Tapjoy.trackPurchase(currencyCode, price);
    }
}
export default TJPurchase;
