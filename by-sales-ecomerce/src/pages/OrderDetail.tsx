import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id && user?.token) {
      fetchOrder(id);
    }
  }, [id, user]);

  useEffect(() => {
    if (order && !loading) {
      setTimeout(() => {
        animateContent();
      }, 100);
    }
  }, [order, loading]);

  const fetchOrder = async (orderId: string) => {
    try {
      const response = await fetch(`http://localhost:3334/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else {
        toast.error('Pedido não encontrado');
        navigate('/orders');
      }
    } catch (error) {
      toast.error('Erro ao carregar pedido');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const animateContent = () => {
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }
    
    if (contentRef.current) {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: "power2.out" }
      );
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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <div className="text-red-500 text-xl mb-4">Pedido não encontrado</div>
        <button onClick={() => navigate('/orders')} className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
          Voltar aos Pedidos
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/orders')}
              className="text-blue-500 hover:text-blue-700 flex items-center"
            >
              ← Voltar aos Pedidos
            </button>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
              {getStatusText(order.status)}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Pedido #{order.id.slice(-8)}
          </h1>
          <p className="text-gray-600">
            Realizado em {new Date(order.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>

        {/* Content */}
        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Itens do Pedido</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                      {item.product.images && item.product.images.length > 0 ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/64x64?text=Img';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          Sem imagem
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">
                        Quantidade: {item.quantity} | Preço unitário: R$ {formatPrice(item.unitPrice)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">
                        R$ {formatPrice(item.totalPrice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Total */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumo do Pedido</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>R$ {formatPrice(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete:</span>
                  <span className="text-green-600">Grátis</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-green-600">R$ {formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Informações de Entrega</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Endereço:</span>
                  <p className="font-medium">{order.shippingAddress}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Método de Pagamento:</span>
                  <p className="font-medium capitalize">{order.paymentMethod}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            {order.status === 'pending' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Ações</h3>
                <button className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">
                  Cancelar Pedido
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;