import { CartItem } from "@/features/cart/types";
import { InventoryItem } from "@/features/items/types";

const CART_KEY = "cart";

// Get cart items from localStorage
export const getCartItems = (): CartItem[] => {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

// Add or update item in cart
export const addToCart = (item: InventoryItem, quantity: number): void => {
  const cartItems = getCartItems();
  const existingItem = cartItems.find(
    (cartItem) => cartItem.item.id === item.id
  );

  if (existingItem) {
    existingItem.quantity += quantity; // Update quantity if item already exists
  } else {
    cartItems.push({ item, quantity }); // Add new item to cart
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
};

// Update quantity of an item in cart
export const updateCartItemQuantity = (
  itemId: string,
  quantity: number
): void => {
  const cartItems = getCartItems();
  const itemToUpdate = cartItems.find(
    (cartItem) => cartItem.item.id === itemId
  );

  if (itemToUpdate) {
    itemToUpdate.quantity = quantity; // Set the new quantity
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }
};

// Remove item from cart
export const removeFromCart = (itemId: string): void => {
  const cartItems = getCartItems().filter(
    (cartItem) => cartItem.item.id !== itemId
  );
  localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
};

// Clear the entire cart
export const clearCart = (): void => {
  localStorage.removeItem(CART_KEY);
};
