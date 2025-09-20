import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import toast from 'react-hot-toast';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Link, useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import WishlistButton from '../components/WishlistButton';

gsap.registerPlugin(ScrollTrigger);

interface Product {
  id: string;
  name: string;
  description: string;
  price: number | string;
  images: string[];
  stockQuantity: number;
  isActive: boolean;
  categoryId?: string;
  minStock?: number;
  maxStock?: number;
  costPrice?: number | string;
  supplier?: string;
  barcode?: string;
  location?: string;
  lastInventoryDate?: string;
  inventoryNotes?: string;
}

interface Category {
  id: string;
  name: string;
  isActive?: boolean;
}

const Products: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const headerRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Processar parâmetros da URL
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [searchParams]);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, selectedCategory, searchTerm, sortBy]);

  useEffect(() => {
    if (!loading) {
      // Animar header e filtros após carregamento
      setTimeout(() => {
        if (headerRef.current) {
          gsap.fromTo(headerRef.current, 
            { opacity: 0, y: -50 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
          );
        }
        
        if (filtersRef.current) {
          gsap.fromTo(filtersRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: "power2.out" }
          );
        }
      }, 100);
    }
  }, [loading]);

  useEffect(() => {
    if (!loading && filteredProducts.length > 0) {
      setTimeout(() => {
        animateProducts();
      }, 300);
    }
  }, [filteredProducts, loading]);

  const fetchData = async () => {
    try {
      // Cache simples para categorias
      const cachedCategories = sessionStorage.getItem('categories');
      let categoriesPromise;
      
      if (cachedCategories) {
        categoriesPromise = Promise.resolve({ json: () => JSON.parse(cachedCategories) });
      } else {
        categoriesPromise = fetch('http://localhost:3334/api/categories');
      }
      
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('http://localhost:3334/api/products'),
        categoriesPromise
      ]);
      
      if (!productsRes.ok) {
        throw new Error('Erro ao carregar produtos');
      }
      
      const productsData = await productsRes.json();
      let categoriesData;
      
      if (cachedCategories) {
        categoriesData = JSON.parse(cachedCategories);
      } else {
        if (!categoriesRes.ok) {
          throw new Error('Erro ao carregar categorias');
        }
        categoriesData = await categoriesRes.json();
        sessionStorage.setItem('categories', JSON.stringify(categoriesData));
      }
      
      setProducts(productsData.filter((p: Product) => p.isActive));
      setCategories(categoriesData);
      
    } catch (err) {
      toast.error('Erro ao carregar dados');
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.categoryId === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'stock':
          return b.stockQuantity - a.stockQuantity;
        default:
          return 0;
      }
    });
    
    setFilteredProducts(filtered);
  };

  const animateProducts = () => {
    const validElements = productsRef.current.filter(el => el !== null);
    if (validElements.length > 0 && gridRef.current) {
      gsap.fromTo(validElements,
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  };

  const handleAddToCart = async (product: Product) => {
    if (product.stockQuantity === 0) {
      toast.error('Produto fora de estoque');
      return;
    }
    
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
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    
    // Animate category change - com verificação
    if (gridRef.current) {
      gsap.to(gridRef.current, {
        opacity: 0.3,
        duration: 0.2,
        onComplete: () => {
          if (gridRef.current) {
            gsap.to(gridRef.current, {
              opacity: 1,
              duration: 0.3
            });
          }
        }
      });
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
          onClick={fetchData}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Nossos Produtos</h1>
            <p className="text-gray-600">Descubra nossa seleção especial</p>
          </div>
          {user?.role === 'admin' && (
            <Link 
              to="/admin/products/new" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              + Adicionar Produto
            </Link>
          )}
        </div>

        {/* Filters */}
        <div ref={filtersRef} className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas as Categorias</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Nome A-Z</option>
                <option value="price-low">Menor Preço</option>
                <option value="price-high">Maior Preço</option>
                <option value="stock">Maior Estoque</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              ref={el => productsRef.current[index] = el!}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              {/* Product Image */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
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
                
                {/* Wishlist Button */}
                <div className="absolute top-2 left-2">
                  <WishlistButton productId={product.id} size="md" />
                </div>

                {/* Stock Badge */}
                <div className="absolute top-2 right-2">
                  {product.stockQuantity === 0 ? (
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Esgotado
                    </span>
                  ) : product.stockQuantity <= (product.minStock || 5) ? (
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Últimas unidades
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-green-600">
                    R$ {(() => {
                      const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
                      return isNaN(price) ? '0.00' : price.toFixed(2);
                    })()}
                  </span>
                  <span className="text-sm text-gray-500">
                    Estoque: {product.stockQuantity}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link 
                    to={`/products/${product.id}`}
                    className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-center hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                  >
                    Ver Detalhes
                  </Link>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stockQuantity === 0}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium transform hover:scale-105"
                  >
                    {product.stockQuantity === 0 ? 'Esgotado' : 'Adicionar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-500 mb-4">
              Tente ajustar os filtros ou buscar por outros termos
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSortBy('name');
              }}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;