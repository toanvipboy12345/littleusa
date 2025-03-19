import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import axiosInstance from "../Api/axiosInstance";
import { UserContext } from "./UserContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartToken, setCartToken] = useState(() => localStorage.getItem("cartToken") || null);
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDiscountPrice, setTotalDiscountPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(UserContext);
  const hasFetched = useRef(false);

  const resetCart = useCallback(() => {
    console.log("resetCart - Resetting cart state");
    setCartItems([]);
    setTotalItems(0);
    setTotalPrice(0);
    setTotalDiscountPrice(0);
    setCartToken(null);
    localStorage.removeItem("cartToken");
    hasFetched.current = false;
  }, []);

  const fetchCart = useCallback(async () => {
    const storedCartToken = localStorage.getItem("cartToken");
    const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

    if (!storedCartToken && !storedUser) {
      console.log("fetchCart - No cartToken or user, resetting cart");
      resetCart();
      return;
    }

    if (isLoading) {
      console.log("fetchCart - Already loading, skipping fetch");
      return;
    }

    setIsLoading(true);
    try {
      console.log("fetchCart - Fetching cart data...");
      const headers = storedUser?.id ? { "User-Id": storedUser.id } : { "Cart-Token": storedCartToken || "" };
      const response = await axiosInstance.get("/api/cart", { headers });
      const data = response.data;

      setCartItems(
        data.items?.map((item) => ({
          ...item,
          productName: typeof item.productName === "string" ? item.productName : "Unnamed Product",
          variant: {
            mainImage: item.variant?.mainImage || "",
            id: item.variant?.id || null,
            color: typeof item.variant?.color === "string" ? item.variant.color : "Unknown",
          },
          size: typeof item.size === "string" ? item.size : "Unknown",
          discountPrice: typeof item.discountPrice === "number" ? item.discountPrice : 0,
        })) || []
      );
      setTotalItems(data.totalItems || 0);
      setTotalPrice(data.totalPrice || 0);
      setTotalDiscountPrice(data.totalDiscountPrice || 0);
      hasFetched.current = true;
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartItems([]);
      setTotalItems(0);
      setTotalPrice(0);
      setTotalDiscountPrice(0);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, resetCart]);

  const ensureCartToken = useCallback(async () => {
    if (isLoading || cartToken || user) return;
    setIsLoading(true);
    try {
      console.log("ensureCartToken - Fetching new cart token for guest...");
      const response = await axiosInstance.get("/api/cart/guest");
      const newCartToken = response.data.cartToken;
      setCartToken(newCartToken);
      localStorage.setItem("cartToken", newCartToken);
    } catch (error) {
      console.error("Error fetching guest cart token:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, cartToken, user]);

  const mergeGuestCartOnLogin = useCallback(async () => {
    const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
    const storedCartToken = localStorage.getItem("cartToken");

    if (isLoading || !storedCartToken || !storedUser?.id) return;

    setIsLoading(true);
    try {
      console.log("mergeGuestCartOnLogin - Merging guest cart with userId:", storedUser.id);
      await axiosInstance.post("/api/cart/merge", null, {
        headers: { "Cart-Token": storedCartToken, "User-Id": storedUser.id },
      });
      localStorage.removeItem("cartToken"); // Xóa cartToken sau khi merge
      setCartToken(null);
      hasFetched.current = false;
    } catch (error) {
      console.error("Error merging guest cart:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const addToCart = useCallback(async (productId, variantId, sizes) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
      const storedCartToken = localStorage.getItem("cartToken");

      if (!storedUser && !storedCartToken) {
        await ensureCartToken();
      }

      const headers = storedUser?.id
        ? { "User-Id": storedUser.id }
        : { "Cart-Token": storedCartToken || localStorage.getItem("cartToken") || "" };
      const payload = {
        productId,
        variantId,
        sizes: sizes.map((size) => ({ sizeId: size.sizeId, quantity: size.quantity })),
      };
      await axiosInstance.post("/api/cart/add", payload, { headers });
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, ensureCartToken]);

  const deleteFromCart = useCallback(async (itemId) => {
    const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
    const storedCartToken = localStorage.getItem("cartToken");

    if (isLoading || (!storedUser && !storedCartToken)) return;

    setIsLoading(true);
    try {
      const headers = storedUser?.id
        ? { "User-Id": storedUser.id }
        : { "Cart-Token": storedCartToken || "" };
      await axiosInstance.delete(`/api/cart/item/${itemId}`, { headers });
    } catch (error) {
      console.error("Error deleting from cart:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const updateQuantity = useCallback(async (itemId, newQuantity) => {
    const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
    const storedCartToken = localStorage.getItem("cartToken");

    if (isLoading || (!storedUser && !storedCartToken)) return;

    setIsLoading(true);
    try {
      if (newQuantity <= 0) {
        await deleteFromCart(itemId);
        return;
      }
      const headers = storedUser?.id
        ? { "User-Id": storedUser.id }
        : { "Cart-Token": storedCartToken || "" };
      const payload = { quantity: newQuantity };
      await axiosInstance.put(`/api/cart/item/${itemId}`, payload, { headers });
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, deleteFromCart]);

  // Khởi tạo giỏ hàng và xóa cartToken khi có user trong localStorage
  useEffect(() => {
    const storedCartToken = localStorage.getItem("cartToken");
    const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

    if (storedUser) {
      // Nếu có user trong localStorage, xóa cartToken ngay lập tức
      if (storedCartToken) {
        console.log("CartContext - User found in localStorage, removing cartToken and merging cart");
        localStorage.removeItem("cartToken");
        setCartToken(null);
        if (!hasFetched.current) {
          mergeGuestCartOnLogin().then(() => fetchCart());
        }
      } else if (!hasFetched.current) {
        console.log("CartContext - User found, fetching cart");
        fetchCart();
      }
    } else if (!storedUser && storedCartToken && !hasFetched.current) {
      console.log("CartContext - No user, using cartToken to fetch cart");
      fetchCart();
    } else if (!storedUser && !storedCartToken) {
      console.log("CartContext - No user or cartToken, resetting cart");
      resetCart();
    }
  }, [user, fetchCart, resetCart, mergeGuestCartOnLogin]);

  const value = {
    cartToken,
    cartItems,
    totalItems,
    totalPrice,
    totalDiscountPrice,
    isLoading,
    fetchCart,
    addToCart,
    mergeGuestCartOnLogin,
    deleteFromCart,
    updateQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);