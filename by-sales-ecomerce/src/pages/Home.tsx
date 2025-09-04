import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { StarIcon, ShoppingCartIcon, HeartIcon, FireIcon } from '@heroicons/react/24/solid';
import { useCart } from '../contexts/CartContext';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

gsap.registerPlugin(ScrollTrigger);

const Home: React.FC = () => {
  const { addToCart } = useCart();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  // Mock data - em produção viria da API
  const bannerSlides = [
    {
      id: 1,
      title: 'Mega Promoção de Eletrônicos',
      subtitle: 'Até 70% OFF em smartphones, notebooks e mais!',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop',
      cta: 'Comprar Agora',
      gradient: 'from-purple-600 to-blue-600'
    },
    {
      id: 2,
      title: 'Moda Verão 2024',
      subtitle: 'Coleção completa com frete grátis',
      image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=600&fit=crop',
      cta: 'Ver Coleção',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      id: 3,
      title: 'Casa & Decoração',
      subtitle: 'Transforme seu lar com estilo',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=600&fit=crop',
      cta: 'Explorar',
      gradient: 'from-green-500 to-teal-500'
    }
  ];

  const featuredProducts = [
    {
      id: '1',
      name: 'iPhone 15 Pro Max',
      price: 8999.99,
      originalPrice: 9999.99,
      images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop'],
      rating: 4.9,
      reviews: 1234,
      discount: 10,
      isHot: true
    },
    {
      id: '2',
      name: 'MacBook Air M2',
      price: 7499.99,
      originalPrice: 8499.99,
      images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop'],
      rating: 4.8,
      reviews: 856,
      discount: 12,
      isHot: true
    },
    {
      id: '3',
      name: 'AirPods Pro 2',
      price: 1899.99,
      originalPrice: 2199.99,
      images: ['https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop'],
      rating: 4.7,
      reviews: 2341,
      discount: 14,
      isHot: false
    },
    {
      id: '4',
      name: 'Samsung Galaxy S24',
      price: 6999.99,
      originalPrice: 7999.99,
      images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop'],
      rating: 4.6,
      reviews: 1876,
      discount: 13,
      isHot: false
    }
  ];

  const categories = [
    { name: 'Eletrônicos', icon: '📱', count: 1234, color: 'from-blue-500 to-purple-600' },
    { name: 'Moda', icon: '👕', count: 856, color: 'from-pink-500 to-rose-500' },
    { name: 'Casa', icon: '🏠', count: 642, color: 'from-green-500 to-teal-500' },
    { name: 'Esportes', icon: '⚽', count: 423, color: 'from-orange-500 to-red-500' },
    { name: 'Livros', icon: '📚', count: 789, color: 'from-indigo-500 to-blue-500' },
    { name: 'Beleza', icon: '💄', count: 567, color: 'from-purple-500 to-pink-500' }
  ];

  useEffect(() => {
    // Animações de entrada
    const tl = gsap.timeline();
    
    tl.fromTo('.hero-content', 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
    );

    // Animações com scroll
    gsap.fromTo('.feature-card',
      { opacity: 0, y: 50, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    gsap.fromTo('.product-card',
      { opacity: 0, y: 30, rotationY: 15 },
      {
        opacity: 1,
        y: 0,
        rotationY: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: productsRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleAddToCart = (product: any) => {
    addToCart(product);
    
    // Animação de feedback
    gsap.to('.cart-feedback', {
      scale: 1.2,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut'
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Banner Carousel */}
      <section className="relative h-[70vh] overflow-hidden" ref={heroRef}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect="fade"
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop
          className="h-full"
        >
          {bannerSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative h-full">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-80`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white hero-content max-w-4xl px-4">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 animate-slide-up opacity-90">
                      {slide.subtitle}
                    </p>
                    <button className="bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 animate-slide-up">
                      {slide.cta}
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50" ref={featuresRef}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Por que escolher a By Sales?</h2>
            <p className="text-xl text-gray-600">Experiência de compra única e segura</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card card p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Entrega Rápida</h3>
              <p className="text-gray-600">Entrega em até 24h para sua região</p>
            </div>
            
            <div className="feature-card card p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Compra Segura</h3>
              <p className="text-gray-600">Seus dados protegidos com criptografia</p>
            </div>
            
            <div className="feature-card card p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Melhor Preço</h3>
              <p className="text-gray-600">Garantia do menor preço do mercado</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore por Categoria</h2>
            <p className="text-xl text-gray-600">Encontre exatamente o que você procura</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                to={`/products?category=${category.name}`}
                className="group"
              >
                <div className="card p-6 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl">{category.icon}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.count} produtos</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50" ref={productsRef}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              <FireIcon className="inline-block w-10 h-10 text-red-500 mr-2" />
              Produtos em Destaque
            </h2>
            <p className="text-xl text-gray-600">Os mais vendidos da semana</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="product-card card overflow-hidden group">
                <div className="relative">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.isHot && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                      🔥 HOT
                    </div>
                  )}
                  {product.discount > 0 && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      -{product.discount}%
                    </div>
                  )}
                  <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110">
                    <HeartIcon className="w-6 h-6 text-red-500" />
                  </button>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-purple-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      ({product.reviews})
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-purple-600">
                        R$ {product.price.toFixed(2)}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          R$ {product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full btn-primary flex items-center justify-center space-x-2 cart-feedback"
                  >
                    <ShoppingCartIcon className="w-5 h-5" />
                    <span>Adicionar ao Carrinho</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/products" className="btn-secondary inline-block">
              Ver Todos os Produtos
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Fique por dentro das novidades!</h2>
          <p className="text-xl mb-8 opacity-90">
            Receba ofertas exclusivas e lançamentos em primeira mão
          </p>
          
          <form className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              className="flex-1 px-6 py-3 rounded-l-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="bg-white text-purple-600 px-8 py-3 rounded-r-full font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              Inscrever
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;