import { API_BASE_URL } from "../utils/api";
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { UserIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, PencilIcon, CheckIcon, XMarkIcon, TicketIcon } from '@heroicons/react/24/outline';
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

interface UserCoupon {
  id: string;
  coupon: {
    id: string;
    code: string;
    title: string;
    description?: string;
    discountType: 'percentage' | 'fixed_amount';
    discountValue: number;
    minPurchaseAmount: number;
    maxDiscountAmount?: number;
    startDate: string;
    endDate: string;
    usageLimit: number;
    usedCount: number;
    status: string;
  };
  usedAt?: string;
  createdAt: string;
}

const Profile: React.FC = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userCoupons, setUserCoupons] = useState<UserCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showCoupons, setShowCoupons] = useState(false);
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
      fetchUserCoupons();
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

  const fetchUserCoupons = async () => {
    if (!user?.id) return;
    
    setLoadingCoupons(true);
    try {
      const response = await fetch(`${API_BASE_URL}/coupons/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const couponsData = await response.json();
        setUserCoupons(couponsData);
      }
    } catch (error) {
      console.error('Erro ao carregar cupons:', error);
    } finally {
      setLoadingCoupons(false);
    }
  };

  const formatDiscount = (coupon: UserCoupon['coupon']) => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}% OFF`;
    } else {
      return `R$ ${coupon.discountValue.toFixed(2)} OFF`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const isCouponExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const isCouponActive = (coupon: UserCoupon) => {
    const now = new Date();
    const startDate = new Date(coupon.coupon.startDate);
    const endDate = new Date(coupon.coupon.endDate);
    
    return !coupon.usedAt && 
           coupon.coupon.status === 'active' && 
           startDate <= now && 
           endDate >= now && 
           coupon.coupon.usedCount < coupon.coupon.usageLimit;
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
                <button 
                  onClick={() => setShowCoupons(true)}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <TicketIcon className="w-4 h-4" />
                  <span>Meus Cupons ({userCoupons.length})</span>
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

        {/* Modal de Cupons */}
        {showCoupons && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              {/* Header do Modal */}
              <div className="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <TicketIcon className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-bold text-white">Meus Cupons de Desconto</h2>
                </div>
                <button
                  onClick={() => setShowCoupons(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Conteúdo do Modal */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                {loadingCoupons ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                    <span className="ml-2 text-gray-600">Carregando cupons...</span>
                  </div>
                ) : userCoupons.length === 0 ? (
                  <div className="text-center py-12">
                    <TicketIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Nenhum cupom disponível
                    </h3>
                    <p className="text-gray-500">
                      Você ainda não possui cupons de desconto. Fique de olho nas nossas promoções!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userCoupons.map((userCoupon) => (
                      <div
                        key={userCoupon.id}
                        className={`relative overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                          isCouponActive(userCoupon)
                            ? 'border-green-200 bg-gradient-to-r from-green-50 to-teal-50 hover:shadow-lg'
                            : userCoupon.usedAt
                            ? 'border-gray-200 bg-gray-50 opacity-75'
                            : 'border-red-200 bg-red-50 opacity-75'
                        }`}
                      >
                        {/* Status Badge */}
                        <div className="absolute top-2 right-2">
                          {userCoupon.usedAt ? (
                            <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              USADO
                            </span>
                          ) : isCouponExpired(userCoupon.coupon.endDate) ? (
                            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              EXPIRADO
                            </span>
                          ) : isCouponActive(userCoupon) ? (
                            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              ATIVO
                            </span>
                          ) : (
                            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              INATIVO
                            </span>
                          )}
                        </div>

                        <div className="p-4">
                          {/* Código do Cupom */}
                          <div className="mb-3">
                            <div className="bg-white border-2 border-dashed border-green-300 rounded-lg p-3 text-center">
                              <div className="text-2xl font-bold text-green-600 font-mono">
                                {userCoupon.coupon.code}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Clique para copiar
                              </div>
                            </div>
                          </div>

                          {/* Informações do Cupom */}
                          <div className="space-y-2">
                            <h3 className="font-bold text-gray-800">
                              {userCoupon.coupon.title}
                            </h3>
                            
                            {userCoupon.coupon.description && (
                              <p className="text-sm text-gray-600">
                                {userCoupon.coupon.description}
                              </p>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="text-lg font-bold text-green-600">
                                {formatDiscount(userCoupon.coupon)}
                              </div>
                              <div className="text-xs text-gray-500">
                                Válido até {formatDate(userCoupon.coupon.endDate)}
                              </div>
                            </div>

                            {userCoupon.coupon.minPurchaseAmount > 0 && (
                              <div className="text-xs text-gray-600">
                                💰 Compra mínima: R$ {userCoupon.coupon.minPurchaseAmount.toFixed(2)}
                              </div>
                            )}

                            {userCoupon.usedAt && (
                              <div className="text-xs text-gray-500">
                                ✅ Usado em {formatDate(userCoupon.usedAt)}
                              </div>
                            )}
                          </div>

                          {/* Botão de Ação */}
                          {isCouponActive(userCoupon) && (
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(userCoupon.coupon.code);
                                toast.success('Código copiado!');
                              }}
                              className="w-full mt-3 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold"
                            >
                              Copiar Código
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;