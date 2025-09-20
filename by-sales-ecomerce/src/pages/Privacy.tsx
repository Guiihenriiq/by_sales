import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ShieldCheckIcon, EyeIcon, LockClosedIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const Privacy: React.FC = () => {
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
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" },
        "-=0.4"
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Política de Privacidade</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sua privacidade é fundamental. Saiba como coletamos, usamos e protegemos seus dados.
          </p>
          <p className="text-sm text-gray-500 mt-4">Última atualização: Janeiro de 2024</p>
        </div>

        {/* Privacy Commitment */}
        <div ref={el => sectionsRef.current[0] = el!} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-8 mb-8 text-center">
          <ShieldCheckIcon className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Compromisso com sua Privacidade</h2>
          <p className="text-xl">Protegemos seus dados com os mais altos padrões de segurança</p>
        </div>

        {/* Data Collection */}
        <div ref={el => sectionsRef.current[1] = el!} className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <EyeIcon className="w-8 h-8 text-blue-600 mr-3" />
            Quais Dados Coletamos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-green-600">Dados Pessoais</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Nome completo</li>
                <li>• E-mail</li>
                <li>• Telefone</li>
                <li>• CPF</li>
                <li>• Endereço de entrega</li>
                <li>• Data de nascimento</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Dados de Navegação</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Endereço IP</li>
                <li>• Tipo de navegador</li>
                <li>• Páginas visitadas</li>
                <li>• Tempo de permanência</li>
                <li>• Cookies e preferências</li>
                <li>• Histórico de compras</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data Usage */}
        <div ref={el => sectionsRef.current[2] = el!} className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <UserGroupIcon className="w-8 h-8 text-purple-600 mr-3" />
            Como Usamos seus Dados
          </h2>
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-lg font-semibold mb-2">Processamento de Pedidos</h3>
              <p className="text-gray-600">Para processar suas compras, calcular frete, emitir notas fiscais e realizar entregas.</p>
            </div>
            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-lg font-semibold mb-2">Comunicação</h3>
              <p className="text-gray-600">Para enviar confirmações de pedidos, atualizações de entrega e suporte ao cliente.</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-lg font-semibold mb-2">Personalização</h3>
              <p className="text-gray-600">Para oferecer recomendações personalizadas e melhorar sua experiência de compra.</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-6">
              <h3 className="text-lg font-semibold mb-2">Marketing</h3>
              <p className="text-gray-600">Para enviar ofertas e promoções (apenas com seu consentimento).</p>
            </div>
          </div>
        </div>

        {/* Data Protection */}
        <div ref={el => sectionsRef.current[3] = el!} className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <LockClosedIcon className="w-8 h-8 text-red-600 mr-3" />
            Como Protegemos seus Dados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-red-50 rounded-lg">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <LockClosedIcon className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-semibold mb-2">Criptografia</h3>
              <p className="text-gray-600 text-sm">SSL/TLS para todas as transmissões de dados</p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Servidores Seguros</h3>
              <p className="text-gray-600 text-sm">Infraestrutura protegida e monitorada 24/7</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Acesso Restrito</h3>
              <p className="text-gray-600 text-sm">Apenas funcionários autorizados têm acesso</p>
            </div>
          </div>
        </div>

        {/* User Rights */}
        <div ref={el => sectionsRef.current[4] = el!} className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Seus Direitos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Você tem o direito de:</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Acessar seus dados pessoais</li>
                <li>• Corrigir informações incorretas</li>
                <li>• Solicitar exclusão de dados</li>
                <li>• Revogar consentimentos</li>
                <li>• Portabilidade de dados</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Para exercer seus direitos:</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• E-mail: privacidade@bysales.com</li>
                <li>• Telefone: (11) 3333-4444</li>
                <li>• WhatsApp: (11) 99999-9999</li>
                <li>• Seção "Meus Dados" no perfil</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Cookies */}
        <div ref={el => sectionsRef.current[5] = el!} className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Cookies e Tecnologias Similares</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              Utilizamos cookies para melhorar sua experiência de navegação, personalizar conteúdo e analisar o tráfego do site.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Cookies Essenciais</h4>
                <p className="text-sm text-gray-600">Necessários para o funcionamento básico do site</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Cookies de Performance</h4>
                <p className="text-sm text-gray-600">Ajudam a melhorar a performance do site</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Cookies de Marketing</h4>
                <p className="text-sm text-gray-600">Personalizam anúncios e ofertas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div ref={el => sectionsRef.current[6] = el!} className="bg-gray-800 text-white rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Dúvidas sobre Privacidade?</h2>
          <p className="text-lg mb-6">Entre em contato com nosso Encarregado de Proteção de Dados</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">E-mail</p>
              <p>privacidade@bysales.com</p>
            </div>
            <div>
              <p className="font-semibold">Telefone</p>
              <p>(11) 3333-4444</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;