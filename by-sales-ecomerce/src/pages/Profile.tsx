import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { UserIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
}

const Profile: React.FC = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [saving, setSaving] = useState(false);
  
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    if (profile && !loading) {
      setTimeout(() => {
        animateContent();
      }, 100);
    }
  }, [profile, loading]);

  const fetchProfile = async () => {
    try {
      // Como não temos endpoint de perfil, usar dados do contexto
      const profileData: UserProfile = {
        id: user?.id || '',
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        role: user?.role || 'customer',
        emailVerified: user?.emailVerified || false,
        createdAt: new Date().toISOString()
      };
      
      setProfile(profileData);
      setFormData({
        name: profileData.name,
        phone: profileData.phone || '',
        address: profileData.address || ''
      });
    } catch (error) {
      toast.error('Erro ao carregar perfil');
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
    
    if (cardRef.current) {
      tl.fromTo(cardRef.current,
        { opacity: 0, x: -100 },
        { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      );
    }
    
    if (statsRef.current) {
      tl.fromTo(statsRef.current,
        { opacity: 0, x: 100 },
        { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      );
    }
  };

  const handleEdit = () => {
    setEditing(true);
    
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      name: profile?.name || '',
      phone: profile?.phone || '',
      address: profile?.address || ''
    });
    
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      // Simular atualização (implementar endpoint quando disponível)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (profile) {
        const updatedProfile = {
          ...profile,
          ...formData
        };
        setProfile(updatedProfile);
      }
      
      setEditing(false);
      toast.success('Perfil atualizado com sucesso!');
      
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    } catch (error) {
      toast.error('Erro ao atualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!profile) {
    return (
      <div className="text-center py-16">
        <div className="text-red-500 text-xl mb-4">Erro ao carregar perfil</div>
        <button 
          onClick={fetchProfile}
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
        <div ref={headerRef} className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Meu Perfil</h1>
          <p className="text-gray-600">Gerencie suas informações pessoais</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div ref={cardRef} className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Header do Card */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                      <UserIcon className="w-10 h-10 text-blue-500" />
                    </div>
                    <div className="text-white">
                      <h2 className="text-2xl font-bold">{profile.name}</h2>
                      <p className="text-blue-100 capitalize">{profile.role}</p>
                      <div className="flex items-center mt-1">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          profile.emailVerified ? 'bg-green-400' : 'bg-yellow-400'
                        }`} />
                        <span className="text-sm text-blue-100">
                          {profile.emailVerified ? 'Email verificado' : 'Email não verificado'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {!editing ? (
                    <button
                      onClick={handleEdit}
                      className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <CheckIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Conteúdo do Card */}
              <div className="p-6 space-y-6">
                {/* Nome */}
                <div className="flex items-center space-x-3">
                  <UserIcon className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.name}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{profile.email}</p>
                    <p className="text-xs text-gray-500">O email não pode ser alterado</p>
                  </div>
                </div>

                {/* Telefone */}
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                    {editing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="(11) 99999-9999"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.phone || 'Não informado'}</p>
                    )}
                  </div>
                </div>

                {/* Endereço */}
                <div className="flex items-start space-x-3">
                  <MapPinIcon className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                    {editing ? (
                      <textarea
                        rows={3}
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Seu endereço completo"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.address || 'Não informado'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats & Actions */}
          <div ref={statsRef} className="space-y-6">
            {/* Estatísticas */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Estatísticas</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Membro desde</span>
                  <span className="font-semibold">
                    {new Date(profile.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pedidos realizados</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status da conta</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    profile.emailVerified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {profile.emailVerified ? 'Verificada' : 'Pendente'}
                  </span>
                </div>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Ações Rápidas</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                  Meus Pedidos
                </button>
                <button className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors">
                  Lista de Desejos
                </button>
                <button className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
                  Cupons de Desconto
                </button>
                {!profile.emailVerified && (
                  <button className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors">
                    Verificar Email
                  </button>
                )}
              </div>
            </div>

            {/* Segurança */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Segurança</h3>
              <div className="space-y-3">
                <button className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
                  Alterar Senha
                </button>
                <button className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">
                  Excluir Conta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;