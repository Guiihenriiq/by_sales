import { API_BASE_URL } from "../utils/api";
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Checkout: React.FC = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'credit_card',
    installments: 1,
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = user?.token;
      if (!token) {
        toast.error('Faça login para finalizar a compra');
        navigate('/login');
        return;
      }

      // Criar venda no novo sistema
      const saleData = {
        totalAmount: getTotalPrice(),
        installmentsCount: formData.paymentMethod === 'credit_card' ? formData.installments : 1,
        paymentMethod: formData.paymentMethod,
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
        notes: `Pedido e-commerce - ${items.length} item(s)`
      };

      const response = await fetch(`${`${API_BASE_URL}/sales`}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(saleData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao processar pedido');
      }

      const result = await response.json();
      
      // Limpar carrinho após sucesso
      await clearCart();
      
      toast.success(`Venda realizada com sucesso! Código: ${result.sale.billingCode}`);
      // Redirecionar para página de sucesso
      navigate(`/order-success?saleId=${result.sale.id}&billingCode=${result.sale.billingCode}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao processar pedido');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <p className="text-gray-600 mb-8">Seu carrinho está vazio</p>
        <button 
          onClick={() => navigate('/products')}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Continuar Comprando
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Dados de Entrega</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Endereço</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Cidade</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">CEP</label>
                <input
                  type="text"
                  required
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Forma de Pagamento</label>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { value: 'credit_card', label: 'Cartão de Crédito' },
                  { value: 'debit_card', label: 'Cartão de Débito' },
                  { value: 'pix', label: 'PIX' },
                  { value: 'boleto', label: 'Boleto' }
                ].map((method) => (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: method.value })}
                    className={`p-3 border rounded-lg text-center ${
                      formData.paymentMethod === method.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Parcelas para cartão de crédito */}
            {formData.paymentMethod === 'credit_card' && (
              <div>
                <label className="block text-sm font-medium mb-2">Parcelas</label>
                <select
                  value={formData.installments}
                  onChange={(e) => setFormData({ ...formData, installments: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                    <option key={num} value={num}>
                      {num}x de R$ {(getTotalPrice() / num).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {/* Dados do cartão */}
            {(formData.paymentMethod === 'credit_card' || formData.paymentMethod === 'debit_card') && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium">Dados do Cartão</h3>
                <div>
                  <label className="block text-sm font-medium mb-2">Número do Cartão</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Nome no Cartão</label>
                  <input
                    type="text"
                    placeholder="João Silva"
                    value={formData.cardName}
                    onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Validade</label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      value={formData.cardExpiry}
                      onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={formData.cardCvv}
                      onChange={(e) => setFormData({ ...formData, cardCvv: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* PIX */}
            {formData.paymentMethod === 'pix' && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium mb-2">Pagamento via PIX</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Após confirmar o pedido, você receberá a chave PIX para pagamento.
                </p>
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm font-medium">Chave PIX (exemplo):</p>
                  <p className="font-mono text-sm">pix@bysales.com.br</p>
                  <button
                    type="button"
                    className="mt-2 text-blue-600 text-sm hover:underline"
                    onClick={() => {
                      navigator.clipboard.writeText('pix@bysales.com.br');
                      toast.success('Chave PIX copiada!');
                    }}
                  >
                    Copiar chave PIX
                  </button>
                </div>
              </div>
            )}
            
            {/* Boleto */}
            {formData.paymentMethod === 'boleto' && (
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-medium mb-2">Pagamento via Boleto</h3>
                <p className="text-sm text-gray-600">
                  O boleto será gerado após a confirmação do pedido e enviado por email.
                  Prazo de vencimento: 3 dias úteis.
                </p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 disabled:bg-gray-400 font-semibold"
            >
              {loading ? 'Processando...' : 'Confirmar Pedido'}
            </button>
          </form>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{item.product.name}</span>
                    <span className="text-gray-500 ml-2">x{item.quantity}</span>
                  </div>
                  <span>R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>R$ {getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete:</span>
                <span className="text-green-600">Grátis</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span className="text-green-600">R$ {getTotalPrice().toFixed(2)}</span>
              </div>
              {formData.paymentMethod === 'credit_card' && formData.installments > 1 && (
                <div className="text-sm text-gray-600 mt-2">
                  {formData.installments}x de R$ {(getTotalPrice() / formData.installments).toFixed(2)}
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>• Entrega em até 7 dias úteis</p>
            <p>• Frete grátis para todo o Brasil</p>
            <p>• Garantia de 30 dias</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;