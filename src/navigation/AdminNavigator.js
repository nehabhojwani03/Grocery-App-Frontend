// navigation/AdminNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AdminHomescreen    from '../screens/admin/AdminHomescreen';
import AdminDriversScreen from '../screens/admin/AdminDriversScreen';

// Add your other admin screens here as you build them:
// import AdminUsersScreen    from '../screens/admin/AdminUsersScreen';
// import AdminOrdersScreen   from '../screens/admin/AdminOrdersScreen';
// import RegisterDriverScreen from '../screens/admin/RegisterDriverScreen';

const Stack = createNativeStackNavigator();

const AdminNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {/* Dashboard — entry point */}
    <Stack.Screen name="AdminHome"    component={AdminHomescreen}    />

    {/* Driver management */}
    <Stack.Screen name="AdminDrivers" component={AdminDriversScreen} />

    {/* Placeholder screens — replace components as you build them */}
    {/* <Stack.Screen name="RegisterDriver" component={RegisterDriverScreen} /> */}
    {/* <Stack.Screen name="AdminUsers"     component={AdminUsersScreen}     /> */}
    {/* <Stack.Screen name="AdminOrders"    component={AdminOrdersScreen}    /> */}
  </Stack.Navigator>
);

export default AdminNavigator;