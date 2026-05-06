import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  StatusBar,
  Animated,
  Image,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import AddressSelectionModal from './Homescreen/AddressSelectionModal';
import { useNavigation } from '@react-navigation/native';
import tw from '../utils/tailwind';
import { useCart } from '../context/CartContext';

const SNOW_ANIMS_COUNT = 5;

const HomeScreen = () => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('HOME - Neha');
  const { cartCount, cartTotal } = useCart();


  const gradientAnim = useRef(new Animated.Value(0)).current;

  // Stable ref array — never recreated, so interpolations stay valid
  const snowAnims = useRef(
    Array.from({ length: SNOW_ANIMS_COUNT }, () => new Animated.Value(0))
  ).current;

  const lottieRef = useRef(null);
  const kidsLottieRef = useRef(null);

  // THE KEY FIX: a cancelled flag that the recursive callback checks before
  // scheduling the next iteration. Setting it to true is instant and
  // synchronous — no race conditions, no dirty Animated state.
  const snowCancelledRef = useRef(false);

  const categoryGradients = {
    All: ['#E0F7FA', '#B2EBF2'],
    Winter: ['#B3E5FC', '#81D4FA'],
    Electronics: ['#CE93D8', '#BA68C8'],
    Beauty: ['#F48FB1', '#F06292'],
    Decor: ['#A5D6A7', '#81C784'],
    Kids: ['#FFCDD2', '#EF9A9A'],
  };

  // Recursive loop that respects the cancelled flag
  const runSnowLoop = useCallback(
    (anim, duration) => {
      if (snowCancelledRef.current) return;
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }).start(({ finished }) => {
        // Only recurse when the animation ran to completion naturally
        if (finished && !snowCancelledRef.current) {
          runSnowLoop(anim, duration);
        }
      });
    },
    [] // no deps — reads ref directly
  );

  const isSnowRunningRef = useRef(false);

  const startSnowAnimations = useCallback(() => {
    if (isSnowRunningRef.current) return; // Prevent restart race
    isSnowRunningRef.current = true;
    snowCancelledRef.current = false;

    const durations = [3000, 3500, 4000, 3200, 3800];
    snowAnims.forEach((anim, index) => {
      if (!snowCancelledRef.current && isSnowRunningRef.current) {
        runSnowLoop(anim, durations[index]);
      }
    });
  }, []);


  const stopSnowAnimations = useCallback(() => {
    isSnowRunningRef.current = false;
    snowCancelledRef.current = true;
    setTimeout(() => {
      snowAnims.forEach((anim) => {
        anim.stopAnimation(() => { }); // ← fixed: proper callback, not assignment
        anim.setValue(0);
      });
    }, 0);
  }, []);


  useEffect(() => {
    gradientAnim.setValue(0);
    Animated.timing(gradientAnim, {
      toValue: 1, duration: 500, useNativeDriver: false,
    }).start();

    if (selectedCategory !== 'Winter') {
      isSnowRunningRef.current = false; // ← add this
      snowCancelledRef.current = true;
      lottieRef.current?.pause();
    }

    const timeoutId = setTimeout(() => {
      if (selectedCategory === 'Winter') {
        lottieRef.current?.play();
        startSnowAnimations();
      }
      if (selectedCategory === 'Kids' && !isSearchFocused) {
        kidsLottieRef.current?.play();
      } else {
        kidsLottieRef.current?.pause();
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      // Don't call stopSnowAnimations here — handleCategoryPress already did it
    };
  }, [selectedCategory, isSearchFocused]);

  // Hard stop on unmount
  useEffect(() => {
    return () => {
      snowCancelledRef.current = true;
      snowAnims.forEach((anim) => anim.stopAnimation());
    };
  }, []);

  const getCurrentGradient = () =>
    categoryGradients[selectedCategory] ?? categoryGradients.All;

  const handleAddressSelect = (addressData) => {
    if (addressData.type === 'current') {
      setSelectedAddress('Current Location');
      navigation.navigate('MapSelection', {
        latitude: addressData.latitude,
        longitude: addressData.longitude,
      });
    } else if (addressData.type === 'new') {
      navigation.navigate('MapSelection');
    } else if (addressData.type === 'saved') {
      setSelectedAddress(addressData.address.label);
    }
  };

  const categories = [
    { id: '1', name: 'All', icon: 'grid', iconType: 'Ionicons' },
    { id: '2', name: 'Winter', icon: 'snow', iconType: 'Ionicons' },
    { id: '3', name: 'Electronics', icon: 'headset', iconType: 'Ionicons' },
    { id: '4', name: 'Beauty', icon: 'rose', iconType: 'Ionicons' },
    { id: '5', name: 'Decor', icon: 'bulb', iconType: 'Ionicons' },
    { id: '6', name: 'Kids', icon: 'football', iconType: 'Ionicons' },
  ];

  const featuredBanners = {
    All: [
      {
        id: '1',
        title: 'NEWLY\nLAUNCHED',
        badge: 'For You',
        color: ['#80DEEA', '#4DD0E1'],
        image: 'https://via.placeholder.com/200x300/80DEEA/000000?text=New',
      },
      {
        id: '2',
        title: 'Enriching\nExotic Nuts',
        badge: 'Featured',
        color: ['#5D4037', '#4E342E'],
        image: 'https://via.placeholder.com/200x300/5D4037/FFFFFF?text=Nuts',
      },
      {
        id: '3',
        title: 'Major Price\nDrop',
        badge: 'Featured',
        color: ['#C8E6C9', '#A5D6A7'],
        image: 'https://via.placeholder.com/200x300/C8E6C9/000000?text=Deals',
      },
    ],
    Winter: [
      {
        id: '1',
        title: 'myTRIDENT',
        badge: 'Featured',
        color: ['#26626D', '#1E4D55'],
        image: 'https://via.placeholder.com/200x300/26626D/FFFFFF?text=Trident',
      },
      {
        id: '2',
        title: 'NESCAFÉ\nRistretto',
        badge: 'Featured',
        color: ['#2C1810', '#1A0F09'],
        image: 'https://via.placeholder.com/200x300/2C1810/FFFFFF?text=Coffee',
      },
      {
        id: '3',
        title: 'Lip Balms',
        badge: 'Featured',
        color: ['#8E0038', '#6D0029'],
        image: 'https://via.placeholder.com/200x300/8E0038/FFFFFF?text=Balms',
      },
    ],
    Electronics: [
      {
        id: '1',
        title: 'Top\nGadgets',
        badge: 'New',
        color: ['#CE93D8', '#AB47BC'],
        image: 'https://via.placeholder.com/200x300/CE93D8/FFFFFF?text=Gadgets',
      },
      {
        id: '2',
        title: 'Best\nDeals',
        badge: 'Sale',
        color: ['#9575CD', '#7E57C2'],
        image: 'https://via.placeholder.com/200x300/9575CD/FFFFFF?text=Deals',
      },
    ],
    Beauty: [
      {
        id: '1',
        title: 'Glow\nUp',
        badge: 'Trending',
        color: ['#F48FB1', '#EC407A'],
        image: 'https://via.placeholder.com/200x300/F48FB1/FFFFFF?text=Beauty',
      },
      {
        id: '2',
        title: 'Skin\nCare',
        badge: 'Featured',
        color: ['#F06292', '#E91E63'],
        image: 'https://via.placeholder.com/200x300/F06292/FFFFFF?text=Skin',
      },
    ],
    Decor: [
      {
        id: '1',
        title: 'Home\nVibes',
        badge: 'New',
        color: ['#A5D6A7', '#66BB6A'],
        image: 'https://via.placeholder.com/200x300/A5D6A7/000000?text=Decor',
      },
      {
        id: '2',
        title: 'Light\nUp',
        badge: 'Featured',
        color: ['#81C784', '#4CAF50'],
        image: 'https://via.placeholder.com/200x300/81C784/FFFFFF?text=Lights',
      },
    ],
    Kids: [
      {
        id: '1',
        title: 'Fun\nToys',
        badge: 'New',
        color: ['#FFCDD2', '#EF9A9A'],
        image: 'https://via.placeholder.com/200x300/FFCDD2/000000?text=Toys',
      },
      {
        id: '2',
        title: 'Learn\n& Play',
        badge: 'Featured',
        color: ['#EF9A9A', '#E57373'],
        image: 'https://via.placeholder.com/200x300/EF9A9A/FFFFFF?text=Learn',
      },
    ],
  };

  const frequentlyBought = [
    {
      id: '1',
      title: 'Favourites',
      color: '#E8F5E9',
      items: [
        { id: '1', image: require('../assets/images/coca_cola_image.png') },
        { id: '2', image: require('../assets/images/maggi_image.png') },
      ],
    },
    {
      id: '2',
      title: 'Chips & Namkeen',
      color: '#E8F5E9',
      items: [
        { id: '1', image: require('../assets/images/yippee_image.png') },
        { id: '2', image: require('../assets/images/maggi_oats_image.png') },
      ],
      moreCount: 2,
    },
    {
      id: '3',
      title: 'Bread, Butter & Eggs',
      color: '#E8F5E9',
      items: [
        { id: '1', image: require('../assets/images/whole_wheat_bread_image.png') },
        { id: '2', image: require('../assets/images/eggs_image.png') },
      ],
    },
    {
      id: '4',
      title: 'Instant Food',
      color: '#E8F5E9',
      items: [
        { id: '1', image: require('../assets/images/maggi_image.png') },
        { id: '2', image: require('../assets/images/top_ramen_image.png') },
      ],
    },
    {
      id: '5',
      title: 'Milk, Curd & Paneer',
      color: '#E8F5E9',
      items: [
        { id: '1', image: require('../assets/images/amul_milk_image.png') },
        { id: '2', image: require('../assets/images/paneer_image.png') },
      ],
    },
    {
      id: '6',
      title: 'Chocolates & Candies',
      color: '#E8F5E9',
      items: [
        { id: '1', image: require('../assets/images/dairy_product_image.png') },
        { id: '2', image: require('../assets/images/vanilla_muffins_image.png') },
      ],
    },
  ];

  const winterProducts = [
    {
      id: '1',
      title: 'Myom Bedsheet',
      subtitle: 'No cost EMI offer',
      price: '₹696',
      mrp: '₹948',
      image: require('../assets/images/barley_image.png'),
    },
    {
      id: '2',
      title: 'Knorr Thick Tomato Soup',
      price: '₹600',
      image: require('../assets/images/knorr_soup_image.png'),
    },
    {
      id: '3',
      title: 'Davidoff Aroma Instant Coffee',
      subtitle: 'Imported',
      price: '₹638',
      mrp: '₹689',
      image: require('../assets/images/brown_rice_image.png'),
    },
  ];
  const handleCategoryPress = useCallback((categoryName) => {
    if (selectedCategory === categoryName) return;

    // Set cancellation flags synchronously, before anything else
    isSnowRunningRef.current = false;
    snowCancelledRef.current = true;

    if (selectedCategory === 'Winter') {
      lottieRef.current?.pause();
      snowAnims.forEach((anim) => anim.stopAnimation(() => { }));
    }

    setSelectedCategory(categoryName);
    setIsSearchFocused(false);
  }, [selectedCategory]);


  const renderIcon = (iconName, iconType, size, color) => {
    switch (iconType) {
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
      case 'FontAwesome5':
        return <FontAwesome5 name={iconName} size={size} color={color} />;
      default:
        return <Icon name={iconName} size={size} color={color} />;
    }
  };

  const renderCategory = useCallback(({ item }) => {
    const isSelected = selectedCategory === item.name;
    return (
      <TouchableOpacity
        style={tw`items-center mr-7 relative`}
        onPress={() => handleCategoryPress(item.name)}
        activeOpacity={0.7}
      >
        <View style={tw`mb-1.5`}>
          {renderIcon(item.icon, item.iconType, 28, '#1A1A1A')}
        </View>
        <Text style={tw`text-[13px] ${isSelected ? 'text-[#1A1A1A] font-bold' : 'text-gray-500 font-semibold'}`}>
          {item.name}
        </Text>
        {isSelected && (
          <View style={tw`absolute -bottom-2 w-10 h-0.5 bg-[#1A1A1A] rounded`} />
        )}
      </TouchableOpacity>
    );
  }, [selectedCategory, handleCategoryPress]);

  const renderFeaturedBanner = ({ item }) => {
    if (!item) return null;
    const bannerWidth = Math.min(width * 0.5, 250);
    return (
      <View style={tw`relative`}>
        {item.badge && (
          <View style={tw`absolute top-3 left-3 bg-white px-3 py-1.5 rounded-full z-10 shadow-sm`}>
            <Text style={tw`text-xs font-bold text-pink-600`}>{item.badge}</Text>
          </View>
        )}
        <LinearGradient
          colors={item.color}
          style={[
            tw`rounded-2xl p-4 justify-end border-2 border-blue-500`,
            { width: bannerWidth, height: 220 },
          ]}
        >
          <Text
            style={tw`text-xl font-extrabold ${item.color[0].includes('4') ? 'text-white' : 'text-[#1A1A1A]'
              } leading-tight`}
          >
            {item.title}
          </Text>
        </LinearGradient>
      </View>
    );
  };

  const renderFrequentlyBought = ({ item }) => {
    const sectionWidth = (width - 44) / 2;
    return (
      <View
        style={[
          tw`rounded-2xl p-4 min-h-40`,
          { backgroundColor: item.color, width: sectionWidth },
        ]}
      >
        <View style={tw`flex-row flex-wrap gap-2 mb-3`}>
          {item.items.map((product) => (
            <View
              key={product.id}
              style={tw`bg-white rounded-xl p-2 w-15 h-15 justify-center items-center shadow-sm`}
            >
              <Image
                source={product.image}
                style={tw`w-full h-full rounded-lg`}
              />
            </View>
          ))}
          {item.moreCount && (
            <View style={tw`bg-white px-2 py-1.5 rounded-xl shadow-sm`}>
              <Text style={tw`text-[11px] font-bold text-[#1A1A1A]`}>
                +{item.moreCount} more
              </Text>
            </View>
          )}
        </View>
        <Text style={tw`text-[15px] font-bold text-[#1A1A1A]`} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
    );
  };

  const renderWinterProduct = ({ item }) => {
    const productWidth = Math.min(width * 0.4, 180);
    return (
      <View
        style={[
          tw`bg-white rounded-xl overflow-hidden shadow-sm`,
          { width: productWidth },
        ]}
      >
        <View style={[tw`relative bg-gray-100`, { height: productWidth * 0.875 }]}>
          {item.subtitle && (
            <View style={tw`absolute top-2 left-2 bg-indigo-50 px-2 py-1 rounded-lg z-10`}>
              <Text style={tw`text-[10px] font-bold text-indigo-400`}>
                {item.subtitle}
              </Text>
            </View>
          )}
          <Image source={item.image} style={tw`w-full h-full`} />
          <TouchableOpacity
            style={tw`absolute top-2 right-2 bg-white rounded-full w-8 h-8 justify-center items-center shadow-sm`}
          >
            <Icon name="heart-outline" size={20} color="#999" />
          </TouchableOpacity>
        </View>
        <View style={tw`p-3`}>
          <Text
            style={tw`text-[13px] font-semibold text-[#1A1A1A] mb-1.5 h-9`}
            numberOfLines={2}
          >
            {item.title}
          </Text>
          <View style={tw`flex-row items-center gap-1.5 mb-2`}>
            <Text style={tw`text-base font-bold text-[#1A1A1A]`}>{item.price}</Text>
            {item.mrp && (
              <Text style={tw`text-xs text-gray-400 line-through`}>
                MRP {item.mrp}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={tw`bg-white border-[1.5px] border-green-500 rounded-lg py-2 items-center`}
          >
            <Text style={tw`text-[13px] font-bold text-green-500`}>ADD</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const currentBanners = featuredBanners[selectedCategory] ?? featuredBanners.All;
  const isWinterSelected = selectedCategory === 'Winter';
  const isKidsSelected = selectedCategory === 'Kids';

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      <StatusBar barStyle="dark-content" backgroundColor={getCurrentGradient()[0]} />

      <View style={tw`relative shadow-sm`}>
        <LinearGradient colors={getCurrentGradient()} style={tw`relative`}>
          {/* Winter Bear */}
          {isWinterSelected && (
            <View
              style={[
                tw`absolute top-7.5 right-35 w-30 h-30 z-10`,
                { display: isWinterSelected ? 'flex' : 'none' }
              ]}
              pointerEvents="none"
            >
              <LottieView
                ref={lottieRef}
                source={require('../assets/BearWinter.json')}
                autoPlay={false}
                loop
                style={tw`w-full h-full`}
              />
            </View>
          )}

          {/* Snowflakes — use stable snowAnims ref array */}
          {isWinterSelected && (
            <View
              style={tw`absolute top-0 left-0 right-0 bottom-0 z-10`}
              pointerEvents="none"
            >
              {snowAnims.map((anim, index) => (
                <Animated.View
                  key={index}
                  style={[
                    tw`absolute -top-5 z-10`,
                    { left: `${10 + index * 20}%` },
                    {
                      transform: [
                        {
                          translateY: anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 400 + index * 10],
                          }),
                        },
                      ],
                      opacity: anim.interpolate({
                        inputRange: [0, 0.2, 0.8, 1],
                        outputRange: [0, 1, 1, 0],
                      }),
                    },
                  ]}
                >
                  <Icon name="snow" size={22 + index * 2} color="#FFFFFF" />
                </Animated.View>
              ))}
            </View>
          )}

          <SafeAreaView edges={['top']} style={tw`relative z-10`}>
            {/* Header */}
            <View style={tw`flex-row justify-between items-start px-4 pt-2 pb-3`}>
              <View style={tw`flex-1 mr-3`}>
                <View style={tw`flex-row items-center flex-wrap gap-2 mb-1`}>
                  <Text
                    style={tw`text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight`}
                  >
                    15 minutes
                  </Text>
                  <View
                    style={tw`flex-row items-center bg-teal-50 px-2 py-1 rounded-xl gap-1`}
                  >
                    <Icon name="car" size={12} color="#00897B" />
                    <Text style={tw`text-xs text-teal-700 font-semibold`}>
                      1 km away
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={tw`flex-row items-center gap-1`}
                  onPress={() => setShowAddressModal(true)}
                >
                  <Text
                    style={tw`text-sm text-[#1A1A1A] font-bold`}
                    numberOfLines={1}
                  >
                    {selectedAddress}
                  </Text>
                  <Icon name="chevron-down" size={14} color="#1A1A1A" />
                </TouchableOpacity>
              </View>
              <View style={tw`flex-row items-center gap-2`}>
                <TouchableOpacity
                  style={tw`bg-white rounded-full px-3 py-2 flex-row items-center shadow-md`}
                  onPress={() => navigation.navigate('Cart')}
                >
                  <View style={tw`relative`}>
                    <Icon1 name="shopping-cart" size={20} color="#1A1A1A" />

                    {cartCount > 0 && (
                      <View
                        style={tw`absolute -top-2 -right-2 bg-red-500 rounded-full min-w-[16px] h-4 px-1 items-center justify-center`}
                      >
                        <Text style={tw`text-white text-[9px] font-bold`}>
                          {cartCount}
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={tw`bg-white rounded-full w-11 h-11 justify-center items-center shadow-md`}
                  onPress={() => navigation.navigate('Profile')}
                >
                  <Icon name="person" size={20} color="#1A1A1A" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Search Bar */}
            <View
              style={tw`flex-row items-center bg-white mx-4 my-3 px-4 py-3 rounded-2xl shadow-sm relative`}
            >
              {isKidsSelected && !isSearchFocused && (
                <View
                  style={[
                    tw`absolute right-30 top-0 w-75 h-15 z-10`,
                    { display: (isKidsSelected && !isSearchFocused) ? 'flex' : 'none' }
                  ]}
                  pointerEvents="none"
                >
                  <LottieView
                    ref={kidsLottieRef}
                    source={require('../assets/kids.json')}
                    autoPlay={false}
                    loop
                    style={tw`w-full h-full`}
                  />
                </View>
              )}
              <Icon name="search" size={22} color="#666" />
              <TextInput
                style={tw`flex-1 text-base text-[#1A1A1A] ml-3 font-medium`}
                placeholder={
                  isKidsSelected && !isSearchFocused ? '' : 'Search "board games"'
                }
                placeholderTextColor="#999"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <TouchableOpacity style={tw`p-1`}>
                <Icon name="mic" size={22} color="#1A1A1A" />
              </TouchableOpacity>
            </View>

            {/* Categories Tab */}
            <FlatList
              data={categories}
              renderItem={renderCategory}  // Back to original
              keyExtractor={(item) => `cat-${item.id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={tw`px-4 pb-4 gap-2`}
              removeClippedSubviews={false}
              initialNumToRender={6}  // Safer than maxToRenderPerBatch
            />
          </SafeAreaView>
        </LinearGradient>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={tw`flex-1`}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => {
          setIsSearchFocused(false);
          Keyboard.dismiss();
        }}
      >
        {/* Winter Season Banner */}
        {isWinterSelected && (
          <View
            style={tw`flex-row items-center justify-between bg-white mx-4 mt-4 p-4 sm:p-5 rounded-2xl shadow-sm`}
          >
            <Image
              source={{ uri: 'https://via.placeholder.com/100/FF6B35/FFFFFF?text=🎿' }}
              style={tw`w-16 h-16 sm:w-20 sm:h-20 rounded-full`}
            />
            <View style={tw`flex-1 items-center px-2`}>
              <Text
                style={tw`text-[10px] sm:text-xs text-blue-500 font-semibold tracking-wide`}
              >
                STOCK UP FOR THE
              </Text>
              <Text
                style={tw`text-xl sm:text-2xl lg:text-3xl font-extrabold text-blue-800 mt-1`}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                Winter Season
              </Text>
            </View>
            <Image
              source={{ uri: 'https://via.placeholder.com/100/FFFFFF/000000?text=☃️' }}
              style={tw`w-16 h-16 sm:w-20 sm:h-20 rounded-full`}
            />
          </View>
        )}

        {/* Featured Banners */}
        {currentBanners.length > 0 && (
          <View style={tw`mt-4`}>
            <FlatList
              data={currentBanners}
              renderItem={renderFeaturedBanner}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={tw`px-4 gap-3`}
            />
          </View>
        )}

        {/* Winter Products */}
        {isWinterSelected && (
          <View style={tw`mt-6 px-4`}>
            <View style={tw`mb-4`}>
              <Text style={tw`text-xl font-extrabold text-[#1A1A1A] mb-1`}>
                Time to snuggle, sip & stay warm!
              </Text>
              <Text style={tw`text-sm text-gray-500 font-medium`}>
                Grab deals on top winter picks
              </Text>
            </View>
            <FlatList
              data={winterProducts}
              renderItem={renderWinterProduct}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={tw`gap-3`}
            />
          </View>
        )}

        {/* Frequently Bought */}
        {selectedCategory === 'All' && (
          <View style={tw`mt-6 px-4`}>
            <Text style={tw`text-[22px] font-extrabold text-[#1A1A1A] mb-4`}>
              Frequently bought
            </Text>
            <View>
              {frequentlyBought.reduce((rows, item, index) => {
                if (index % 2 === 0) {
                  rows.push(
                    <View key={item.id} style={tw`flex-row justify-between mb-3`}>
                      {renderFrequentlyBought({ item: frequentlyBought[index] })}
                      {frequentlyBought[index + 1]
                        ? renderFrequentlyBought({ item: frequentlyBought[index + 1] })
                        : <View style={{ width: (width - 44) / 2 }} />}
                    </View>
                  );
                }
                return rows;
              }, [])}
            </View>
          </View>
        )}

        {/* Promo Banner */}
        <View style={tw`bg-yellow-50 mx-4 mt-6 rounded-2xl p-4 shadow-sm`}>
          <View style={tw`flex-row items-center`}>
            <View
              style={tw`w-12 h-12 sm:w-15 sm:h-15 rounded-full overflow-hidden flex-shrink-0`}
            >
              <Image
                source={{ uri: 'https://via.placeholder.com/60/7C4DFF/FFFFFF?text=D' }}
                style={tw`w-full h-full`}
              />
            </View>
            <View style={tw`flex-1 mx-3`}>
              <Text
                style={tw`text-xs sm:text-sm font-bold text-[#1A1A1A] mb-0.5`}
                numberOfLines={2}
              >
                Get a District Movie Voucher worth ₹125
              </Text>
              <Text style={tw`text-xs text-gray-500 font-medium`}>
                on orders above ₹199
              </Text>
            </View>
            <View style={tw`flex-row items-center gap-1`}>
              <Icon name="chevron-forward" size={20} color="#666" />
              <TouchableOpacity style={tw`p-1`}>
                <Icon name="close" size={20} color="#999" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={tw`h-30`} />
      </ScrollView>

      <AddressSelectionModal
        visible={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onAddressSelect={handleAddressSelect}
      />
    </View>
  );
};

export default HomeScreen;