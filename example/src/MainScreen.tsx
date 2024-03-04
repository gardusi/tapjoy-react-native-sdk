import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  TextInput,
  Platform,
  Text,
  ScrollView,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getTrackingStatus,
  requestTrackingPermission,
} from 'react-native-tracking-transparency';
import styles from './Styles';
import Button from './Button';
import Tapjoy, { TJVersion, TJConnect } from 'tapjoy-react-native-sdk';

const MainScreen: React.FC = () => {
  const [sdkKey, setSdkKey] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [statusLabelText, setStatusLabelText] = useState('Status Message');

  interface TapjoyEvent {
    name: string;
    code: string;
    message: string;
  }

  useEffect(() => {
    retrieveSdkKey().then();
  }, []);

  const retrieveSdkKey = async () => {
    try {
      const value = await AsyncStorage.getItem('sdkKey');
      if (value !== null) {
        setSdkKey(value);
      } else {
        setSdkKey(
          Platform.OS === 'ios'
            ? 'E7CuaoUWRAWdz_5OUmSGsgEBXHdOwPa8de7p4aseeYP01mecluf-GfNgtXlF'
            : 'u6SfEbh_TA-WMiGqgQ3W8QECyiQIURFEeKm0zbOggubusy-o5ZfXp33sTXaD'
        );
      }
    } catch (error) {
      setStatusLabelText(`Failed to retrieve sdk key: ${error}`);
    }
  };

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      await AsyncStorage.setItem('sdkKey', sdkKey);

      Tapjoy.setDebugEnabled(true);
      let userId = await AsyncStorage.getItem('userId');
      let flags: object = { TJC_OPTION_USER_ID: userId };
      let trackingStatus = await getTrackingStatus();
      if (trackingStatus !== 'authorized' && trackingStatus !== 'unavailable') {
        await requestTrackingPermission();
      }
      const TJ = NativeModules.TapjoyReactNativeSdk;
      const TapjoyEmitter = new NativeEventEmitter(TJ);
      const TapjoyEventType = 'Tapjoy';
      const subscription = TapjoyEmitter.addListener(
        TapjoyEventType,
        (event: TapjoyEvent) => {
          if (event.name === TJConnect.TJC_CONNECT_WARNING) {
            subscription.remove();
            setStatusLabelText(
              `Tapjoy SDK connected with Warning: ErrorCode: ${event.code} ${event.message} `
            );
          }
        }
      );
      await Tapjoy.connect(sdkKey, flags);
      setIsConnecting(false);
      setStatusLabelText(
        'Tapjoy SDK Connected' +
          (userId !== null ? `\nFlags: ${JSON.stringify(flags)}` : '')
      );
    } catch (error: any) {
      setStatusLabelText(
        `Tapjoy SDK failed to connect. code: ${error.code}, message: ${error.message}`
      );
      setIsConnecting(false);
    }
  };

  const getCurrencyBalance = async () => {
    try {
      let result = await Tapjoy.getCurrencyBalance();
      setStatusLabelText(
        'getCurrencyBalance returned ' +
          result.currencyName +
          ': ' +
          result.amount
      );
    } catch (error: any) {
      setStatusLabelText(error.toString());
    }
  };

  const spendCurrency = async () => {
    try {
      let amount = 10.0;
      let result = await Tapjoy.spendCurrency(amount);
      setStatusLabelText(
        'spendCurrency returned ' + result.currencyName + ': ' + result.amount
      );
    } catch (error: any) {
      setStatusLabelText(error.toString());
    }
  };

  const awardCurrency = async () => {
    try {
      let amount = 10.0;
      let result = await Tapjoy.awardCurrency(amount);
      setStatusLabelText(
        'awardCurrency returned ' + result.currencyName + ': ' + result.amount
      );
    } catch (error: any) {
      setStatusLabelText(error.toString());
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView>
        <SafeAreaView style={styles.container}>
          <View style={styles.lineGap}>
            <Text style={styles.statusText}>{statusLabelText}</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={sdkKey}
              onChangeText={setSdkKey}
              placeholder="Enter SDK Key"
            />
            <Button
              title="Connect"
              style={[styles.zeroFlex, styles.leftSpacing]}
              onPress={handleConnect}
              disabled={isConnecting || Tapjoy.isConnected()}
            />
          </View>
          <View style={styles.currencyOuterContainer}>
            <Text style={styles.labelText}>{'Managed Currency:'}</Text>
            <View style={styles.currencyInnerContainer}>
              <Button
                style={styles.buttonGap}
                title="Get"
                onPress={getCurrencyBalance}
              />
              <Button
                style={styles.buttonGap}
                title="Spend"
                onPress={spendCurrency}
              />
              <Button title="Award" onPress={awardCurrency} />
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
      <Text style={styles.versionText}>
        Version: {TJVersion.getPluginVersion()}
      </Text>
    </View>
  );
};

export default MainScreen;
