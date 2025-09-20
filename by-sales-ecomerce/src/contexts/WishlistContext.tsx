import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../utils/api';

interface WishlistContextType {
  wishlistItems: Set<string>;
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  loadWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const { user, token, isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isAuthenticated && user) {
      loadWishlist();
    } else {
      setWishlistItems(new Set());
    }
  }, [isAuthenticated, user]);

  const loadWishlist = async () => {
    if (!token || !isAuthenticated) {
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/wishlist`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const productIds = new Set(data.map((item: any) => item.productId));
        setWishlistItems(productIds);
      } else if (response.status === 401) {
        setWishlistItems(new Set());
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.has(productId);
  };

  const addToWishlist = async (productId: string) => {
    if (!isAuthenticated || !token) {
      toast.error('Faça login para adicionar à lista de desejos');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });
      
      if (response.ok) {
        setWishlistItems(prev => new Set(prev).add(productId));
        toast.success('Produto adicionado à lista de desejos!');
      } else {
        const errorText = await response.text();
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }
        
        if (errorData.error === 'Product already in wishlist') {
          toast.error('Produto já está na lista de desejos');
        } else if (response.status === 401) {
          toast.error('Sessão expirada. Faça login novamente.');
        } else if (response.status === 404) {
          toast.error('Produto não encontrado');
        } else {
          toast.error(`Erro: ${errorData.error || 'Erro desconhecido'}`);
        }
      }
    } catch (error) {
      console.error('Network error:', error);
      toast.error('Erro de conexão. Verifique sua internet.');
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!isAuthenticated || !token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setWishlistItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        toast.success('Produto removido da lista de desejos');
      } else {
        throw new Error('Erro ao remover produto');
      }
    } catch (error) {
      toast.error('Erro ao remover da lista de desejos');
    }
  };

  const toggleWishlist = async (productId: string) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      loadWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};