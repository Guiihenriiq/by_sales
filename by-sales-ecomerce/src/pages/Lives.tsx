import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { API_BASE_URL } from '../utils/api';
import { PlayIcon, EyeIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { LivePlayer } from '../components/LivePlayer';

interface Live {
  id: string;
  title: string;
  description: string;
  streamUrl: string;
  thumbnailUrl: string;
  scheduledAt: string;
  startedAt?: string;
  endedAt?: string;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  viewerCount: number;
  products?: string[];
}

const Lives: React.FC = () => {
  const [lives, setLives] = useState<Live[]>([]);
  const [currentLive, setCurrentLive] = useState<Live | null>(null);
  const [selectedLive, setSelectedLive] = useState<Live | null>(null);
  const [showLivePlayer, setShowLivePlayer] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const headerRef = useRef<HTMLDivElement>(null);
  const currentLiveRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    fetchLives();
    fetchCurrentLive();
    animateElements();
    
    // Poll for current live every 30 seconds
    const interval = setInterval(() => {
      fetchCurrentLive();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const animateElements = () => {
    const tl = gsap.timeline();
    
    if (headerRef.current) {
      tl.fromTo(headerRef.current,
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }
    
    if (currentLiveRef.current) {
      tl.fromTo(currentLiveRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.4"
      );
    }
    
    const validCards = cardsRef.current.filter(el => el !== null);
    if (validCards.length > 0) {
      tl.fromTo(validCards,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" },
        "-=0.3"
      );
    }
  };

  const fetchLives = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/lives`);
      if (response.ok) {
        const data = await response.json();
        setLives(data);
      }
    } catch (error) {
      console.error('Erro ao carregar lives:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentLive = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/lives/current`);
      if (response.ok) {
        const data = await response.json();
        setCurrentLive(data);
      }
    } catch (error) {
      console.error('Erro ao carregar live atual:', error);
    }
  };

  const openLiveModal = (live: Live) => {
    setSelectedLive(live);
    setShowLivePlayer(true);
    // Simulate viewer count update
    updateViewerCount(live.id);
  };

  const closeLiveModal = () => {
    setSelectedLive(null);
    setShowLivePlayer(false);
  };

  const updateViewerCount = async (liveId: string) => {
    try {
      await fetch(`${API_BASE_URL}/lives/${liveId}/viewers`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          viewerCount: Math.floor(Math.random() * 1000) + 100 
        })
      });
    } catch (error) {
      console.error('Erro ao atualizar visualizações:', error);
    }
  };

  const getTimeUntilLive = (scheduledAt: string) => {
    const now = new Date();
    const liveTime = new Date(scheduledAt);
    const diff = liveTime.getTime() - now.getTime();
    
    if (diff <= 0) return 'Iniciando...';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando lives...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Lives Promocionais</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Acompanhe nossas lives exclusivas com ofertas imperdíveis e lançamentos!
          </p>
        </div>

        {/* Current Live */}
        {currentLive && (
          <div ref={currentLiveRef} className="mb-12">
            <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-xl p-8 text-white text-center mb-4">
              <div className="flex items-center justify-center mb-4">
                <div className="w-4 h-4 bg-white rounded-full animate-pulse mr-2"></div>
                <span className="text-2xl font-bold">AO VIVO AGORA</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">{currentLive.title}</h2>
              <p className="text-xl mb-6 opacity-90">{currentLive.description}</p>
              <div className="flex items-center justify-center space-x-6 mb-6">
                <div className="flex items-center">
                  <EyeIcon className="w-5 h-5 mr-2" />
                  <span>{currentLive.viewerCount} assistindo</span>
                </div>
              </div>
              <button
                onClick={() => openLiveModal(currentLive)}
                className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center mx-auto space-x-2"
              >
                <PlayIcon className="w-5 h-5" />
                <span>Assistir Agora</span>
              </button>
            </div>
          </div>
        )}

        {/* Upcoming Lives */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Próximas Lives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lives
              .filter(live => live.status === 'scheduled')
              .map((live, index) => (
                <div
                  key={live.id}
                  ref={el => cardsRef.current[index] = el!}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative">
                    <img
                      src={live.thumbnailUrl}
                      alt={live.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {getTimeUntilLive(live.scheduledAt)}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{live.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{live.description}</p>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      {new Date(live.scheduledAt).toLocaleString('pt-BR')}
                    </div>

                    <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
                      <ClockIcon className="w-4 h-4" />
                      <span>Lembrar-me</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Past Lives */}
        {lives.filter(live => live.status === 'ended').length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Lives Anteriores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {lives
                .filter(live => live.status === 'ended')
                .slice(0, 8)
                .map((live) => (
                  <div
                    key={live.id}
                    className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={live.thumbnailUrl}
                        alt={live.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <PlayIcon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-sm mb-1">{live.title}</h4>
                      <p className="text-xs text-gray-500">
                        {new Date(live.scheduledAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {lives.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📺</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma live disponível</h3>
            <p className="text-gray-500">Fique ligado! Em breve teremos lives incríveis para você!</p>
          </div>
        )}
      </div>

      {/* Live Player */}
      {selectedLive && (
        <LivePlayer
          liveId={selectedLive.id}
          isOpen={showLivePlayer}
          onClose={closeLiveModal}
          liveData={{
            title: selectedLive.title,
            description: selectedLive.description,
            viewerCount: selectedLive.viewerCount,
            products: selectedLive.products?.map(id => ({ id, name: `Produto ${id}`, price: '99.99' }))
          }}
        />
      )}
    </div>
  );
};

export default Lives;