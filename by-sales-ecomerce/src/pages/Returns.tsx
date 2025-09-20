import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ArrowPathIcon, ShieldCheckIcon, CalendarDaysIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const Returns: React.FC = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Trocas e Devoluções</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sua satisfação é nossa prioridade. Conheça nossa política de trocas e devoluções.
          </p>
        </div>

        {/* Guarantee Banner */}
        <div ref={el => sectionsRef.current[0] = el!} className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-8 mb-8 text-center">
          <ShieldCheckIcon className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Garantia de Satisfação</h2>
          <p className="text-xl">30 dias para trocas e devoluções</p>
          <p className="text-lg opacity-90 mt-2">Sem complicações, sem burocracia</p>
        </div>

        {/* Return Policy */}
        <div ref={el => sectionsRef.current[1] = el!} className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <ArrowPathIcon className="w-8 h-8 text-blue-600 mr-3" />
            Como Solicitar Troca ou Devolução
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 border rounded-lg">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold mb-2">Entre em Contato</h3>
              <p className="text-gray-600 text-sm">WhatsApp, e-mail ou telefone dentro de 30 dias</p>
            </div>
            <div className="text-center p-6 border rounded-lg">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-semibold mb-2">Autorização</h3>
              <p className="text-gray-600 text-sm">Receba o código de autorização e etiqueta de envio</p>
            </div>
            <div className="text-center p-6 border rounded-lg">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="font-semibold mb-2">Envio</h3>
              <p className="text-gray-600 text-sm">Embale o produto e envie pelos Correios</p>
            </div>
          </div>
        </div>

        {/* Conditions */}
        <div ref={el => sectionsRef.current[2] = el!} className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <DocumentTextIcon className="w-8 h-8 text-purple-600 mr-3" />
            Condições para Troca/Devolução
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-green-600">✅ Aceito</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Produto em perfeito estado</li>
                <li>• Embalagem original preservada</li>
                <li>• Etiquetas e lacres intactos</li>
                <li>• Nota fiscal incluída</li>
                <li>• Dentro do prazo de 30 dias</li>
                <li>• Produtos não utilizados</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-red-600">❌ Não Aceito</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Produtos danificados pelo uso</li>
                <li>• Embalagem violada ou danificada</li>
                <li>• Produtos personalizados</li>
                <li>• Itens de higiene pessoal</li>
                <li>• Fora do prazo de 30 dias</li>
                <li>• Produtos com sinais de uso</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Timeframes */}
        <div ref={el => sectionsRef.current[3] = el!} className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <CalendarDaysIcon className="w-8 h-8 text-indigo-600 mr-3" />
            Prazos e Processamento
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-blue-600">Análise</h3>
              <p className="text-3xl font-bold text-blue-600 mb-2">2-3</p>
              <p className="text-gray-600">dias úteis após recebimento</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-green-600">Reembolso</h3>
              <p className="text-3xl font-bold text-green-600 mb-2">5-7</p>
              <p className="text-gray-600">dias úteis após aprovação</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-purple-600">Nova Troca</h3>
              <p className="text-3xl font-bold text-purple-600 mb-2">3-5</p>
              <p className="text-gray-600">dias úteis para envio</p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div ref={el => sectionsRef.current[4] = el!} className="bg-gray-800 text-white rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Precisa de Ajuda?</h2>
          <p className="text-lg mb-6">Nossa equipe está pronta para ajudar com sua solicitação</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="font-semibold">WhatsApp</p>
              <p>(11) 99999-9999</p>
            </div>
            <div>
              <p className="font-semibold">E-mail</p>
              <p>trocas@bysales.com</p>
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

export default Returns;