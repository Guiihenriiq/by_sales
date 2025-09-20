import { API_BASE_URL } from "../utils/api";
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import toast from 'react-hot-toast';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import WishlistButton from '../components/WishlistButton';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number | string;
  images: string[];
  stockQuantity: number;
  isActive: boolean;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
  };
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const imageRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  useEffect(() => {
    if (product && !loading) {
      setTimeout(() => {
        animateContent();
      }, 100);
    }
  }, [product, loading]);

  const fetchProduct = async (productId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`);
      if (!response.ok) {
        if (response.status === 404) {
          toast.error('Produto não encontrado');
          navigate('/products');
          return;
        }
        throw new Error('Erro ao carregar produto');
      }
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      toast.error('Erro ao carregar produto');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const animateContent = () => {
    const tl = gsap.timeline();
    
    if (imageRef.current) {
      tl.fromTo(imageRef.current,
        { opacity: 0, x: -100 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }
      );
    }
    
    if (infoRef.current) {
      tl.fromTo(infoRef.current,
        { opacity: 0, x: 100 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
        "-=0.4"
      );
    }
    
    if (actionsRef.current) {
      tl.fromTo(actionsRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.2"
      );
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    if (product.stockQuantity === 0) {
      toast.error('Produto fora de estoque');
      return;
    }
    
    if (quantity > product.stockQuantity) {
      toast.error(`Apenas ${product.stockQuantity} unidades disponíveis`);
      return;
    }
    
    for (let i = 0; i < quantity; i++) {
      const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
      if (isNaN(price)) {
        toast.error('Preço inválido do produto');
        return;
      }
      
      await addToCart({
        id: product.id,
        name: product.name,
        price: price,
        images: product.images
      });
    }
  };

  const handleImageChange = (index: number) => {
    setSelectedImage(index);
    
    const img = imageRef.current?.querySelector('img');
    if (img) {
      gsap.fromTo(img,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }
      );
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <div className="text-center py-16">
        <div className="text-red-500 text-xl mb-4">Produto não encontrado</div>
        <Link to="/products" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
          Voltar aos Produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600">Início</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-blue-600">Produtos</Link>
            <span>/</span>
            <span className="text-gray-800">{product.name}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div ref={imageRef} className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImage] || product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/500x500?text=Sem+Imagem';
                    }}
                  />
                ) : (
                  <div className="text-gray-400 text-lg">Sem imagem disponível</div>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageChange(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/80x80?text=Img';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div ref={infoRef} className="space-y-6">
            <div>
              {product.category && (
                <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-2">
                  {product.category.name}
                </span>
              )}
              <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
              <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
            </div>

            {/* Price */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-green-600">
                  R$ {(() => {
                    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
                    return isNaN(price) ? '0.00' : price.toFixed(2);
                  })()}
                </span>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Estoque</div>
                  <div className={`font-semibold ${
                    product.stockQuantity === 0 ? 'text-red-500' :
                    product.stockQuantity <= 5 ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                    {product.stockQuantity === 0 ? 'Esgotado' : `${product.stockQuantity} unidades`}
                  </div>
                </div>
              </div>

              {/* Stock Status */}
              {product.stockQuantity > 0 && product.stockQuantity <= 5 && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-lg text-sm">
                  ⚠️ Últimas unidades disponíveis!
                </div>
              )}
            </div>

            {/* Actions */}
            <div ref={actionsRef} className="bg-white rounded-xl p-6 shadow-lg space-y-4">
              {/* Quantity Selector */}
              {product.stockQuantity > 0 && (
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">Quantidade:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-gray-100 transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stockQuantity}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.min(product.stockQuantity, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="w-16 text-center py-2 border-0 focus:ring-0"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      className="px-3 py-2 hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center space-x-4 mb-4">
                <WishlistButton productId={product.id} size="lg" className="shadow-lg" />
                <span className="text-sm text-gray-600">Adicionar à lista de desejos</span>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stockQuantity === 0}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                  {product.stockQuantity === 0 ? 'Produto Esgotado' : 'Adicionar ao Carrinho'}
                </button>
                
                <Link
                  to="/products"
                  className="bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200"
                >
                  Voltar
                </Link>
              </div>
            </div>

            {/* Admin Actions */}
            {user?.role === 'admin' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">🔧 Ações de Administrador</h3>
                <div className="flex space-x-2">
                  <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 text-sm">
                    Editar Produto
                  </button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm">
                    Desativar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;