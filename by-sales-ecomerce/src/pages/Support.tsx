import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { PhoneIcon, EnvelopeIcon, ChatBubbleLeftRightIcon, ClockIcon } from '@heroicons/react/24/outline';

const Support: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const tl = gsap.timeline();
    
    if (headerRef.current) {
      tl.fromTo(headerRef.current,
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }
    
    const validCards = cardsRef.current.filter(el => el !== null);
    if (validCards.length > 0) {
      tl.fromTo(validCards,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" },
        "-=0.4"
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Central de Atendimento</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Estamos aqui para ajudar! Entre em contato conosco através dos canais abaixo.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div ref={el => cardsRef.current[0] = el!} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <PhoneIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Telefone</h3>
              <p className="text-gray-600 mb-4">Fale diretamente com nossa equipe</p>
              <p className="text-2xl font-bold text-blue-600">(11) 99999-9999</p>
              <p className="text-sm text-gray-500 mt-2">Seg-Sex: 8h às 18h</p>
            </div>
          </div>

          <div ref={el => cardsRef.current[1] = el!} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChatBubbleLeftRightIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">WhatsApp</h3>
              <p className="text-gray-600 mb-4">Atendimento rápido e prático</p>
              <a 
                href="https://wa.me/5511999999999" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Iniciar Conversa
              </a>
            </div>
          </div>

          <div ref={el => cardsRef.current[2] = el!} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <EnvelopeIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">E-mail</h3>
              <p className="text-gray-600 mb-4">Envie sua dúvida detalhada</p>
              <p className="text-lg font-semibold text-purple-600">suporte@bysales.com</p>
              <p className="text-sm text-gray-500 mt-2">Resposta em até 24h</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Perguntas Frequentes</h2>
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="font-semibold text-lg mb-2">Como posso acompanhar meu pedido?</h3>
              <p className="text-gray-600">Após a confirmação do pagamento, você receberá um código de rastreamento por e-mail. Também pode acompanhar na seção "Meus Pedidos" do seu perfil.</p>
            </div>
            <div className="border-b pb-4">
              <h3 className="font-semibold text-lg mb-2">Qual o prazo de entrega?</h3>
              <p className="text-gray-600">O prazo varia de 3 a 7 dias úteis, dependendo da sua localização e do produto escolhido. Produtos em estoque são enviados em até 24h.</p>
            </div>
            <div className="border-b pb-4">
              <h3 className="font-semibold text-lg mb-2">Como funciona a troca de produtos?</h3>
              <p className="text-gray-600">Você tem até 30 dias para solicitar a troca. O produto deve estar em perfeitas condições. Entre em contato conosco para iniciar o processo.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Posso cancelar meu pedido?</h3>
              <p className="text-gray-600">Sim, você pode cancelar seu pedido antes do envio. Após o envio, será necessário aguardar a entrega e solicitar a devolução.</p>
            </div>
          </div>
        </div>

        {/* Hours */}
        <div className="mt-8 bg-gray-800 text-white rounded-xl p-6 text-center">
          <ClockIcon className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Horário de Atendimento</h3>
          <p className="text-lg">Segunda a Sexta: 8h às 18h</p>
          <p className="text-lg">Sábado: 9h às 14h</p>
          <p className="text-sm text-gray-300 mt-2">Domingo e feriados: Fechado</p>
        </div>
      </div>
    </div>
  );
};

export default Support;