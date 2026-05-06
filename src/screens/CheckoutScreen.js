import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
    StatusBar,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useCart } from '../context/CartContext';
import AddressSelectionModal from './Homescreen/AddressSelectionModal';
import { CommonActions } from '@react-navigation/native';

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

const PRODUCT_UNIT_MAP = {
    '69f747441a331c9902d3a5b8': '500g', '69f747441a331c9902d3a5b9': '500g',
    '69f747441a331c9902d3a5ba': '1 pc', '69f747441a331c9902d3a5bb': '1 pc',
    '69f747441a331c9902d3a5bc': '250g', '69f747441a331c9902d3a5bd': '500g',
    '69f747441a331c9902d3a5be': '500g', '69f747441a331c9902d3a5bf': '100g',
    '69f747441a331c9902d3a5c0': '3 pcs', '69f747441a331c9902d3a5c1': '500g',
    '69f747441a331c9902d3a5c2': '500g', '69f747441a331c9902d3a5c3': '500g',
    '69f747441a331c9902d3a5c4': '500g', '69f747441a331c9902d3a5c5': '100g',
    '69f747441a331c9902d3a5c6': '200g', '69f747441a331c9902d3a5c7': '6 pcs',
    '69f747441a331c9902d3a5c8': '1 pc', '69f747441a331c9902d3a5c9': '500g',
    '69f747441a331c9902d3a5ca': '4 pcs', '69f747441a331c9902d3a5cb': '2 pcs',
    '69f747441a331c9902d3a5cc': '250g', '69f747441a331c9902d3a5cd': '2 pcs',
    '69f747441a331c9902d3a5ce': '1 pc', '69f747441a331c9902d3a5cf': '1 pc',
    '69f747441a331c9902d3a5d0': '500g', '69f747441a331c9902d3a5d1': '500ml',
    '69f747441a331c9902d3a5d2': '1L', '69f747441a331c9902d3a5d3': '200ml',
    '69f747441a331c9902d3a5d4': '400g', '69f747441a331c9902d3a5d5': '400g',
    '69f747441a331c9902d3a5d6': '200ml', '69f747441a331c9902d3a5d7': '12 pcs',
    '69f747441a331c9902d3a5d8': '400g', '69f747441a331c9902d3a5d9': '400g',
    '69f747441a331c9902d3a5da': '26g', '69f747441a331c9902d3a5db': '26g',
    '69f747441a331c9902d3a5dc': '26g', '69f747441a331c9902d3a5dd': '26g',
    '69f747441a331c9902d3a5de': '107g', '69f747441a331c9902d3a5df': '40g',
    '69f747441a331c9902d3a5e0': '107g', '69f747441a331c9902d3a5e1': '40g',
    '69f747441a331c9902d3a5e2': '40g', '69f747441a331c9902d3a5e3': '56g',
    '69f747441a331c9902d3a5e4': '107g', '69f747441a331c9902d3a5e5': '750ml',
    '69f747441a331c9902d3a5e6': '750ml', '69f747441a331c9902d3a5e7': '750ml',
    '69f747441a331c9902d3a5e8': '750ml', '69f747441a331c9902d3a5e9': '330ml',
    '69f747441a331c9902d3a5ea': '330ml', '69f747441a331c9902d3a5eb': '330ml',
    '69f747441a331c9902d3a5ec': '330ml', '69f747441a331c9902d3a5ed': '200ml',
    '69f747441a331c9902d3a5ee': '320ml', '69f747441a331c9902d3a5ef': '200ml',
    '69f747441a331c9902d3a5f0': '400ml', '69f747441a331c9902d3a5f1': '1L',
    '69f747441a331c9902d3a5f2': '500ml', '69f747441a331c9902d3a5f3': '330ml',
    '69f747441a331c9902d3a5f4': '1 pc', '69f747441a331c9902d3a5f5': '1 pc',
    '69f747441a331c9902d3a5f6': '1 pc', '69f747441a331c9902d3a5f7': '70g',
    '69f747441a331c9902d3a5f8': '70g', '69f747441a331c9902d3a5f9': '80g',
    '69f747441a331c9902d3a5fa': '80g', '69f747441a331c9902d3a5fb': '70g',
    '69f747441a331c9902d3a5fc': '75g', '69f747441a331c9902d3a5fd': '100g',
    '69f747441a331c9902d3a5fe': '100g', '69f747441a331c9902d3a5ff': '66g',
    '69f747441a331c9902d3a600': '250g', '69f747441a331c9902d3a601': '100g',
    '69f747441a331c9902d3a602': '75g', '69f747441a331c9902d3a603': '56g',
    '69f747441a331c9902d3a604': '100g', '69f747441a331c9902d3a605': '100g',
    '69f747441a331c9902d3a606': '120g', '69f747441a331c9902d3a607': '100g',
    '69f747441a331c9902d3a608': '75g', '69f747441a331c9902d3a609': '75g',
    '69f747441a331c9902d3a60a': '120g', '69f747441a331c9902d3a60b': '120g',
    '69f747441a331c9902d3a60c': '1 pc', '69f747441a331c9902d3a60d': '1 pc',
    '69f747441a331c9902d3a60e': '1 pc', '69f747441a331c9902d3a60f': '16 pcs',
    '69f747441a331c9902d3a610': '1 pc', '69f747441a331c9902d3a611': '1 pc',
    '69f747441a331c9902d3a612': '75g', '69f747441a331c9902d3a613': '162g',
    '69f747441a331c9902d3a614': '100g', '69f747441a331c9902d3a615': '50g',
    '69f747441a331c9902d3a616': '1 pc', '69f747441a331c9902d3a617': '162g',
    '69f747441a331c9902d3a618': '57g', '69f747441a331c9902d3a619': '150g',
    '69f747441a331c9902d3a61a': '5kg', '69f747441a331c9902d3a61b': '5kg',
    '69f747441a331c9902d3a61c': '1kg', '69f747441a331c9902d3a61d': '1kg',
    '69f747441a331c9902d3a61e': '500g', '69f747441a331c9902d3a61f': '500g',
    '69f747441a331c9902d3a620': '500g', '69f747441a331c9902d3a621': '500g',
    '69f747441a331c9902d3a622': '39g', '69f747441a331c9902d3a623': '875ml',
    '69f747441a331c9902d3a624': '200ml', '69f747441a331c9902d3a625': '200ml',
    '69f747441a331c9902d3a626': '200ml', '69f747441a331c9902d3a627': '300ml',
    '69f747441a331c9902d3a628': '400ml', '69f747441a331c9902d3a629': '680g',
    '69f747441a331c9902d3a62a': '400ml', '69f747441a331c9902d3a62b': '680g',
    '69f747441a331c9902d3a62c': '450ml', '69f747441a331c9902d3a62d': '395ml',
    '69f747441a331c9902d3a62e': '50g', '69f747441a331c9902d3a62f': '200g',
    '69f747441a331c9902d3a630': '200g', '69f747441a331c9902d3a631': '200ml',
    '69f747441a331c9902d3a632': '200g', '69f747441a331c9902d3a633': '80 pcs',
    '69f747441a331c9902d3a634': '40 pcs', '69f747441a331c9902d3a635': '72 pcs',
};


const CheckoutScreen = ({ navigation }) => {
    const { cartItems, cartCount, cartTotal, clearCart } = useCart();
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const deliveryFee = cartTotal >= 299 ? 0 : 25;
    const grandTotal = cartTotal + deliveryFee;

    const handleAddressSelect = (addressData) => {
        if (addressData.type === 'current') {
            navigation.navigate('MapSelection', { type: 'current' });
        } else if (addressData.type === 'new') {
            navigation.navigate('MapSelection', {
                type: 'new',
                onLocationSelect: (locationData) => {
                    setSelectedAddress({
                        label: 'Selected Location',
                        address: locationData.address,
                    });
                },
            });
        } else if (addressData.type === 'saved') {
            setSelectedAddress(addressData.address);
        }
    };

const renderItem = ({ item }) => {
        // item from backend: { _id, product: { _id, name, price... }, quantity, price }
        const product = item.product;
        const productId = product?._id;
        const localImage = PRODUCT_IMAGE_MAP[productId];
        const unit = PRODUCT_UNIT_MAP[productId] ?? '';

        return (
            <View style={styles.cartItem}>
                <View style={styles.itemImageWrap}>
                    {localImage ? (
                        <Image source={localImage} style={styles.itemImage} resizeMode="contain" />
                    ) : (
                        <View style={[styles.itemImageWrap, { backgroundColor: '#EEE' }]} />
                    )}
                </View>
                <View style={styles.itemInfo}>
                    <Text style={styles.itemName} numberOfLines={2}>{product?.name}</Text>
                    <Text style={styles.itemUnit}>{unit}</Text>
                </View>
                <View style={styles.itemRight}>
                    <Text style={styles.itemQty}>×{item.quantity}</Text>
                    <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#F2F0EF" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon name="arrow-back" size={20} color="#111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Checkout</Text>
                <View style={{ width: 36 }} />
            </View>

            <ScrollView
                style={styles.scroll}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* ── Delivery Address ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Delivery Address</Text>

                    {selectedAddress ? (
                        <View style={styles.addressCard}>
                            <View style={styles.addressLeft}>
                                <View style={styles.addressIconWrap}>
                                    <Icon name="location" size={20} color="#E91E63" />
                                </View>
                                <View style={styles.addressInfo}>
                                    <Text style={styles.addressLabel}>{selectedAddress.label}</Text>
                                    <Text style={styles.addressText} numberOfLines={2}>
                                        {selectedAddress.address}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => setShowAddressModal(true)}
                                style={styles.changeBtn}
                            >
                                <Text style={styles.changeBtnText}>Change</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.addAddressBtn}
                            onPress={() => setShowAddressModal(true)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.addAddressLeft}>
                                <View style={styles.addAddressIcon}>
                                    <Icon name="add" size={20} color="#E91E63" />
                                </View>
                                <Text style={styles.addAddressText}>Add delivery address</Text>
                            </View>
                            <Icon name="chevron-forward" size={20} color="#999" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* ── Delivery Time ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Delivery Time</Text>
                    <View style={styles.deliveryTimeCard}>
                        <View style={styles.deliveryTimeLeft}>
                            <Icon name="time-outline" size={22} color="#4CAF50" />
                            <View style={styles.deliveryTimeInfo}>
                                <Text style={styles.deliveryTimeMain}>15 minutes</Text>
                                <Text style={styles.deliveryTimeSub}>Express delivery</Text>
                            </View>
                        </View>
                        <View style={styles.deliveryTimeBadge}>
                            <Text style={styles.deliveryTimeBadgeText}>Fast</Text>
                        </View>
                    </View>
                </View>

                {/* ── Order Items ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Order Items ({cartCount} item{cartCount > 1 ? 's' : ''})
                    </Text>
                    {cartItems.map((item) => (
                        <View key={item._id}>{renderItem({ item })}</View>
                    ))}
                </View>

                {/* ── Payment Method ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment Method</Text>
                    <View style={styles.paymentCard}>
                        <View style={styles.paymentLeft}>
                            <View style={styles.paymentIcon}>
                                <Icon name="cash-outline" size={20} color="#4CAF50" />
                            </View>
                            <Text style={styles.paymentText}>Cash on Delivery</Text>
                        </View>
                        <View style={styles.paymentSelected}>
                            <Icon name="checkmark-circle" size={20} color="#4CAF50" />
                        </View>
                    </View>
                </View>

                {/* ── Bill Details ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Bill Details</Text>
                    <View style={styles.billCard}>
                        <View style={styles.billRow}>
                            <Text style={styles.billLabel}>Item total</Text>
                            <Text style={styles.billValue}>₹{cartTotal}</Text>
                        </View>
                        <View style={styles.billRow}>
                            <Text style={styles.billLabel}>Delivery fee</Text>
                            <Text style={[styles.billValue, deliveryFee === 0 && styles.freeText]}>
                                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                            </Text>
                        </View>
                        {deliveryFee === 0 && (
                            <View style={styles.savingsBadge}>
                                <Icon name="pricetag-outline" size={12} color="#2E7D32" />
                                <Text style={styles.savingsText}>You save ₹25 on delivery!</Text>
                            </View>
                        )}
                        <View style={styles.billDivider} />
                        <View style={styles.billRow}>
                            <Text style={styles.billTotal}>To Pay</Text>
                            <Text style={styles.billTotalValue}>₹{grandTotal}</Text>
                        </View>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* ── Place Order Button ── */}
            <View style={styles.footer}>
                <View style={styles.footerLeft}>
                    <Text style={styles.footerTotal}>₹{grandTotal}</Text>
                    <Text style={styles.footerLabel}>Total payable</Text>
                </View>
                <TouchableOpacity
                    style={[
                        styles.placeOrderBtn,
                        !selectedAddress && styles.placeOrderBtnDisabled,
                    ]}
                    activeOpacity={0.85}
                    onPress={() => {
                        if (!selectedAddress) {
                            setShowAddressModal(true);
                            return;
                        }
                        clearCart();
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{ name: 'MainApp' }],
                            })
                        );
                    }}
                >
                    <Text style={styles.placeOrderText}>
                        {selectedAddress ? 'Place Order  →' : 'Add Address to Continue'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Address Modal */}
            <AddressSelectionModal
                visible={showAddressModal}
                onClose={() => setShowAddressModal(false)}
                onAddressSelect={(data) => {
                    setShowAddressModal(false);
                    handleAddressSelect(data);
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F0EF',
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 6,
        paddingBottom: 14,
        backgroundColor: '#F2F0EF',
    },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.07,
        shadowRadius: 3,
        elevation: 2,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#111',
        letterSpacing: -0.4,
    },

    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 14, paddingTop: 4 },

    // Section
    section: { marginBottom: 16 },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#888',
        letterSpacing: 0.3,
        textTransform: 'uppercase',
        marginBottom: 10,
        marginLeft: 2,
    },

    // Address card
    addressCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    addressLeft: { flexDirection: 'row', alignItems: 'flex-start', flex: 1 },
    addressIconWrap: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#FCE4EC',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    addressInfo: { flex: 1 },
    addressLabel: {
        fontSize: 14,
        fontWeight: '800',
        color: '#111',
        marginBottom: 3,
    },
    addressText: {
        fontSize: 12,
        color: '#777',
        fontWeight: '500',
        lineHeight: 18,
    },
    changeBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: '#E91E63',
        marginLeft: 10,
    },
    changeBtnText: { fontSize: 12, fontWeight: '700', color: '#E91E63' },

    // Add address button
    addAddressBtn: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1.5,
        borderColor: '#FCE4EC',
        borderStyle: 'dashed',
    },
    addAddressLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    addAddressIcon: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#FCE4EC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addAddressText: { fontSize: 14, fontWeight: '700', color: '#E91E63' },

    // Delivery time
    deliveryTimeCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    deliveryTimeLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    deliveryTimeInfo: {},
    deliveryTimeMain: { fontSize: 14, fontWeight: '800', color: '#111' },
    deliveryTimeSub: { fontSize: 11, color: '#999', fontWeight: '500', marginTop: 1 },
    deliveryTimeBadge: {
        backgroundColor: '#E8F5E9',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    deliveryTimeBadgeText: { fontSize: 11, fontWeight: '700', color: '#2E7D32' },

    // Cart items
    cartItem: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
        elevation: 1,
    },
    itemImageWrap: {
        width: 56,
        height: 56,
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    itemImage: { width: 48, height: 48 },
    itemInfo: { flex: 1 },
    itemName: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1A1A1A',
        letterSpacing: -0.2,
        marginBottom: 2,
    },
    itemUnit: { fontSize: 11, color: '#A0AAB4', fontWeight: '500' },
    itemRight: { alignItems: 'flex-end', gap: 4 },
    itemQty: { fontSize: 11, color: '#999', fontWeight: '600' },
    itemPrice: { fontSize: 14, fontWeight: '800', color: '#111' },

    // Payment
    paymentCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    paymentLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    paymentIcon: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#E8F5E9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paymentText: { fontSize: 14, fontWeight: '700', color: '#111' },

    // Bill
    billCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    billLabel: { fontSize: 13, color: '#777', fontWeight: '500' },
    billValue: { fontSize: 13, color: '#111', fontWeight: '700' },
    freeText: { color: '#4CAF50' },
    savingsBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#E8F5E9',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    savingsText: { fontSize: 11, fontWeight: '700', color: '#2E7D32' },
    billDivider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: 10 },
    billTotal: { fontSize: 15, fontWeight: '800', color: '#111' },
    billTotalValue: { fontSize: 15, fontWeight: '800', color: '#111' },

    // Footer
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        paddingVertical: 14,
        paddingBottom: 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 10,
    },
    footerLeft: {},
    footerTotal: { fontSize: 18, fontWeight: '800', color: '#111', letterSpacing: -0.3 },
    footerLabel: { fontSize: 11, color: '#999', fontWeight: '500', marginTop: 1 },
    placeOrderBtn: {
        backgroundColor: '#1A1A1A',
        borderRadius: 14,
        paddingHorizontal: 22,
        paddingVertical: 13,
    },
    placeOrderBtnDisabled: { backgroundColor: '#E91E63' },
    placeOrderText: { fontSize: 13, fontWeight: '800', color: '#fff', letterSpacing: 0.2 },
});

export default CheckoutScreen;