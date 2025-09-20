import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { XMarkIcon, ChatBubbleLeftRightIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const FAQ_RESPONSES = {
  'entrega': 'Nossos produtos são entregues em 3-7 dias úteis. Você pode acompanhar o status do pedido na seção "Meus Pedidos".',
  'pagamento': 'Aceitamos cartão de crédito, débito, PIX e boleto bancário. Todos os pagamentos são processados com segurança.',
  'troca': 'Você tem até 30 dias para trocar ou devolver produtos. Entre em contato conosco pelo WhatsApp (11) 99999-9999.',
  'produto': 'Todos os nossos produtos passam por rigoroso controle de qualidade. Oferecemos garantia de 90 dias.',
  'desconto': 'Cadastre-se em nossa newsletter para receber cupons exclusivos! Também temos promoções sazonais.',
  'conta': 'Para criar sua conta, clique em "Entrar" no menu superior e depois em "Criar conta". É rápido e fácil!',
  'carrinho': 'Adicione produtos ao carrinho clicando no botão "Adicionar ao Carrinho". Você pode revisar antes de finalizar.',
  'pedido': 'Após finalizar a compra, você receberá um e-mail de confirmação com o código de rastreamento.',
  'default': 'Obrigado pela sua pergunta! Nossa equipe está sempre pronta para ajudar. Para suporte personalizado, entre em contato pelo WhatsApp: (11) 99999-9999 ou e-mail: suporte@bysales.com'
};

const QUICK_QUESTIONS = [
  'Como funciona a entrega?',
  'Quais formas de pagamento?',
  'Como fazer trocas?',
  'Produtos têm garantia?',
  'Como conseguir desconto?',
  'Como criar uma conta?'
];

const HelpChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! 👋 Sou a assistente virtual da By Sales. Como posso ajudar você hoje?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
      setTimeout(() => {
        if (chatRef.current) {
          gsap.fromTo(chatRef.current,
            { opacity: 0, scale: 0.8, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "back.out(1.7)" }
          );
        }
      }, 10);
    } else {
      if (chatRef.current) {
        gsap.to(chatRef.current, {
          opacity: 0,
          scale: 0.8,
          y: 20,
          duration: 0.2,
          ease: "power2.in",
          onComplete: () => setIsOpen(false)
        });
      }
    }
  };

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('entrega') || message.includes('prazo') || message.includes('envio')) {
      return FAQ_RESPONSES.entrega;
    }
    if (message.includes('pagamento') || message.includes('pagar') || message.includes('cartão')) {
      return FAQ_RESPONSES.pagamento;
    }
    if (message.includes('troca') || message.includes('devolução') || message.includes('devolver')) {
      return FAQ_RESPONSES.troca;
    }
    if (message.includes('produto') || message.includes('qualidade') || message.includes('garantia')) {
      return FAQ_RESPONSES.produto;
    }
    if (message.includes('desconto') || message.includes('promoção') || message.includes('cupom')) {
      return FAQ_RESPONSES.desconto;
    }
    if (message.includes('conta') || message.includes('cadastro') || message.includes('registrar')) {
      return FAQ_RESPONSES.conta;
    }
    if (message.includes('carrinho') || message.includes('comprar') || message.includes('adicionar')) {
      return FAQ_RESPONSES.carrinho;
    }
    if (message.includes('pedido') || message.includes('compra') || message.includes('rastreamento')) {
      return FAQ_RESPONSES.pedido;
    }
    
    return FAQ_RESPONSES.default;
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot typing and response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(text),
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        ref={buttonRef}
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-50"
        title="Central de Ajuda"
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <ChatBubbleLeftRightIcon className="w-6 h-6" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          ref={chatRef}
          className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Central de Ajuda</h3>
                <p className="text-xs opacity-90">Online agora</p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="text-white/80 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={messagesRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.isBot
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  {message.text}
                  <div
                    className={`text-xs mt-1 ${
                      message.isBot ? 'text-gray-500' : 'text-blue-100'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white px-3 py-2 rounded-lg shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-600 text-center">Perguntas frequentes:</p>
                <div className="grid grid-cols-1 gap-2">
                  {QUICK_QUESTIONS.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="text-left text-xs bg-white hover:bg-blue-50 text-blue-600 px-3 py-2 rounded-lg border border-blue-200 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Digite sua pergunta..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
              >
                <PaperAirplaneIcon className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default HelpChat;