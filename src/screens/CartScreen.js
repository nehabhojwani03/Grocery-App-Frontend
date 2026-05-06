import React from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Image, StatusBar, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';

// Map MongoDB _id → local image require()

const CartScreen = ({ navigation }) => {
  const { cartItems, cartCount, cartTotal, addItem, removeItem, clearCart, loading } = useCart();

  const deliveryFee = cartTotal > 0 ? (cartTotal >= 299 ? 0 : 25) : 0;
  const grandTotal = cartTotal + deliveryFee;

  const PRODUCT_IMAGE_MAP = {
    '69f747441a331c9902d3a5b8': require('../assets/categories/vegetablefruits/tomato.jpg'),
    '69f747441a331c9902d3a5b9': require('../assets/categories/vegetablefruits/brinjles.jpg'),
    '69f747441a331c9902d3a5ba': require('../assets/categories/vegetablefruits/cabagge.jpg'),
    '69f747441a331c9902d3a5bb': require('../assets/categories/vegetablefruits/cauliflower.jpg'),
    '69f747441a331c9902d3a5bc': require('../assets/categories/vegetablefruits/brocolli.jpg'),
    '69f747441a331c9902d3a5bd': require('../assets/categories/vegetablefruits/onions.jpg'),
    '69f747441a331c9902d3a5be': require('../assets/categories/vegetablefruits/potato.jpg'),
    '69f747441a331c9902d3a5bf': require('../assets/categories/vegetablefruits/garlic.jpg'),
    '69f747441a331c9902d3a5c0': require('../assets/categories/vegetablefruits/lemon.jpg'),
    '69f747441a331c9902d3a5c1': require('../assets/categories/vegetablefruits/beetroot.jpg'),
    '69f747441a331c9902d3a5c2': require('../assets/categories/vegetablefruits/carrots.jpg'),
    '69f747441a331c9902d3a5c3': require('../assets/categories/vegetablefruits/pumpkins.jpg'),
    '69f747441a331c9902d3a5c4': require('../assets/categories/vegetablefruits/sweetpatotes.jpg'),
    '69f747441a331c9902d3a5c5': require('../assets/categories/vegetablefruits/ginger.jpg'),
    '69f747441a331c9902d3a5c6': require('../assets/categories/vegetablefruits/mushrooms.jpg'),
    '69f747441a331c9902d3a5c7': require('../assets/categories/vegetablefruits/banana.jpg'),
    '69f747441a331c9902d3a5c8': require('../assets/categories/vegetablefruits/watermalon.jpg'),
    '69f747441a331c9902d3a5c9': require('../assets/categories/vegetablefruits/apple.jpg'),
    '69f747441a331c9902d3a5ca': require('../assets/categories/vegetablefruits/oranges.jpg'),
    '69f747441a331c9902d3a5cb': require('../assets/categories/vegetablefruits/kiwi.jpg'),
    '69f747441a331c9902d3a5cc': require('../assets/categories/vegetablefruits/strawberry.jpg'),
    '69f747441a331c9902d3a5cd': require('../assets/categories/vegetablefruits/mango.jpg'),
    '69f747441a331c9902d3a5ce': require('../assets/categories/vegetablefruits/pineapple.jpg'),
    '69f747441a331c9902d3a5cf': require('../assets/categories/vegetablefruits/papaya.jpg'),
    '69f747441a331c9902d3a5d0': require('../assets/categories/vegetablefruits/grappes.jpg'),
    '69f747441a331c9902d3a5d1': require('../assets/categories/dairy/amulgold.jpg'),
    '69f747441a331c9902d3a5d2': require('../assets/categories/dairy/almondmilk.jpg'),
    '69f747441a331c9902d3a5d3': require('../assets/categories/dairy/amulcream.jpg'),
    '69f747441a331c9902d3a5d4': require('../assets/categories/dairy/dahi.jpg'),
    '69f747441a331c9902d3a5d5': require('../assets/categories/dairy/mastidahi.jpg'),
    '69f747441a331c9902d3a5d6': require('../assets/categories/dairy/lassi.jpg'),
    '69f747441a331c9902d3a5d7': require('../assets/categories/dairy/whiteggs.jpg'),
    '69f747441a331c9902d3a5d8': require('../assets/categories/dairy/bread.jpg'),
    '69f747441a331c9902d3a5d9': require('../assets/categories/dairy/wholewheatbread.jpg'),
    '69f747441a331c9902d3a5da': require('../assets/categories/Munchies/sweetspicy.jpg'),
    '69f747441a331c9902d3a5db': require('../assets/categories/Munchies/indianmagicmasala.jpg'),
    '69f747441a331c9902d3a5dc': require('../assets/categories/Munchies/hotandsweetchilli.jpg'),
    '69f747441a331c9902d3a5dd': require('../assets/categories/Munchies/salted.jpg'),
    '69f747441a331c9902d3a5de': require('../assets/categories/Munchies/pringles.jpg'),
    '69f747441a331c9902d3a5df': require('../assets/categories/Munchies/doriotos.jpg'),
    '69f747441a331c9902d3a5e0': require('../assets/categories/Munchies/pringlescreamandonion.jpg'),
    '69f747441a331c9902d3a5e1': require('../assets/categories/Munchies/spicysweetchilli.jpg'),
    '69f747441a331c9902d3a5e2': require('../assets/categories/Munchies/cheddarjalapenocheetos.jpg'),
    '69f747441a331c9902d3a5e3': require('../assets/categories/Munchies/takis.jpg'),
    '69f747441a331c9902d3a5e4': require('../assets/categories/Munchies/pringlesbbq.jpg'),
    '69f747441a331c9902d3a5e5': require('../assets/categories/colddrinks/cocacola.jpg'),
    '69f747441a331c9902d3a5e6': require('../assets/categories/colddrinks/pepsi.jpg'),
    '69f747441a331c9902d3a5e7': require('../assets/categories/colddrinks/sprite.jpg'),
    '69f747441a331c9902d3a5e8': require('../assets/categories/colddrinks/fanta.jpg'),
    '69f747441a331c9902d3a5e9': require('../assets/categories/colddrinks/fantaberry.jpg'),
    '69f747441a331c9902d3a5ea': require('../assets/categories/colddrinks/fantafruitpunch.jpg'),
    '69f747441a331c9902d3a5eb': require('../assets/categories/colddrinks/fantagrappe.jpg'),
    '69f747441a331c9902d3a5ec': require('../assets/categories/colddrinks/fantagreenapple.jpg'),
    '69f747441a331c9902d3a5ed': require('../assets/categories/colddrinks/mangojuice.jpg'),
    '69f747441a331c9902d3a5ee': require('../assets/categories/colddrinks/moggumoggu.jpg'),
    '69f747441a331c9902d3a5ef': require('../assets/categories/colddrinks/orangejuice.jpg'),
    '69f747441a331c9902d3a5f0': require('../assets/categories/colddrinks/pulpyorange.jpg'),
    '69f747441a331c9902d3a5f1': require('../assets/categories/colddrinks/tropicana.jpg'),
    '69f747441a331c9902d3a5f2': require('../assets/categories/colddrinks/cherryjuice.jpg'),
    '69f747441a331c9902d3a5f3': require('../assets/categories/colddrinks/blueberrdrink.jpg'),
    '69f747441a331c9902d3a5f4': require('../assets/categories/instantfood/buldakblack.jpg'),
    '69f747441a331c9902d3a5f5': require('../assets/categories/instantfood/buldakpink.jpg'),
    '69f747441a331c9902d3a5f6': require('../assets/categories/instantfood/buldakyellow.jpg'),
    '69f747441a331c9902d3a5f7': require('../assets/categories/instantfood/maggicuppa.jpg'),
    '69f747441a331c9902d3a5f8': require('../assets/categories/instantfood/maggicurryfalvour.jpg'),
    '69f747441a331c9902d3a5f9': require('../assets/categories/instantfood/poha.jpg'),
    '69f747441a331c9902d3a5fa': require('../assets/categories/instantfood/upma.jpg'),
    '69f747441a331c9902d3a5fb': require('../assets/categories/instantfood/yippe.jpg'),
    '69f747441a331c9902d3a5fc': require('../assets/categories/biscuits/chocolatecookie.jpg'),
    '69f747441a331c9902d3a5fd': require('../assets/categories/biscuits/desirebutter.jpg'),
    '69f747441a331c9902d3a5fe': require('../assets/categories/biscuits/momsmagic.jpg'),
    '69f747441a331c9902d3a5ff': require('../assets/categories/biscuits/fiftyfifty.jpg'),
    '69f747441a331c9902d3a600': require('../assets/categories/biscuits/mariegold.jpg'),
    '69f747441a331c9902d3a601': require('../assets/categories/biscuits/jimjam.jpg'),
    '69f747441a331c9902d3a602': require('../assets/categories/biscuits/littlhearts.jpg'),
    '69f747441a331c9902d3a603': require('../assets/categories/biscuits/milkbikis.jpg'),
    '69f747441a331c9902d3a604': require('../assets/categories/biscuits/nutrichoice.jpg'),
    '69f747441a331c9902d3a605': require('../assets/categories/biscuits/bourbon.jpg'),
    '69f747441a331c9902d3a606': require('../assets/categories/biscuits/happyhappy.jpg'),
    '69f747441a331c9902d3a607': require('../assets/categories/biscuits/hideandseek.jpg'),
    '69f747441a331c9902d3a608': require('../assets/categories/biscuits/unibicchocolate.jpg'),
    '69f747441a331c9902d3a609': require('../assets/categories/biscuits/unibicfruitandnut.jpg'),
    '69f747441a331c9902d3a60a': require('../assets/categories/biscuits/orio.jpg'),
    '69f747441a331c9902d3a60b': require('../assets/categories/biscuits/oreostrawberry.jpg'),
    '69f747441a331c9902d3a60c': require('../assets/categories/sweettooth/cornettochoco.jpg'),
    '69f747441a331c9902d3a60d': require('../assets/categories/sweettooth/cornettoblue.jpg'),
    '69f747441a331c9902d3a60e': require('../assets/categories/sweettooth/mangum.jpg'),
    '69f747441a331c9902d3a60f': require('../assets/categories/sweettooth/ferroro.jpg'),
    '69f747441a331c9902d3a610': require('../assets/categories/sweettooth/kitkatbiscoff.jpg'),
    '69f747441a331c9902d3a611': require('../assets/categories/sweettooth/kitkatcookiecrumble.jpg'),
    '69f747441a331c9902d3a612': require('../assets/categories/sweettooth/oreobites.jpg'),
    '69f747441a331c9902d3a613': require('../assets/categories/sweettooth/snickers.jpg'),
    '69f747441a331c9902d3a614': require('../assets/categories/sweettooth/toblerone.jpg'),
    '69f747441a331c9902d3a615': require('../assets/categories/sweettooth/twix.jpg'),
    '69f747441a331c9902d3a616': require('../assets/categories/sweettooth/kinderjoy.jpg'),
    '69f747441a331c9902d3a617': require('../assets/categories/sweettooth/mars.jpg'),
    '69f747441a331c9902d3a618': require('../assets/categories/sweettooth/bounty.jpg'),
    '69f747441a331c9902d3a619': require('../assets/categories/sweettooth/rafaello.jpg'),
    '69f747441a331c9902d3a61a': require('../assets/categories/Attarice/aashirvadatta.jpg'),
    '69f747441a331c9902d3a61b': require('../assets/categories/Attarice/bhogaata.jpg'),
    '69f747441a331c9902d3a61c': require('../assets/categories/Attarice/dawatbrownrice.jpg'),
    '69f747441a331c9902d3a61d': require('../assets/categories/Attarice/basmatirce.jpg'),
    '69f747441a331c9902d3a61e': require('../assets/categories/Attarice/masoordal.jpg'),
    '69f747441a331c9902d3a61f': require('../assets/categories/Attarice/moongdal.jpg'),
    '69f747441a331c9902d3a620': require('../assets/categories/Attarice/toordal.jpg'),
    '69f747441a331c9902d3a621': require('../assets/categories/Attarice/uraldal.jpg'),
    '69f747441a331c9902d3a622': require('../assets/categories/Attarice/masalaoats.jpg'),
    '69f747441a331c9902d3a623': require('../assets/categories/sauces/barbeque.jpg'),
    '69f747441a331c9902d3a624': require('../assets/categories/sauces/harsheystrawberry.jpg'),
    '69f747441a331c9902d3a625': require('../assets/categories/sauces/hersheycarame;.jpg'),
    '69f747441a331c9902d3a626': require('../assets/categories/sauces/hersheychoco.jpg'),
    '69f747441a331c9902d3a627': require('../assets/categories/sauces/hotchilli.jpg'),
    '69f747441a331c9902d3a628': require('../assets/categories/sauces/mayo.jpg'),
    '69f747441a331c9902d3a629': require('../assets/categories/sauces/pastasauce.jpg'),
    '69f747441a331c9902d3a62a': require('../assets/categories/sauces/tandoorimayo.jpg'),
    '69f747441a331c9902d3a62b': require('../assets/categories/sauces/tomatobasil.jpg'),
    '69f747441a331c9902d3a62c': require('../assets/categories/sauces/tomatoketcup.jpg'),
    '69f747441a331c9902d3a62d': require('../assets/categories/sauces/yellowmustard.jpg'),
    '69f747441a331c9902d3a62e': require('../assets/categories/babycare/babyrub.jpg'),
    '69f747441a331c9902d3a62f': require('../assets/categories/babycare/johnsonaleopowder.jpg'),
    '69f747441a331c9902d3a630': require('../assets/categories/babycare/johnsoncream.jpg'),
    '69f747441a331c9902d3a631': require('../assets/categories/babycare/johnsonoil.jpg'),
    '69f747441a331c9902d3a632': require('../assets/categories/babycare/johnsonpowder.jpg'),
    '69f747441a331c9902d3a633': require('../assets/categories/babycare/johnsonwipes.jpg'),
    '69f747441a331c9902d3a634': require('../assets/categories/babycare/pampersdiaper.jpg'),
    '69f747441a331c9902d3a635': require('../assets/categories/babycare/pamperswipes.jpg'),
};

const renderItem = ({ item }) => {
    const product = item.product;
    const productId = product?._id;
    
    // Use local image from map, fallback to uri if somehow available
    const localImage = PRODUCT_IMAGE_MAP[productId];

    return (
      <View style={styles.cartItem}>
        <View style={styles.itemImageWrap}>
          {localImage ? (
            <Image source={localImage} style={styles.itemImage} resizeMode="contain" />
          ) : (
            <View style={styles.itemImagePlaceholder} />
          )}
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={2}>{product?.name}</Text>
          <Text style={styles.itemUnit}>₹{item.price} each</Text>
          <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
        </View>
        <View style={[styles.qtyControl, { borderColor: '#4CAF50' }]}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => removeItem(productId)}>
            <Text style={[styles.qtyBtnText, { color: '#4CAF50' }]}>−</Text>
          </TouchableOpacity>
          <Text style={[styles.qtyNum, { color: '#4CAF50' }]}>{item.quantity}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => addItem({ _id: productId, ...product })}>
            <Text style={[styles.qtyBtnText, { color: '#4CAF50' }]}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
};

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      </SafeAreaView>
    );
  }

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F2F0EF" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Cart</Text>
          <View style={{ width: 36 }} />
        </View>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add items from categories to get started</Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.shopBtnText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F0EF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>My Cart</Text>
          <Text style={styles.headerSub}>{cartCount} item{cartCount > 1 ? 's' : ''}</Text>
        </View>
        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Free delivery nudge */}
      {deliveryFee > 0 && (
        <View style={styles.nudge}>
          <Text style={styles.nudgeText}>
            Add ₹{299 - cartTotal} more for <Text style={styles.nudgeBold}>FREE delivery</Text>
          </Text>
        </View>
      )}

      {/* Items */}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Order Summary */}
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>₹{cartTotal}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
          <Text style={[styles.summaryValue, deliveryFee === 0 && { color: '#4CAF50' }]}>
            {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{grandTotal}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Checkout')}
        >
          <Text style={styles.checkoutText}>Proceed to Checkout  →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F0EF' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 6, paddingBottom: 14, backgroundColor: '#F2F0EF',
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 12, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07, shadowRadius: 3, elevation: 2,
  },
  backArrow: { fontSize: 18, color: '#111', marginTop: -1 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#111', letterSpacing: -0.4 },
  headerSub: { fontSize: 11, color: '#7A9BAA', fontWeight: '500', textAlign: 'center' },
  clearText: { fontSize: 13, fontWeight: '700', color: '#FF5252' },
  nudge: {
    backgroundColor: '#E8F5E9', marginHorizontal: 14, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 8, marginBottom: 8,
  },
  nudgeText: { fontSize: 12, color: '#388E3C', fontWeight: '600' },
  nudgeBold: { fontWeight: '800' },
  listContent: { paddingHorizontal: 12, paddingBottom: 12 },
  cartItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 14, padding: 12, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 3, elevation: 1,
  },
  itemImageWrap: {
    width: 70, height: 70, backgroundColor: '#F5F5F5',
    borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  itemImage: { width: 60, height: 60 },
  itemImagePlaceholder: { width: 60, height: 60, backgroundColor: '#EEE', borderRadius: 8 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 13, fontWeight: '700', color: '#1A1A1A', marginBottom: 2, letterSpacing: -0.2 },
  itemUnit: { fontSize: 11, color: '#A0AAB4', fontWeight: '500', marginBottom: 6 },
  itemPrice: { fontSize: 14, fontWeight: '800', color: '#111' },
  qtyControl: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderRadius: 8, overflow: 'hidden',
  },
  qtyBtn: { paddingHorizontal: 8, paddingVertical: 5 },
  qtyBtnText: { fontSize: 16, fontWeight: '700', lineHeight: 20 },
  qtyNum: { fontSize: 13, fontWeight: '800', minWidth: 18, textAlign: 'center' },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#111', marginBottom: 6 },
  emptySubtitle: { fontSize: 13, color: '#999', fontWeight: '500', marginBottom: 24 },
  shopBtn: { backgroundColor: '#1A1A1A', borderRadius: 14, paddingHorizontal: 28, paddingVertical: 12 },
  shopBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  summary: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 34,
    shadowColor: '#000', shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08, shadowRadius: 10, elevation: 10,
  },
  summaryTitle: { fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 14, letterSpacing: -0.3 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 13, color: '#777', fontWeight: '500' },
  summaryValue: { fontSize: 13, color: '#111', fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 10 },
  totalLabel: { fontSize: 15, fontWeight: '800', color: '#111' },
  totalValue: { fontSize: 15, fontWeight: '800', color: '#111' },
  checkoutBtn: {
    backgroundColor: '#1A1A1A', borderRadius: 14,
    paddingVertical: 14, alignItems: 'center', marginTop: 16,
  },
  checkoutText: { color: '#fff', fontWeight: '800', fontSize: 14, letterSpacing: 0.2 },
});

export default CartScreen;