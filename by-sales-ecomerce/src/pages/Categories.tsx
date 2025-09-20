import { API_BASE_URL } from "../utils/api";
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

gsap.registerPlugin(ScrollTrigger);

interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  createdAt: string;
  products?: any[];
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!loading && categories.length > 0) {
      setTimeout(() => {
        animateCategories();
      }, 200);
    }
  }, [categories, loading]);

  const fetchCategories = async () => {
    try {
      const cachedCategories = sessionStorage.getItem('categories');
      let categoriesData;
      
      if (cachedCategories) {
        categoriesData = JSON.parse(cachedCategories);
      } else {
        const response = await fetch(`${`${API_BASE_URL}/categories`}`);
        if (!response.ok) throw new Error('Erro ao carregar categorias');
        categoriesData = await response.json();
        sessionStorage.setItem('categories', JSON.stringify(categoriesData));
      }
      
      setCategories(categoriesData);
      
      if (headerRef.current) {
        gsap.fromTo(headerRef.current, 
          { opacity: 0, y: -50 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
        );
      }
      
    } catch (err) {
      toast.error('Erro ao carregar categorias');
      setError('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  const animateCategories = () => {
    const validElements = categoriesRef.current.filter(el => el !== null);
    if (validElements.length > 0 && gridRef.current) {
      gsap.fromTo(validElements,
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button 
          onClick={fetchCategories}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Categorias</h1>
            <p className="text-gray-600">Explore nossas categorias de produtos</p>
          </div>
          {user?.role === 'admin' && (
            <Link 
              to="/admin/categories/new" 
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              + Nova Categoria
            </Link>
          )}
        </div>

        {/* Categories Grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={category.id}
              ref={el => categoriesRef.current[index] = el!}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer"
            >
              <Link to={`/products?category=${category.id}`}>
                {/* Category Image */}
                <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
                  {category.imageUrl ? (
                    <img 
                      src={category.imageUrl} 
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(category.name);
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-6xl mb-4">
                        {getCategoryIcon(category.name)}
                      </div>
                    </div>
                  )}
                  
                  {/* Products Count Badge */}
                  <div className="absolute top-2 right-2">
                    <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      {category.products?.length || 0} produtos
                    </span>
                  </div>
                </div>

                {/* Category Info */}
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2 text-gray-800 group-hover:text-purple-600 transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Criada em {new Date(category.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                    <div className="text-purple-500 group-hover:text-purple-700 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Admin Actions */}
              {user?.role === 'admin' && (
                <div className="px-6 pb-4">
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-yellow-500 text-white py-2 px-3 rounded text-sm hover:bg-yellow-600 transition-colors">
                      Editar
                    </button>
                    <button className="flex-1 bg-red-500 text-white py-2 px-3 rounded text-sm hover:bg-red-600 transition-colors">
                      Excluir
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhuma categoria encontrada
            </h3>
            <p className="text-gray-500 mb-4">
              Ainda não há categorias cadastradas no sistema
            </p>
            {user?.role === 'admin' && (
              <Link
                to="/admin/categories/new"
                className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
              >
                Criar Primeira Categoria
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function para ícones de categoria
const getCategoryIcon = (categoryName: string): string => {
  const name = categoryName.toLowerCase();
  if (name.includes('eletrônico') || name.includes('tech')) return '💻';
  if (name.includes('roupa') || name.includes('vestuário')) return '👕';
  if (name.includes('casa') || name.includes('jardim')) return '🏠';
  if (name.includes('esporte') || name.includes('fitness')) return '⚽';
  if (name.includes('livro') || name.includes('educação')) return '📚';
  if (name.includes('beleza') || name.includes('cosmético')) return '💄';
  if (name.includes('brinquedo') || name.includes('criança')) return '🧸';
  if (name.includes('cozinha') || name.includes('utensílio')) return '🍳';
  return '📦';
};

export default Categories;