import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { TruckIcon, MapPinIcon, CurrencyDollarIcon, ClockIcon } from '@heroicons/react/24/outline';

const Shipping: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const tl = gsap.timeline();
    
    if (headerRef.current) {
      tl.fromTo(headerRef.current,
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }
    
    const validSections = sectionsRef.current.filter(el => el !== null);
    if (validSections.length > 0) {
      tl.fromTo(validSections,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: "power2.out" },
        "-=0.4"
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Entrega e Frete</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Informações completas sobre prazos, valores e modalidades de entrega.
          </p>
        </div>

        {/* Shipping Options */}
        <div ref={el => sectionsRef.current[0] = el!} className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <TruckIcon className="w-8 h-8 text-blue-600 mr-3" />
            Modalidades de Entrega
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-green-600">Entrega Padrão</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Prazo: 5 a 7 dias úteis</li>
                <li>• Frete: R$ 15,90</li>
                <li>• Rastreamento incluído</li>
                <li>• Entrega pelos Correios</li>
              </ul>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Entrega Expressa</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Prazo: 2 a 3 dias úteis</li>
                <li>• Frete: R$ 25,90</li>
                <li>• Rastreamento em tempo real</li>
                <li>• Entrega por transportadora</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Free Shipping */}
        <div ref={el => sectionsRef.current[1] = el!} className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-8 mb-8">
          <div className="text-center">
            <CurrencyDollarIcon className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Frete Grátis</h2>
            <p className="text-xl mb-4">Em compras acima de R$ 199,00</p>
            <p className="text-lg opacity-90">Válido para todo o Brasil • Entrega padrão</p>
          </div>
        </div>

        {/* Coverage Areas */}
        <div ref={el => sectionsRef.current[2] = el!} className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <MapPinIcon className="w-8 h-8 text-purple-600 mr-3" />
            Áreas de Cobertura
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">SP</span>
              </div>
              <h3 className="font-semibold mb-2">Grande São Paulo</h3>
              <p className="text-gray-600">1-2 dias úteis</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">SE</span>
              </div>
              <h3 className="font-semibold mb-2">Região Sudeste</h3>
              <p className="text-gray-600">2-4 dias úteis</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">BR</span>
              </div>
              <h3 className="font-semibold mb-2">Demais Regiões</h3>
              <p className="text-gray-600">5-7 dias úteis</p>
            </div>
          </div>
        </div>

        {/* Shipping Process */}
        <div ref={el => sectionsRef.current[3] = el!} className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <ClockIcon className="w-8 h-8 text-indigo-600 mr-3" />
            Como Funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="font-semibold mb-2">Pedido Confirmado</h3>
              <p className="text-gray-600 text-sm">Após aprovação do pagamento</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="font-semibold mb-2">Preparação</h3>
              <p className="text-gray-600 text-sm">Separação e embalagem</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="font-semibold mb-2">Envio</h3>
              <p className="text-gray-600 text-sm">Código de rastreamento</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-indigo-600">4</span>
              </div>
              <h3 className="font-semibold mb-2">Entrega</h3>
              <p className="text-gray-600 text-sm">No endereço cadastrado</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;