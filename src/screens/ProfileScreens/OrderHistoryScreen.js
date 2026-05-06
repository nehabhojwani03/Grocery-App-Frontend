import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import tw from '../../utils/tailwind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../config/apiconfig';

const OrderHistoryScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('All');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = ['All', 'Delivered', 'Processing', 'Cancelled'];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/orders/myorders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) {
          // Map backend shape to the UI shape
          const mapped = data.data.map(order => ({
            id: order._id,
            orderNumber: `ORD-${order._id.slice(-8).toUpperCase()}`,
            date: new Date(order.createdAt).toLocaleString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            }),
            status: order.status === 'cancelled' ? 'Cancelled'
              : order.isDelivered ? 'Delivered'
                : 'Processing',
            items: order.orderItems.reduce((sum, i) => sum + i.quantity, 0),
            total: `₹${order.totalPrice}`,
            products: order.orderItems.slice(0, 2).map(i => ({
              name: i.name,
              image: `https://via.placeholder.com/60/4285F4/FFFFFF?text=${i.name.charAt(0)}`,
            })),
            deliveryAddress: order.shippingAddress?.address || '',
            estimatedDelivery: !order.isDelivered && order.status !== 'cancelled'
              ? 'Within 15 min' : undefined,
            cancelReason: order.status === 'cancelled' ? 'Cancelled by customer' : undefined,
          }));
          setOrders(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return { bg: 'bg-green-100', text: 'text-green-700', icon: 'checkmark-circle' };
      case 'Processing':
        return { bg: 'bg-blue-100', text: 'text-blue-700', icon: 'time' };
      case 'Cancelled':
        return { bg: 'bg-red-100', text: 'text-red-700', icon: 'close-circle' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: 'help-circle' };
    }
  };

  const filteredOrders = selectedTab === 'All'
    ? orders
    : orders.filter(order => order.status === selectedTab);

  const renderOrder = (order) => {
    const statusStyle = getStatusColor(order.status);

    return (
      <TouchableOpacity
        key={order.id}
        style={tw`bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-200`}
        onPress={() => navigation.navigate('OrderDetails', { order })}
        activeOpacity={0.7}
      >
        {/* Header */}
        <View style={tw`flex-row items-center justify-between mb-3`}>
          <View style={tw`flex-1`}>
            <Text style={tw`text-sm font-bold text-[#1A1A1A] mb-1`}>
              {order.orderNumber}
            </Text>
            <Text style={tw`text-xs text-gray-500`}>
              {order.date}
            </Text>
          </View>
          <View style={tw`${statusStyle.bg} px-3 py-1.5 rounded-full flex-row items-center`}>
            <Icon name={statusStyle.icon} size={14} color={statusStyle.text.replace('text-', '#')} />
            <Text style={tw`text-xs font-bold ${statusStyle.text} ml-1`}>
              {order.status}
            </Text>
          </View>
        </View>

        {/* Products Preview */}
        <View style={tw`flex-row gap-2 mb-3`}>
          {order.products.map((product, index) => (
            <View key={index} style={tw`bg-gray-100 rounded-xl p-2 w-14 h-14`}>
              <Image source={{ uri: product.image }} style={tw`w-full h-full rounded-lg`} />
            </View>
          ))}
          {order.items > order.products.length && (
            <View style={tw`bg-gray-100 rounded-xl w-14 h-14 justify-center items-center`}>
              <Text style={tw`text-xs font-bold text-gray-600`}>
                +{order.items - order.products.length}
              </Text>
            </View>
          )}
        </View>

        {/* Order Details */}
        <View style={tw`border-t border-gray-100 pt-3`}>
          <View style={tw`flex-row items-center justify-between mb-2`}>
            <View style={tw`flex-row items-center flex-1`}>
              <Icon name="location-outline" size={16} color="#666" />
              <Text style={tw`text-sm text-gray-600 ml-2 flex-1`} numberOfLines={1}>
                {order.deliveryAddress}
              </Text>
            </View>
          </View>

          {order.status === 'Processing' && order.estimatedDelivery && (
            <View style={tw`flex-row items-center mb-2`}>
              <Icon name="calendar-outline" size={16} color="#666" />
              <Text style={tw`text-sm text-gray-600 ml-2`}>
                Est. delivery: {order.estimatedDelivery}
              </Text>
            </View>
          )}

          {order.status === 'Cancelled' && order.cancelReason && (
            <View style={tw`flex-row items-center mb-2`}>
              <Icon name="information-circle-outline" size={16} color="#EF4444" />
              <Text style={tw`text-sm text-red-600 ml-2`}>
                {order.cancelReason}
              </Text>
            </View>
          )}

          <View style={tw`flex-row items-center justify-between mt-2`}>
            <View style={tw`flex-row items-center`}>
              <MaterialCommunityIcons name="package-variant-closed" size={16} color="#666" />
              <Text style={tw`text-sm text-gray-600 ml-2`}>
                {order.items} items
              </Text>
            </View>
            <Text style={tw`text-lg font-bold text-[#1A1A1A]`}>
              {order.total}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={tw`flex-row gap-2 mt-3 pt-3 border-t border-gray-100`}>
          {order.status === 'Delivered' && (
            <>
              <TouchableOpacity
                style={tw`flex-1 bg-green-50 rounded-lg py-2.5 items-center border border-green-500`}
                onPress={() => console.log('Reorder')}
              >
                <Text style={tw`text-sm font-bold text-green-600`}>Reorder</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`flex-1 bg-gray-100 rounded-lg py-2.5 items-center`}
                onPress={() => console.log('Rate')}
              >
                <Text style={tw`text-sm font-bold text-[#1A1A1A]`}>Rate Order</Text>
              </TouchableOpacity>
            </>
          )}
          {order.status === 'Processing' && (
            <>
              <TouchableOpacity
                style={tw`flex-1 bg-blue-50 rounded-lg py-2.5 items-center border border-blue-500`}
                onPress={() => console.log('Track')}
              >
                <Text style={tw`text-sm font-bold text-blue-600`}>Track Order</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`flex-1 bg-red-50 rounded-lg py-2.5 items-center border border-red-500`}
                onPress={() => console.log('Cancel')}
              >
                <Text style={tw`text-sm font-bold text-red-600`}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
          {order.status === 'Cancelled' && (
            <TouchableOpacity
              style={tw`flex-1 bg-green-50 rounded-lg py-2.5 items-center border border-green-500`}
              onPress={() => console.log('Reorder')}
            >
              <Text style={tw`text-sm font-bold text-green-600`}>Reorder</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <SafeAreaView edges={['top']} style={tw`bg-white shadow-sm`}>
        <View style={tw`px-4 py-3`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`flex-row items-center mb-3`}
          >
            <Icon name="chevron-back" size={24} color="#1A1A1A" />
            <Text style={tw`text-lg font-semibold text-[#1A1A1A] ml-2`}>
              Order History
            </Text>
          </TouchableOpacity>

          {/* Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={tw`gap-2`}
          >
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={tw`px-4 py-2 rounded-full ${selectedTab === tab ? 'bg-green-500' : 'bg-gray-100'}`}
                onPress={() => setSelectedTab(tab)}
                activeOpacity={0.7}
              >
                <Text style={tw`text-sm font-bold ${selectedTab === tab ? 'text-white' : 'text-gray-600'}`}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>

      {/* Orders List */}
      <ScrollView
        style={tw`flex-1`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`p-4 pb-6`}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" style={tw`mt-20`} />
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map(renderOrder)
        ) : (
          <View style={tw`items-center justify-center py-20`}>
            <MaterialCommunityIcons name="package-variant" size={80} color="#D1D5DB" />
            <Text style={tw`text-lg font-semibold text-gray-400 mt-4`}>
              No orders found
            </Text>
            <Text style={tw`text-sm text-gray-400 mt-2 text-center px-8`}>
              You haven't placed any {selectedTab !== 'All' ? selectedTab.toLowerCase() : ''} orders yet
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default OrderHistoryScreen;