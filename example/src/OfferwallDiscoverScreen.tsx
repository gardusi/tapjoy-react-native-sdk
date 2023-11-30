import React, { useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
  Dimensions,
} from 'react-native';
import Tapjoy, { TJOfferwallDiscoverView } from 'tapjoy-react-native-sdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import Button from './Button';
import styles from './Styles';

const OfferwallDiscoverScreen: React.FC = () => {
  const widthChangedManually = useRef(false);
  const [width, setWidth] = useState<string>(
    Math.floor(Dimensions.get('window').width) + ''
  );
  const [height, setHeight] = useState<string>('262');

  const [offerwallPlacementName, _setOfferwallPlacementName] =
    useState<string>('offerwall_discover');
  const [isSdkConnected, setIsSdkConnected] = useState<boolean>(false);

  const [logData, setLogData] = useState<Array<string>>([]);
  const owdRef: React.MutableRefObject<TJOfferwallDiscoverView | null> =
    useRef<TJOfferwallDiscoverView | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      setIsSdkConnected(Tapjoy.isConnected());
    }, [])
  );

  useEffect(() => {
    AsyncStorage.getItem('owdPlacementName').then((value) => {
      if (value !== null) {
        setOfferwallPlacementName(value).then();
      }
    });
  }, []);

  useEffect(() => {
    Dimensions.addEventListener('change', () => {
      if (!widthChangedManually.current) {
        setWidth(Math.floor(Dimensions.get('window').width) + '');
      }
    });
  }, []);

  const handleClearInput = async () => {
    await setOfferwallPlacementName('');
  };

  const loadContent = async () => {
    try {
      owdRef.current!.requestContent(offerwallPlacementName);
    } catch (error: any) {
      addLogItem(error);
    }
  };

  const clearContent = () => {
    addLogItem('cleared');
    owdRef.current!.clearContent();
  };

  const setOfferwallPlacementName = async (placementName: string) => {
    _setOfferwallPlacementName(placementName);
    await AsyncStorage.setItem('owdPlacementName', placementName);
  };

  const addLogItem = (item: string) => {
    setLogData([dayjs(new Date()).format('HH:mm:ss') + ' ' + item, ...logData]);
  };

  const stripNonNumericValue = (value: string) => {
    value = value.replace(/\D/g, '');
    if (value === '') value = '0';
    let intValue = parseInt(value, 10);
    return intValue + '';
  };

  const getViewStyle = () => {
    return {
      width: width ? parseInt(width, 10) : 0,
      height: height ? parseInt(height, 10) : 0,
      backgroundColor: '#999999',
    };
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.offerwallScrollContainer}>
        <SafeAreaView style={styles.container}>
          <View style={styles.inputContainer}>
            <Text style={styles.textInputLabel}>Width</Text>
            <TextInput
              keyboardType="numeric"
              style={styles.textInput}
              onChangeText={(value) => {
                value = stripNonNumericValue(value);
                setWidth(value);
                widthChangedManually.current = true;
              }}
              value={width}
              autoCorrect={false}
              placeholderTextColor="#888"
              autoCapitalize="none"
            />
            <Text style={[styles.textInputLabel, styles.leftSpacing]}>
              Height
            </Text>
            <TextInput
              keyboardType="numeric"
              style={styles.textInput}
              onChangeText={(value) => {
                value = stripNonNumericValue(value);
                setHeight(value);
              }}
              value={height.replace(/\D/g, '')}
              autoCorrect={false}
              placeholderTextColor="#888"
              autoCapitalize="none"
            />
          </View>
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
              onPress={loadContent}
              disabled={!isSdkConnected}
              title={'Request'}
            />
            <View style={styles.buttonGap} />
            <Button onPress={clearContent} title={'Clear'} />
          </View>
          <TJOfferwallDiscoverView
            ref={owdRef}
            style={getViewStyle()}
            onRequestSuccess={(event: any) => {
              addLogItem(event.nativeEvent.result);
            }}
            onRequestFailure={(event: any) =>
              addLogItem(
                `requestFailure: code:${event.nativeEvent.errorCode}, message:${event.nativeEvent.errorMessage}`
              )
            }
            onContentReady={(event: any) =>
              addLogItem(event.nativeEvent.result)
            }
            onContentError={(event: any) =>
              addLogItem(
                `contentError: code:${event.nativeEvent.errorCode}, message:${event.nativeEvent.errorMessage}`
              )
            }
          />
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

export default OfferwallDiscoverScreen;
