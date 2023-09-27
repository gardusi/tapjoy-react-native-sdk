import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import dayjs from 'dayjs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from './Button';
import styles, { pickerSelectStyles } from './Styles';
import Tapjoy, { TJPlacement } from 'tapjoy-react-native-sdk';
import RNPickerSelect from 'react-native-picker-select';
import TJEntryPoint from '../../src/TJEntryPoint';

let offerwallPlacement: TJPlacement;

const OfferwallScreen: React.FC = () => {
  const [offerwallPlacementName, _setOfferwallPlacementName] =
    useState<string>('offerwall_unit');
  const [isSdkConnected, setIsSdkConnected] = useState<boolean>(false);
  const [placementState, setPlacementState] = useState<string>('');
  const [logData, setLogData] = useState<Array<string>>([]);
  const [entryPoint, setEntryPoint] = useState<TJEntryPoint>(
    TJEntryPoint.TJEntryPointUnknown
  );
  const [currencyId, _setCurrencyId] = useState<string>('');
  const [currencyBalance, _setCurrencyBalance] = useState<string>('');
  const [requiredAmount, _setRequiredAmount] = useState<string>('');

  useFocusEffect(
    React.useCallback(() => {
      setIsSdkConnected(Tapjoy.isConnected());
    }, [])
  );

  useEffect(() => {
    retrieveStoredPlacementName();
  });

  useEffect(() => {
    retrieveCurrencyId().then();
  });

  useEffect(() => {
    retrieveCurrencyBalance().then();
  });

  useEffect(() => {
    retrieveRequiredAmount().then();
  });

  const retrieveStoredPlacementName = () => {
    AsyncStorage.getItem('placementName').then(async (value) => {
      if (value !== null) {
        await setOfferwallPlacementName(value);
      }
    });
  };

  const retrieveCurrencyId = async () => {
    try {
      const value = await AsyncStorage.getItem('currencyId');
      if (value !== null) {
        await setCurrencyId(value);
      }
    } catch (error) {
      addLogItem(`Failed to retrieve currency ID: ${error}`);
    }
  };

  const retrieveCurrencyBalance = async () => {
    try {
      const value = await AsyncStorage.getItem('currencyBalance');
      if (value !== null) {
        await setCurrencyBalance(value);
      }
    } catch (error) {
      addLogItem(`Failed to retrieve currency balance: ${error}`);
    }
  };

  const retrieveRequiredAmount = async () => {
    try {
      const value = await AsyncStorage.getItem('requiredAmount');
      if (value !== null) {
        await setRequiredAmount(value);
      }
    } catch (error) {
      addLogItem(`Failed to retrieve currency requiredAmount: ${error}`);
    }
  };

  const setCurrencyId = async (id: string) => {
    _setCurrencyId(id);
    let trimmedCurrencyId = id.trim();
    await AsyncStorage.setItem('currencyId', trimmedCurrencyId);
  };

  const setCurrencyBalance = async (balance: string) => {
    _setCurrencyBalance(balance);
    let trimmedCurrencyBalance = balance.trim();
    await AsyncStorage.setItem('currencyBalance', trimmedCurrencyBalance);
  };

  const setRequiredAmount = async (newValue: string) => {
    _setRequiredAmount(newValue);
    let trimmedValue = newValue.trim();
    await AsyncStorage.setItem('requiredAmount', trimmedValue);
  };

  const handleClearCurrencyId = async () => {
    await setCurrencyId('');
  };

  const handleClearCurrencyBalance = async () => {
    await setCurrencyBalance('');
  };

  const handleClearRequiredAmount = async () => {
    await setRequiredAmount('');
  };

  const handleClearInput = async () => {
    await setOfferwallPlacementName('');
  };

  const loadPlacement = async () => {
    offerwallPlacement = new TJPlacement(offerwallPlacementName);

    if (currencyId !== '') {
      if (currencyBalance !== '') {
        try {
          await offerwallPlacement?.setCurrencyBalance(
            currencyId,
            Number(currencyBalance)
          );
          addLogItem(
            'setCurrencyBalance: ' +
              (await offerwallPlacement?.getCurrencyBalance(currencyId))
          );
        } catch (e: any) {
          addLogItem(`currencyBalanceError: ${e.code} - ${e.message}`);
        }
      }

      if (requiredAmount !== '') {
        try {
          await offerwallPlacement?.setRequiredAmount(
            Number(requiredAmount),
            currencyId
          );
          addLogItem(
            'setCurrencyRequiredAmount: ' +
              JSON.stringify(
                await offerwallPlacement?.getRequiredAmount(currencyId)
              )
          );
        } catch (e: any) {
          addLogItem(`requiredAmountError: ${e.code} - ${e.message}`);
        }
      }
    }

    if (entryPoint !== TJEntryPoint.TJEntryPointUnknown) {
      offerwallPlacement.setEntryPoint(entryPoint);
      addLogItem(
        'setEntryPoint: ' + (await offerwallPlacement?.getEntryPoint())
      );
    }

    offerwallPlacement.on(
      TJPlacement.REQUEST_DID_SUCCEED,
      (placement: TJPlacement) => {
        addLogItem(`${TJPlacement.REQUEST_DID_SUCCEED} "${placement.name}"`);
        addLogItem(`Content available: ${placement.isContentAvailable()}`);
        setPlacementState('request_success');
      }
    );

    offerwallPlacement.on(
      TJPlacement.REQUEST_DID_FAIL,
      (placement: TJPlacement) => {
        addLogItem(
          `${TJPlacement.REQUEST_DID_FAIL} "${placement.name}" - ${
            placement.error !== undefined ? placement.error : ''
          }`
        );
        setPlacementState('failed');
      }
    );

    offerwallPlacement.on(
      TJPlacement.CONTENT_IS_READY,
      (placement: TJPlacement) => {
        addLogItem(`${TJPlacement.CONTENT_IS_READY} "${placement.name}"`);
        setPlacementState('ready');
      }
    );
    offerwallPlacement.requestContent();
    setPlacementState('loading');
  };

  const showPlacement = () => {
    addLogItem(offerwallPlacement.name);
    if (placementState !== 'ready') {
      addLogItem(`"${offerwallPlacementName}" placement not loaded.`);
      setPlacementState('failed');
      return;
    }

    offerwallPlacement.on(
      TJPlacement.CONTENT_DID_APPEAR,
      (placement: TJPlacement) => {
        addLogItem(`${TJPlacement.CONTENT_DID_APPEAR} "${placement.name}"`);
        setPlacementState('shown');
      }
    );

    offerwallPlacement.on(
      TJPlacement.CONTENT_DID_DISAPPEAR,
      (placement: TJPlacement) => {
        addLogItem(`${TJPlacement.CONTENT_DID_DISAPPEAR} "${placement.name}"`);
        setPlacementState('dismissed');
      }
    );

    offerwallPlacement.showContent();
    setPlacementState('show');
  };

  const setOfferwallPlacementName = async (placementName: string) => {
    _setOfferwallPlacementName(placementName);
    await AsyncStorage.setItem('placementName', placementName);
  };

  const addLogItem = (item: string) => {
    logData.push(dayjs(new Date()).format('HH:mm:ss') + ' ' + item);
    setLogData(logData);
  };

  const entryPointArray = [
    { label: 'Other', value: TJEntryPoint.TJEntryPointOther },
    { label: 'Main Menu', value: TJEntryPoint.TJEntryPointMainMenu },
    { label: 'HUD', value: TJEntryPoint.TJEntryPointHud },
    { label: 'Exit', value: TJEntryPoint.TJEntryPointExit },
    { label: 'Fail', value: TJEntryPoint.TJEntryPointFail },
    { label: 'Complete', value: TJEntryPoint.TJEntryPointComplete },
    { label: 'Inbox', value: TJEntryPoint.TJEntryPointInbox },
    { label: 'Initialisation', value: TJEntryPoint.TJEntryPointInit },
    { label: 'Store', value: TJEntryPoint.TJEntryPointStore },
  ];

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.offerwallScrollContainer}>
        <SafeAreaView style={styles.container}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={offerwallPlacementName}
              onChangeText={setOfferwallPlacementName}
              autoCorrect={false}
              placeholder="Enter Placement Name"
              placeholderTextColor="#888"
              autoCapitalize="none"
            />
            <Button
              style={styles.clearButton}
              onPress={handleClearInput}
              title={'\u2573'}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              onPress={loadPlacement}
              disabled={!isSdkConnected}
              title={'Request'}
            />
            <View style={styles.buttonGap} />
            <Button
              onPress={showPlacement}
              disabled={!(placementState === 'ready')}
              title={'Display'}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.userPropertiesLabel}>Entry Point: </Text>
            <RNPickerSelect
              placeholder={{
                label: 'Select Entry Point...',
                value: TJEntryPoint.TJEntryPointUnknown,
              }}
              onValueChange={async (value: any) => {
                offerwallPlacement?.setEntryPoint(value);
                setEntryPoint(value);
              }}
              items={entryPointArray}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
              touchableWrapperProps={{ style: { flex: 1 } }}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.userPropertiesLabel}>Currency ID:</Text>
            <TextInput
              style={styles.textInput}
              value={currencyId}
              keyboardType={'default'}
              onChangeText={setCurrencyId}
              placeholder="Enter Currency ID."
              placeholderTextColor="#888"
            />
            <Button
              style={styles.clearButton}
              onPress={handleClearCurrencyId}
              title={'\u2573'}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.userPropertiesLabel}>Currency Balance:</Text>
            <TextInput
              style={styles.textInput}
              value={currencyBalance}
              keyboardType={'numeric'}
              onChangeText={setCurrencyBalance}
              placeholder="Enter Currency Balance."
              placeholderTextColor="#888"
            />
            <Button
              style={styles.clearButton}
              onPress={handleClearCurrencyBalance}
              title={'\u2573'}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.userPropertiesLabel}>Required Amount:</Text>
            <TextInput
              style={styles.textInput}
              value={requiredAmount}
              keyboardType={'numeric'}
              onChangeText={setRequiredAmount}
              placeholder="Enter Required Amount."
              placeholderTextColor="#888"
            />
            <Button
              style={styles.clearButton}
              onPress={handleClearRequiredAmount}
              title={'\u2573'}
            />
          </View>
        </SafeAreaView>
      </ScrollView>
      <View style={styles.owLogContainer}>
        <FlatList
          data={logData}
          renderItem={({ item }) => (
            <View>
              <Text style={styles.logText}>{item}</Text>
            </View>
          )}
          keyExtractor={(_item, index) => index.toString()}
        />
      </View>
    </View>
  );
};

export default OfferwallScreen;
