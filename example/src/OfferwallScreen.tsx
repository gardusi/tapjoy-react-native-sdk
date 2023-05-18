import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  SafeAreaView,
  View,
  TextInput,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from './Button';
import styles from './Styles';
import Tapjoy, { TJPlacement } from 'tapjoy-react-native-sdk';

const OfferwallScreen: React.FC = () => {
  const [offerwallPlacementName, _setOfferwallPlacementName] =
    useState<string>('offerwall_unit');
  const [isSdkConnected, setIsSdkConnected] = useState<boolean>(false);
  const [, setPlacementState] = useState<string>('');
  const [logData, setLogData] = useState<Array<string>>([]);

  useFocusEffect(
    React.useCallback(() => {
      setIsSdkConnected(Tapjoy.isConnected());
    }, [])
  );

  useEffect(() => {
    retrieveStoredPlacementName();
  });

  const retrieveStoredPlacementName = () => {
    AsyncStorage.getItem('placementName').then(async (value) => {
      if (value !== null) {
        await setOfferwallPlacementName(value);
      }
    });
  };

  const handleClearInput = async () => {
    await setOfferwallPlacementName('');
  };

  const loadPlacement = () => {
    let offerwallPlacement = new TJPlacement(offerwallPlacementName);
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
    let offerwallPlacement = new TJPlacement(offerwallPlacementName);
    if (offerwallPlacement === undefined) {
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

  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const addLogItem = (item: string) => {
    const timestamp = new Date().toLocaleTimeString();
    logData.push(timestamp + ' ' + item);
    setLogData(logData);
  };

  return (
    <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
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
            disabled={!new TJPlacement(offerwallPlacementName).isContentReady()}
            title={'Display'}
          />
        </View>
        <View style={styles.owLogContainer}>
          <FlatList
            contentContainerStyle={styles.flexGrow}
            data={logData}
            renderItem={({ item }) => (
              <View>
                <Text style={styles.logText}>{item}</Text>
              </View>
            )}
            keyExtractor={(_item, index) => index.toString()}
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default OfferwallScreen;
