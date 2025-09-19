import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

interface Sale {
  id: string;
  totalAmount: number;
  status: string;
  billingCode: string;
  installmentsCount: number;
  paymentMethod: string;
  createdAt: string;
  installments?: Array<{
    installmentNumber: number;
    amount: number;
    dueDate: string;
    status: string;
  }>;
}

const OrderSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const saleId = searchParams.get('saleId');
  const billingCode = searchParams.get('billingCode');

  useEffect(() => {
    if (saleId && user?.token) {
      fetchSale(saleId);
    }
  }, [saleId, user]);

  const fetchSale = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3334/api/sales/${id}`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      
      if (response.ok) {
        const saleData = await response.json();
        setSale(saleData);
      }
    } catch (error) {
      console.error('Erro ao carregar venda:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Compra Realizada!
          </h1>
          <p className="text-gray-600 mb-6">
            Sua compra foi processada com sucesso. Você receberá um email de confirmação em breve.
          </p>
          
          {billingCode && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Código de Cobrança</h3>
              <p className="text-2xl font-mono font-bold text-blue-600">{billingCode}</p>
              <p className="text-sm text-gray-600 mt-1">Guarde este código para acompanhar seu pedido</p>
            </div>
          )}

          {sale && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Detalhes da Compra</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Código:</strong> {sale.billingCode}</p>
                <p><strong>Valor Total:</strong> R$ {(() => {
                  const amount = typeof sale.totalAmount === 'string' ? parseFloat(sale.totalAmount) : sale.totalAmount;
                  return isNaN(amount) ? '0.00' : amount.toFixed(2);
                })()}</p>
                <p><strong>Parcelas:</strong> {sale.installmentsCount}x</p>
                <p><strong>Pagamento:</strong> {{
                  credit_card: 'Cartão de Crédito',
                  debit_card: 'Cartão de Débito',
                  pix: 'PIX',
                  boleto: 'Boleto'
                }[sale.paymentMethod] || sale.paymentMethod}</p>
                <p><strong>Status:</strong> {{
                  pending: 'Pendente',
                  confirmed: 'Confirmado',
                  cancelled: 'Cancelado',
                  completed: 'Concluído'
                }[sale.status] || sale.status}</p>
                <p><strong>Data:</strong> {new Date(sale.createdAt).toLocaleDateString('pt-BR')}</p>
              </div>
              
              {sale.installments && sale.installments.length > 1 && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-800 mb-2">Parcelas</h4>
                  <div className="space-y-1">
                    {sale.installments.map((installment) => (
                      <div key={installment.installmentNumber} className="flex justify-between text-sm">
                        <span>{installment.installmentNumber}ª parcela</span>
                        <span>R$ {installment.amount.toFixed(2)} - {new Date(installment.dueDate).toLocaleDateString('pt-BR')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Próximos Passos</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Confirmação por email</li>
              <li>• Preparação do pedido</li>
              <li>• Envio e rastreamento</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link
              to="/orders"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 block"
            >
              Ver Minhas Compras
            </Link>
            <Link
              to="/products"
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-300 block"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;