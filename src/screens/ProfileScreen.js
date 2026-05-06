import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from '../utils/tailwind';
import { fetchUserProfile, clearUserData } from '../store/slices/userSlice';
import { logoutUser } from '../store/slices/authSlice';

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  
  // Redux state
  const { data: userData, loading } = useSelector((state) => state.user);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [displayData, setDisplayData] = useState(null);

  // Load data from AsyncStorage first, then fetch fresh from API
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('=== ProfileScreen: Loading user data ===');
        
        // Load from AsyncStorage first for immediate display
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          console.log('ProfileScreen: Data from AsyncStorage:', user);
          console.log('ProfileScreen: Phone from AsyncStorage:', user.phone);
          setDisplayData(user);
        }
        
        // Then fetch fresh data from API
        if (isAuthenticated) {
          dispatch(fetchUserProfile());
        }
      } catch (error) {
        console.error('ProfileScreen: Error loading data:', error);
      }
    };

    loadData();
  }, [dispatch, isAuthenticated]);

  // Update displayData when Redux userData changes
  useEffect(() => {
    if (userData) {
      console.log('=== ProfileScreen: Redux userData updated ===');
      console.log('Name:', userData.name);
      console.log('Email:', userData.email);
      console.log('Phone:', userData.phone);
      setDisplayData(userData);
    }
  }, [userData]);

  // Refresh profile when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      console.log('ProfileScreen: Screen focused, refreshing data');
      
      // Load from AsyncStorage again
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          console.log('ProfileScreen: Refreshed from AsyncStorage');
          console.log('Phone:', user.phone);
          setDisplayData(user);
        }
      } catch (error) {
        console.error('Error refreshing from AsyncStorage:', error);
      }
      
      // Also fetch from API
      if (isAuthenticated) {
        dispatch(fetchUserProfile());
      }
    });

    return unsubscribe;
  }, [navigation, dispatch, isAuthenticated]);

  const handleLogoutConfirmed = async () => {
    try {
      setLoggingOut(true);
      
      // Clear user data from Redux
      dispatch(clearUserData());
      
      // Logout from auth (this will also clear AsyncStorage)
      await dispatch(logoutUser()).unwrap();
      
      console.log('Logout successful');
      
      // Navigation will be handled automatically by your auth flow
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    } finally {
      setLoggingOut(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: handleLogoutConfirmed,
        },
      ],
      { cancelable: true }
    );
  };

  // Get user initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Format member since date
  const getMemberSince = (createdAt) => {
    if (!createdAt) return 'Recently';
    const date = new Date(createdAt);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Menu sections
  const accountSection = [
    {
      id: '1',
      title: 'Edit Profile',
      icon: 'person-outline',
      iconType: 'Ionicons',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      id: '2',
      title: 'My Addresses',
      icon: 'location-outline',
      iconType: 'Ionicons',
      badge: '3',
      onPress: () => navigation.navigate('MyAddresses'),
    },
    {
      id: '3',
      title: 'Payment Methods',
      icon: 'card-outline',
      iconType: 'Ionicons',
      onPress: () => navigation.navigate('PaymentMethods'),
    },
    {
      id: '4',
      title: 'Order History',
      icon: 'time-outline',
      iconType: 'Ionicons',
      onPress: () => navigation.navigate('OrderHistory'),
    },
  ];

  const preferencesSection = [
    {
      id: '1',
      title: 'Notifications',
      icon: 'notifications-outline',
      iconType: 'Ionicons',
      hasSwitch: true,
      value: notificationsEnabled,
      onToggle: setNotificationsEnabled,
    },
    {
      id: '2',
      title: 'Location Services',
      icon: 'navigate-outline',
      iconType: 'Ionicons',
      hasSwitch: true,
      value: locationEnabled,
      onToggle: setLocationEnabled,
    },
    {
      id: '3',
      title: 'Language',
      icon: 'language-outline',
      iconType: 'Ionicons',
      rightText: 'English',
      onPress: () => navigation.navigate('Language'),
    },
  ];

  const supportSection = [
    {
      id: '1',
      title: 'Help Center',
      icon: 'help-circle-outline',
      iconType: 'Ionicons',
      onPress: () => navigation.navigate('HelpCenter'),
    },
    {
      id: '2',
      title: 'About Us',
      icon: 'information-circle-outline',
      iconType: 'Ionicons',
      onPress: () => navigation.navigate('About'),
    },
    {
      id: '3',
      title: 'Terms & Conditions',
      icon: 'document-text-outline',
      iconType: 'Ionicons',
      onPress: () => navigation.navigate('Terms'),
    },
    {
      id: '4',
      title: 'Privacy Policy',
      icon: 'shield-checkmark-outline',
      iconType: 'Ionicons',
      onPress: () => navigation.navigate('Privacy'),
    },
  ];

  const renderMenuItem = (item) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={tw`flex-row items-center justify-between bg-white px-4 py-4 border-b border-gray-100`}
        onPress={item.onPress}
        activeOpacity={0.7}
      >
        <View style={tw`flex-row items-center flex-1`}>
          <View style={tw`w-10 h-10 bg-gray-100 rounded-full justify-center items-center`}>
            <Icon name={item.icon} size={20} color="#1A1A1A" />
          </View>
          <Text style={tw`text-base font-semibold text-[#1A1A1A] ml-3`}>
            {item.title}
          </Text>
          {item.badge && (
            <View style={tw`bg-green-500 rounded-full px-2 py-0.5 ml-2`}>
              <Text style={tw`text-xs font-bold text-white`}>{item.badge}</Text>
            </View>
          )}
        </View>
        {item.hasSwitch ? (
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ false: '#D1D5DB', true: '#4CAF50' }}
            thumbColor="#FFFFFF"
          />
        ) : (
          <View style={tw`flex-row items-center`}>
            {item.rightText && (
              <Text style={tw`text-sm text-gray-500 mr-2`}>{item.rightText}</Text>
            )}
            <Icon name="chevron-forward" size={20} color="#9CA3AF" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Use displayData (from AsyncStorage or Redux)
  const currentData = displayData || userData;

  // Show loading state only if no data at all
  if (loading && !currentData) {
    return (
      <View style={tw`flex-1 bg-gray-50 justify-center items-center`}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={tw`mt-4 text-gray-600`}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#4CAF50', '#45A049']}
        style={tw`pb-6`}
      >
        <SafeAreaView edges={['top']}>
          <View style={tw`flex-row items-center justify-between px-4 pt-2`}>
            <View style={tw`flex-row items-center flex-1`}>
              <TouchableOpacity 
                style={tw`bg-white bg-opacity-20 rounded-full w-10 h-10 justify-center items-center mr-3`}
                onPress={() => navigation.goBack()}
              >
                <Icon name="chevron-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={tw`text-2xl font-extrabold text-white`}>Profile</Text>
            </View>
            <TouchableOpacity 
              style={tw`bg-white bg-opacity-20 rounded-full w-10 h-10 justify-center items-center`}
              onPress={() => navigation.navigate('Settings')}
            >
              <Icon name="settings-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* User Info Card */}
          <View style={tw`mx-4 mt-6 bg-white rounded-2xl p-4 shadow-lg`}>
            <View style={tw`flex-row items-center`}>
              {currentData?.avatar ? (
                <Image
                  source={{ uri: currentData.avatar }}
                  style={tw`w-20 h-20 rounded-full border-4 border-green-100`}
                />
              ) : (
                <View style={tw`w-20 h-20 rounded-full border-4 border-green-100 bg-green-500 justify-center items-center`}>
                  <Text style={tw`text-2xl font-bold text-white`}>
                    {getInitials(currentData?.name)}
                  </Text>
                </View>
              )}
              <View style={tw`flex-1 ml-4`}>
                <Text style={tw`text-xl font-bold text-[#1A1A1A] mb-1`}>
                  {currentData?.name || 'User'}
                </Text>
                <Text style={tw`text-sm text-gray-500 mb-0.5`}>
                  {currentData?.email || 'No email'}
                </Text>
                {/* GUARANTEED PHONE DISPLAY */}
                {currentData?.phone && (
                  <View style={tw`flex-row items-center mt-1`}>
                    <Icon name="call-outline" size={14} color="#6B7280" />
                    <Text style={tw`text-sm text-gray-500 ml-1`}>
                      {currentData.phone}
                    </Text>
                  </View>
                )}
                {!currentData?.phone && (
                  <Text style={tw`text-xs text-red-400 mt-1`}>
                    No phone number
                  </Text>
                )}
              </View>
            </View>

            {/* Stats Row */}
            <View style={tw`flex-row justify-around mt-4 pt-4 border-t border-gray-100`}>
              <View style={tw`items-center`}>
                <Text style={tw`text-2xl font-bold text-green-600`}>
                  {currentData?.orderCount || 0}
                </Text>
                <Text style={tw`text-xs text-gray-500 mt-1`}>Orders</Text>
              </View>
              <View style={tw`w-px bg-gray-200`} />
              <View style={tw`items-center`}>
                <Text style={tw`text-2xl font-bold text-green-600`}>
                  ₹{currentData?.totalSavings || 0}
                </Text>
                <Text style={tw`text-xs text-gray-500 mt-1`}>Saved</Text>
              </View>
              <View style={tw`w-px bg-gray-200`} />
              <View style={tw`items-center`}>
                <Text style={tw`text-2xl font-bold text-green-600`}>
                  {currentData?.membershipTier || 'Gold'}
                </Text>
                <Text style={tw`text-xs text-gray-500 mt-1`}>Member</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Scrollable Content */}
      <ScrollView 
        style={tw`flex-1`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-6`}
      >
        {/* Account Section */}
        <View style={tw`mt-6`}>
          <Text style={tw`text-sm font-bold text-gray-500 uppercase tracking-wide px-4 mb-2`}>
            Account
          </Text>
          <View style={tw`bg-white rounded-2xl mx-4 overflow-hidden shadow-sm`}>
            {accountSection.map(renderMenuItem)}
          </View>
        </View>

        {/* Preferences Section */}
        <View style={tw`mt-6`}>
          <Text style={tw`text-sm font-bold text-gray-500 uppercase tracking-wide px-4 mb-2`}>
            Preferences
          </Text>
          <View style={tw`bg-white rounded-2xl mx-4 overflow-hidden shadow-sm`}>
            {preferencesSection.map(renderMenuItem)}
          </View>
        </View>

        {/* Support Section */}
        <View style={tw`mt-6`}>
          <Text style={tw`text-sm font-bold text-gray-500 uppercase tracking-wide px-4 mb-2`}>
            Support
          </Text>
          <View style={tw`bg-white rounded-2xl mx-4 overflow-hidden shadow-sm`}>
            {supportSection.map(renderMenuItem)}
          </View>
        </View>

        {/* Membership Card */}
        <View style={tw`mx-4 mt-6`}>
          <LinearGradient
            colors={['#FFD700', '#FFC107']}
            style={tw`rounded-2xl p-4 shadow-lg`}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={tw`flex-row items-center justify-between`}>
              <View style={tw`flex-1`}>
                <Text style={tw`text-sm font-semibold text-gray-800 mb-1`}>
                  {currentData?.membershipTier || 'Gold'} Member
                </Text>
                <Text style={tw`text-xl font-extrabold text-gray-900 mb-2`}>
                  Member since {getMemberSince(currentData?.createdAt)}
                </Text>
                <Text style={tw`text-xs text-gray-700`}>
                  Enjoying exclusive benefits & rewards
                </Text>
              </View>
              <MaterialCommunityIcons name="crown" size={50} color="#CD7F32" />
            </View>
          </LinearGradient>
        </View>

        {/* App Info */}
        <View style={tw`items-center mt-6 px-4`}>
          <Text style={tw`text-xs text-gray-400 mb-1`}>
            Version 1.0.0
          </Text>
          <Text style={tw`text-xs text-gray-400`}>
            Made with ❤️ in India
          </Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={tw`mx-4 mt-6 bg-red-50 border-2 border-red-500 rounded-xl py-4 items-center shadow-sm ${loggingOut ? 'opacity-50' : ''}`}
          onPress={handleLogout}
          activeOpacity={0.7}
          disabled={loggingOut}
        >
          <View style={tw`flex-row items-center`}>
            {loggingOut ? (
              <>
                <ActivityIndicator size="small" color="#EF4444" />
                <Text style={tw`text-base font-bold text-red-500 ml-2`}>
                  Logging out...
                </Text>
              </>
            ) : (
              <>
                <Icon name="log-out-outline" size={22} color="#EF4444" />
                <Text style={tw`text-base font-bold text-red-500 ml-2`}>
                  Logout
                </Text>
              </>
            )}
          </View>
        </TouchableOpacity>

        {/* Bottom Spacing */}
        <View style={tw`h-6`} />
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;