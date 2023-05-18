import { NativeModules, NativeEventEmitter } from 'react-native';
import { EventEmitter } from 'eventemitter3';

const Tapjoy = NativeModules.TapjoyReactNativeSdk;
const TapjoyEmitter = new NativeEventEmitter(Tapjoy);

const TapjoyEventType = 'TapjoyPlacement';

interface TapjoyPlacementEvent {
  name: string;
  error: string;
  placement: string;
}

class TJPlacement extends EventEmitter {
  static readonly REQUEST_DID_SUCCEED = 'requestDidSucceed';
  static readonly REQUEST_DID_FAIL = 'requestDidFail';
  static readonly CONTENT_IS_READY = 'contentIsReady';
  static readonly CONTENT_DID_APPEAR = 'contentDidAppear';
  static readonly CONTENT_DID_DISAPPEAR = 'contentDidDisappear';

  public name: string;
  public error: string | undefined;

  public constructor(name: string) {
    super();
    this.name = name;
    this.error = undefined;
  }

  requestContent(): void {
    var subscription = TapjoyEmitter.addListener(
      TapjoyEventType,
      (event: TapjoyPlacementEvent) => {
        if (event.name === TJPlacement.REQUEST_DID_SUCCEED) {
          // Remove listener if there is no content available.
          if (!this.isContentAvailable()) {
            subscription.remove();
          }
          this.emit(TJPlacement.REQUEST_DID_SUCCEED, this);
        } else if (event.name === TJPlacement.REQUEST_DID_FAIL) {
          // No more events expected, remove listener.
          subscription.remove();
          this.error = event.error;
          this.emit(TJPlacement.REQUEST_DID_FAIL, this);
        } else if (event.name === TJPlacement.CONTENT_IS_READY) {
          // No more events expected, remove listener.
          subscription.remove();
          this.emit(TJPlacement.CONTENT_IS_READY, this);
        }
      }
    );
    Tapjoy.requestPlacement(this.name);
  }

  showContent(): void {
    var subscription = TapjoyEmitter.addListener(
      TapjoyEventType,
      (event: TapjoyPlacementEvent) => {
        if (event.name === TJPlacement.CONTENT_DID_APPEAR) {
          this.emit(TJPlacement.CONTENT_DID_APPEAR, this);
        } else if (event.name === TJPlacement.CONTENT_DID_DISAPPEAR) {
          // No more events expected, remove listener.
          subscription.remove();
          this.emit(TJPlacement.CONTENT_DID_DISAPPEAR, this);
        }
      }
    );
    Tapjoy.showPlacement(this.name);
  }

  isContentReady(): boolean {
    return Tapjoy.isContentReady(this.name);
  }

  isContentAvailable(): boolean {
    return Tapjoy.isContentAvailable(this.name);
  }
}

export default TJPlacement;
