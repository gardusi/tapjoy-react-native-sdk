import { ViewStyle } from 'react-native';
import React from 'react';
interface TJOfferwallDiscoverViewProps {
    style?: ViewStyle;
    onRequestSuccess?: Function;
    onRequestFailure?: Function;
    onContentReady?: Function;
    onContentError?: Function;
}
export default class TJOfferwallDiscoverView extends React.Component<TJOfferwallDiscoverViewProps> {
    nativeCompHandle: number | null;
    constructor(props: TJOfferwallDiscoverViewProps);
    render(): React.JSX.Element;
    requestContent(placement: string): void;
    clearContent(): void;
}
export {};
