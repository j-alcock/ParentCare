import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { enableScreens } from 'react-native-screens';

import ContactsScreen from '../screens/ContactsScreen';
import HealthcareScreen from '../screens/HealthcareScreen';
import CalendarScreen from '../screens/CalendarScreen';
import CommunicationScreen from '../screens/CommunicationScreen';

enableScreens(false);

const Tab = createBottomTabNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Tab.Screen name="Contacts" component={ContactsScreen} />
      <Tab.Screen name="Healthcare" component={HealthcareScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Comm" component={CommunicationScreen} />
    </Tab.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
