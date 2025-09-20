import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

gsap.registerPlugin(ScrollTrigger);

interface Offer {
  id: string;
  title: string;
  description?: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  minPurchaseAmount: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usedCount: number;
  status: string;
  bannerImage?: string;
  offerProducts: {
    id: string;
    product: {
      id: string;
      name: string;
      price: number;
      images: string[];
    };
  }[];
}

const Offers: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const offersRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    fetchOffers();
  }, []);

  useEffect(() => {
    if (!loading && offers.length > 0) {
      setTimeout(() => {
        animateOffers();
      }, 200);
    }
  }, [offers, loading]);

  const fetchOffers = async () => {
    try {
      const response = await fetch('http://localhost:3334/api/offers/active');
      if (!response.ok) throw new Error('Erro ao carregar ofertas');
      
      const offersData = await response.json();
      setOffers(offersData);
      
      if (headerRef.current) {
        gsap.fromTo(headerRef.current, 
          { opacity: 0, y: -50 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
        );
      }
      
    } catch (err) {
      toast.error('Erro ao carregar ofertas');
      setError('Erro ao carregar ofertas');
    } finally {
      setLoading(false);
    }
  };

  const animateOffers = () => {
    const validElements = offersRef.current.filter(el => el !== null);
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

  const formatDiscount = (offer: Offer) => {
    if (offer.discountType === 'percentage') {
      return `${offer.discountValue}% OFF`;
    } else {
      return `R$ ${offer.discountValue.toFixed(2)} OFF`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isOfferExpiringSoon = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays > 0;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button 
          onClick={fetchOffers}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🔥 Ofertas Especiais
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Aproveite nossas promoções exclusivas e economize muito!
          </p>
        </div>

        {/* Offers Grid */}
        <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {offers.map((offer, index) => (
            <div
              key={offer.id}
              ref={el => offersRef.current[index] = el!}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group relative"
            >
              {/* Offer Banner */}
              <div className="relative h-48 bg-gradient-to-br from-red-500 to-orange-500 overflow-hidden">
                {offer.bannerImage ? (
                  <img 
                    src={offer.bannerImage} 
                    alt={offer.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-white">
                      <div className="text-4xl font-bold mb-2">
                        {formatDiscount(offer)}
                      </div>
                      <div className="text-lg opacity-90">
                        {offer.title}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Discount Badge */}
                <div className="absolute top-4 right-4">
                  <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    {formatDiscount(offer)}
                  </div>
                </div>

                {/* Expiring Soon Badge */}
                {isOfferExpiringSoon(offer.endDate) && (
                  <div className="absolute top-4 left-4">
                    <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                      ⏰ Últimos dias!
                    </div>
                  </div>
                )}
              </div>

              {/* Offer Content */}
              <div className="p-6">
                <h3 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-red-600 transition-colors">
                  {offer.title}
                </h3>
                
                {offer.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {offer.description}
                  </p>
                )}

                {/* Offer Details */}
                <div className="space-y-2 mb-4">
                  {offer.minPurchaseAmount > 0 && (
                    <div className="text-sm text-gray-600">
                      💰 Compra mínima: R$ {offer.minPurchaseAmount.toFixed(2)}
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-600">
                    📅 Válida até: {formatDate(offer.endDate)}
                  </div>
                  
                  {offer.usageLimit && (
                    <div className="text-sm text-gray-600">
                      🎯 Restam: {offer.usageLimit - offer.usedCount} usos
                    </div>
                  )}
                </div>

                {/* Products Preview */}
                {offer.offerProducts && offer.offerProducts.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-semibold text-gray-700 mb-2">
                      Produtos em oferta:
                    </div>
                    <div className="flex -space-x-2 overflow-hidden">
                      {offer.offerProducts.slice(0, 3).map((offerProduct) => (
                        <div
                          key={offerProduct.id}
                          className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-gray-200 overflow-hidden"
                        >
                          {offerProduct.product.images[0] ? (
                            <img
                              src={offerProduct.product.images[0]}
                              alt={offerProduct.product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-gray-300 flex items-center justify-center text-xs">
                              📦
                            </div>
                          )}
                        </div>
                      ))}
                      {offer.offerProducts.length > 3 && (
                        <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-gray-600 text-white text-xs flex items-center justify-center">
                          +{offer.offerProducts.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Link
                  to={`/products?offer=${offer.id}`}
                  className="block w-full bg-gradient-to-r from-red-500 to-orange-500 text-white text-center py-3 px-4 rounded-lg font-semibold hover:from-red-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Ver Produtos em Oferta
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {offers.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhuma oferta ativa no momento
            </h3>
            <p className="text-gray-500 mb-4">
              Fique de olho! Novas ofertas incríveis chegam em breve
            </p>
            <Link
              to="/products"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Ver Todos os Produtos
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Offers;