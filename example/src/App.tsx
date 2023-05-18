import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import MainScreen from './MainScreen';
import OfferwallScreen from './OfferwallScreen';
import UserProperties from './UserProperties';
import styles from './Styles';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelPosition: 'beside-icon',
          tabBarLabelStyle: styles.tabBarLabelStyle,
          tabBarIconStyle: styles.tabBarIconStyle,
        }}
      >
        <Tab.Screen name="Main" component={MainScreen} />
        <Tab.Screen name="Offerwall" component={OfferwallScreen} />
        <Tab.Screen name="User Properties" component={UserProperties} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
