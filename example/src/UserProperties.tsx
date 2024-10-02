import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from './Button';
import styles from './Styles';
import Tapjoy, {
  TJPrivacyPolicy,
  TJStatus,
  TJSegment,
} from 'tapjoy-react-native-sdk';
import SelectionMenu from './SelectionMenu';
import { useIsFocused } from '@react-navigation/native';

const UserProperties: React.FC = () => {
  const NOT_SET_LABEL = 'Not Set';

  const [statusLabelText, setStatusLabelText] =
    useState<string>('Status Message');
  const [userId, setUserId] = useState<string>('');
  const [maxLevel, _setMaxLevel] = useState<string>('');
  const [userLevel, _setUserLevel] = useState<string>('');
  const [USPrivacy, setUSPrivacy] = useState<string>('');
  const [isSubjectToGDPR, setSubjectToGDPR] = useState<TJStatus>(
    TJStatus.Unknown
  );
  const [isBelowConsentAge, setBelowConsentAge] = useState<TJStatus>(
    TJStatus.Unknown
  );
  const [userConsent, setUserConsent] = useState<TJStatus>(TJStatus.Unknown);
  const [userSegment, setUserSegment] = useState<TJSegment>(TJSegment.Unknown);
  const [userTag, setUserTag] = useState<string>('');
  const [optOut, setOptOut] = useState<boolean>(false);
  const isFocused = useIsFocused();

  const statusData = [
    { value: TJStatus.True, label: 'True' },
    { value: TJStatus.False, label: 'False' },
    { value: TJStatus.Unknown, label: 'Not Set' },
  ];

  const segmentData = [
    { value: TJSegment.NonPayer, label: 'Non \nPayer' },
    { value: TJSegment.Payer, label: 'Payer' },
    { value: TJSegment.VIP, label: 'VIP' },
    { value: TJSegment.Unknown, label: 'Unknown' },
  ];

  const optOutAdData = [
    { value: true, label: 'True' },
    { value: false, label: 'False' },
  ];

  useEffect(() => {
    if (isFocused) {
      retrievePrivacyPolicy().then();
      retrieveUserSegment().then();
      retrieveUserId().then();
      retrieveUserLevel().then();
      retrieveMaxLevel().then();
    }
  }, [isFocused]);

  const retrieveUserLevel = async () => {
    try {
      const value = await Tapjoy.getUserLevel();
      if (value !== null) {
        await setUserLevel(value.toString());
      }
    } catch (error) {
      setStatusLabelText(`Failed to retrieve User Level: ${error}`);
    }
  };
  const retrieveUserId = async () => {
    try {
      await setUserId(await Tapjoy.getUserId());
    } catch (error) {
      setStatusLabelText(`Failed to retrieve User ID: ${error}`);
    }
  };

  const retrieveUserSegment = async () => {
    try {
      setUserSegment(await Tapjoy.getUserSegment());
    } catch (error) {
      setStatusLabelText(`Failed to retrieve User Segment: ${error}`);
    }
  };

  const retrieveMaxLevel = async () => {
    try {
      const value = await AsyncStorage.getItem('maxLevel');
      if (value !== null) {
        await setMaxLevel(value);
      }
    } catch (error) {
      setStatusLabelText(`Failed to retrieve Max Level: ${error}`);
    }
  };

  const retrievePrivacyPolicy = async () => {
    try {
      let privacyPolicy = new TJPrivacyPolicy();

      setBelowConsentAge(await privacyPolicy.getBelowConsentAge());
      setSubjectToGDPR(await privacyPolicy.getSubjectToGDPR());
      setUserConsent(await privacyPolicy.getUserConsent());
      setUSPrivacy(await privacyPolicy.getUSPrivacy());
    } catch (error) {
      setStatusLabelText(`Failed to retrieve Privacy Policy: ${error}`);
    }
  };

  const findStatus = (value: TJStatus) => {
    return (
      statusData.find((item) => item.value === value) || {
        value: TJStatus.Unknown,
        label: NOT_SET_LABEL,
      }
    );
  };

  const findSegment = (value: TJSegment) => {
    return (
      segmentData.find((item) => item.value === value) || {
        value: TJSegment.Unknown,
        label: NOT_SET_LABEL,
      }
    );
  };

  const findOptOut = (value: boolean) => {
    return (
      optOutAdData.find((item) => item.value === value) || {
        value: false,
        label: 'False',
      }
    );
  };

  const initialUserConsentItem = findStatus(userConsent);
  const initialBelowConsentAgeItem = findStatus(isBelowConsentAge);
  const initialSubjectToGDPRItem = findStatus(isSubjectToGDPR);
  const initialUserSegmentItem = findSegment(userSegment);
  const initialOptOutItem = findOptOut(optOut);

  const applyProperties = async () => {
    try {
      let trimmedUserId = userId?.trim();
      let trimmedMaxLevel = maxLevel.trim();
      let trimmedUserLevel = userLevel.trim();
      let maxLevelValue = -1;
      if (trimmedMaxLevel.length > 0) {
        maxLevelValue = parseInt(trimmedMaxLevel);
      }
      let userLevelValue = -1;
      if (trimmedUserLevel.length > 0) {
        userLevelValue = parseInt(trimmedUserLevel);
      }
      let privacyPolicy = new TJPrivacyPolicy();
      privacyPolicy.setSubjectToGDPRStatus(isSubjectToGDPR);
      privacyPolicy.setBelowConsentAgeStatus(isBelowConsentAge);
      privacyPolicy.setUserConsentStatus(userConsent);
      privacyPolicy.setUSPrivacy(USPrivacy);
      if (Platform.OS === 'android') {
        privacyPolicy.optOutAdvertisingID(optOut);
      }
      Tapjoy.setUserSegment(userSegment);
      await AsyncStorage.setItem('maxLevel', trimmedMaxLevel);
      await Tapjoy.setMaxLevel(maxLevelValue);
      await Tapjoy.setUserLevel(userLevelValue);
      await Tapjoy.setUserId(trimmedUserId);
      setStatusLabelText(`User ID set:\n"${trimmedUserId}"`);
    } catch (error) {
      setStatusLabelText(`Set properties error: ${error}`);
    }
  };

  const setMaxLevel = async (maxLevel: string) => {
    _setMaxLevel(maxLevel);
    let trimmedMaxLevel = maxLevel.trim();
    await AsyncStorage.setItem('maxLevel', trimmedMaxLevel);
  };

  const setUserLevel = async (userLevel: string) => {
    _setUserLevel(userLevel);
  };

  const handleUSPrivacy = async (newUSPrivacy: string) => {
    setUSPrivacy(newUSPrivacy);
  };

  const handleClearInput = async () => {
    await setUserId('');
  };

  const handleClearMaxLevel = async () => {
    await setMaxLevel('');
  };

  const handleClearUserLevel = async () => {
    await setUserLevel('');
  };

  const handleAddUserTag = async () => {
    Tapjoy.addUserTag(userTag);
    setUserTag('');
  };

  const handleRemoveUserTag = async () => {
    Tapjoy.removeUserTag(userTag);
    setUserTag('');
  };

  const handleClearUserTag = async () => {
    Tapjoy.clearUserTags();
    setUserTag('');
  };

  const handleSubjectToGDPR = (item: { value: TJStatus; label: string }) => {
    setSubjectToGDPR(item.value);
  };

  const handleBelowConsentAge = (item: { value: TJStatus; label: string }) => {
    setBelowConsentAge(item.value);
  };

  const handleUserConsent = (item: { value: TJStatus; label: string }) => {
    setUserConsent(item.value);
  };

  const handleUserSegment = (item: { value: TJSegment; label: string }) => {
    setUserSegment(item.value);
  };

  const handleOptOut = (item: { value: boolean; label: string }) => {
    setOptOut(item.value);
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View style={styles.lineGap}>
          <Text style={styles.statusText}>{statusLabelText}</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.userPropertiesLabel}>User ID:</Text>
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
        <View style={styles.inputContainer}>
          <Text style={styles.userPropertiesLabel}>Max Level:</Text>
          <TextInput
            style={styles.textInput}
            value={maxLevel}
            keyboardType={'numeric'}
            onChangeText={setMaxLevel}
            placeholder="Enter max level"
            placeholderTextColor="#888"
          />
          <Button
            style={styles.clearButton}
            onPress={handleClearMaxLevel}
            title={'\u2573'}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.userPropertiesLabel}>User Level:</Text>
          <TextInput
            style={styles.textInput}
            value={userLevel}
            keyboardType={'numeric'}
            onChangeText={setUserLevel}
            placeholder="Enter user level"
            placeholderTextColor="#888"
          />
          <Button
            style={styles.clearButton}
            onPress={handleClearUserLevel}
            title={'\u2573'}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.userPropertiesLabel}>User Tags:</Text>
          <TextInput
            style={styles.textInput}
            value={userTag}
            onChangeText={setUserTag}
            placeholder="Enter user tag"
            placeholderTextColor="#888"
          />
        </View>
        <View style={styles.horizontalContainer}>
          <Button
            style={styles.buttonTag}
            onPress={handleAddUserTag}
            title={'Add'}
          />
          <Button
            style={styles.buttonTag}
            onPress={handleRemoveUserTag}
            title={'Remove'}
          />
          <Button
            style={styles.buttonTag}
            onPress={handleClearUserTag}
            title={'Clear'}
          />
        </View>
        <View style={styles.selectionContainer}>
          <View style={styles.horizontalContainer}>
            <Text style={styles.userPropertiesLabel}>User Segment:</Text>
            <SelectionMenu
              data={segmentData}
              onSelectItem={handleUserSegment}
              initialSelectedItem={initialUserSegmentItem}
            />
          </View>
        </View>
        <View style={styles.selectionContainer}>
          <View style={styles.horizontalContainer}>
            <Text style={styles.userPropertiesLabel}>Subject To GDPR:</Text>
            <SelectionMenu
              data={statusData}
              onSelectItem={handleSubjectToGDPR}
              initialSelectedItem={initialSubjectToGDPRItem}
            />
          </View>
        </View>
        <View style={styles.selectionContainer}>
          <View style={styles.horizontalContainer}>
            <Text style={styles.userPropertiesLabel}>Below Consent Age:</Text>
            <SelectionMenu
              data={statusData}
              onSelectItem={handleBelowConsentAge}
              initialSelectedItem={initialBelowConsentAgeItem}
            />
          </View>
        </View>
        <View style={styles.selectionContainer}>
          <View style={styles.horizontalContainer}>
            <Text style={styles.userPropertiesLabel}>User Consent:</Text>
            <SelectionMenu
              data={statusData}
              onSelectItem={handleUserConsent}
              initialSelectedItem={initialUserConsentItem}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.userPropertiesLabel}>US Privacy:</Text>
          <TextInput
            style={styles.textInput}
            value={USPrivacy}
            onChangeText={handleUSPrivacy}
            placeholder="E.g 1YYN"
            placeholderTextColor="#888"
          />
        </View>
        {Platform.OS === 'android' && (
          <View style={styles.selectionContainer}>
            <View style={styles.horizontalContainer}>
              <Text style={styles.userPropertiesLabel}>Opt Out Ad ID:</Text>
              <SelectionMenu
                data={optOutAdData}
                onSelectItem={handleOptOut}
                initialSelectedItem={initialOptOutItem}
              />
            </View>
          </View>
        )}
        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            onPress={applyProperties}
            title={'Apply'}
          />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default UserProperties;
