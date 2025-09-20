import { API_BASE_URL } from "../utils/api";
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon, TrashIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import LoadingSpinner from '../components/LoadingSpinner';

gsap.registerPlugin(ScrollTrigger);

interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    stockQuantity: number;
    isActive: boolean;
    category?: {
      id: string;
      name: string;
    };
  };
}

const Wishlist: React.FC = () => {
  const { user, token } = useAuth();
  const { addToCart } = useCart();
  const { loadWishlist } = useWishlist();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        animateContent();
      }, 100);
    }
  }, [loading, wishlistItems]);

  const fetchWishlist = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/wishlist`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Erro ao carregar lista de desejos');
      
      const data = await response.json();
      setWishlistItems(data);
      
    } catch (err) {
      toast.error('Erro ao carregar lista de desejos');
      setError('Erro ao carregar lista de desejos');
    } finally {
      setLoading(false);
    }
  };

  const animateContent = () => {
    const tl = gsap.timeline();
    
    if (headerRef.current) {
      tl.fromTo(headerRef.current,
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }
    
    const validElements = itemsRef.current.filter(el => el !== null);
    if (validElements.length > 0) {
      tl.fromTo(validElements,
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out"
        },
        "-=0.4"
      );
    }
  };

  const removeFromWishlist = async (productId: string) => {
    setRemovingItems(prev => new Set(prev).add(productId));
    
    // Animate item removal
    const itemElement = itemsRef.current.find(el => 
      el && el.getAttribute('data-product-id') === productId
    );
    
    if (itemElement) {
      gsap.to(itemElement, {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: async () => {
          try {
            const response = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (response.ok) {
              setWishlistItems(prev => prev.filter(item => item.productId !== productId));
              loadWishlist(); // Update global wishlist state
              toast.success('Produto removido da lista de desejos');
            } else {
              throw new Error('Erro ao remover produto');
            }
          } catch (error) {
            toast.error('Erro ao remover produto da lista');
            // Restore item animation
            gsap.to(itemElement, {
              scale: 1,
              opacity: 1,
              duration: 0.3,
              ease: "power2.out"
            });
          } finally {
            setRemovingItems(prev => {
              const newSet = new Set(prev);
              newSet.delete(productId);
              return newSet;
            });
          }
        }
      });
    }
  };

  const handleAddToCart = async (product: WishlistItem['product']) => {
    if (product.stockQuantity === 0) {
      toast.error('Produto fora de estoque');
      return;
    }
    
    await addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.images
    });
    
    // Remove from wishlist after adding to cart
    await removeFromWishlist(product.id);
  };

  const moveAllToCart = async () => {
    const availableItems = wishlistItems.filter(item => 
      item.product.isActive && item.product.stockQuantity > 0
    );
    
    if (availableItems.length === 0) {
      toast.error('Nenhum produto disponível para adicionar ao carrinho');
      return;
    }

    try {
      for (const item of availableItems) {
        await addToCart({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          images: item.product.images
        });
      }
      
      // Remove all moved items from wishlist
      const removePromises = availableItems.map(item => 
        fetch(`${API_BASE_URL}/wishlist/${item.productId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
      );
      
      await Promise.all(removePromises);
      setWishlistItems(prev => prev.filter(item => 
        !availableItems.some(available => available.productId === item.productId)
      ));
      loadWishlist(); // Update global wishlist state
      
      toast.success(`${availableItems.length} produtos movidos para o carrinho!`);
    } catch (error) {
      toast.error('Erro ao mover produtos para o carrinho');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button 
          onClick={fetchWishlist}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center">
                <HeartSolidIcon className="w-10 h-10 text-red-500 mr-3" />
                Minha Lista de Desejos
              </h1>
              <p className="text-gray-600">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'produto' : 'produtos'} salvos
              </p>
            </div>
            
            {wishlistItems.length > 0 && (
              <button
                onClick={moveAllToCart}
                className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                <span>Mover Tudo para o Carrinho</span>
              </button>
            )}
          </div>
        </div>

        {/* Wishlist Grid */}
        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <HeartIcon className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              Sua lista de desejos está vazia
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Explore nossos produtos e adicione seus favoritos clicando no coração ❤️
            </p>
            <Link
              to="/products"
              className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-8 py-3 rounded-lg hover:from-pink-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Descobrir Produtos
            </Link>
          </div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item, index) => (
              <div
                key={item.id}
                ref={el => itemsRef.current[index] = el!}
                data-product-id={item.productId}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group relative"
              >
                {/* Remove Button */}
                <button
                  onClick={() => removeFromWishlist(item.productId)}
                  disabled={removingItems.has(item.productId)}
                  className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white text-red-500 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-50"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>

                {/* Product Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {item.product.images && item.product.images.length > 0 ? (
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Sem+Imagem';
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-gray-400 text-sm">Sem imagem</span>
                    </div>
                  )}
                  
                  {/* Stock Status */}
                  {item.product.stockQuantity === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Esgotado
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="mb-2">
                    {item.product.category && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {item.product.category.name}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2 group-hover:text-pink-600 transition-colors">
                    {item.product.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.product.description}
                  </p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-green-600">
                      R$ {(() => {
                        const price = typeof item.product.price === 'string' ? parseFloat(item.product.price) : item.product.price;
                        return isNaN(price) ? '0.00' : price.toFixed(2);
                      })()}
                    </span>
                    <span className="text-sm text-gray-500">
                      Adicionado em {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link 
                      to={`/products/${item.product.id}`}
                      className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-center hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                    >
                      Ver Detalhes
                    </Link>
                    <button
                      onClick={() => handleAddToCart(item.product)}
                      disabled={item.product.stockQuantity === 0 || !item.product.isActive}
                      className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 text-white px-3 py-2 rounded-lg hover:from-pink-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium transform hover:scale-105 flex items-center justify-center space-x-1"
                    >
                      <ShoppingCartIcon className="w-4 h-4" />
                      <span>{item.product.stockQuantity === 0 ? 'Esgotado' : 'Adicionar'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;