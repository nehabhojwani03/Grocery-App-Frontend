import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
    StatusBar,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../../context/CartContext';
import Icon1 from 'react-native-vector-icons/Entypo';

// Add this ID map at the top of the file (outside the component)
const PRODUCT_ID_MAP = {
    'v1': '69f747441a331c9902d3a5b8',
    'v2': '69f747441a331c9902d3a5b9',
    'v3': '69f747441a331c9902d3a5ba',
    'v4': '69f747441a331c9902d3a5bb',
    'v5': '69f747441a331c9902d3a5bc',
    'v6': '69f747441a331c9902d3a5bd',
    'v7': '69f747441a331c9902d3a5be',
    'v8': '69f747441a331c9902d3a5bf',
    'v9': '69f747441a331c9902d3a5c0',
    'v10': '69f747441a331c9902d3a5c1',
    'v11': '69f747441a331c9902d3a5c2',
    'v12': '69f747441a331c9902d3a5c3',
    'v13': '69f747441a331c9902d3a5c4',
    'v14': '69f747441a331c9902d3a5c5',
    'v15': '69f747441a331c9902d3a5c6',
    'f1': '69f747441a331c9902d3a5c7',
    'f2': '69f747441a331c9902d3a5c8',
    'f3': '69f747441a331c9902d3a5c9',
    'f4': '69f747441a331c9902d3a5ca',
    'f5': '69f747441a331c9902d3a5cb',
    'f6': '69f747441a331c9902d3a5cc',
    'f7': '69f747441a331c9902d3a5cd',
    'f8': '69f747441a331c9902d3a5ce',
    'f9': '69f747441a331c9902d3a5cf',
    'f10': '69f747441a331c9902d3a5d0',
    'd1': '69f747441a331c9902d3a5d1',
    'd2': '69f747441a331c9902d3a5d2',
    'd3': '69f747441a331c9902d3a5d3',
    'd4': '69f747441a331c9902d3a5d4',
    'd5': '69f747441a331c9902d3a5d5',
    'd6': '69f747441a331c9902d3a5d6',
    'd7': '69f747441a331c9902d3a5d7',
    'd9': '69f747441a331c9902d3a5d8',
    'd10': '69f747441a331c9902d3a5d9',
    'm1': '69f747441a331c9902d3a5da',
    'm2': '69f747441a331c9902d3a5db',
    'm3': '69f747441a331c9902d3a5dc',
    'm4': '69f747441a331c9902d3a5dd',
    'm5': '69f747441a331c9902d3a5de',
    'm6': '69f747441a331c9902d3a5df',
    'm7': '69f747441a331c9902d3a5e0',
    'm8': '69f747441a331c9902d3a5e1',
    'm9': '69f747441a331c9902d3a5e2',
    'm10': '69f747441a331c9902d3a5e3',
    'm11': '69f747441a331c9902d3a5e4',
    'c1': '69f747441a331c9902d3a5e5',
    'c2': '69f747441a331c9902d3a5e6',
    'c3': '69f747441a331c9902d3a5e7',
    'c4': '69f747441a331c9902d3a5e8',
    'c5': '69f747441a331c9902d3a5e9',
    'c6': '69f747441a331c9902d3a5ea',
    'c7': '69f747441a331c9902d3a5eb',
    'c8': '69f747441a331c9902d3a5ec',
    'c9': '69f747441a331c9902d3a5ed',
    'c10': '69f747441a331c9902d3a5ee',
    'c11': '69f747441a331c9902d3a5ef',
    'c12': '69f747441a331c9902d3a5f0',
    'c13': '69f747441a331c9902d3a5f1',
    'c14': '69f747441a331c9902d3a5f2',
    'c15': '69f747441a331c9902d3a5f3',
    'n1': '69f747441a331c9902d3a5f4',
    'n2': '69f747441a331c9902d3a5f5',
    'n3': '69f747441a331c9902d3a5f6',
    'n4': '69f747441a331c9902d3a5f7',
    'n5': '69f747441a331c9902d3a5f8',
    'n6': '69f747441a331c9902d3a5f9',
    'n7': '69f747441a331c9902d3a5fa',
    'n8': '69f747441a331c9902d3a5fb',
    'b1': '69f747441a331c9902d3a5fc',
    'b2': '69f747441a331c9902d3a5fd',
    'b3': '69f747441a331c9902d3a5fe',
    'b4': '69f747441a331c9902d3a5ff',
    'b5': '69f747441a331c9902d3a600',
    'b6': '69f747441a331c9902d3a601',
    'b7': '69f747441a331c9902d3a602',
    'b8': '69f747441a331c9902d3a603',
    'b9': '69f747441a331c9902d3a604',
    'b10': '69f747441a331c9902d3a605',
    'b11': '69f747441a331c9902d3a606',
    'b12': '69f747441a331c9902d3a607',
    'b13': '69f747441a331c9902d3a608',
    'b14': '69f747441a331c9902d3a609',
    'b15': '69f747441a331c9902d3a60a',
    'b16': '69f747441a331c9902d3a60b',
    's1': '69f747441a331c9902d3a60c',
    's2': '69f747441a331c9902d3a60d',
    's3': '69f747441a331c9902d3a60e',
    's4': '69f747441a331c9902d3a60f',
    's5': '69f747441a331c9902d3a610',
    's6': '69f747441a331c9902d3a611',
    's7': '69f747441a331c9902d3a612',
    's8': '69f747441a331c9902d3a613',
    's9': '69f747441a331c9902d3a614',
    's10': '69f747441a331c9902d3a615',
    's11': '69f747441a331c9902d3a616',
    's12': '69f747441a331c9902d3a617',
    's13': '69f747441a331c9902d3a618',
    's14': '69f747441a331c9902d3a619',
    'ar1': '69f747441a331c9902d3a61a',
    'ar2': '69f747441a331c9902d3a61b',
    'ar3': '69f747441a331c9902d3a61c',
    'ar4': '69f747441a331c9902d3a61d',
    'ar5': '69f747441a331c9902d3a61e',
    'ar6': '69f747441a331c9902d3a61f',
    'ar7': '69f747441a331c9902d3a620',
    'ar8': '69f747441a331c9902d3a621',
    'ar9': '69f747441a331c9902d3a622',
    'sc1': '69f747441a331c9902d3a623',
    'sc2': '69f747441a331c9902d3a624',
    'sc3': '69f747441a331c9902d3a625',
    'sc4': '69f747441a331c9902d3a626',
    'sc5': '69f747441a331c9902d3a627',
    'sc6': '69f747441a331c9902d3a628',
    'sc7': '69f747441a331c9902d3a629',
    'sc8': '69f747441a331c9902d3a62a',
    'sc9': '69f747441a331c9902d3a62b',
    'sc10': '69f747441a331c9902d3a62c',
    'sc11': '69f747441a331c9902d3a62d',
    'bc1': '69f747441a331c9902d3a62e',
    'bc2': '69f747441a331c9902d3a62f',
    'bc3': '69f747441a331c9902d3a630',
    'bc4': '69f747441a331c9902d3a631',
    'bc5': '69f747441a331c9902d3a632',
    'bc6': '69f747441a331c9902d3a633',
    'bc7': '69f747441a331c9902d3a634',
    'bc8': '69f747441a331c9902d3a635',
};

const CATEGORY_DATA = {
    'Vegetables & Fruits': {
        accent: '#4CAF50',
        accentLight: '#E8F5E9',
        subtitle: 'Farm fresh, delivered in 15 min',
        products: [
            // Vegetables
            { id: 'v1', name: 'Tomato', image: require('../../assets/categories/vegetablefruits/tomato.jpg'), price: 30, unit: '500g', badge: 'Fresh' },
            { id: 'v2', name: 'Brinjal', image: require('../../assets/categories/vegetablefruits/brinjles.jpg'), price: 35, unit: '500g' },
            { id: 'v3', name: 'Cabbage', image: require('../../assets/categories/vegetablefruits/cabagge.jpg'), price: 28, unit: '1 pc' },
            { id: 'v4', name: 'Cauliflower', image: require('../../assets/categories/vegetablefruits/cauliflower.jpg'), price: 40, unit: '1 pc', badge: 'Popular' },
            { id: 'v5', name: 'Broccoli', image: require('../../assets/categories/vegetablefruits/brocolli.jpg'), price: 55, unit: '250g' },
            { id: 'v6', name: 'Onion', image: require('../../assets/categories/vegetablefruits/onions.jpg'), price: 25, unit: '500g' },
            { id: 'v7', name: 'Potato', image: require('../../assets/categories/vegetablefruits/potato.jpg'), price: 22, unit: '500g' },
            { id: 'v8', name: 'Garlic', image: require('../../assets/categories/vegetablefruits/garlic.jpg'), price: 18, unit: '100g' },
            { id: 'v9', name: 'Lemon', image: require('../../assets/categories/vegetablefruits/lemon.jpg'), price: 10, unit: '3 pcs' },
            { id: 'v10', name: 'Beetroot', image: require('../../assets/categories/vegetablefruits/beetroot.jpg'), price: 30, unit: '500g' },
            { id: 'v11', name: 'Carrots', image: require('../../assets/categories/vegetablefruits/carrots.jpg'), price: 28, unit: '500g' },
            { id: 'v12', name: 'Pumpkin', image: require('../../assets/categories/vegetablefruits/pumpkins.jpg'), price: 32, unit: '500g' },
            { id: 'v13', name: 'Sweet Potato', image: require('../../assets/categories/vegetablefruits/sweetpatotes.jpg'), price: 35, unit: '500g' },
            { id: 'v14', name: 'Ginger', image: require('../../assets/categories/vegetablefruits/ginger.jpg'), price: 15, unit: '100g' },
            { id: 'v15', name: 'Mushrooms', image: require('../../assets/categories/vegetablefruits/mushrooms.jpg'), price: 60, unit: '200g', badge: 'Premium' },
            // Fruits
            { id: 'f1', name: 'Banana', image: require('../../assets/categories/vegetablefruits/banana.jpg'), price: 45, unit: '6 pcs', badge: 'Popular' },
            { id: 'f2', name: 'Watermelon', image: require('../../assets/categories/vegetablefruits/watermalon.jpg'), price: 80, unit: '1 pc' },
            { id: 'f3', name: 'Apple', image: require('../../assets/categories/vegetablefruits/apple.jpg'), price: 90, unit: '500g' },
            { id: 'f4', name: 'Orange', image: require('../../assets/categories/vegetablefruits/oranges.jpg'), price: 60, unit: '4 pcs' },
            { id: 'f5', name: 'Kiwi', image: require('../../assets/categories/vegetablefruits/kiwi.jpg'), price: 75, unit: '2 pcs' },
            { id: 'f6', name: 'Strawberry', image: require('../../assets/categories/vegetablefruits/strawberry.jpg'), price: 99, unit: '250g', badge: 'Premium' },
            { id: 'f7', name: 'Mango', image: require('../../assets/categories/vegetablefruits/mango.jpg'), price: 85, unit: '2 pcs', badge: 'Seasonal' },
            { id: 'f8', name: 'Pineapple', image: require('../../assets/categories/vegetablefruits/pineapple.jpg'), price: 65, unit: '1 pc' },
            { id: 'f9', name: 'Papaya', image: require('../../assets/categories/vegetablefruits/papaya.jpg'), price: 55, unit: '1 pc' },
            { id: 'f10', name: 'Grapes', image: require('../../assets/categories/vegetablefruits/grappes.jpg'), price: 70, unit: '500g' },
        ],
    },

    'Dairy, Eggs & Bread': {
        accent: '#FDD835',
        accentLight: '#FFFDE7',
        subtitle: 'Fresh dairy, every morning',
        products: [
            { id: 'd1', name: 'Amul Gold Milk', image: require('../../assets/categories/dairy/amulgold.jpg'), price: 31, unit: '500ml', badge: 'Popular' },
            { id: 'd2', name: 'Almond Milk', image: require('../../assets/categories/dairy/almondmilk.jpg'), price: 149, unit: '1L', badge: 'Premium' },
            { id: 'd3', name: 'Amul Fresh Cream', image: require('../../assets/categories/dairy/amulcream.jpg'), price: 45, unit: '200ml' },
            { id: 'd4', name: 'Dahi', image: require('../../assets/categories/dairy/dahi.jpg'), price: 42, unit: '400g', badge: 'Fresh' },
            { id: 'd5', name: 'Masti Dahi', image: require('../../assets/categories/dairy/mastidahi.jpg'), price: 55, unit: '400g', badge: 'Popular' },
            { id: 'd6', name: 'Amul Lassi', image: require('../../assets/categories/dairy/lassi.jpg'), price: 30, unit: '200ml' },
            { id: 'd7', name: 'White Eggs', image: require('../../assets/categories/dairy/whiteggs.jpg'), price: 89, unit: '12 pcs' },
            { id: 'd9', name: 'Bread', image: require('../../assets/categories/dairy/bread.jpg'), price: 35, unit: '400g' },
            { id: 'd10', name: 'Whole Wheat Bread', image: require('../../assets/categories/dairy/wholewheatbread.jpg'), price: 45, unit: '400g', badge: 'Healthy' },
        ],
    },
    'Munchies': {
        accent: '#FF7043',
        accentLight: '#FBE9E7',
        subtitle: 'Snack attack? We got you',
        products: [
            { id: 'm1', name: "Lay's Sweet Spicy", image: require('../../assets/categories/Munchies/sweetspicy.jpg'), price: 20, unit: '26g', badge: 'Popular' },
            { id: 'm2', name: "Lay's Indian Magic Masala", image: require('../../assets/categories/Munchies/indianmagicmasala.jpg'), price: 20, unit: '26g' },
            { id: 'm3', name: "Lay's Hot & Sweet Chilli", image: require('../../assets/categories/Munchies/hotandsweetchilli.jpg'), price: 20, unit: '26g' },
            { id: 'm4', name: "Lay's Salted", image: require('../../assets/categories/Munchies/salted.jpg'), price: 20, unit: '26g' },
            { id: 'm5', name: 'Pringles Original', image: require('../../assets/categories/Munchies/pringles.jpg'), price: 199, unit: '107g', badge: 'Premium' },
            { id: 'm6', name: 'Doritos Nacho Cheese', image: require('../../assets/categories/Munchies/doriotos.jpg'), price: 50, unit: '40g', badge: 'Popular' },
            { id: 'm7', name: 'Pringles Cream & Onion', image: require('../../assets/categories/Munchies/pringlescreamandonion.jpg'), price: 199, unit: '107g' },
            { id: 'm8', name: 'Doritos Spicy Sweet Chilli', image: require('../../assets/categories/Munchies/spicysweetchilli.jpg'), price: 50, unit: '40g' },
            { id: 'm9', name: 'Cheetos Cheddar Jalapeño', image: require('../../assets/categories/Munchies/cheddarjalapenocheetos.jpg'), price: 50, unit: '40g', badge: 'Spicy' },
            { id: 'm10', name: 'Takis', image: require('../../assets/categories/Munchies/takis.jpg'), price: 150, unit: '56g', badge: 'Spicy' },
            { id: 'm11', name: 'Pringles BBQ', image: require('../../assets/categories/Munchies/pringlesbbq.jpg'), price: 199, unit: '107g', badge: 'Premium' },
        ],
    },
    'Cold Drinks & Juices': {
        accent: '#29B6F6',
        accentLight: '#E1F5FE',
        subtitle: 'Chilled & refreshing, always',
        products: [
            { id: 'c1', name: 'Coca Cola', image: require('../../assets/categories/colddrinks/cocacola.jpg'), price: 45, unit: '750ml', badge: 'Popular' },
            { id: 'c2', name: 'Pepsi', image: require('../../assets/categories/colddrinks/pepsi.jpg'), price: 45, unit: '750ml' },
            { id: 'c3', name: 'Sprite', image: require('../../assets/categories/colddrinks/sprite.jpg'), price: 45, unit: '750ml' },
            { id: 'c4', name: 'Fanta Orange', image: require('../../assets/categories/colddrinks/fanta.jpg'), price: 45, unit: '750ml' },
            { id: 'c5', name: 'Fanta Berry', image: require('../../assets/categories/colddrinks/fantaberry.jpg'), price: 40, unit: '330ml' },
            { id: 'c6', name: 'Fanta Fruit Punch', image: require('../../assets/categories/colddrinks/fantafruitpunch.jpg'), price: 40, unit: '330ml' },
            { id: 'c7', name: 'Fanta Grape', image: require('../../assets/categories/colddrinks/fantagrappe.jpg'), price: 40, unit: '330ml' },
            { id: 'c8', name: 'Fanta Green Apple', image: require('../../assets/categories/colddrinks/fantagreenapple.jpg'), price: 40, unit: '330ml' },
            { id: 'c9', name: 'Mango Juice', image: require('../../assets/categories/colddrinks/mangojuice.jpg'), price: 30, unit: '200ml', badge: 'Popular' },
            { id: 'c10', name: 'Moggu Moggu', image: require('../../assets/categories/colddrinks/moggumoggu.jpg'), price: 60, unit: '320ml', badge: 'New' },
            { id: 'c11', name: 'Orange Juice', image: require('../../assets/categories/colddrinks/orangejuice.jpg'), price: 35, unit: '200ml' },
            { id: 'c12', name: 'Minute Maid Pulpy', image: require('../../assets/categories/colddrinks/pulpyorange.jpg'), price: 25, unit: '400ml', badge: 'Popular' },
            { id: 'c13', name: 'Tropicana', image: require('../../assets/categories/colddrinks/tropicana.jpg'), price: 99, unit: '1L', badge: 'Premium' },
            { id: 'c14', name: 'Cherry Juice', image: require('../../assets/categories/colddrinks/cherryjuice.jpg'), price: 80, unit: '500ml' },
            { id: 'c15', name: 'Blueberry Drink', image: require('../../assets/categories/colddrinks/blueberrdrink.jpg'), price: 80, unit: '330ml', badge: 'New' },
        ],
    },
    'Noodles & Instant Food': {
        accent: '#AB47BC',
        accentLight: '#F3E5F5',
        subtitle: 'Ready in minutes, loved always',
        products: [
            { id: 'n1', name: 'Buldak Black', image: require('../../assets/categories/instantfood/buldakblack.jpg'), price: 180, unit: '1 pc', badge: 'Spicy' },
            { id: 'n2', name: 'Buldak Pink', image: require('../../assets/categories/instantfood/buldakpink.jpg'), price: 180, unit: '1 pc', badge: 'Popular' },
            { id: 'n3', name: 'Buldak Yellow', image: require('../../assets/categories/instantfood/buldakyellow.jpg'), price: 180, unit: '1 pc' },
            { id: 'n4', name: 'Maggi Masala Cup', image: require('../../assets/categories/instantfood/maggicuppa.jpg'), price: 30, unit: '70g', badge: 'Popular' },
            { id: 'n5', name: 'Maggi Curry Flavour', image: require('../../assets/categories/instantfood/maggicurryfalvour.jpg'), price: 14, unit: '70g' },
            { id: 'n6', name: 'MTR Poha', image: require('../../assets/categories/instantfood/poha.jpg'), price: 45, unit: '80g' },
            { id: 'n7', name: 'MTR Upma', image: require('../../assets/categories/instantfood/upma.jpg'), price: 45, unit: '80g' },
            { id: 'n8', name: 'Yippee Noodles', image: require('../../assets/categories/instantfood/yippe.jpg'), price: 14, unit: '70g', badge: 'Popular' },
        ],
    },
    'Bakery & Biscuits': {
        accent: '#FF9800',
        accentLight: '#FFF3E0',
        subtitle: 'Crispy, crunchy & freshly baked',
        products: [
            { id: 'b1', name: 'Chocolate Cookie', image: require('../../assets/categories/biscuits/chocolatecookie.jpg'), price: 30, unit: '75g', badge: 'Popular' },
            { id: 'b2', name: 'Desire Butter', image: require('../../assets/categories/biscuits/desirebutter.jpg'), price: 20, unit: '100g' },
            { id: 'b3', name: 'Moms Magic', image: require('../../assets/categories/biscuits/momsmagic.jpg'), price: 25, unit: '100g' },
            { id: 'b4', name: 'Fifty Fifty', image: require('../../assets/categories/biscuits/fiftyfifty.jpg'), price: 20, unit: '66g', badge: 'Popular' },
            { id: 'b5', name: 'Marie Gold', image: require('../../assets/categories/biscuits/mariegold.jpg'), price: 25, unit: '250g' },
            { id: 'b6', name: 'Jim Jam', image: require('../../assets/categories/biscuits/jimjam.jpg'), price: 20, unit: '100g' },
            { id: 'b7', name: 'Little Hearts', image: require('../../assets/categories/biscuits/littlhearts.jpg'), price: 20, unit: '75g', badge: 'Popular' },
            { id: 'b8', name: 'Milk Bikis', image: require('../../assets/categories/biscuits/milkbikis.jpg'), price: 10, unit: '56g' },
            { id: 'b9', name: 'Nutri Choice', image: require('../../assets/categories/biscuits/nutrichoice.jpg'), price: 30, unit: '100g', badge: 'Healthy' },
            { id: 'b10', name: 'Bourbon', image: require('../../assets/categories/biscuits/bourbon.jpg'), price: 20, unit: '100g', badge: 'Popular' },
            { id: 'b11', name: 'Happy Happy Oreo', image: require('../../assets/categories/biscuits/happyhappy.jpg'), price: 20, unit: '120g' },
            { id: 'b12', name: 'Hide & Seek', image: require('../../assets/categories/biscuits/hideandseek.jpg'), price: 30, unit: '100g' },
            { id: 'b13', name: 'Unibic Chocolate', image: require('../../assets/categories/biscuits/unibicchocolate.jpg'), price: 40, unit: '75g', badge: 'Premium' },
            { id: 'b14', name: 'Unibic Fruit & Nut', image: require('../../assets/categories/biscuits/unibicfruitandnut.jpg'), price: 40, unit: '75g', badge: 'Premium' },
            { id: 'b15', name: 'Oreo Original', image: require('../../assets/categories/biscuits/orio.jpg'), price: 20, unit: '120g', badge: 'Popular' },
            { id: 'b16', name: 'Oreo Strawberry', image: require('../../assets/categories/biscuits/oreostrawberry.jpg'), price: 20, unit: '120g' },
        ],
    },
    'Sweet Tooth': {
        accent: '#E91E63',
        accentLight: '#FCE4EC',
        subtitle: 'Life is sweeter with every bite',
        products: [
            { id: 's1', name: 'Cornetto Choco', image: require('../../assets/categories/sweettooth/cornettochoco.jpg'), price: 50, unit: '1 pc', badge: 'Popular' },
            { id: 's2', name: 'Cornetto Blue', image: require('../../assets/categories/sweettooth/cornettoblue.jpg'), price: 50, unit: '1 pc' },
            { id: 's3', name: 'Magnum', image: require('../../assets/categories/sweettooth/mangum.jpg'), price: 90, unit: '1 pc', badge: 'Premium' },
            { id: 's4', name: 'Ferrero Rocher', image: require('../../assets/categories/sweettooth/ferroro.jpg'), price: 199, unit: '16 pcs', badge: 'Premium' },
            { id: 's5', name: 'KitKat Biscoff', image: require('../../assets/categories/sweettooth/kitkatbiscoff.jpg'), price: 60, unit: '1 pc' },
            { id: 's6', name: 'KitKat Cookie Crumble', image: require('../../assets/categories/sweettooth/kitkatcookiecrumble.jpg'), price: 60, unit: '1 pc' },
            { id: 's7', name: 'Oreo Bites', image: require('../../assets/categories/sweettooth/oreobites.jpg'), price: 50, unit: '75g', badge: 'New' },
            { id: 's8', name: 'Snickers Minis', image: require('../../assets/categories/sweettooth/snickers.jpg'), price: 99, unit: '162g', badge: 'Popular' },
            { id: 's9', name: 'Toblerone', image: require('../../assets/categories/sweettooth/toblerone.jpg'), price: 180, unit: '100g', badge: 'Premium' },
            { id: 's10', name: 'Twix', image: require('../../assets/categories/sweettooth/twix.jpg'), price: 60, unit: '50g' },
            { id: 's11', name: 'Kinder Joy', image: require('../../assets/categories/sweettooth/kinderjoy.jpg'), price: 40, unit: '1 pc', badge: 'Popular' },
            { id: 's12', name: 'Mars Minis', image: require('../../assets/categories/sweettooth/mars.jpg'), price: 99, unit: '162g' },
            { id: 's13', name: 'Bounty', image: require('../../assets/categories/sweettooth/bounty.jpg'), price: 60, unit: '57g' },
            { id: 's14', name: 'Rafaello', image: require('../../assets/categories/sweettooth/rafaello.jpg'), price: 299, unit: '150g', badge: 'Premium' },
        ],
    },
    'Atta, Rice & Dal': {
        accent: '#8BC34A',
        accentLight: '#F1F8E9',
        subtitle: 'Kitchen staples, always stocked',
        products: [
            { id: 'ar1', name: 'Aashirvaad Atta', image: require('../../assets/categories/Attarice/aashirvadatta.jpg'), price: 280, unit: '5kg', badge: 'Popular' },
            { id: 'ar2', name: 'Bhog Atta', image: require('../../assets/categories/Attarice/bhogaata.jpg'), price: 240, unit: '5kg' },
            { id: 'ar3', name: 'Daawat Brown Rice', image: require('../../assets/categories/Attarice/dawatbrownrice.jpg'), price: 180, unit: '1kg', badge: 'Healthy' },
            { id: 'ar4', name: 'India Gate Basmati', image: require('../../assets/categories/Attarice/basmatirce.jpg'), price: 320, unit: '1kg', badge: 'Premium' },
            { id: 'ar5', name: 'Masoor Dal', image: require('../../assets/categories/Attarice/masoordal.jpg'), price: 120, unit: '500g' },
            { id: 'ar6', name: 'Moong Dal', image: require('../../assets/categories/Attarice/moongdal.jpg'), price: 130, unit: '500g', badge: 'Popular' },
            { id: 'ar7', name: 'Toor Dal', image: require('../../assets/categories/Attarice/toordal.jpg'), price: 110, unit: '500g' },
            { id: 'ar8', name: 'Urad Dal', image: require('../../assets/categories/Attarice/uraldal.jpg'), price: 115, unit: '500g' },
            { id: 'ar9', name: 'Saffola Masala Oats', image: require('../../assets/categories/Attarice/masalaoats.jpg'), price: 75, unit: '39g', badge: 'Healthy' },
        ],
    },
    'Sauces & Spreads': {
        accent: '#5C6BC0',
        accentLight: '#E8EAF6',
        subtitle: 'Add flavour to every meal',
        products: [
            { id: 'sc1', name: 'Heinz BBQ Sauce', image: require('../../assets/categories/sauces/barbeque.jpg'), price: 299, unit: '875ml', badge: 'Popular' },
            { id: 'sc2', name: 'Hershey Strawberry', image: require('../../assets/categories/sauces/harsheystrawberry.jpg'), price: 120, unit: '200ml' },
            { id: 'sc3', name: 'Hershey Caramel', image: require('../../assets/categories/sauces/hersheycarame;.jpg'), price: 120, unit: '200ml' },
            { id: 'sc4', name: 'Hershey Chocolate', image: require('../../assets/categories/sauces/hersheychoco.jpg'), price: 120, unit: '200ml', badge: 'Popular' },
            { id: 'sc5', name: 'Heinz Hot Chilli Sauce', image: require('../../assets/categories/sauces/hotchilli.jpg'), price: 199, unit: '300ml', badge: 'Spicy' },
            { id: 'sc6', name: 'Heinz Mayonnaise', image: require('../../assets/categories/sauces/mayo.jpg'), price: 179, unit: '400ml' },
            { id: 'sc7', name: 'Rao\'s Pasta Sauce', image: require('../../assets/categories/sauces/pastasauce.jpg'), price: 599, unit: '680g', badge: 'Premium' },
            { id: 'sc8', name: 'Heinz Tandoori Mayo', image: require('../../assets/categories/sauces/tandoorimayo.jpg'), price: 179, unit: '400ml' },
            { id: 'sc9', name: 'Rao\'s Tomato Basil', image: require('../../assets/categories/sauces/tomatobasil.jpg'), price: 599, unit: '680g', badge: 'Premium' },
            { id: 'sc10', name: 'Heinz Tomato Ketchup', image: require('../../assets/categories/sauces/tomatoketcup.jpg'), price: 149, unit: '450ml', badge: 'Popular' },
            { id: 'sc11', name: 'Heinz Yellow Mustard', image: require('../../assets/categories/sauces/yellowmustard.jpg'), price: 199, unit: '395ml' },
        ],
    },
    'Baby Care': {
        accent: '#F48FB1',
        accentLight: '#FCE4EC',
        subtitle: 'Gentle care for your little one',
        products: [
            { id: 'bc1', name: 'Baby Rub', image: require('../../assets/categories/babycare/babyrub.jpg'), price: 199, unit: '50g', badge: 'Popular' },
            { id: 'bc2', name: 'Johnson Aloe Powder', image: require('../../assets/categories/babycare/johnsonaleopowder.jpg'), price: 149, unit: '200g' },
            { id: 'bc3', name: 'Johnson Baby Cream', image: require('../../assets/categories/babycare/johnsoncream.jpg'), price: 129, unit: '200g', badge: 'Popular' },
            { id: 'bc4', name: 'Johnson Baby Oil', image: require('../../assets/categories/babycare/johnsonoil.jpg'), price: 179, unit: '200ml' },
            { id: 'bc5', name: 'Johnson Baby Powder', image: require('../../assets/categories/babycare/johnsonpowder.jpg'), price: 149, unit: '200g' },
            { id: 'bc6', name: 'Johnson Baby Wipes', image: require('../../assets/categories/babycare/johnsonwipes.jpg'), price: 199, unit: '80 pcs', badge: 'Popular' },
            { id: 'bc7', name: 'Pampers Diapers', image: require('../../assets/categories/babycare/pampersdiaper.jpg'), price: 699, unit: '40 pcs', badge: 'Premium' },
            { id: 'bc8', name: 'Pampers Baby Wipes', image: require('../../assets/categories/babycare/pamperswipes.jpg'), price: 249, unit: '72 pcs' },
        ],
    },
};

const BADGE_COLORS = {
    Fresh: { bg: '#E8F5E9', text: '#2E7D32' },
    Popular: { bg: '#E3F2FD', text: '#1565C0' },
    Premium: { bg: '#FFF8E1', text: '#F57F17' },
    Seasonal: { bg: '#FCE4EC', text: '#880E4F' },
    Healthy: { bg: '#F1F8E9', text: '#558B2F' },
    Spicy: { bg: '#FBE9E7', text: '#BF360C' },
    New: { bg: '#E8EAF6', text: '#283593' },
};


const ProductCard = ({ item, accent, onAdd, onRemove, quantity }) => {
    const badge = item.badge ? BADGE_COLORS[item.badge] : null;

    return (
        <View style={styles.card}>
            {/* Badge */}
            {badge && (
                <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                    <Text style={[styles.badgeText, { color: badge.text }]}>{item.badge}</Text>
                </View>
            )}

            {/* Product image */}
            <View style={styles.imageWrap}>
                <Image source={item.image} style={styles.productImage} resizeMode="contain" />
            </View>

            {/* Info */}
            <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.productUnit}>{item.unit}</Text>

            {/* Price + Cart control */}
            <View style={styles.cardFooter}>
                <Text style={styles.price}>₹{item.price}</Text>

                {quantity === 0 ? (
                    <TouchableOpacity
                        style={[styles.addBtn, { borderColor: accent }]}
                        onPress={() => onAdd(item.id)}
                        activeOpacity={0.75}
                    >
                        <Text style={[styles.addBtnText, { color: accent }]}>ADD</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={[styles.qtyControl, { borderColor: accent }]}>
                        <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.qtyBtn}>
                            <Text style={[styles.qtyBtnText, { color: accent }]}>−</Text>
                        </TouchableOpacity>
                        <Text style={[styles.qtyNum, { color: accent }]}>{quantity}</Text>
                        <TouchableOpacity onPress={() => onAdd(item.id)} style={styles.qtyBtn}>
                            <Text style={[styles.qtyBtnText, { color: accent }]}>+</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};

// ─────────────────────────────────────────────
// MAIN SCREEN
// Usage: <CategoryProductsScreen route={{ params: { categoryName: 'Vegetables & Fruits' } }} />
// ─────────────────────────────────────────────
const CategoryProductsScreen = ({ route, navigation }) => {
    const { categoryName = 'Vegetables & Fruits' } = route?.params ?? {};
    const data = CATEGORY_DATA[categoryName];
    const { cart, addItem, removeItem, cartCount, cartTotal } = useCart();

    const handleAdd = useCallback((id) => {
        const product = data.products.find(p => p.id === id);
        const productWithMongoId = {
            ...product,
            _id: PRODUCT_ID_MAP[id],
        };
        addItem(productWithMongoId);
    }, [data, addItem]);

    const handleRemove = useCallback((id) => {
        const mongoId = PRODUCT_ID_MAP[id];
        removeItem(mongoId);
    }, [removeItem]);

    const renderItem = ({ item }) => (
        <ProductCard
            item={item}
            accent={data.accent}
            quantity={cart[PRODUCT_ID_MAP[item.id]] ?? 0}
            onAdd={handleAdd}
            onRemove={handleRemove}
        />
    );

    if (!data) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={{ padding: 20, color: '#666' }}>Category not found.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#E8F5FB" />

            {/* ── Header ── */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>{categoryName}</Text>
                    <Text style={styles.headerSubtitle}>{data.subtitle}</Text>
                </View>
                {/* Cart icon (header) */}
                <TouchableOpacity
                    style={styles.headerCartWrap}
                    onPress={() => navigation?.navigate('Cart')}
                    activeOpacity={0.8}
                >
                    <Icon1 name="shopping-cart" size={24} color="#1A1A1A" />
                    {cartCount > 0 && (
                        <View style={[styles.cartBadge, { backgroundColor: data.accent }]}>
                            <Text style={styles.cartBadgeText}>{cartCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* ── Product Grid ── */}
            <FlatList
                data={data.products}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={[
                    styles.listContent,
                    cartCount > 0 && { paddingBottom: 100 },
                ]}
                showsVerticalScrollIndicator={false}
            />

            {/* ── Sticky Cart Bar ── */}
            {cartCount > 0 && (
                <View style={styles.cartBar}>
                    <View>
                        <Text style={styles.cartBarCount}>{cartCount} item{cartCount > 1 ? 's' : ''}</Text>
                        <Text style={styles.cartBarTotal}>₹{cartTotal}</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.cartBarBtn, { backgroundColor: data.accent }]}
                        activeOpacity={0.85}
                        onPress={() => navigation.navigate('Cart')}
                    >
                        <Text style={styles.cartBarBtnText}>View Cart  →</Text>
                    </TouchableOpacity>
                </View>
            )}
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
        paddingHorizontal: 16,
        paddingTop: 6,
        paddingBottom: 14,
        backgroundColor: '#F2F0EF',
        gap: 10,
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
    backArrow: { fontSize: 18, color: '#111', marginTop: -1 },
    headerCenter: { flex: 1 },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#111',
        letterSpacing: -0.4,
    },
    headerSubtitle: {
        fontSize: 11,
        color: '#7A9BAA',
        fontWeight: '500',
        marginTop: 1,
    },
    headerCartIcon: { fontSize: 24 },
    headerCartWrap: { position: 'relative' },
    headerCartIcon: { fontSize: 24 },
    cartBadge: {
        position: 'absolute',
        top: -4,
        right: -6,
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 3,
    },
    cartBadgeText: { fontSize: 9, color: '#fff', fontWeight: '800' },

    // Grid
    listContent: { paddingHorizontal: 10, paddingBottom: 20 },
    row: { justifyContent: 'space-between' },

    // Card
    card: {
        width: '48.5%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: 10,
        left: 10,
        borderRadius: 6,
        paddingHorizontal: 7,
        paddingVertical: 2,
        zIndex: 1,
    },
    badgeText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.3 },
    imageWrap: {
        width: '100%',
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    productImage: { width: 90, height: 90 },
    productName: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1A1A1A',
        letterSpacing: -0.2,
        marginBottom: 2,
    },
    productUnit: {
        fontSize: 11,
        color: '#A0AAB4',
        fontWeight: '500',
        marginBottom: 10,
    },

    // Card footer
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    price: {
        fontSize: 15,
        fontWeight: '800',
        color: '#111',
        letterSpacing: -0.3,
    },
    addBtn: {
        borderWidth: 1.5,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 5,
    },
    addBtnText: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
    qtyControl: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: 8,
        overflow: 'hidden',
    },
    qtyBtn: { paddingHorizontal: 8, paddingVertical: 4 },
    qtyBtnText: { fontSize: 16, fontWeight: '700', lineHeight: 20 },
    qtyNum: { fontSize: 13, fontWeight: '800', minWidth: 16, textAlign: 'center' },

    // Sticky cart bar
    cartBar: {
        position: 'absolute',
        bottom: 16,
        left: 14,
        right: 14,
        backgroundColor: '#fff',
        borderRadius: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        paddingVertical: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 8,
    },
    cartBarCount: { fontSize: 11, color: '#999', fontWeight: '600' },
    cartBarTotal: { fontSize: 17, fontWeight: '800', color: '#111', letterSpacing: -0.3 },
    cartBarBtn: {
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    cartBarBtnText: { fontSize: 13, fontWeight: '800', color: '#fff', letterSpacing: 0.2 },
});

export default CategoryProductsScreen;