import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';

import ContactsScreen from '../screens/ContactsScreen';
import HealthcareScreen from '../screens/HealthcareScreen';
import MedicationManageScreen from '../screens/MedicationManageScreen';
import PillBottleCaptureScreen from '../screens/PillBottleCaptureScreen';
import MedicationListCaptureScreen from '../screens/MedicationListCaptureScreen';
import CalendarScreen from '../screens/CalendarScreen';
import CommunicationScreen from '../screens/CommunicationScreen';

enableScreens(false);

const Tab = createBottomTabNavigator();
const HealthcareStackNav = createNativeStackNavigator();

const HealthcareStack = () => (
  <HealthcareStackNav.Navigator>
    <HealthcareStackNav.Screen name="HealthcareHome" component={HealthcareScreen} options={{ title: 'Healthcare' }} />
    <HealthcareStackNav.Screen name="MedicationManage" component={MedicationManageScreen} options={{ title: 'Manage Medications' }} />
    <HealthcareStackNav.Screen name="PillBottleCapture" component={PillBottleCaptureScreen} options={{ title: 'Pill Bottle' }} />
    <HealthcareStackNav.Screen name="MedicationListCapture" component={MedicationListCaptureScreen} options={{ title: 'Medication List' }} />
  </HealthcareStackNav.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Tab.Screen name="Contacts" component={ContactsScreen} />
      <Tab.Screen name="Healthcare" component={HealthcareStack} options={{ headerShown: false }} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Comm" component={CommunicationScreen} />
    </Tab.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
