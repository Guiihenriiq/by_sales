<template>
  <q-dialog v-model="isOpen" persistent maximized>
    <q-card class="bg-dark text-white">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Transmissão Ao Vivo</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="stopStreaming" />
      </q-card-section>

      <q-card-section class="q-pa-none">
        <div class="row no-wrap" style="height: calc(100vh - 100px)">
          <!-- Video Preview -->
          <div class="col-8 relative-position bg-black">
            <video
              ref="localVideo"
              autoplay
              muted
              playsinline
              class="full-width full-height"
              style="object-fit: cover"
            ></video>
            
            <!-- Live Indicator -->
            <div v-if="isLive" class="absolute-top-left q-ma-md">
              <q-badge color="red" class="text-weight-bold">
                <q-icon name="fiber_manual_record" size="xs" class="q-mr-xs animate-pulse" />
                AO VIVO
              </q-badge>
            </div>

            <!-- Viewer Count -->
            <div v-if="isLive" class="absolute-top-right q-ma-md">
              <q-badge color="black" class="text-white">
                <q-icon name="visibility" size="xs" class="q-mr-xs" />
                {{ viewerCount }} visualizações
              </q-badge>
            </div>

            <!-- Controls -->
            <div class="absolute-bottom full-width q-pa-md">
              <div class="row items-center justify-center q-gutter-md">
                <q-btn
                  v-if="!isLive"
                  @click="startStreaming"
                  color="red"
                  icon="videocam"
                  label="Iniciar Live"
                  size="lg"
                  :loading="connecting"
                />
                
                <q-btn
                  v-if="isLive"
                  @click="stopStreaming"
                  color="red"
                  icon="stop"
                  label="Finalizar Live"
                  size="lg"
                />

                <q-btn
                  @click="toggleMute"
                  :color="isMuted ? 'grey' : 'white'"
                  :icon="isMuted ? 'mic_off' : 'mic'"
                  round
                  size="md"
                />

                <q-btn
                  @click="toggleCamera"
                  :color="cameraOff ? 'grey' : 'white'"
                  :icon="cameraOff ? 'videocam_off' : 'videocam'"
                  round
                  size="md"
                />
              </div>
            </div>
          </div>

          <!-- Chat/Info Panel -->
          <div class="col-4 bg-grey-9">
            <q-tabs v-model="activeTab" class="text-white">
              <q-tab name="chat" label="Chat" />
              <q-tab name="info" label="Info" />
            </q-tabs>

            <q-tab-panels v-model="activeTab" class="bg-grey-9 text-white" style="height: calc(100% - 48px)">
              <!-- Chat Panel -->
              <q-tab-panel name="chat" class="q-pa-none">
                <div class="column full-height">
                  <div class="col q-pa-md" style="overflow-y: auto">
                    <div v-for="message in chatMessages" :key="message.id" class="q-mb-sm">
                      <div class="text-weight-bold text-blue-3">{{ message.user }}</div>
                      <div class="text-body2">{{ message.text }}</div>
                    </div>
                  </div>
                  
                  <div class="q-pa-md">
                    <q-input
                      v-model="newMessage"
                      placeholder="Digite uma mensagem..."
                      dark
                      outlined
                      @keyup.enter="sendMessage"
                    >
                      <template v-slot:append>
                        <q-btn icon="send" flat @click="sendMessage" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </q-tab-panel>

              <!-- Info Panel -->
              <q-tab-panel name="info" class="q-pa-md">
                <div class="q-gutter-md">
                  <div>
                    <div class="text-subtitle2">Título</div>
                    <div class="text-body2">{{ liveData?.title }}</div>
                  </div>
                  
                  <div>
                    <div class="text-subtitle2">Duração</div>
                    <div class="text-body2">{{ formatDuration(duration) }}</div>
                  </div>
                  
                  <div>
                    <div class="text-subtitle2">Qualidade</div>
                    <q-select
                      v-model="selectedQuality"
                      :options="qualityOptions"
                      dark
                      outlined
                      @update:model-value="changeQuality"
                    />
                  </div>

                  <div>
                    <div class="text-subtitle2">URL da Stream</div>
                    <q-input
                      :model-value="streamUrl"
                      readonly
                      dark
                      outlined
                    >
                      <template v-slot:append>
                        <q-btn icon="content_copy" flat @click="copyStreamUrl" />
                      </template>
                    </q-input>
                  </div>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';

interface Props {
  liveId: string;
  modelValue: boolean;
}

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: Date;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue', 'streamStarted', 'streamEnded']);

const $q = useQuasar();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const localVideo = ref<HTMLVideoElement>();
const isLive = ref(false);
const connecting = ref(false);
const isMuted = ref(false);
const cameraOff = ref(false);
const viewerCount = ref(0);
const duration = ref(0);
const activeTab = ref('chat');

const liveData = ref<any>(null);
const mediaStream = ref<MediaStream | null>(null);
const peerConnections = ref<Map<string, RTCPeerConnection>>(new Map());

const chatMessages = ref<ChatMessage[]>([]);
const newMessage = ref('');

const selectedQuality = ref('720p');
const qualityOptions = ['480p', '720p', '1080p'];

const streamUrl = computed(() => 
  `${window.location.origin}/live/${props.liveId}`
);

let durationInterval: NodeJS.Timeout;
let socket: WebSocket;

const initializeCamera = async () => {
  try {
    const constraints = {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 }
      },
      audio: true
    };

    mediaStream.value = await navigator.mediaDevices.getUserMedia(constraints);
    
    if (localVideo.value) {
      localVideo.value.srcObject = mediaStream.value;
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao acessar câmera/microfone'
    });
  }
};

const startStreaming = async () => {
  connecting.value = true;
  
  try {
    // Iniciar live no backend
    await api.patch(`/lives/${props.liveId}/start`);
    
    // Conectar WebSocket
    connectWebSocket();
    
    isLive.value = true;
    startDurationTimer();
    
    emit('streamStarted');
    
    $q.notify({
      type: 'positive',
      message: 'Live iniciada com sucesso!'
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao iniciar live'
    });
  } finally {
    connecting.value = false;
  }
};

const stopStreaming = async () => {
  try {
    // Finalizar live no backend
    await api.patch(`/lives/${props.liveId}/end`);
    
    // Fechar conexões
    if (socket) {
      socket.close();
    }
    
    peerConnections.value.forEach(pc => pc.close());
    peerConnections.value.clear();
    
    if (mediaStream.value) {
      mediaStream.value.getTracks().forEach(track => track.stop());
    }
    
    isLive.value = false;
    clearInterval(durationInterval);
    
    emit('streamEnded');
    isOpen.value = false;
    
    $q.notify({
      type: 'positive',
      message: 'Live finalizada'
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao finalizar live'
    });
  }
};

const connectWebSocket = () => {
  const wsUrl = `ws://localhost:3333/ws/live/${props.liveId}`;
  socket = new WebSocket(wsUrl);
  
  socket.onopen = () => {
    console.log('WebSocket conectado');
  };
  
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    switch (data.type) {
      case 'viewer-joined':
        viewerCount.value++;
        break;
      case 'viewer-left':
        viewerCount.value--;
        break;
      case 'chat-message':
        chatMessages.value.push(data.message);
        break;
      case 'webrtc-offer':
        handleWebRTCOffer(data);
        break;
    }
  };
};

const handleWebRTCOffer = async (data: any) => {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  });
  
  peerConnections.value.set(data.viewerId, pc);
  
  // Adicionar stream local
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach(track => {
      pc.addTrack(track, mediaStream.value!);
    });
  }
  
  await pc.setRemoteDescription(data.offer);
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  
  socket.send(JSON.stringify({
    type: 'webrtc-answer',
    viewerId: data.viewerId,
    answer
  }));
};

const toggleMute = () => {
  if (mediaStream.value) {
    const audioTrack = mediaStream.value.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      isMuted.value = !audioTrack.enabled;
    }
  }
};

const toggleCamera = () => {
  if (mediaStream.value) {
    const videoTrack = mediaStream.value.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      cameraOff.value = !videoTrack.enabled;
    }
  }
};

const sendMessage = () => {
  if (newMessage.value.trim() && socket) {
    const message = {
      id: Date.now().toString(),
      user: 'Admin',
      text: newMessage.value,
      timestamp: new Date()
    };
    
    socket.send(JSON.stringify({
      type: 'chat-message',
      message
    }));
    
    chatMessages.value.push(message);
    newMessage.value = '';
  }
};

const changeQuality = (quality: string) => {
  // Implementar mudança de qualidade
  console.log('Mudando qualidade para:', quality);
};

const copyStreamUrl = () => {
  navigator.clipboard.writeText(streamUrl.value);
  $q.notify({
    type: 'positive',
    message: 'URL copiada!'
  });
};

const startDurationTimer = () => {
  durationInterval = setInterval(() => {
    duration.value++;
  }, 1000);
};

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

onMounted(() => {
  initializeCamera();
});

onUnmounted(() => {
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach(track => track.stop());
  }
  
  if (socket) {
    socket.close();
  }
  
  clearInterval(durationInterval);
});
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}
</style>