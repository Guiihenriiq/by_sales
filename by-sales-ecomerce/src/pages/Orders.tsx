import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

interface Installment {
  id: string;
  installmentNumber: number;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
}

interface Sale {
  id: string;
  userId: string;
  totalAmount: number;
  installmentsCount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  billingCode: string;
  shippingAddress: string;
  paymentMethod: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  installments?: Installment[];
}

const Orders: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, loading: authLoading } = useAuth();
  
  const headerRef = useRef<HTMLDivElement>(null);
  const salesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    console.log('Orders useEffect - user:', user);
    if (user?.token) {
      fetchOrders();
    } else if (user === null && !authLoading) {
      setError('Você precisa estar logado para ver suas compras');
      setPageLoading(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!pageLoading && sales.length > 0) {
      setTimeout(() => {
        animateSales();
      }, 200);
    }
  }, [sales, pageLoading]);

  const fetchOrders = async () => {
    const token = user?.token;
    if (!token) {
      setError('Token de autenticação não encontrado');
      setPageLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3334/api/sales', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const salesData = Array.isArray(data) ? data : [];
        setSales(salesData);
        setError('');
      } else if (response.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
        throw new Error(errorData.error || 'Erro ao carregar compras');
      }

      if (headerRef.current) {
        gsap.fromTo(headerRef.current, 
          { opacity: 0, y: -50 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
        );
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar compras';
      console.error('Erro ao buscar vendas:', err);
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setPageLoading(false);
    }
  };

  const animateSales = () => {
    const validElements = salesRef.current.filter(el => el !== null);
    if (validElements.length > 0) {
      gsap.fromTo(validElements,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out"
        }
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'confirmed': return 'Confirmado';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  if (authLoading || pageLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center py-16 max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <div className="text-red-500 text-xl mb-4">{error}</div>
          {error.includes('logado') ? (
            <Link
              to="/login"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 inline-block"
            >
              Fazer Login
            </Link>
          ) : (
            <button 
              onClick={fetchOrders}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Tentar Novamente
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div ref={headerRef} className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Minhas Compras</h1>
          <p className="text-gray-600">Acompanhe o status das suas compras e parcelas</p>
        </div>

        {sales.length > 0 ? (
          <div className="space-y-6">
            {sales.map((sale, index) => (
              <div
                key={sale.id}
                ref={el => salesRef.current[index] = el!}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="text-white">
                      <h3 className="text-lg font-semibold">Compra {sale.billingCode}</h3>
                      <p className="text-blue-100 text-sm">
                        {new Date(sale.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0 flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(sale.status)}`}>
                        {getStatusText(sale.status)}
                      </span>
                      <span className="text-white font-bold text-lg">
                        R$ {(() => {
                          const amount = typeof sale.totalAmount === 'string' ? parseFloat(sale.totalAmount) : sale.totalAmount;
                          return isNaN(amount) ? '0.00' : amount.toFixed(2);
                        })()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Endereço de Entrega</h4>
                      <p className="text-gray-600 text-sm">{sale.shippingAddress}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Método de Pagamento</h4>
                      <p className="text-gray-600 text-sm">{{
                        credit_card: 'Cartão de Crédito',
                        debit_card: 'Cartão de Débito',
                        pix: 'PIX',
                        boleto: 'Boleto'
                      }[sale.paymentMethod] || sale.paymentMethod}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Parcelas</h4>
                      <p className="text-gray-600 text-sm">{sale.installmentsCount}x de R$ {(() => {
                        const amount = typeof sale.totalAmount === 'string' ? parseFloat(sale.totalAmount) : sale.totalAmount;
                        const validAmount = isNaN(amount) ? 0 : amount;
                        const installmentValue = validAmount / (sale.installmentsCount || 1);
                        return installmentValue.toFixed(2);
                      })()}</p>
                    </div>
                  </div>

                  {sale.installments && sale.installments.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-4">Parcelas</h4>
                      <div className="space-y-2">
                        {sale.installments.map((installment) => (
                          <div key={installment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <span className="font-medium">{installment.installmentNumber}ª parcela</span>
                              <span className="text-sm text-gray-600 ml-2">
                                Vencimento: {new Date(installment.dueDate).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="font-semibold">R$ {(() => {
                                const amount = typeof installment.amount === 'string' ? parseFloat(installment.amount) : installment.amount;
                                return isNaN(amount) ? '0.00' : amount.toFixed(2);
                              })()}</span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                installment.status === 'paid' ? 'bg-green-100 text-green-800' :
                                installment.status === 'overdue' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {{
                                  pending: 'Pendente',
                                  paid: 'Pago',
                                  overdue: 'Vencido',
                                  cancelled: 'Cancelado'
                                }[installment.status]}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {sale.notes && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <h5 className="font-medium text-gray-800 mb-1">Observações</h5>
                      <p className="text-sm text-gray-600">{sale.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhuma compra encontrada
            </h3>
            <p className="text-gray-500 mb-6">
              Você ainda não fez nenhuma compra. Que tal começar suas compras?
            </p>
            <Link
              to="/products"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Começar a Comprar
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;