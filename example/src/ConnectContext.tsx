import React, { createContext, useState } from 'react';

interface ConnectContextProps {
  isSdkConnected: boolean;
  setIsSdkConnected: (newIsSdkConnected: boolean) => void;
}

export const ConnectContext = createContext<ConnectContextProps>({
  isSdkConnected: false,
  setIsSdkConnected: () => {},
});