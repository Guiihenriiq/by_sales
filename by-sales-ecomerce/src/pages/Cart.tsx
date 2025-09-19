import React from 'react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

const Cart: React.FC = () => {
  const { items, loading, getTotalPrice, updateQuantity, removeFromCart, clearCart } = useCart();

  // Helper function para formatar preço
  const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-lg">Carregando carrinho...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-8">Seu Carrinho</h1>
        <p className="text-gray-600 mb-8">Seu carrinho está vazio</p>
        <Link to="/products" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
          Continuar Comprando
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Seu Carrinho</h1>
        <button
          onClick={clearCart}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          Limpar Carrinho
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {items.map((item) => {
            const price = typeof item.product.price === 'string' ? parseFloat(item.product.price) : item.product.price;
            const validPrice = isNaN(price) ? 0 : price;
            
            return (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-6 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                    {item.product.images && item.product.images.length > 0 ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-500 text-xs">Sem imagem</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.product.name}</h3>
                    <p className="text-green-600 font-bold text-xl">
                      R$ {formatPrice(validPrice)}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Subtotal: R$ {formatPrice(validPrice * item.quantity)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={loading}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={loading}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    disabled={loading}
                    className="text-red-500 hover:text-red-700 px-3 py-1 rounded disabled:opacity-50"
                  >
                    Remover
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h3 className="text-xl font-bold mb-4">Resumo do Pedido</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal ({items.reduce((acc, item) => acc + item.quantity, 0)} itens):</span>
                <span>R$ {formatPrice(getTotalPrice())}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete:</span>
                <span className="text-green-600">Grátis</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-green-600">R$ {formatPrice(getTotalPrice())}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 text-center block font-semibold"
            >
              Finalizar Compra
            </Link>
            <Link
              to="/products"
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 text-center block mt-3"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;