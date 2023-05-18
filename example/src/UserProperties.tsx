import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Keyboard,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from './Button';
import styles from './Styles';
import Tapjoy from 'tapjoy-react-native-sdk';

const UserProperties: React.FC = () => {
  const [statusLabelText, setStatusLabelText] =
    useState<string>('Status Message');
  const [userId, _setUserId] = useState<string>('');

  useEffect(() => {
    retrieveUserId().then();
  });

  const retrieveUserId = async () => {
    try {
      const value = await AsyncStorage.getItem('userId');
      if (value !== null) {
        await setUserId(value);
      }
    } catch (error) {
      setStatusLabelText(`Failed to retrieve User ID: ${error}`);
    }
  };

  const applyProperties = async () => {
    try {
      let trimmedUserId = userId.trim();
      await AsyncStorage.setItem('userId', trimmedUserId);
      await Tapjoy.setUserId(trimmedUserId);
      setStatusLabelText(`User ID set:\n"${trimmedUserId}"`);
    } catch (error) {
      setStatusLabelText(`Set properties error: ${error}`);
    }
  };

  const setUserId = async (newUserId: string) => {
    _setUserId(newUserId);
    let trimmedUserId = newUserId.trim();
    await AsyncStorage.setItem('userId', trimmedUserId);
  };

  const handleClearInput = async () => {
    await setUserId('');
  };

  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
      <SafeAreaView style={styles.container}>
        <View style={styles.lineGap}>
          <Text style={styles.statusText}>{statusLabelText}</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.userIdLabel}>User ID:</Text>
          <TextInput
            style={styles.textInput}
            value={userId}
            onChangeText={setUserId}
            placeholder="Enter user ID"
            placeholderTextColor="#888"
          />
          <Button
            style={styles.clearButton}
            onPress={handleClearInput}
            title={'\u2573'}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            onPress={applyProperties}
            title={'Apply'}
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default UserProperties;
