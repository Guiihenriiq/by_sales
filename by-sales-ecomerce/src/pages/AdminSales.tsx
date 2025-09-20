import { API_BASE_URL } from "../utils/api";
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: {
    id: string;
    name: string;
    images: string[];
  };
}

interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

const AdminSales: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const { user } = useAuth();
  
  const headerRef = useRef<HTMLDivElement>(null);
  const ordersRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (user?.token && user?.role === 'admin') {
      fetchAllOrders();
    }
  }, [user]);

  useEffect(() => {
    if (!loading && orders.length > 0) {
      setTimeout(() => {
        animateOrders();
      }, 200);
    }
  }, [orders, loading]);

  const fetchAllOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/orders`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        throw new Error('Erro ao carregar pedidos');
      }

      if (headerRef.current) {
        gsap.fromTo(headerRef.current, 
          { opacity: 0, y: -50 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
        );
      }
    } catch (error) {
      toast.error('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const animateOrders = () => {
    const validElements = ordersRef.current.filter(el => el !== null);
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

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) {
        toast.error('Pedido não encontrado');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ 
          status: newStatus,
          items: order.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        })
      });

      if (response.ok) {
        setOrders(orders.map(o => 
          o.id === orderId 
            ? { ...o, status: newStatus as any, updatedAt: new Date().toISOString() }
            : o
        ));
        
        let message = 'Status atualizado com sucesso!';
        if (newStatus === 'confirmed') {
          message = 'Pedido aprovado e estoque atualizado!';
        } else if (newStatus === 'cancelled') {
          message = 'Pedido cancelado!';
        }
        
        toast.success(message);
      } else {
        throw new Error('Erro ao atualizar status');
      }
    } catch (error) {
      toast.error('Erro ao atualizar pedido');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'confirmed': return 'Confirmado';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregue';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Painel de Vendas</h1>
          <p className="text-gray-600">Gerencie todos os pedidos da loja</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos ({orders.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pendentes ({orders.filter(o => o.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('confirmed')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'confirmed' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Confirmados ({orders.filter(o => o.status === 'confirmed').length})
            </button>
            <button
              onClick={() => setFilter('shipped')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'shipped' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Enviados ({orders.filter(o => o.status === 'shipped').length})
            </button>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-6">
            {filteredOrders.map((order, index) => (
              <div
                key={order.id}
                ref={el => ordersRef.current[index] = el!}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="text-white">
                      <h3 className="text-lg font-semibold">Pedido #{order.id.slice(-8)}</h3>
                      <p className="text-purple-100 text-sm">
                        {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0 flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      <span className="text-white font-bold text-lg">
                        R$ {formatPrice(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Endereço de Entrega</h4>
                      <p className="text-gray-600 text-sm">{order.shippingAddress}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Método de Pagamento</h4>
                      <p className="text-gray-600 text-sm capitalize">{order.paymentMethod}</p>
                    </div>
                  </div>

                  {/* Items Summary */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Itens ({order.items.length} produtos)
                    </h4>
                    <div className="text-sm text-gray-600">
                      {order.items.map(item => item.product.name).join(', ')}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'confirmed')}
                          className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                        >
                          ✓ Aprovar Pedido
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          ✗ Recusar Pedido
                        </button>
                      </>
                    )}
                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'shipped')}
                        className="flex-1 bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors"
                      >
                        📦 Marcar como Enviado
                      </button>
                    )}
                    {order.status === 'shipped' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        ✅ Marcar como Entregue
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhum pedido encontrado
            </h3>
            <p className="text-gray-500">
              {filter === 'all' ? 'Ainda não há pedidos no sistema' : `Não há pedidos com status "${getStatusText(filter)}"`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSales;