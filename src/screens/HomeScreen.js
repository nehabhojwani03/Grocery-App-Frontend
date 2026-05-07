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
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import AddressSelectionModal from './Homescreen/AddressSelectionModal';
import { useNavigation } from '@react-navigation/native';
import tw from '../utils/tailwind';
import { useCart } from '../context/CartContext';

const SNOW_ANIMS_COUNT = 6;

// ─── Design Tokens ───────────────────────────────────────────────────────────
const COLORS = {
  bg: '#F5F4F0',
  card: '#FFFFFF',
  text: '#111111',
  textSub: '#888888',
  textMuted: '#BBBBBB',
  border: '#EBEBEB',
  green: '#2BB77D',
  greenLight: '#E8F8F1',
  red: '#E24B4A',
  ink: '#1A1A1A',
};

const CATEGORY_GRADIENTS = {
  All:         ['#DBF3F7', '#BDE8EF'],
  Winter:      ['#C8E8F8', '#A8D4F2'],
  Electronics: ['#E4D5F7', '#D0B8F0'],
  Beauty:      ['#FAD6E8', '#F5B5D2'],
  Decor:       ['#D5EED8', '#B8E4BC'],
  Kids:        ['#FDE0CC', '#FAC8A8'],
};

const CATEGORY_ACCENT = {
  All:         '#1A8A9A',
  Winter:      '#1A6FA0',
  Electronics: '#6A3AAA',
  Beauty:      '#B83060',
  Decor:       '#2A7040',
  Kids:        '#C05020',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const renderIcon = (iconName, iconType, size, color) => {
  switch (iconType) {
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
    case 'FontAwesome5':
      return <FontAwesome5 name={iconName} size={size} color={color} />;
    case 'MaterialIcons':
      return <MaterialIcons name={iconName} size={size} color={color} />;
    default:
      return <Icon name={iconName} size={size} color={color} />;
  }
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionHeader = ({ title, subtitle, onSeeAll }) => (
  <View style={s.sectionHeader}>
    <View>
      <Text style={s.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={s.sectionSub}>{subtitle}</Text> : null}
    </View>
    {onSeeAll && (
      <TouchableOpacity style={s.seeAllBtn} onPress={onSeeAll} activeOpacity={0.7}>
        <Text style={s.seeAllText}>View all</Text>
        <Icon name="arrow-forward" size={13} color={COLORS.textSub} />
      </TouchableOpacity>
    )}
  </View>
);

const BannerCard = ({ item, width }) => (
  <LinearGradient
    colors={item.gradient}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={[s.bannerCard, { width }]}
  >
    {item.badge && (
      <View style={s.bannerBadge}>
        <Text style={s.bannerBadgeText}>{item.badge}</Text>
      </View>
    )}
    <Text style={s.bannerTitle}>{item.title}</Text>
    {item.subtitle ? <Text style={s.bannerSub}>{item.subtitle}</Text> : null}
  </LinearGradient>
);

const ProductCard = ({ item, cardWidth }) => {
  const [added, setAdded] = useState(false);
  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };
  return (
    <View style={[s.productCard, { width: cardWidth }]}>
      <View style={[s.productImgWrap, { backgroundColor: item.imgBg || '#F7F6F2' }]}>
        {item.subtitle && (
          <View style={s.productTag}>
            <Text style={s.productTagText}>{item.subtitle}</Text>
          </View>
        )}
        <Image source={item.image} style={s.productImg} resizeMode="contain" />
        <TouchableOpacity style={s.productHeart} activeOpacity={0.7}>
          <Icon name="heart-outline" size={16} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>
      <View style={s.productInfo}>
        <Text style={s.productName} numberOfLines={2}>{item.title}</Text>
        <View style={s.productPriceRow}>
          <Text style={s.productPrice}>{item.price}</Text>
          {item.mrp && <Text style={s.productMrp}>MRP {item.mrp}</Text>}
        </View>
        <TouchableOpacity
          style={[s.addBtn, added && s.addBtnActive]}
          onPress={handleAdd}
          activeOpacity={0.8}
        >
          <Text style={[s.addBtnText, added && s.addBtnTextActive]}>
            {added ? 'ADDED' : 'ADD'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const FreqCard = ({ item, cardWidth }) => (
  <TouchableOpacity style={[s.freqCard, { width: cardWidth }]} activeOpacity={0.85}>
    <View style={s.freqImgs}>
      {item.items.map((p) => (
        <View key={p.id} style={s.freqImgBox}>
          <Image source={p.image} style={s.freqImg} resizeMode="contain" />
        </View>
      ))}
      {item.moreCount ? (
        <View style={s.freqMore}>
          <Text style={s.freqMoreText}>+{item.moreCount}</Text>
        </View>
      ) : null}
    </View>
    <Text style={s.freqLabel} numberOfLines={2}>{item.title}</Text>
    <View style={s.freqArrow}>
      <Icon name="arrow-forward" size={13} color={COLORS.textSub} />
    </View>
  </TouchableOpacity>
);

const PromoStrip = ({ accent }) => (
  <View style={s.promoStrip}>
    <View style={[s.promoIconWrap, { backgroundColor: accent + '18' }]}>
      <Icon name="ticket-outline" size={22} color={accent} />
    </View>
    <View style={s.promoText}>
      <Text style={s.promoTitle}>Movie Voucher worth ₹125</Text>
      <Text style={s.promoSub}>On orders above ₹199</Text>
    </View>
    <View style={s.promoActions}>
      <Icon name="chevron-forward" size={18} color={COLORS.textSub} />
      <TouchableOpacity style={s.promoClose} activeOpacity={0.7}>
        <Icon name="close" size={16} color={COLORS.textMuted} />
      </TouchableOpacity>
    </View>
  </View>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: '1', name: 'All',         icon: 'grid',          iconType: 'Ionicons' },
  { id: '2', name: 'Winter',      icon: 'snow',          iconType: 'Ionicons' },
  { id: '3', name: 'Electronics', icon: 'hardware-chip', iconType: 'Ionicons' },
  { id: '4', name: 'Beauty',      icon: 'rose',          iconType: 'Ionicons' },
  { id: '5', name: 'Decor',       icon: 'bulb',          iconType: 'Ionicons' },
  { id: '6', name: 'Kids',        icon: 'balloon',       iconType: 'Ionicons' },
];

const FEATURED_BANNERS = {
  All: [
    { id: '1', title: 'Newly\nLaunched',   badge: 'For You',  subtitle: 'Fresh arrivals',     gradient: ['#1D8A7A', '#0D5D53'] },
    { id: '2', title: 'Exotic\nNuts',      badge: 'Featured', subtitle: 'Imported premium',   gradient: ['#3B2A1A', '#1E1409'] },
    { id: '3', title: 'Major\nDiscounts',  badge: 'Sale',     subtitle: 'Up to 40% off',      gradient: ['#4A6B38', '#2D4A1E'] },
  ],
  Winter: [
    { id: '1', title: 'myTRIDENT',         badge: 'Featured', subtitle: 'Warm bedsheets',     gradient: ['#1D4E6E', '#0D2D45'] },
    { id: '2', title: 'NESCAFÉ\nRistretto',badge: 'Hot Pick', subtitle: 'Stay cosy',          gradient: ['#2C1810', '#1A0F09'] },
    { id: '3', title: 'Lip Balms',         badge: 'Care',     subtitle: 'Beat the dry cold',  gradient: ['#8E0038', '#6D0029'] },
  ],
  Electronics: [
    { id: '1', title: 'Top\nGadgets',      badge: 'New',      subtitle: 'Latest arrivals',    gradient: ['#5A3580', '#361D55'] },
    { id: '2', title: 'Best\nDeals',       badge: 'Sale',     subtitle: 'Up to 50% off',      gradient: ['#2A4080', '#162450'] },
  ],
  Beauty: [
    { id: '1', title: 'Glow Up',           badge: 'Trending', subtitle: 'Bestselling skincare',gradient: ['#B8345A', '#7A1C35'] },
    { id: '2', title: 'Skin\nCare',        badge: 'Featured', subtitle: 'Dermatologist picks', gradient: ['#8A2050', '#5A1030'] },
  ],
  Decor: [
    { id: '1', title: 'Home\nVibes',       badge: 'New',      subtitle: 'Fresh decor picks',  gradient: ['#2D6040', '#1A3E28'] },
    { id: '2', title: 'Light Up',          badge: 'Featured', subtitle: 'Lamps & fairy lights',gradient: ['#4A7A30', '#2A5018'] },
  ],
  Kids: [
    { id: '1', title: 'Fun Toys',          badge: 'New',      subtitle: 'Hours of fun',       gradient: ['#C04A1A', '#8A2E0A'] },
    { id: '2', title: 'Learn\n& Play',     badge: 'Featured', subtitle: 'Educational picks',  gradient: ['#E07030', '#B04A18'] },
  ],
};

const FREQUENTLY_BOUGHT = [
  { id: '1', title: 'Favourites',          color: '#E8F5E9', items: [{ id: '1', image: require('../assets/images/coca_cola_image.png') }, { id: '2', image: require('../assets/images/maggi_image.png') }] },
  { id: '2', title: 'Chips & Namkeen',     color: '#FFF8E1', items: [{ id: '1', image: require('../assets/images/yippee_image.png') }, { id: '2', image: require('../assets/images/maggi_oats_image.png') }], moreCount: 2 },
  { id: '3', title: 'Bread & Eggs',        color: '#FFF3E0', items: [{ id: '1', image: require('../assets/images/whole_wheat_bread_image.png') }, { id: '2', image: require('../assets/images/eggs_image.png') }] },
  { id: '4', title: 'Instant Food',        color: '#F3E5F5', items: [{ id: '1', image: require('../assets/images/maggi_image.png') }, { id: '2', image: require('../assets/images/top_ramen_image.png') }] },
  { id: '5', title: 'Milk, Curd & Paneer', color: '#E3F2FD', items: [{ id: '1', image: require('../assets/images/amul_milk_image.png') }, { id: '2', image: require('../assets/images/paneer_image.png') }] },
  { id: '6', title: 'Chocolates & Sweets', color: '#FCE4EC', items: [{ id: '1', image: require('../assets/images/dairy_product_image.png') }, { id: '2', image: require('../assets/images/vanilla_muffins_image.png') }] },
];

const WINTER_PRODUCTS = [
  { id: '1', title: 'Myom Bedsheet Double 220TC', subtitle: 'No Cost EMI', price: '₹696', mrp: '₹948', imgBg: '#E8F4EC', image: require('../assets/images/barley_image.png') },
  { id: '2', title: 'Knorr Thick Tomato Soup 44g', price: '₹45', mrp: '₹55',           imgBg: '#FEF0E6', image: require('../assets/images/knorr_soup_image.png') },
  { id: '3', title: 'Davidoff Aroma Instant Coffee', subtitle: 'Imported', price: '₹638', mrp: '₹689', imgBg: '#EDE8F8', image: require('../assets/images/brown_rice_image.png') },
];

// ─── Main Component ───────────────────────────────────────────────────────────

const HomeScreen = () => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const { cartCount } = useCart();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('HOME — Neha');

  // Snow animation refs
  const snowAnims = useRef(
    Array.from({ length: SNOW_ANIMS_COUNT }, () => new Animated.Value(0))
  ).current;
  const snowCancelledRef = useRef(false);
  const isSnowRunningRef = useRef(false);

  const lottieRef = useRef(null);
  const kidsLottieRef = useRef(null);

  // ── Snow loop ──────────────────────────────────────────────────────────────
  const runSnowLoop = useCallback((anim, duration) => {
    if (snowCancelledRef.current) return;
    anim.setValue(0);
    Animated.timing(anim, { toValue: 1, duration, useNativeDriver: true }).start(
      ({ finished }) => {
        if (finished && !snowCancelledRef.current) runSnowLoop(anim, duration);
      }
    );
  }, []);

  const startSnowAnimations = useCallback(() => {
    if (isSnowRunningRef.current) return;
    isSnowRunningRef.current = true;
    snowCancelledRef.current = false;
    const durations = [3000, 3500, 4000, 3200, 3800, 2800];
    snowAnims.forEach((anim, i) => {
      if (!snowCancelledRef.current) runSnowLoop(anim, durations[i]);
    });
  }, [runSnowLoop, snowAnims]);

  const stopSnowAnimations = useCallback(() => {
    isSnowRunningRef.current = false;
    snowCancelledRef.current = true;
    setTimeout(() => {
      snowAnims.forEach((anim) => { anim.stopAnimation(() => {}); anim.setValue(0); });
    }, 0);
  }, [snowAnims]);

  // ── Category effect ────────────────────────────────────────────────────────
  useEffect(() => {
    if (selectedCategory !== 'Winter') {
      isSnowRunningRef.current = false;
      snowCancelledRef.current = true;
      lottieRef.current?.pause();
    }
    const t = setTimeout(() => {
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
    return () => clearTimeout(t);
  }, [selectedCategory, isSearchFocused, startSnowAnimations]);

  useEffect(() => () => {
    snowCancelledRef.current = true;
    snowAnims.forEach((a) => a.stopAnimation());
  }, [snowAnims]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleCategoryPress = useCallback((name) => {
    if (selectedCategory === name) return;
    isSnowRunningRef.current = false;
    snowCancelledRef.current = true;
    if (selectedCategory === 'Winter') {
      lottieRef.current?.pause();
      snowAnims.forEach((a) => a.stopAnimation(() => {}));
    }
    setSelectedCategory(name);
    setIsSearchFocused(false);
  }, [selectedCategory, snowAnims]);

  const handleAddressSelect = (data) => {
    if (data.type === 'current') {
      setSelectedAddress('Current Location');
      navigation.navigate('MapSelection', { latitude: data.latitude, longitude: data.longitude });
    } else if (data.type === 'new') {
      navigation.navigate('MapSelection');
    } else if (data.type === 'saved') {
      setSelectedAddress(data.address.label);
    }
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const gradient      = CATEGORY_GRADIENTS[selectedCategory] ?? CATEGORY_GRADIENTS.All;
  const accent        = CATEGORY_ACCENT[selectedCategory] ?? CATEGORY_ACCENT.All;
  const currentBanners= FEATURED_BANNERS[selectedCategory] ?? FEATURED_BANNERS.All;
  const isWinter      = selectedCategory === 'Winter';
  const isKids        = selectedCategory === 'Kids';
  const isAll         = selectedCategory === 'All';
  const bannerW       = Math.min(width * 0.52, 220);
  const productW      = Math.min(width * 0.42, 165);
  const freqCardW     = (width - 48) / 2;

  const SNOW_POSITIONS = ['8%', '22%', '38%', '55%', '72%', '88%'];
  const SNOW_SIZES     = [12, 16, 13, 11, 15, 12];
  const SNOW_DURATIONS = [3000, 3500, 4000, 3200, 3800, 2800];

  // ── Renderers ──────────────────────────────────────────────────────────────
  const renderCategory = useCallback(({ item }) => {
    const active = selectedCategory === item.name;
    return (
      <TouchableOpacity
        style={s.catItem}
        onPress={() => handleCategoryPress(item.name)}
        activeOpacity={0.75}
        accessibilityRole="tab"
        accessibilityState={{ selected: active }}
      >
        <View style={[s.catIconWrap, active && s.catIconWrapActive]}>
          {renderIcon(item.icon, item.iconType, 22, active ? COLORS.ink : '#666')}
        </View>
        <Text style={[s.catLabel, active && s.catLabelActive]}>{item.name}</Text>
        {active && <View style={[s.catDot, { backgroundColor: accent }]} />}
      </TouchableOpacity>
    );
  }, [selectedCategory, handleCategoryPress, accent]);

  const renderBanner = ({ item }) => (
    <BannerCard key={item.id} item={item} width={bannerW} />
  );

  const renderWinterProduct = ({ item }) => (
    <ProductCard key={item.id} item={item} cardWidth={productW} />
  );

  // ── UI ─────────────────────────────────────────────────────────────────────
  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={gradient[0]} />

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <View style={s.headerShell}>
        <LinearGradient colors={gradient} style={s.headerGradient}>

          {/* Winter bear Lottie */}
          {isWinter && (
            <View style={s.bearWrap} pointerEvents="none">
              <LottieView
                ref={lottieRef}
                source={require('../assets/BearWinter.json')}
                autoPlay={false}
                loop
                style={s.bearLottie}
              />
            </View>
          )}

          {/* Snowflakes */}
          {isWinter && (
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
              {snowAnims.map((anim, i) => (
                <Animated.View
                  key={i}
                  style={[
                    s.snowflake,
                    { left: SNOW_POSITIONS[i] },
                    {
                      transform: [{
                        translateY: anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 380 + i * 10],
                        }),
                      }],
                      opacity: anim.interpolate({
                        inputRange: [0, 0.15, 0.85, 1],
                        outputRange: [0, 1, 1, 0],
                      }),
                    },
                  ]}
                >
                  <Icon name="snow" size={SNOW_SIZES[i]} color="rgba(255,255,255,0.9)" />
                </Animated.View>
              ))}
            </View>
          )}

          <SafeAreaView edges={['top']} style={s.safeHeader}>

            {/* Top bar */}
            <View style={s.topBar}>
              <View style={s.deliveryBlock}>
                <View style={s.deliveryTimeRow}>
                  <Text style={s.deliveryMins}>15 minutes</Text>
                  <View style={s.deliveryBadge}>
                    <Icon name="car-outline" size={11} color={accent} />
                    <Text style={[s.deliveryBadgeText, { color: accent }]}>1 km away</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={s.addressRow}
                  onPress={() => setShowAddressModal(true)}
                  activeOpacity={0.8}
                >
                  <Icon name="location-sharp" size={13} color="#555" />
                  <Text style={s.addressText} numberOfLines={1}>{selectedAddress}</Text>
                  <Icon name="chevron-down" size={13} color="#555" />
                </TouchableOpacity>
              </View>

              <View style={s.topActions}>
                <TouchableOpacity
                  style={s.iconBtn}
                  onPress={() => navigation.navigate('Cart')}
                  activeOpacity={0.85}
                  accessibilityLabel="Cart"
                >
                  <Icon1 name="shopping-cart" size={19} color={COLORS.ink} />
                  {cartCount > 0 && (
                    <View style={s.cartBadge}>
                      <Text style={s.cartBadgeText}>{cartCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={s.iconBtn}
                  onPress={() => navigation.navigate('Profile')}
                  activeOpacity={0.85}
                  accessibilityLabel="Profile"
                >
                  <Icon name="person-outline" size={20} color={COLORS.ink} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Search */}
            <View style={s.searchWrap}>
              {/* Kids Lottie overlay */}
              {isKids && !isSearchFocused && (
                <View style={s.kidsLottieWrap} pointerEvents="none">
                  <LottieView
                    ref={kidsLottieRef}
                    source={require('../assets/kids.json')}
                    autoPlay={false}
                    loop
                    style={s.kidsLottie}
                  />
                </View>
              )}
              <View style={[s.searchBar, isSearchFocused && s.searchBarFocused]}>
                <Icon name="search-outline" size={20} color="#999" />
                <TextInput
                  style={s.searchInput}
                  placeholder={isKids && !isSearchFocused ? '' : 'Search products...'}
                  placeholderTextColor="#AAA"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                <TouchableOpacity activeOpacity={0.7}>
                  <Icon name="mic-outline" size={20} color="#555" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Category tabs */}
            <FlatList
              data={CATEGORIES}
              renderItem={renderCategory}
              keyExtractor={(item) => `cat-${item.id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.catsContainer}
              removeClippedSubviews={false}
              initialNumToRender={6}
            />
          </SafeAreaView>
        </LinearGradient>
      </View>

      {/* ── BODY ───────────────────────────────────────────────────────────── */}
      <ScrollView
        style={s.body}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => { setIsSearchFocused(false); Keyboard.dismiss(); }}
      >

        {/* Winter season strip */}
        {isWinter && (
          <View style={[s.winterStrip, { borderColor: gradient[1] }]}>
            <View style={[s.winterStripIcon, { backgroundColor: accent + '18' }]}>
              <Icon name="snow" size={24} color={accent} />
            </View>
            <View>
              <Text style={[s.winterStripLabel, { color: accent }]}>STOCK UP FOR THE</Text>
              <Text style={[s.winterStripTitle, { color: COLORS.ink }]}>Winter Season</Text>
            </View>
          </View>
        )}

        {/* Featured banners */}
        {currentBanners.length > 0 && (
          <View style={s.bannersSection}>
            <FlatList
              data={currentBanners}
              renderItem={renderBanner}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.bannersScroll}
            />
          </View>
        )}

        {/* Winter products */}
        {isWinter && (
          <View style={s.section}>
            <SectionHeader
              title="Snuggle, sip & stay warm"
              subtitle="Top winter picks with deals"
              onSeeAll={() => {}}
            />
            <FlatList
              data={WINTER_PRODUCTS}
              renderItem={renderWinterProduct}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.productScroll}
            />
          </View>
        )}

        {/* Frequently bought — All only */}
        {isAll && (
          <View style={s.section}>
            <SectionHeader
              title="Frequently bought"
              subtitle="Based on your past orders"
              onSeeAll={() => {}}
            />
            <View style={s.freqGrid}>
              {FREQUENTLY_BOUGHT.map((item, index) => {
                if (index % 2 !== 0) return null;
                const next = FREQUENTLY_BOUGHT[index + 1];
                return (
                  <View key={item.id} style={s.freqRow}>
                    <FreqCard item={item} cardWidth={freqCardW} />
                    {next
                      ? <FreqCard item={next} cardWidth={freqCardW} />
                      : <View style={{ width: freqCardW }} />}
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Promo strip */}
        <View style={s.promoWrap}>
          <PromoStrip accent={accent} />
        </View>

        <View style={s.bottomPad} />
      </ScrollView>

      <AddressSelectionModal
        visible={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onAddressSelect={handleAddressSelect}
      />
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },

  // Header
  headerShell: { zIndex: 10 },
  headerGradient: { position: 'relative' },
  safeHeader: {},

  bearWrap: {
    position: 'absolute', top: 28, right: 130,
    width: 110, height: 110, zIndex: 10,
  },
  bearLottie: { width: '100%', height: '100%' },

  snowflake: { position: 'absolute', top: -20, zIndex: 10 },

  // Top bar
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: 18, paddingTop: 14, paddingBottom: 4,
  },
  deliveryBlock: { flex: 1, marginRight: 12 },
  deliveryTimeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 },
  deliveryMins: { fontSize: 24, fontWeight: '700', color: COLORS.ink, letterSpacing: -0.5 },
  deliveryBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 20,
    paddingHorizontal: 9, paddingVertical: 3,
    borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.85)',
  },
  deliveryBadgeText: { fontSize: 11, fontWeight: '600' },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addressText: { fontSize: 13, fontWeight: '600', color: COLORS.ink, flex: 1 },

  topActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center', alignItems: 'center',
  },
  cartBadge: {
    position: 'absolute', top: -3, right: -3,
    width: 17, height: 17, borderRadius: 9,
    backgroundColor: COLORS.red, borderWidth: 1.5, borderColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
  },
  cartBadgeText: { fontSize: 9, fontWeight: '700', color: '#fff' },

  // Search
  searchWrap: { marginHorizontal: 18, marginTop: 12, marginBottom: 2, position: 'relative' },
  kidsLottieWrap: {
    position: 'absolute', right: 90, top: -4,
    width: 220, height: 52, zIndex: 10,
  },
  kidsLottie: { width: '100%', height: '100%' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11,
    borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.95)',
  },
  searchBarFocused: { backgroundColor: '#FFFFFF', borderColor: '#DDDDD8' },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.ink, fontWeight: '400', padding: 0 },

  // Category tabs
  catsContainer: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 18, gap: 2 },
  catItem: {
    alignItems: 'center', marginRight: 22,
    position: 'relative', paddingBottom: 8,
  },
  catIconWrap: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 6,
  },
  catIconWrapActive: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  catLabel: { fontSize: 11.5, fontWeight: '500', color: '#666', letterSpacing: 0.1 },
  catLabelActive: { fontWeight: '700', color: COLORS.ink },
  catDot: { position: 'absolute', bottom: 0, width: 5, height: 5, borderRadius: 3 },

  // Body
  body: { flex: 1 },

  // Winter strip
  winterStrip: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    marginHorizontal: 18, marginTop: 18,
    backgroundColor: '#FFFFFF', borderRadius: 18,
    padding: 16,
    borderWidth: 0.5,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  winterStripIcon: {
    width: 48, height: 48, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  winterStripLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.9, marginBottom: 3 },
  winterStripTitle: { fontSize: 22, fontWeight: '700', letterSpacing: -0.4 },

  // Banners
  bannersSection: { marginTop: 10, marginLeft: -5},
  bannersScroll: { paddingHorizontal: 10, gap: 0 },
  bannerCard: {
    borderRadius: 12, paddingHorizontal: 10, paddingTop: -10, paddingBottom: 5,
    justifyContent: 'flex-end', height: 110, width: 120
  },
  bannerBadge: {
    alignSelf: 'flex-start', marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 20, paddingHorizontal: 9, paddingVertical: 3,
    borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.35)',
  },
  bannerBadgeText: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.95)', letterSpacing: 0.3 },
  bannerBottom: {},
  bannerTitle: { fontSize: 19, fontWeight: '700', color: '#FFFFFF', lineHeight: 23, letterSpacing: -0.3 },
  bannerSub: { fontSize: 10.5, color: 'rgba(255,255,255,0.6)', marginTop: 2, marginBottom: 3, fontWeight: '400' },
 
  // Section
  section: { paddingHorizontal: 18, marginTop: 20 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-end', marginBottom: 11,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.ink, letterSpacing: -0.3 },
  sectionSub: { fontSize: 12.5, color: COLORS.textSub, marginTop: 2, fontWeight: '400' },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  seeAllText: { fontSize: 12.5, fontWeight: '600', color: COLORS.textSub },

  // Products
  productScroll: { gap: 12, paddingRight: 2 },
  productCard: {
    backgroundColor: COLORS.card, borderRadius: 18, overflow: 'hidden',
    borderWidth: 0.5, borderColor: COLORS.border,
  },
  productImgWrap: { height: 115, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  productImg: { width: '70%', height: '80%' },
  productTag: {
    position: 'absolute', top: 9, left: 9,
    backgroundColor: '#EDF2FE', borderRadius: 7,
    paddingHorizontal: 7, paddingVertical: 3,
  },
  productTagText: { fontSize: 9.5, fontWeight: '700', color: '#4763C5' },
  productHeart: {
    position: 'absolute', top: 9, right: 9,
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#FFFFFF', borderWidth: 0.5, borderColor: COLORS.border,
    justifyContent: 'center', alignItems: 'center',
  },
  productInfo: { padding: 10 },
  productName: { fontSize: 12, fontWeight: '500', color: COLORS.ink, lineHeight: 16, height: 33, marginBottom: 6 },
  productPriceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 5, marginBottom: 8 },
  productPrice: { fontSize: 15, fontWeight: '700', color: COLORS.ink },
  productMrp: { fontSize: 11, color: COLORS.textMuted, textDecorationLine: 'line-through' },
  addBtn: {
    height: 32, borderRadius: 9,
    borderWidth: 1.5, borderColor: COLORS.green,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  addBtnActive: { backgroundColor: COLORS.green },
  addBtnText: { fontSize: 12, fontWeight: '800', color: COLORS.green, letterSpacing: 0.5 },
  addBtnTextActive: { color: '#FFFFFF' },

  // Frequently bought
  freqGrid: { gap: 8 },
  freqRow: { flexDirection: 'row', justifyContent: 'space-between' },
  freqCard: {
    backgroundColor: COLORS.card, borderRadius: 16,
    paddingHorizontal: 12, paddingTop: 11, paddingBottom: 10,
    borderWidth: 0.5, borderColor: COLORS.border,
    position: 'relative',
  },
  freqImgs: { flexDirection: 'row', gap: 5, marginBottom: 7, flexWrap: 'wrap' },
  freqImgBox: {
    width: 40, height: 40, borderRadius: 9,
    backgroundColor: COLORS.bg, overflow: 'hidden',
    justifyContent: 'center', alignItems: 'center',
  },
  freqImg: { width: '85%', height: '85%' },
  freqMore: {
    height: 40, borderRadius: 9,
    backgroundColor: '#F0F0EB',
    paddingHorizontal: 7, justifyContent: 'center', alignItems: 'center',
  },
  freqMoreText: { fontSize: 10, fontWeight: '700', color: '#888' },
  freqLabel: { fontSize: 12.5, fontWeight: '600', color: COLORS.ink, lineHeight: 17, paddingRight: 18 },
  freqArrow: { position: 'absolute', bottom: 10, right: 12 },

  // Promo
  promoWrap: { paddingHorizontal: 18, marginTop: 20 },
  promoStrip: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FFFBF0', borderRadius: 18, padding: 14,
    borderWidth: 0.5, borderColor: '#F0E8C0',
  },
  promoIconWrap: {
    width: 44, height: 44, borderRadius: 13,
    justifyContent: 'center', alignItems: 'center',
  },
  promoText: { flex: 1 },
  promoTitle: { fontSize: 12.5, fontWeight: '600', color: '#4A3500', marginBottom: 2 },
  promoSub: { fontSize: 11.5, color: '#A08030', fontWeight: '400' },
  promoActions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  promoClose: { padding: 4 },

  bottomPad: { height: 32 },
});

export default HomeScreen;