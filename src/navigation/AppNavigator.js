
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import OrderAgainScreen from '../screens/OrderAgainScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import PrintScreen from '../screens/PrintScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import EditProfileScreen from '../screens/ProfileScreens/EditProfileScreen';
import PaymentMethodsScreen from '../screens/ProfileScreens/PaymentMethodsScreen';
import MyAddressesScreen from '../screens/ProfileScreens/MyAddressesScreen';
import AddPaymentMethodScreen from '../screens/ProfileScreens/AddPaymentMethodScreen';
import OrderHistoryScreen from '../screens/ProfileScreens/OrderHistoryScreen';
import MapSelectionScreen from '../screens/Homescreen/Mapselectionscreen';
import BottomTabNavigator from '../navigation/BottomTabNavigator';

const Stack = createNativeStackNavigator();

// Main Tab Container Component (4 tabs only - no Profile in bottom tabs)
const TabContainer = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Home');

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
  };

  const renderScreen = () => {
    const screenProps = {
      navigation,
    };

    switch (activeTab) {
      case 'Home':
        return <HomeScreen {...screenProps} />;
      case 'OrderAgain':
        return <OrderAgainScreen {...screenProps} />;
      case 'Categories':
        return <CategoriesScreen {...screenProps} />;
      case 'Print':
        return <PrintScreen {...screenProps} />;
      default:
        return <HomeScreen {...screenProps} />;
    }
  };

  return (
    <View style={styles.container}>
      {renderScreen()}
      <BottomTabNavigator activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="MainApp"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {/* Main App with Bottom Tabs (4 tabs) */}
      <Stack.Screen 
        name="MainApp" 
        component={TabContainer}
        options={{
          headerShown: false,
        }}
      />
      
      {/* Profile Screen - Accessed from header person icon */}
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />

      {/* Profile Related Screens */}
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />

      <Stack.Screen 
        name="MyAddresses" 
        component={MyAddressesScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="PaymentMethods" 
        component={PaymentMethodsScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />

      <Stack.Screen 
        name="OrderHistory" 
        component={OrderHistoryScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
       {/* Settings Screen */}
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
         <Stack.Screen 
        name="AddPaymentMethod" 
        component={AddPaymentMethodScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_bottom',
        }}
      />

      {/* Map Selection Screen */}
      <Stack.Screen 
        name="MapSelection" 
        component={MapSelectionScreen}
        options={{
          headerShown: true,
          headerTitle: 'Select Location',
          headerBackTitle: 'Back',
          presentation: 'modal',
          headerStyle: {
            backgroundColor: '#F5F5F5',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
          headerTintColor: '#1A1A1A',
        }}
      />

      {/* Cart Screen - Accessed from header cart icon */}
      {/* <Stack.Screen 
        name="Cart" 
        component={CartScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      /> */}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AppNavigator;