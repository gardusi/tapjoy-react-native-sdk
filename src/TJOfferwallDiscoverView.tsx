import {
  findNodeHandle,
  requireNativeComponent,
  UIManager,
  ViewStyle,
} from 'react-native';
import React from 'react';

enum Command {
  REQUEST_CONTENT = 'requestContent',
  CLEAR_CONTENT = 'clearContent',
}

const TJOfferwallDiscoverNativeView = requireNativeComponent(
  'TJOfferwallDiscoverNativeView'
);

interface TJOfferwallDiscoverViewProps {
  style?: ViewStyle;
  onRequestSuccess?: Function;
  onRequestFailure?: Function;
  onContentReady?: Function;
  onContentError?: Function;
}

export default class TJOfferwallDiscoverView extends React.Component<TJOfferwallDiscoverViewProps> {
  nativeCompHandle: number | null = null;
  constructor(props: TJOfferwallDiscoverViewProps) {
    super(props);
  }

  render() {
    return (
      <TJOfferwallDiscoverNativeView
        {...this.props}
        ref={(ref) => {
          this.nativeCompHandle = findNodeHandle(ref);
        }}
      />
    );
  }

  requestContent(placement: string) {
    UIManager.dispatchViewManagerCommand(
      this.nativeCompHandle!!,
      Command.REQUEST_CONTENT,
      [placement]
    );
  }

  clearContent() {
    UIManager.dispatchViewManagerCommand(
      this.nativeCompHandle!!,
      Command.CLEAR_CONTENT
    );
  }
}
