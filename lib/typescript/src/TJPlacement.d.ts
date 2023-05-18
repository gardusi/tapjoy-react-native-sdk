import { EventEmitter } from 'eventemitter3';
declare class TJPlacement extends EventEmitter {
    static readonly REQUEST_DID_SUCCEED = "requestDidSucceed";
    static readonly REQUEST_DID_FAIL = "requestDidFail";
    static readonly CONTENT_IS_READY = "contentIsReady";
    static readonly CONTENT_DID_APPEAR = "contentDidAppear";
    static readonly CONTENT_DID_DISAPPEAR = "contentDidDisappear";
    name: string;
    error: string | undefined;
    constructor(name: string);
    requestContent(): void;
    showContent(): void;
    isContentReady(): boolean;
    isContentAvailable(): boolean;
}
export default TJPlacement;
//# sourceMappingURL=TJPlacement.d.ts.map