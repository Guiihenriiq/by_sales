import { API_BASE_URL } from "../utils/api";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
}

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [localCart, setLocalCart] = useState<CartItem[]>([]);

  useEffect(() => {
    if (user?.token) {
      fetchCart();
    } else {
      // Carregar carrinho local do localStorage
      const savedCart = localStorage.getItem('localCart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
        setLocalCart(parsedCart);
      } else {
        setItems([]);
        setLocalCart([]);
      }
    }
  }, [user]);

  const fetchCart = async () => {
    const token = user?.token;
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const cartItems = await response.json();
        setItems(cartItems);
      }
    } catch (error) {
      toast.error('Erro ao carregar carrinho');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: Product, quantity = 1) => {
    const token = user?.token;
    
    if (token) {
      // Usuário logado - usar API
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            productId: product.id,
            quantity
          })
        });

        if (response.ok) {
          await fetchCart();
          toast.success('Produto adicionado ao carrinho!');
        } else {
          throw new Error('Erro ao adicionar produto ao carrinho');
        }
      } catch (error) {
        toast.error('Erro ao adicionar produto ao carrinho');
      } finally {
        setLoading(false);
      }
    } else {
      // Usuário não logado - usar localStorage
      const existingItem = localCart.find(item => item.product.id === product.id);
      let newCart;
      
      if (existingItem) {
        // Garantir que o preço seja um número válido
        const validPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
        if (isNaN(validPrice)) {
          toast.error('Preço do produto inválido');
          return;
        }
        
        newCart = localCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity, product: { ...item.product, price: validPrice } }
            : item
        );
      } else {
        // Garantir que o preço seja um número válido
        const validPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
        if (isNaN(validPrice)) {
          toast.error('Preço do produto inválido');
          return;
        }
        
        const newItem: CartItem = {
          id: `local-${Date.now()}`,
          product: { ...product, price: validPrice },
          quantity
        };
        newCart = [...localCart, newItem];
      }
      
      setLocalCart(newCart);
      setItems(newCart);
      localStorage.setItem('localCart', JSON.stringify(newCart));
      toast.success('Produto adicionado ao carrinho!');
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    const token = user?.token;
    
    if (token) {
      // Usuário logado - usar API
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/cart/${cartItemId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
          toast.success('Produto removido do carrinho');
        } else {
          throw new Error('Erro ao remover produto do carrinho');
        }
      } catch (error) {
        toast.error('Erro ao remover produto do carrinho');
      } finally {
        setLoading(false);
      }
    } else {
      // Usuário não logado - usar localStorage
      const newCart = localCart.filter(item => item.id !== cartItemId);
      setLocalCart(newCart);
      setItems(newCart);
      localStorage.setItem('localCart', JSON.stringify(newCart));
      toast.success('Produto removido do carrinho');
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }

    const token = user?.token;
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${cartItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
      });

      if (response.ok) {
        await fetchCart();
        toast.success('Quantidade atualizada');
      } else {
        throw new Error('Erro ao atualizar quantidade');
      }
    } catch (error) {
      toast.error('Erro ao atualizar quantidade');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    const token = user?.token;
    if (!token) return;

    setLoading(true);
    try {
      const deletePromises = items.map(item => 
        fetch(`${API_BASE_URL}/cart/${item.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      );

      await Promise.all(deletePromises);
      setItems([]);
      toast.success('Carrinho limpo com sucesso');
    } catch (error) {
      toast.error('Erro ao limpar carrinho');
    } finally {
      setLoading(false);
    }
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const price = typeof item.product.price === 'string' ? parseFloat(item.product.price) : item.product.price;
      const validPrice = isNaN(price) ? 0 : price;
      return total + (validPrice * item.quantity);
    }, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};