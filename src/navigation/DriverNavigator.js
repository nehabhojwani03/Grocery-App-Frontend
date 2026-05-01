// navigation/DriverNavigator.js
// Mirrors the pattern of AppNavigator.js — stack navigator for driver screens

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DriverHomescreen from '../screens/driver/DriverHomescreen';

// Uncomment as you build these screens:
// import DriverDeliveriesScreen from '../screens/driver/DriverDeliveriesScreen';
// import DriverEarningsScreen from '../screens/driver/DriverEarningsScreen';
// import DriverProfileScreen from '../screens/driver/DriverProfileScreen';
// import MapTrackingScreen from '../screens/driver/MapTrackingScreen';

const Stack = createNativeStackNavigator();

const DriverNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="DriverHome"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="DriverHome" component={DriverHomescreen} />

      {/* Uncomment as you add screens:
      <Stack.Screen name="DriverDeliveries" component={DriverDeliveriesScreen} />
      <Stack.Screen name="DriverEarnings"   component={DriverEarningsScreen} />
      <Stack.Screen name="DriverProfile"    component={DriverProfileScreen} />
      <Stack.Screen
        name="MapTracking"
        component={MapTrackingScreen}
        options={{
          headerShown: true,
          headerTitle: 'Live Tracking',
          presentation: 'modal',
        }}
      />
      */}
    </Stack.Navigator>
  );
};

export default DriverNavigator;