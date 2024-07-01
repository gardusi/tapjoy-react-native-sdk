import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import MainScreen from './MainScreen';
import OfferwallScreen from './OfferwallScreen';
import OfferwallDiscoverScreen from './OfferwallDiscoverScreen';
import UserProperties from './UserProperties';
import styles from './Styles';
import { ConnectContext } from './ConnectContext';

const Tab = createBottomTabNavigator();
const windowHeight = Dimensions.get('window').height;


export default function App() {
  const [isSdkConnected, setIsSdkConnected] = useState(false);
  return (
    <NavigationContainer>
      <ConnectContext.Provider value={{ isSdkConnected, setIsSdkConnected }}>
        <Tab.Navigator
            screenOptions={{
            scrollEnabled: true,
            tabBarLabelPosition: 'beside-icon',
            tabBarLabelStyle: styles.tabBarLabelStyle,
            tabBarIconStyle: styles.tabBarIconStyle,
            tabBarStyle: { height: windowHeight * 0.075, paddingRight: 10},
            }}
      >
          <Tab.Screen name="Main" component={MainScreen} />
          <Tab.Screen name="Offerwall" component={OfferwallScreen} />
          <Tab.Screen name="Discover" component={OfferwallDiscoverScreen} />
          <Tab.Screen name="User" component={UserProperties} />
        </Tab.Navigator>
      </ConnectContext.Provider>
    </NavigationContainer>
  );
}
