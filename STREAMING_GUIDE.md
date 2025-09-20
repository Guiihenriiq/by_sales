# 📺 Guia do Sistema de Streaming Ao Vivo

## 🎯 Visão Geral

O sistema de streaming permite que administradores criem e transmitam lives promocionais diretamente do painel admin, enquanto clientes podem assistir no e-commerce com chat interativo.

## 🏗️ Arquitetura

### Frontend (Admin - Vue/Quasar)
- **LivesPage.vue**: Gerenciamento de lives
- **LiveStreaming.vue**: Interface de transmissão com WebRTC

### Frontend (E-commerce - React)
- **Lives.tsx**: Página de lives para clientes
- **LivePlayer.tsx**: Player de vídeo com chat

### Backend (Node.js)
- **LiveController**: API REST para CRUD de lives
- **LiveStreamingServer**: WebSocket para streaming e chat
- **Live Entity**: Modelo de dados das lives

## 🚀 Como Usar

### 1. Criar uma Live (Admin)

1. Acesse o painel admin: `http://localhost:9000`
2. Vá para **Lives** no menu lateral
3. Clique em **"Nova Live"**
4. Preencha os dados:
   - **Título**: Nome da live
   - **Descrição**: Detalhes da transmissão
   - **URL da Stream**: Deixe em branco (será gerada automaticamente)
   - **Thumbnail**: URL da imagem de capa
   - **Data/Hora**: Quando será transmitida
   - **Produtos**: IDs dos produtos em destaque

### 2. Iniciar Transmissão (Admin)

1. Na lista de lives, clique em **"Iniciar"** na live desejada
2. Permita acesso à câmera e microfone
3. A interface de streaming abrirá com:
   - **Preview da câmera**: Sua transmissão ao vivo
   - **Controles**: Iniciar/parar, mute, câmera on/off
   - **Chat**: Interação com viewers
   - **Informações**: Duração, qualidade, viewers

### 3. Assistir Lives (Clientes)

1. Acesse o e-commerce: `http://localhost:3000`
2. Vá para **Lives** no menu
3. Clique em **"Assistir Agora"** na live ativa
4. O player abrirá com:
   - **Vídeo em tela cheia**: Stream ao vivo
   - **Chat lateral**: Mensagens em tempo real
   - **Produtos**: Itens em destaque na live

## 🔧 Configuração Técnica

### Dependências Necessárias

```bash
# Backend
npm install ws @types/ws

# Frontend Admin (Vue)
# Já incluído no Quasar

# Frontend E-commerce (React)
# WebRTC é nativo do browser
```

### Variáveis de Ambiente

```env
# Backend (.env)
WS_PORT=3333
STREAM_QUALITY=720p
MAX_VIEWERS=1000
```

### Portas Utilizadas

- **Backend API**: `http://localhost:3333`
- **WebSocket**: `ws://localhost:3333`
- **Admin Panel**: `http://localhost:9000`
- **E-commerce**: `http://localhost:3000`

## 🌐 Fluxo de Dados

### 1. Conexão WebSocket

```javascript
// Admin (Streamer)
ws://localhost:3333?liveId=123&streamer=true

// Cliente (Viewer)
ws://localhost:3333?liveId=123&viewerId=abc123
```

### 2. Mensagens WebSocket

```json
// Iniciar stream
{
  "type": "webrtc-offer",
  "offer": { /* RTCSessionDescription */ }
}

// Chat
{
  "type": "chat-message",
  "message": {
    "user": "Admin",
    "text": "Olá pessoal!",
    "timestamp": "2024-01-01T10:00:00Z"
  }
}

// Contagem de viewers
{
  "type": "viewer-count",
  "count": 42
}
```

## 📱 Funcionalidades

### Admin (Streamer)
- ✅ Captura de vídeo/áudio da webcam
- ✅ Controles de mute/câmera
- ✅ Chat com viewers
- ✅ Monitoramento de viewers
- ✅ Qualidade de stream configurável
- ✅ Duração da transmissão

### Cliente (Viewer)
- ✅ Player de vídeo responsivo
- ✅ Chat interativo
- ✅ Controles de volume
- ✅ Produtos em destaque
- ✅ Compartilhamento
- ✅ Reações (curtir)

## 🔒 Segurança

### Autenticação
- Apenas admins podem criar/iniciar lives
- Viewers não precisam de login para assistir
- Chat moderado pelo admin

### WebRTC
- Conexão P2P segura
- STUN server para NAT traversal
- ICE candidates para conectividade

## 🚀 Melhorias Futuras

### Próximas Implementações
- [ ] **RTMP Integration**: Suporte para OBS Studio
- [ ] **CDN Streaming**: Escalabilidade para milhares de viewers
- [ ] **Recording**: Gravação automática das lives
- [ ] **Analytics**: Métricas detalhadas de engagement
- [ ] **Mobile App**: Transmissão via smartphone
- [ ] **Multi-quality**: Adaptive bitrate streaming

### Integrações Externas
- [ ] **YouTube Live**: Transmissão simultânea
- [ ] **Twitch**: Stream para múltiplas plataformas
- [ ] **Facebook Live**: Alcance em redes sociais
- [ ] **Instagram Live**: Stories e IGTV

## 🛠️ Troubleshooting

### Problemas Comuns

**1. Câmera não funciona**
```bash
# Verificar permissões do browser
# Chrome: chrome://settings/content/camera
# Firefox: about:preferences#privacy
```

**2. WebSocket não conecta**
```bash
# Verificar se o servidor está rodando
curl -I http://localhost:3333/health

# Verificar logs do servidor
npm run dev
```

**3. Vídeo não aparece para viewers**
```bash
# Verificar WebRTC connection
# Abrir DevTools > Console
# Procurar por erros de ICE candidates
```

### Logs Úteis

```bash
# Backend logs
tail -f logs/streaming.log

# Browser console
console.log('WebRTC state:', peerConnection.connectionState);
```

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do servidor
2. Teste a conexão WebSocket
3. Confirme permissões de câmera/microfone
4. Consulte a documentação do WebRTC

---

**🎉 Agora você pode transmitir lives promocionais diretamente do seu e-commerce!**