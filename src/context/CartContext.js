import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { cartService } from '../services/cartService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(false);

  // Ref to always have latest cartItems without stale closure issues
  const cartItemsRef = useRef([]);

  // Keep ref in sync with state
  useEffect(() => {
    cartItemsRef.current = cartItems;
  }, [cartItems]);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const buildFlatCart = (items) => {
    const flat = {};
    items.forEach((item) => {
      const pid = item.product?._id ?? item.product;
      flat[pid] = item.quantity;
    });
    return flat;
  };

  const applyCart = (backendCart) => {
    const items = backendCart?.items ?? [];
    setCartItems(items);
    cartItemsRef.current = items; // keep ref immediately in sync
    setCart(buildFlatCart(items));
  };

  // ── Fetch cart on mount ───────────────────────────────────────────────────
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const backendCart = await cartService.getCart();
      applyCart(backendCart);
    } catch (err) {
      console.error('fetchCart error:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, []);

  // ── addItem ───────────────────────────────────────────────────────────────
  const addItem = useCallback(async (product) => {
    const productId = product._id ?? product.id;

    // Optimistic update
    setCart((prev) => ({ ...prev, [productId]: (prev[productId] ?? 0) + 1 }));

    try {
      const existingItem = cartItemsRef.current.find(
        (i) => (i.product?._id ?? i.product) === productId
      );

      let backendCart;
      if (existingItem) {
        backendCart = await cartService.updateCartItem(
          existingItem._id,
          existingItem.quantity + 1
        );
      } else {
        backendCart = await cartService.addToCart(productId, 1);
      }
      applyCart(backendCart);
    } catch (err) {
      console.error('addItem error:', err.message);
      // Revert optimistic update
      setCart((prev) => {
        const updated = { ...prev };
        if (updated[productId] <= 1) delete updated[productId];
        else updated[productId] -= 1;
        return updated;
      });
    }
  }, []);

  // ── removeItem ────────────────────────────────────────────────────────────
  const removeItem = useCallback(async (productId) => {
    const existingItem = cartItemsRef.current.find(
      (i) => (i.product?._id ?? i.product) === productId
    );
    if (!existingItem) return;

    // Optimistic update
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[productId] <= 1) delete updated[productId];
      else updated[productId] -= 1;
      return updated;
    });

    try {
      let backendCart;
      if (existingItem.quantity <= 1) {
        backendCart = await cartService.removeFromCart(existingItem._id);
      } else {
        backendCart = await cartService.updateCartItem(
          existingItem._id,
          existingItem.quantity - 1
        );
      }
      applyCart(backendCart);
    } catch (err) {
      console.error('removeItem error:', err.message);
      // Revert
      setCart((prev) => ({ ...prev, [productId]: (prev[productId] ?? 0) + 1 }));
    }
  }, []);

  // ── clearCart ─────────────────────────────────────────────────────────────
  const clearCart = useCallback(async () => {
    setCart({});
    setCartItems([]);
    cartItemsRef.current = [];
    try {
      await cartService.clearCart();
    } catch (err) {
      console.error('clearCart error:', err.message);
      fetchCart(); // re-sync if clear failed
    }
  }, [fetchCart]);

  // ── Derived values ────────────────────────────────────────────────────────
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems,
        loading,
        addItem,
        removeItem,
        clearCart,
        fetchCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);