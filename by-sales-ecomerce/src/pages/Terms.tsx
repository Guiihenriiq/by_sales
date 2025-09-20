import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { DocumentTextIcon, ScaleIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const Terms: React.FC = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Termos de Uso</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Condições gerais de uso da plataforma By Sales. Leia atentamente antes de utilizar nossos serviços.
          </p>
          <p className="text-sm text-gray-500 mt-4">Última atualização: Janeiro de 2024</p>
        </div>

        {/* Agreement Banner */}
        <div ref={el => sectionsRef.current[0] = el!} className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-8 mb-8 text-center">
          <ScaleIcon className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Acordo de Uso</h2>
          <p className="text-xl">Ao utilizar nossa plataforma, você concorda com estes termos</p>
        </div>

        {/* Platform Usage */}
        <div ref={el => sectionsRef.current[1] = el!} className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <CheckCircleIcon className="w-8 h-8 text-green-600 mr-3" />
            Uso da Plataforma
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Cadastro e Conta</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Você deve fornecer informações verdadeiras e atualizadas</li>
                <li>• É responsável pela segurança de sua senha</li>
                <li>• Deve ter pelo menos 18 anos ou autorização dos pais</li>
                <li>• Uma pessoa pode ter apenas uma conta ativa</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Uso Permitido</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Navegar e comprar produtos disponíveis</li>
                <li>• Acessar informações sobre produtos e serviços</li>
                <li>• Entrar em contato com nosso suporte</li>
                <li>• Avaliar produtos adquiridos</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Prohibited Activities */}
        <div ref={el => sectionsRef.current[2] = el!} className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <ExclamationTriangleIcon className="w-8 h-8 text-red-600 mr-3" />
            Atividades Proibidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-red-600">Não é permitido:</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Usar a plataforma para atividades ilegais</li>
                <li>• Tentar hackear ou comprometer a segurança</li>
                <li>• Criar múltiplas contas</li>
                <li>• Revender produtos sem autorização</li>
                <li>• Fazer uso comercial não autorizado</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-orange-600">Consequências:</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Suspensão temporária da conta</li>
                <li>• Cancelamento definitivo do cadastro</li>
                <li>• Bloqueio de acesso à plataforma</li>
                <li>• Medidas legais cabíveis</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Purchase Terms */}
        <div ref={el => sectionsRef.current[3] = el!} className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <DocumentTextIcon className="w-8 h-8 text-blue-600 mr-3" />
            Condições de Compra
          </h2>
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-lg font-semibold mb-2">Preços e Pagamento</h3>
              <p className="text-gray-600">Os preços podem ser alterados sem aviso prévio. O pagamento deve ser realizado no ato da compra através dos métodos disponíveis.</p>
            </div>
            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-lg font-semibold mb-2">Disponibilidade</h3>
              <p className="text-gray-600">Os produtos estão sujeitos à disponibilidade em estoque. Reservamo-nos o direito de cancelar pedidos em caso de indisponibilidade.</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-lg font-semibold mb-2">Entrega</h3>
              <p className="text-gray-600">Os prazos de entrega são estimativas e podem variar. Não nos responsabilizamos por atrasos causados por terceiros.</p>
            </div>
          </div>
        </div>

        {/* Intellectual Property */}
        <div ref={el => sectionsRef.current[4] = el!} className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Propriedade Intelectual</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              Todo o conteúdo da plataforma, incluindo textos, imagens, logos, design e código, é protegido por direitos autorais e propriedade intelectual da By Sales.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2 text-green-600">Permitido:</h3>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• Visualizar conteúdo para uso pessoal</li>
                  <li>• Compartilhar links de produtos</li>
                  <li>• Imprimir páginas para referência</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-red-600">Proibido:</h3>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• Copiar ou reproduzir conteúdo</li>
                  <li>• Usar imagens sem autorização</li>
                  <li>• Modificar ou criar obras derivadas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Liability */}
        <div ref={el => sectionsRef.current[5] = el!} className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Limitação de Responsabilidade</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              A By Sales não se responsabiliza por danos indiretos, lucros cessantes ou prejuízos decorrentes do uso da plataforma, exceto nos casos previstos em lei.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-yellow-800">Importante:</h3>
              <p className="text-yellow-700 text-sm">
                Nossa responsabilidade está limitada ao valor do produto adquirido. Recomendamos a leitura completa destes termos antes de efetuar qualquer compra.
              </p>
            </div>
          </div>
        </div>

        {/* Changes and Contact */}
        <div ref={el => sectionsRef.current[6] = el!} className="bg-gray-800 text-white rounded-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-4">Alterações nos Termos</h2>
              <p className="text-gray-300 mb-4">
                Podemos atualizar estes termos periodicamente. As alterações entram em vigor imediatamente após a publicação.
              </p>
              <p className="text-sm text-gray-400">
                Recomendamos verificar esta página regularmente.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4">Dúvidas Jurídicas?</h2>
              <div className="space-y-2">
                <p><span className="font-semibold">E-mail:</span> juridico@bysales.com</p>
                <p><span className="font-semibold">Telefone:</span> (11) 3333-4444</p>
                <p><span className="font-semibold">Endereço:</span> São Paulo, SP</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;