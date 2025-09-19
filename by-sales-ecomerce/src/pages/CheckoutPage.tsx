import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CheckoutFormData {
  paymentMethod: 'credit_card' | 'debit_card' | 'pix' | 'boleto' | 'cash';
  installments: number;
  shippingAddress: string;
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCvv?: string;
  pixKey?: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CheckoutFormData>({
    paymentMethod: 'credit_card',
    installments: 1,
    shippingAddress: '',
  });
  const [loading, setLoading] = useState(false);

  const handlePaymentMethodChange = (method: CheckoutFormData['paymentMethod']) => {
    setFormData({ ...formData, paymentMethod: method });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3334/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          totalAmount: 1200.00, // Valor do carrinho
          installmentsCount: formData.installments,
          paymentMethod: formData.paymentMethod,
          shippingAddress: formData.shippingAddress,
          notes: 'Pedido via e-commerce'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Pedido realizado com sucesso! Código: ${result.sale.billingCode}`);
        navigate('/orders');
      } else {
        alert('Erro ao processar pedido');
      }
    } catch (error) {
      alert('Erro interno');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Finalizar Compra</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Endereço de Entrega */}
        <div>
          <label className="block text-sm font-medium mb-2">Endereço de Entrega</label>
          <textarea
            value={formData.shippingAddress}
            onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
            className="w-full p-3 border rounded-lg"
            rows={3}
            required
          />
        </div>

        {/* Forma de Pagamento */}
        <div>
          <label className="block text-sm font-medium mb-4">Forma de Pagamento</label>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: 'credit_card', label: 'Cartão de Crédito' },
              { value: 'debit_card', label: 'Cartão de Débito' },
              { value: 'pix', label: 'PIX' },
              { value: 'boleto', label: 'Boleto' },
            ].map((method) => (
              <button
                key={method.value}
                type="button"
                onClick={() => handlePaymentMethodChange(method.value as any)}
                className={`p-4 border rounded-lg text-center ${
                  formData.paymentMethod === method.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300'
                }`}
              >
                {method.label}
              </button>
            ))}
          </div>
        </div>

        {/* Parcelas (apenas para cartão de crédito) */}
        {formData.paymentMethod === 'credit_card' && (
          <div>
            <label className="block text-sm font-medium mb-2">Parcelas</label>
            <select
              value={formData.installments}
              onChange={(e) => setFormData({ ...formData, installments: Number(e.target.value) })}
              className="w-full p-3 border rounded-lg"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                <option key={num} value={num}>
                  {num}x de R$ {(1200 / num).toFixed(2)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Dados do Cartão */}
        {(formData.paymentMethod === 'credit_card' || formData.paymentMethod === 'debit_card') && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Dados do Cartão</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Número do Cartão</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Nome no Cartão</label>
                <input
                  type="text"
                  placeholder="João Silva"
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Validade</label>
                <input
                  type="text"
                  placeholder="MM/AA"
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* PIX */}
        {formData.paymentMethod === 'pix' && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Pagamento via PIX</h3>
            <p className="text-sm text-gray-600 mb-4">
              Após confirmar o pedido, você receberá a chave PIX para pagamento.
            </p>
            <div className="bg-white p-3 rounded border">
              <p className="text-sm font-medium">Chave PIX (exemplo):</p>
              <p className="font-mono text-sm">pix@bysales.com.br</p>
              <button
                type="button"
                className="mt-2 text-blue-600 text-sm"
                onClick={() => navigator.clipboard.writeText('pix@bysales.com.br')}
              >
                Copiar chave PIX
              </button>
            </div>
          </div>
        )}

        {/* Boleto */}
        {formData.paymentMethod === 'boleto' && (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Pagamento via Boleto</h3>
            <p className="text-sm text-gray-600">
              O boleto será gerado após a confirmação do pedido e enviado por email.
              Prazo de vencimento: 3 dias úteis.
            </p>
          </div>
        )}

        {/* Resumo do Pedido */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Resumo do Pedido</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>R$ 1.200,00</span>
            </div>
            <div className="flex justify-between">
              <span>Frete:</span>
              <span>Grátis</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>R$ 1.200,00</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Processando...' : 'Finalizar Compra'}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;