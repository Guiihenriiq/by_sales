import React, { useRef, useEffect, useState } from 'react';
import { X, MessageCircle, Users, Heart, Share2, Volume2, VolumeX } from 'lucide-react';

interface LivePlayerProps {
  liveId: string;
  isOpen: boolean;
  onClose: () => void;
  liveData: {
    title: string;
    description: string;
    viewerCount: number;
    products?: any[];
  };
}

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: Date;
}

export const LivePlayer: React.FC<LivePlayerProps> = ({
  liveId,
  isOpen,
  onClose,
  liveData
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(true);
  const [viewerCount, setViewerCount] = useState(liveData.viewerCount);
  
  const socketRef = useRef<WebSocket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    if (isOpen && liveId) {
      connectToLive();
    }

    return () => {
      disconnect();
    };
  }, [isOpen, liveId]);

  const connectToLive = async () => {
    try {
      // Conectar WebSocket
      const wsUrl = `ws://localhost:3333/ws/live/${liveId}`;
      socketRef.current = new WebSocket(wsUrl);

      socketRef.current.onopen = () => {
        setIsConnected(true);
        console.log('Conectado à live');
        
        // Solicitar stream
        socketRef.current?.send(JSON.stringify({
          type: 'viewer-join',
          viewerId: generateViewerId()
        }));
      };

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      };

      socketRef.current.onclose = () => {
        setIsConnected(false);
        console.log('Desconectado da live');
      };

      // Configurar WebRTC
      setupWebRTC();
    } catch (error) {
      console.error('Erro ao conectar à live:', error);
    }
  };

  const setupWebRTC = () => {
    peerConnectionRef.current = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    peerConnectionRef.current.ontrack = (event) => {
      if (videoRef.current) {
        videoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.send(JSON.stringify({
          type: 'ice-candidate',
          candidate: event.candidate
        }));
      }
    };
  };

  const handleWebSocketMessage = async (data: any) => {
    switch (data.type) {
      case 'webrtc-offer':
        await handleOffer(data.offer);
        break;
      case 'ice-candidate':
        await peerConnectionRef.current?.addIceCandidate(data.candidate);
        break;
      case 'chat-message':
        setChatMessages(prev => [...prev, data.message]);
        break;
      case 'viewer-count':
        setViewerCount(data.count);
        break;
    }
  };

  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) return;

    await peerConnectionRef.current.setRemoteDescription(offer);
    const answer = await peerConnectionRef.current.createAnswer();
    await peerConnectionRef.current.setLocalDescription(answer);

    socketRef.current?.send(JSON.stringify({
      type: 'webrtc-answer',
      answer
    }));
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() && socketRef.current) {
      const message = {
        id: Date.now().toString(),
        user: 'Você',
        text: newMessage,
        timestamp: new Date()
      };

      socketRef.current.send(JSON.stringify({
        type: 'chat-message',
        message
      }));

      setNewMessage('');
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const generateViewerId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex">
      {/* Video Player */}
      <div className={`${showChat ? 'w-3/4' : 'w-full'} relative bg-black`}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Live Indicator */}
        <div className="absolute top-4 left-4">
          <div className="bg-red-600 text-white px-3 py-1 rounded-full flex items-center">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
            AO VIVO
          </div>
        </div>

        {/* Viewer Count */}
        <div className="absolute top-4 right-4">
          <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full flex items-center">
            <Users size={16} className="mr-1" />
            {viewerCount}
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleMute}
              className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            
            <button className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70">
              <Heart size={20} />
            </button>
            
            <button className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70">
              <Share2 size={20} />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowChat(!showChat)}
              className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
            >
              <MessageCircle size={20} />
            </button>
            
            <button
              onClick={onClose}
              className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Live Info */}
        <div className="absolute bottom-20 left-4 right-4">
          <div className="bg-black bg-opacity-50 text-white p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2">{liveData.title}</h3>
            <p className="text-sm opacity-80">{liveData.description}</p>
          </div>
        </div>
      </div>

      {/* Chat Panel */}
      {showChat && (
        <div className="w-1/4 bg-gray-900 text-white flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-700">
            <h3 className="font-bold">Chat da Live</h3>
            <p className="text-sm text-gray-400">{viewerCount} pessoas assistindo</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((message) => (
              <div key={message.id} className="text-sm">
                <span className="font-bold text-blue-400">{message.user}:</span>
                <span className="ml-2">{message.text}</span>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Digite uma mensagem..."
                className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-l-lg focus:outline-none"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700"
              >
                Enviar
              </button>
            </div>
          </div>

          {/* Products */}
          {liveData.products && liveData.products.length > 0 && (
            <div className="p-4 border-t border-gray-700">
              <h4 className="font-bold mb-2">Produtos em Destaque</h4>
              <div className="space-y-2">
                {liveData.products.map((product) => (
                  <div key={product.id} className="bg-gray-800 p-2 rounded">
                    <div className="text-sm font-medium">{product.name}</div>
                    <div className="text-xs text-green-400">R$ {product.price}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Connection Status */}
      {!isConnected && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Conectando à live...</p>
          </div>
        </div>
      )}
    </div>
  );
};