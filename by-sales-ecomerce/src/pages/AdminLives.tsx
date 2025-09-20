import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { API_BASE_URL } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { PlayIcon, StopIcon, PlusIcon, CalendarIcon, EyeIcon } from '@heroicons/react/24/outline';

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

const AdminLives: React.FC = () => {
  const [lives, setLives] = useState<Live[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    streamUrl: '',
    thumbnailUrl: '',
    scheduledAt: '',
    products: ''
  });
  
  const { user } = useAuth();
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    fetchLives();
    animateElements();
  }, []);

  const animateElements = () => {
    const tl = gsap.timeline();
    
    if (headerRef.current) {
      tl.fromTo(headerRef.current,
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
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
      toast.error('Erro ao carregar lives');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const products = formData.products ? formData.products.split(',').map(p => p.trim()) : [];
      
      const response = await fetch(`${API_BASE_URL}/lives`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          ...formData,
          products
        })
      });

      if (response.ok) {
        toast.success('Live criada com sucesso!');
        setShowForm(false);
        setFormData({
          title: '',
          description: '',
          streamUrl: '',
          thumbnailUrl: '',
          scheduledAt: '',
          products: ''
        });
        fetchLives();
      } else {
        throw new Error('Erro ao criar live');
      }
    } catch (error) {
      toast.error('Erro ao criar live');
    } finally {
      setLoading(false);
    }
  };

  const startLive = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/lives/${id}/start`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      if (response.ok) {
        toast.success('Live iniciada!');
        fetchLives();
      }
    } catch (error) {
      toast.error('Erro ao iniciar live');
    }
  };

  const endLive = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/lives/${id}/end`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      if (response.ok) {
        toast.success('Live finalizada!');
        fetchLives();
      }
    } catch (error) {
      toast.error('Erro ao finalizar live');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'live': return 'bg-red-100 text-red-800';
      case 'ended': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Agendada';
      case 'live': return 'Ao Vivo';
      case 'ended': return 'Finalizada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div ref={headerRef} className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gerenciar Lives</h1>
            <p className="text-gray-600">Crie e gerencie suas lives promocionais</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Nova Live</span>
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Criar Nova Live</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL da Stream</label>
                  <input
                    type="url"
                    value={formData.streamUrl}
                    onChange={(e) => setFormData({...formData, streamUrl: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL da Thumbnail</label>
                  <input
                    type="url"
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData({...formData, thumbnailUrl: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data e Hora</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledAt}
                    onChange={(e) => setFormData({...formData, scheduledAt: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Produtos (IDs separados por vírgula)</label>
                <input
                  type="text"
                  value={formData.products}
                  onChange={(e) => setFormData({...formData, products: e.target.value})}
                  placeholder="produto1, produto2, produto3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  {loading ? 'Criando...' : 'Criar Live'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lives List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lives.map((live, index) => (
            <div
              key={live.id}
              ref={el => cardsRef.current[index] = el!}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative">
                <img
                  src={live.thumbnailUrl}
                  alt={live.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(live.status)}`}>
                    {getStatusText(live.status)}
                  </span>
                </div>
                {live.status === 'live' && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded flex items-center space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-xs font-semibold">AO VIVO</span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{live.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{live.description}</p>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  {new Date(live.scheduledAt).toLocaleString('pt-BR')}
                </div>

                {live.status === 'live' && (
                  <div className="flex items-center text-sm text-red-600 mb-4">
                    <EyeIcon className="w-4 h-4 mr-1" />
                    {live.viewerCount} visualizações
                  </div>
                )}

                <div className="flex space-x-2">
                  {live.status === 'scheduled' && (
                    <button
                      onClick={() => startLive(live.id)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-1 transition-colors"
                    >
                      <PlayIcon className="w-4 h-4" />
                      <span>Iniciar</span>
                    </button>
                  )}
                  
                  {live.status === 'live' && (
                    <button
                      onClick={() => endLive(live.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-1 transition-colors"
                    >
                      <StopIcon className="w-4 h-4" />
                      <span>Finalizar</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {lives.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📺</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma live encontrada</h3>
            <p className="text-gray-500">Crie sua primeira live promocional!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLives;