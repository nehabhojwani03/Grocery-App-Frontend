import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Modal,
    Animated,
    Dimensions,
    ScrollView,
    TouchableWithoutFeedback,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.58;

const BADGE_COLORS = {
    Fresh: { bg: '#E8F5E9', text: '#2E7D32' },
    Popular: { bg: '#E3F2FD', text: '#1565C0' },
    Premium: { bg: '#FFF8E1', text: '#F57F17' },
    Seasonal: { bg: '#FCE4EC', text: '#880E4F' },
    Healthy: { bg: '#F1F8E9', text: '#558B2F' },
    Spicy: { bg: '#FBE9E7', text: '#BF360C' },
    New: { bg: '#E8EAF6', text: '#283593' },
};

const ProductDetailModal = ({
    visible,
    product,
    accent = '#4CAF50',
    quantity = 0,
    onAdd,
    onRemove,
    onClose,
}) => {
    const slideAnim = useRef(new Animated.Value(MODAL_HEIGHT)).current;
    const backdropAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: 0,
                    useNativeDriver: true,
                    bounciness: 4,
                    speed: 14,
                }),
                Animated.timing(backdropAnim, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: MODAL_HEIGHT,
                    duration: 220,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    if (!product) return null;

    const badge = product.badge ? BADGE_COLORS[product.badge] : null;
    const description = product.description || 'A quality product, freshly sourced and delivered to your door in minutes.';

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            {/* Backdrop */}
            <TouchableWithoutFeedback onPress={onClose}>
                <Animated.View
                    style={[
                        styles.backdrop,
                        { opacity: backdropAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.45] }) },
                    ]}
                />
            </TouchableWithoutFeedback>

            {/* Sheet */}
            <Animated.View
                style={[
                    styles.sheet,
                    { transform: [{ translateY: slideAnim }] },
                ]}
            >
                {/* Drag Handle */}
                <View style={styles.handle} />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Top Row: Image + Basic Info */}
                    <View style={styles.topRow}>
                        {/* Image */}
                        <View style={[styles.imageContainer, { backgroundColor: accent + '15' }]}>
                            {badge && (
                                <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                                    <Text style={[styles.badgeText, { color: badge.text }]}>{product.badge}</Text>
                                </View>
                            )}
                            <Image
                                source={product.image}
                                style={styles.productImage}
                                resizeMode="contain"
                            />
                        </View>

                        {/* Info */}
                        <View style={styles.infoBlock}>
                            <Text style={styles.productName}>{product.name}</Text>
                            <Text style={styles.productUnit}>{product.unit}</Text>
                            <Text style={styles.price}>₹{product.price}</Text>

                            {/* Cart Controls */}
                            {quantity === 0 ? (
                                <TouchableOpacity
                                    style={[styles.addBtn, { backgroundColor: accent }]}
                                    onPress={() => onAdd(product.id)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.addBtnText}>ADD TO CART</Text>
                                </TouchableOpacity>
                            ) : (
                                <View style={[styles.qtyControl, { borderColor: accent }]}>
                                    <TouchableOpacity
                                        onPress={() => onRemove(product.id)}
                                        style={styles.qtyBtn}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={[styles.qtyBtnText, { color: accent }]}>−</Text>
                                    </TouchableOpacity>
                                    <Text style={[styles.qtyNum, { color: accent }]}>{quantity}</Text>
                                    <TouchableOpacity
                                        onPress={() => onAdd(product.id)}
                                        style={styles.qtyBtn}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={[styles.qtyBtnText, { color: accent }]}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Description */}
                    <View style={styles.descSection}>
                        <Text style={styles.descLabel}>About this product</Text>
                        <Text style={styles.descText}>{description}</Text>
                    </View>

                    {/* Quick Info Pills */}
                    <View style={styles.pillRow}>
                        <View style={[styles.pill, { backgroundColor: accent + '18' }]}>
                            <Text style={styles.pillIcon}>⚡</Text>
                            <Text style={[styles.pillText, { color: accent }]}>15 min delivery</Text>
                        </View>
                        <View style={[styles.pill, { backgroundColor: accent + '18' }]}>
                            <Text style={styles.pillIcon}>↩</Text>
                            <Text style={[styles.pillText, { color: accent }]}>Easy returns</Text>
                        </View>
                        <View style={[styles.pill, { backgroundColor: accent + '18' }]}>
                            <Text style={styles.pillIcon}>✓</Text>
                            <Text style={[styles.pillText, { color: accent }]}>Quality checked</Text>
                        </View>
                    </View>
                </ScrollView>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
    },
    sheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: MODAL_HEIGHT,
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 20,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#DDE1E7',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 16,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 28,
    },

    // Top Row
    topRow: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'flex-start',
    },
    imageContainer: {
        width: 130,
        height: 130,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexShrink: 0,
    },
    badge: {
        position: 'absolute',
        top: 8,
        left: 8,
        borderRadius: 6,
        paddingHorizontal: 7,
        paddingVertical: 3,
        zIndex: 1,
    },
    badgeText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.3 },
    productImage: {
        width: 100,
        height: 100,
    },
    infoBlock: {
        flex: 1,
        paddingTop: 4,
        gap: 4,
    },
    productName: {
        fontSize: 16,
        fontWeight: '800',
        color: '#111',
        letterSpacing: -0.3,
        lineHeight: 22,
    },
    productUnit: {
        fontSize: 12,
        color: '#A0AAB4',
        fontWeight: '500',
        marginBottom: 2,
    },
    price: {
        fontSize: 20,
        fontWeight: '900',
        color: '#111',
        letterSpacing: -0.5,
        marginBottom: 10,
    },
    addBtn: {
        borderRadius: 10,
        paddingVertical: 9,
        paddingHorizontal: 14,
        alignItems: 'center',
    },
    addBtnText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: 0.6,
    },
    qtyControl: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: 10,
        overflow: 'hidden',
        alignSelf: 'flex-start',
    },
    qtyBtn: { paddingHorizontal: 14, paddingVertical: 7 },
    qtyBtnText: { fontSize: 18, fontWeight: '700', lineHeight: 22 },
    qtyNum: { fontSize: 14, fontWeight: '800', minWidth: 22, textAlign: 'center' },

    // Divider
    divider: {
        height: 1,
        backgroundColor: '#F0F2F5',
        marginVertical: 18,
    },

    // Description
    descSection: { marginBottom: 18 },
    descLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
        letterSpacing: -0.1,
    },
    descText: {
        fontSize: 13,
        color: '#666',
        lineHeight: 20,
        fontWeight: '400',
    },

    // Pills
    pillRow: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    pillIcon: { fontSize: 11 },
    pillText: { fontSize: 11, fontWeight: '700' },
});

export default ProductDetailModal;